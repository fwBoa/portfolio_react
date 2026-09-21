import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope, FaDownload, FaTimes } from 'react-icons/fa';
import avatar from '../assets/Img/avatarportfoliobackgroundremove.png';
import avatarWebp from '../assets/Img/avatar.webp';
import cv from '../assets/doc/cv_alternance_2026.pdf';
import { site, LEGAL_LAST_UPDATED } from '../data/site';
import { skillGroups as skills } from '../data/skills';
import { legalSections, privacySections } from '../data/legal';

const legalTabs = [
  { id: 'legal', label: 'Mentions légales', sections: legalSections },
  { id: 'privacy', label: 'Confidentialité', sections: privacySections },
];

const revealUp = {
  hidden: { opacity: 0, y: 60 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: i * 0.12, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

const lineReveal = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 1.2, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const letterVariants = {
  hidden: { y: '110%', opacity: 0 },
  visible: (i) => ({
    y: '0%',
    opacity: 1,
    transition: { duration: 0.7, delay: i * 0.03, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

const AnimatedLetters = ({ text, className, delayOffset = 0 }) => (
  <span className={`${className} inline-block overflow-hidden`}>
    {text.split('').map((char, i) => (
      <motion.span
        key={`${char}-${i}`}
        custom={i + delayOffset}
        initial="hidden"
        animate="visible"
        variants={letterVariants}
        className="inline-block"
        style={{ whiteSpace: char === ' ' ? 'pre' : undefined }}
      >
        {char === ' ' ? ' ' : char}
      </motion.span>
    ))}
  </span>
);

const Face = () => {
  const [showLegal, setShowLegal] = useState(false);
  const [legalTab, setLegalTab] = useState('legal');

  const openLegal = (tab) => {
    setLegalTab(tab);
    setShowLegal(true);
  };

  const activeTab = legalTabs.find((tab) => tab.id === legalTab) ?? legalTabs[0];

  const { scrollY } = useScroll();
  const rawAvatarY = useTransform(scrollY, [0, 800], [0, -50]);
  const avatarY = useSpring(rawAvatarY, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Fermeture de la modale au clavier + blocage du scroll d'arrière-plan
  useEffect(() => {
    if (!showLegal) return;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') setShowLegal(false);
    };

    window.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [showLegal]);

  return (
    <main className="min-h-screen bg-os-bg text-os-text pt-20 overflow-x-hidden">
      <div className="grain-overlay" />

      {/* ===== HERO ===== */}
      <section id="about" className="relative px-5 sm:px-10 lg:px-20 xl:px-24 pt-12 sm:pt-20 lg:pt-24 pb-16 sm:pb-24 lg:pb-32">
        <div className="max-w-[1400px] mx-auto relative">

          {/* Name + Avatar — un seul h1, ses deux lignes sont des spans */}
          <div className="relative">
            <h1 className="text-[clamp(2.8rem,13vw,14rem)] font-display font-bold leading-[0.82] tracking-[-0.04em] text-center">
              <span className="block">
                <AnimatedLetters text="Jean-David" />
              </span>

              <span className="flex flex-col lg:flex-row lg:items-end lg:justify-center gap-6 lg:gap-0 mt-2 sm:mt-3 lg:mt-0 relative">
                <span className="block">
                  <AnimatedLetters text="Zamblezie" delayOffset={12} />
                </span>

                <motion.span
                  initial={{ opacity: 0, scale: 0.8, rotate: -3 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1], delay: 0.5 }}
                  style={{ y: avatarY }}
                  className="lg:absolute lg:bottom-[-1rem] lg:left-[-2%] xl:left-[0%] flex-shrink-0 self-center lg:self-auto mt-6 lg:mt-0 block"
                >
                  {/* Image décorative : le nom est déjà porté par le h1 */}
                  <picture>
                    <source srcSet={avatarWebp} type="image/webp" />
                    <img
                      src={avatar}
                      alt=""
                      aria-hidden="true"
                      width="480"
                      height="720"
                      className="w-36 sm:w-44 md:w-52 lg:w-60 h-auto object-contain max-w-full"
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                    />
                  </picture>
                </motion.span>

                {/* Complète le h1 pour les moteurs de recherche et les lecteurs d'écran */}
                <span className="sr-only">
                  {' '}— Développeur web spécialisé en automatisation IA et ingénierie agentique
                </span>
              </span>
            </h1>
          </div>

          {/* Tagline + CV */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="mt-16 sm:mt-20 lg:mt-28 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 sm:gap-8"
          >
            <p className="text-os-body text-sm sm:text-base lg:text-lg max-w-sm leading-relaxed">
              Web Developer · AI Automation · Agentic Engineer
            </p>

            <a
              href={cv}
              download="cv_jeandavidzamblezie.pdf"
              className="group flex items-center gap-3 text-sm font-medium"
            >
              <span className="border-b border-os-text pb-0.5 group-hover:text-os-muted group-hover:border-os-muted transition-colors duration-500">
                Télécharger le CV
              </span>
              <span className="w-9 h-9 rounded-full border border-os-border flex items-center justify-center group-hover:border-os-text group-hover:bg-os-text group-hover:text-white transition-all duration-500">
                <FaDownload size={12} />
              </span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* ===== SKILLS ===== */}
      <section id="skills" className="relative bg-os-surface/40">
        {skills.map((cat, index) => (
          <div
            key={cat.num}
            className="relative px-5 sm:px-10 lg:px-20 xl:px-24 py-20 sm:py-28 lg:py-40"
          >
            {/* Line separator */}
            {index > 0 && (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                variants={lineReveal}
                className="absolute top-0 left-5 sm:left-10 lg:left-20 xl:left-24 right-5 sm:right-10 lg:right-20 xl:right-24 h-px bg-os-border origin-left"
              />
            )}

            {/* Watermark number — masqué sous sm : sur mobile il passait derrière
                le paragraphe et brouillait la lecture */}
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="hidden sm:block absolute top-1/2 sm:left-[70%] lg:left-[75%] -translate-x-1/2 -translate-y-1/2 text-[clamp(7rem,22vw,24rem)] font-display font-bold text-os-border/10 sm:text-os-border/20 select-none pointer-events-none leading-none"
            >
              {cat.num}
            </motion.span>

            <div className="max-w-[1400px] mx-auto relative z-10">
              {/* Title + skill tags */}
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8 sm:gap-10 lg:gap-20 items-start">
                <motion.div
                  custom={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.4 }}
                  variants={revealUp}
                >
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-display font-bold tracking-tight leading-[1.05]">
                    {cat.title}
                  </h2>
                </motion.div>

                <motion.div
                  custom={index + 1}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.4 }}
                  variants={revealUp}
                  className="lg:pt-3"
                >
                  <div className="flex flex-wrap gap-x-5 sm:gap-x-7 gap-y-2 sm:gap-y-3">
                    {cat.items.map((item, i) => (
                      <span key={item} className="text-sm sm:text-base lg:text-lg text-os-body font-medium">
                        {item}
                        {i < cat.items.length - 1 && (
                          <span className="text-os-border ml-5 sm:ml-7">·</span>
                        )}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Description */}
              <motion.p
                custom={index + 2}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.4 }}
                variants={revealUp}
                className="mt-10 sm:mt-14 lg:mt-20 text-os-body text-sm sm:text-base lg:text-lg max-w-2xl leading-[1.8]"
              >
                {cat.desc}
              </motion.p>
            </div>
          </div>
        ))}
      </section>

      {/* Line before contact */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={lineReveal}
        className="mx-5 sm:mx-10 lg:mx-20 xl:mx-24 h-px bg-os-border origin-left"
      />

      {/* ===== CONTACT ===== */}
      <section id="contact" className="px-5 sm:px-10 lg:px-20 xl:px-24 py-24 sm:py-32 lg:py-48">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-14 sm:gap-16 lg:gap-28">
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-bold tracking-tight leading-[1.05] mb-8 sm:mb-10">
                Travaillons
                <br />
                ensemble.
              </h2>
              <p className="text-os-body text-sm sm:text-base lg:text-lg leading-relaxed max-w-md">
                Vous avez un projet, une opportunité, ou juste envie d&apos;échanger ?
                Je suis toujours ouvert aux nouvelles collaborations.
              </p>
            </motion.div>

            {/* Right — Links */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1], delay: 0.15 }}
              className="lg:pt-4 space-y-1"
            >
              {[
                {
                  label: 'Email',
                  value: site.email,
                  href: `mailto:${site.email}`,
                  icon: FaEnvelope,
                },
                {
                  label: 'GitHub',
                  value: site.githubLabel,
                  href: site.github,
                  icon: FaGithub,
                  external: true,
                },
                {
                  label: 'LinkedIn',
                  value: site.linkedinLabel,
                  href: site.linkedin,
                  icon: FaLinkedin,
                  external: true,
                },
              ].map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                  className="group flex items-center gap-4 sm:gap-5 py-5 sm:py-6 border-b border-os-border"
                >
                  <span className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-os-border flex items-center justify-center text-os-muted group-hover:border-os-text group-hover:text-os-text group-hover:bg-os-text group-hover:text-white transition-all duration-500 flex-shrink-0"
                  >
                    <link.icon size={18} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs sm:text-sm text-os-muted block mb-0.5">
                      {link.label}
                    </span>
                    <span className="text-lg sm:text-xl lg:text-2xl text-os-text group-hover:text-os-text transition-colors duration-500 truncate block font-medium">
                      {link.value}
                    </span>
                  </div>
                  {link.external && (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      className="text-os-border group-hover:text-os-text transition-all duration-500 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 flex-shrink-0"
                    >
                      <path d="M7 17L17 7" />
                      <path d="M7 7h10v10" />
                    </svg>
                  )}
                </motion.a>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="px-5 sm:px-10 lg:px-20 xl:px-24 py-10 sm:py-14 lg:py-20 border-t border-os-border bg-os-surface/30">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8 lg:gap-12">
            <div className="space-y-4">
              <p className="text-os-text text-xl sm:text-2xl lg:text-3xl font-display font-bold leading-tight">
                Jean-David
                <br />
                Zamblezie
              </p>
              <p className="text-os-body text-sm">
                © {new Date().getFullYear()} — Tous droits réservés.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
              <a
                href={site.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-os-muted hover:text-os-text transition-colors duration-300 text-sm"
              >
                GitHub
              </a>
              <a
                href={site.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-os-muted hover:text-os-text transition-colors duration-300 text-sm"
              >
                LinkedIn
              </a>
              <button
                onClick={() => openLegal('privacy')}
                className="text-os-muted hover:text-os-text transition-colors duration-300 text-sm"
              >
                Confidentialité
              </button>
              <button
                onClick={() => openLegal('legal')}
                className="text-os-muted hover:text-os-text transition-colors duration-300 text-sm"
              >
                Mentions légales
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* ===== LEGAL MODAL ===== */}
      {/* Le portail cible le body : il n'existe pas côté serveur, donc on ne le
          crée que dans le navigateur (cf. scripts/prerender.mjs). */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {showLegal && (
            <motion.div
              key="legal-modal"
              className="fixed inset-0 z-[9999]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div
                onClick={() => setShowLegal(false)}
                className="absolute inset-0 bg-os-text/20 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                role="dialog"
                aria-modal="true"
                aria-labelledby="legal-modal-title"
                className="absolute inset-4 sm:inset-6 lg:inset-auto lg:top-20 lg:left-1/2 lg:-translate-x-1/2 lg:w-full lg:max-w-2xl bg-white border border-os-text rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh]"
              >
                <div className="flex items-center justify-between gap-3 px-5 sm:px-6 py-3.5 sm:py-4 border-b border-os-border">
                  <h2 id="legal-modal-title" className="sr-only">
                    Informations légales
                  </h2>
                  <div role="tablist" aria-label="Informations légales" className="flex items-center gap-1">
                    {legalTabs.map((tab) => {
                      const isActive = tab.id === legalTab;
                      return (
                        <button
                          key={tab.id}
                          role="tab"
                          id={`legal-tab-${tab.id}`}
                          aria-selected={isActive}
                          aria-controls={`legal-panel-${tab.id}`}
                          onClick={() => setLegalTab(tab.id)}
                          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-[13px] font-medium transition-colors duration-300 ${
                            isActive
                              ? 'bg-os-surface text-os-text'
                              : 'text-os-muted hover:text-os-text'
                          }`}
                        >
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setShowLegal(false)}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-os-border flex items-center justify-center text-os-muted hover:border-os-text hover:text-os-text transition-all duration-300 flex-shrink-0"
                    aria-label="Fermer"
                  >
                    <FaTimes size={13} />
                  </button>
                </div>

                <div
                  id={`legal-panel-${activeTab.id}`}
                  role="tabpanel"
                  aria-labelledby={`legal-tab-${activeTab.id}`}
                  className="flex-1 overflow-y-auto p-5 sm:p-10 space-y-6 sm:space-y-8"
                >
                  {activeTab.sections.map((section) => (
                    <div key={section.title}>
                      <h3 className="text-sm font-bold mb-2 sm:mb-3 text-os-text">{section.title}</h3>
                      <p className="text-os-body text-sm leading-relaxed whitespace-pre-line">
                        {section.body}
                      </p>
                    </div>
                  ))}
                  <div className="pt-3 sm:pt-4 border-t border-os-border">
                    <p className="text-xs text-os-muted">
                      Dernière mise à jour : {LEGAL_LAST_UPDATED}
                    </p>
                  </div>
                </div>

                <div className="px-5 sm:px-6 py-3 sm:py-4 border-t border-os-border flex justify-end">
                  <button
                    onClick={() => setShowLegal(false)}
                    className="px-5 sm:px-6 py-2 sm:py-2.5 bg-os-text text-white rounded-lg text-sm font-medium hover:bg-os-muted transition-colors duration-300"
                  >
                    Fermer
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </main>
  );
};

export default Face;
