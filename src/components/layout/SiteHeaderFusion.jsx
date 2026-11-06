import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useScroll,
  useSpring,
} from 'framer-motion';
import useFocusTrap from '../../hooks/useFocusTrap';
import { startLenis, stopLenis } from '../../lib/smooth-scroll';
import { site } from '../../data/site';
import cv from '../../assets/doc/cv_alternance_2026.pdf';
import logo from '../../assets/Img/logo.png';
import logoWebp from '../../assets/Img/logo.webp';

const NAV_LINKS = [
  { label: 'À propos', href: '/#about', section: 'about', num: '01' },
  { label: 'Compétences', href: '/#skills', section: 'skills', num: '02' },
  { label: 'Notes', href: '/blog', section: 'notes', num: '03' },
  { label: 'Contact', href: '/#contact', section: 'contact', num: '04' },
];

const Logo = () => (
  <span className="flex items-center justify-center rounded-full bg-os-surface/90">
    <picture>
      <source srcSet={logoWebp} type="image/webp" />
      <img
        src={logo}
        alt=""
        width="192"
        height="192"
        className="h-7 w-7 object-contain"
      />
    </picture>
  </span>
);

/**
 * Pastille de navigation. Elle est montée seulement après l'hydratation :
 * sa largeur vient d'une mesure DOM, impossible à figer côté serveur. Le
 * rendu initial (serveur et client) n'a donc ni pastille ni libellé blanc,
 * ce qui évite toute divergence d'hydratation.
 */
const NavPill = ({ section, linkRefs }) => {
  const pillRef = useRef(null);

  useLayoutEffect(() => {
    const pill = pillRef.current;
    const nav = pill?.parentElement;
    if (!pill || !nav) return;

    const update = () => {
      const target = linkRefs.current[section];
      if (!target) {
        pill.style.opacity = '0';
        return;
      }

      const linkRect = target.getBoundingClientRect();
      const navRect = nav.getBoundingClientRect();
      const first = !pill.dataset.ready;

      if (first) pill.style.transition = 'none';
      pill.style.width = `${linkRect.width}px`;
      pill.style.transform = `translateX(${linkRect.left - navRect.left}px)`;
      pill.style.opacity = '1';

      if (first) {
        pill.dataset.ready = '1';
        requestAnimationFrame(() => {
          pill.style.transition = '';
        });
      }
    };

    update();
    window.addEventListener('resize', update);
    document.fonts?.ready.then(update).catch(() => {});

    return () => window.removeEventListener('resize', update);
  }, [section, linkRefs]);

  return <span ref={pillRef} aria-hidden="true" className="nav-pill" />;
};

/**
 * En-tête de la face publique — capsule en verre sur bureau, barre haute et
 * tiroir teal sous 1024 px. Le mode Dev garde son propre en-tête : ce
 * composant n'est monté que sur la face normale.
 *
 * Le tiroir reprend le piège de focus du menu historique, et le lien actif
 * reste la seule source de l'état `aria-current`.
 */
const SiteHeaderFusion = ({ activeSection = null, notesHref = '/#notes' }) => {
  const currentSection = activeSection;
  const [hovered, setHovered] = useState(null);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const linkRefs = useRef({});
  const drawerRef = useFocusTrap(open);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    restDelta: 0.001,
  });

  const pillSection = hovered ?? currentSection;
  const ghost =
    NAV_LINKS.find((link) => link.section === (hovered ?? currentSection))?.num ??
    '01';

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    const desktop = window.matchMedia('(min-width: 1024px)');
    const onDesktop = () => {
      if (desktop.matches) setOpen(false);
    };

    window.addEventListener('keydown', onKeyDown);
    desktop.addEventListener('change', onDesktop);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    stopLenis();

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      desktop.removeEventListener('change', onDesktop);
      document.body.style.overflow = previousOverflow;
      startLenis();
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="fixed left-0 right-0 top-0 z-[60] h-[2px] origin-left bg-os-text"
        style={{ scaleX: progress }}
      />

      <header className="fixed left-3 right-3 top-3 z-50 lg:left-1/2 lg:right-auto lg:top-4 lg:-translate-x-1/2">
        <div className="fusion-capsule flex w-full items-center gap-2 rounded-full border border-os-text/15 bg-white p-1.5 shadow-[0_18px_50px_-34px_rgba(45,107,107,0.55)] lg:w-auto lg:bg-white/70 lg:backdrop-blur-lg lg:backdrop-saturate-150">
          <a
            href="/"
            aria-label="Accueil, Jean-David Zamblezie"
            className="flex flex-none items-center"
          >
            <Logo />
          </a>

          <nav
            aria-label="Navigation principale"
            onMouseLeave={() => setHovered(null)}
            className="relative hidden items-center gap-0.5 p-0.5 lg:flex"
          >
            {mounted && <NavPill section={pillSection} linkRefs={linkRefs} />}

            {NAV_LINKS.map((link) => {
              const isPill = mounted && pillSection === link.section;
              const isActive = currentSection === link.section;

              return (
                <a
                  key={link.section}
                  ref={(el) => {
                    linkRefs.current[link.section] = el;
                  }}
                  href={link.section === 'notes' ? notesHref : link.href}
                  aria-current={isActive ? 'true' : undefined}
                  onMouseEnter={() => setHovered(link.section)}
                  onFocus={() => setHovered(link.section)}
                  onBlur={() => setHovered(null)}
                  className={`relative z-10 inline-flex h-11 items-center rounded-full px-3.5 font-display text-sm font-bold transition-colors duration-300 ${
                    isPill ? 'text-white' : 'text-os-reading hover:text-os-text'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={() => {
              setHovered(null);
              setOpen(true);
            }}
            aria-expanded={open}
            aria-controls="fusion-menu"
            aria-haspopup="dialog"
            aria-label="Ouvrir le menu"
            className="ml-auto inline-flex min-h-11 items-center gap-2 rounded-full px-3 font-display text-xs font-medium uppercase tracking-[0.1em] text-os-reading transition-[color,transform] duration-200 hover:text-os-text active:scale-95 lg:hidden"
          >
            <span>Menu</span>
            <span className="flex flex-col gap-1" aria-hidden="true">
              <i className="block h-px w-4 bg-current" />
              <i className="block h-px w-4 bg-current" />
            </span>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="fusion-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={close}
            aria-hidden="true"
            className="fixed inset-0 z-[9997] bg-os-reading/40 lg:hidden"
          />
        )}

        {open && (
          <motion.aside
            key="fusion-menu"
            id="fusion-menu"
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            drag="x"
            dragDirectionLock
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={{ left: 0.45, right: 0 }}
            dragMomentum={false}
            onDragEnd={(_, info) => {
              if (info.offset.x < -70 || info.velocity.x < -500) close();
            }}
            className="fixed inset-y-0 left-0 z-[9998] flex w-[min(88vw,380px)] flex-col overflow-y-auto overflow-x-hidden bg-os-text px-6 pb-6 pt-5 text-white lg:hidden"
          >
            <span className="drawer-ghost absolute right-2 top-24" aria-hidden="true">
              {ghost}
            </span>

            {/* Poignée de glissement : indique que le tiroir se ferme en le
                faisant glisser vers la gauche. */}
            <span
              aria-hidden="true"
              className="relative mx-auto mb-4 block h-1 w-10 flex-none rounded-full bg-white/30"
            />

            <div className="relative flex flex-row-reverse items-center justify-between">
              <button
                type="button"
                onClick={close}
                aria-label="Fermer le menu"
                className="inline-flex min-h-11 items-center gap-2 text-xs font-medium uppercase tracking-[0.12em] text-white/90 transition-opacity duration-200 hover:text-white active:opacity-70"
              >
                <span>Fermer</span>
                <span aria-hidden="true" className="text-lg leading-none">
                  ×
                </span>
              </button>

              <a
                href="/"
                onClick={close}
                aria-label="Accueil, Jean-David Zamblezie"
                className="flex items-center"
              >
                <Logo />
              </a>
            </div>

            <nav
              aria-label="Navigation mobile"
              className="relative mt-10 flex flex-1 flex-col justify-center"
            >
              {NAV_LINKS.map((link, index) => {
                const isActive = currentSection === link.section;

                return (
                  <a
                    key={link.section}
                    href={link.section === 'notes' ? notesHref : link.href}
                    onClick={close}
                    aria-current={isActive ? 'true' : undefined}
                    onMouseEnter={() => setHovered(link.section)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(link.section)}
                    onBlur={() => setHovered(null)}
                    className="grid grid-cols-[34px_minmax(0,1fr)_10px] items-center gap-3 border-b border-white/20 py-4 font-display text-[clamp(1.7rem,7.4vw,2.3rem)] font-bold leading-none tracking-[-0.045em] first:border-t first:border-white/20"
                  >
                    <span
                      aria-hidden="true"
                      className="text-[11px] font-medium tracking-[0.12em] text-white/80"
                    >
                      {link.num}
                    </span>
                    <span className="block overflow-hidden">
                      <motion.span
                        initial={{ y: '110%' }}
                        animate={{ y: 0 }}
                        transition={{
                          duration: 0.5,
                          delay: 0.15 + index * 0.06,
                          ease: [0.23, 1, 0.32, 1],
                        }}
                        className="block"
                      >
                        {link.label}
                      </motion.span>
                    </span>
                    <i
                      aria-hidden="true"
                      className={`h-[7px] w-[7px] rounded-full bg-white transition-opacity duration-300 ${
                        isActive ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  </a>
                );
              })}
            </nav>

            <div className="relative mt-10 flex flex-col gap-3 border-t border-white/20 pt-5 text-[13px] text-white/90">
              <a
                href={cv}
                download="cv_jeandavidzamblezie.pdf"
                className="inline-flex min-h-11 items-center justify-between gap-3 font-medium text-white"
              >
                Télécharger le CV
                <span aria-hidden="true">↗</span>
              </a>
              <a
                href={`mailto:${site.email}`}
                className="min-h-11 break-all py-2 text-sm text-white"
              >
                {site.email}
              </a>
              <div className="flex flex-wrap gap-5 py-1">
                <a
                  href={site.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center text-white"
                >
                  GitHub
                </a>
                <a
                  href={site.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center text-white"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default SiteHeaderFusion;
