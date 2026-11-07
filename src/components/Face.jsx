import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope, FaDownload } from 'react-icons/fa';
import avatar from '../assets/Img/avatarportfoliobackgroundremove.png';
import avatarWebp from '../assets/Img/avatar.webp';
import cv from '../assets/doc/cv_alternance_2026.pdf';
import { site } from '../data/site';
import SkillsSection from './SkillsSection';
import NotesSection from './NotesSection';

/**
 * Chaque lettre est une balise distincte pour l'animation. Sans
 * `aria-hidden`, les lecteurs d'écran reçoivent une suite de lettres isolées
 * et peuvent épeler le nom ; le nom complet est fourni en `sr-only` par le h1.
 */
const AnimatedLetters = ({ text, className = '', delayOffset = 0 }) => (
  <span className={`${className} inline-block overflow-hidden`} aria-hidden="true">
    {text.split('').map((char, i) => (
      <span
        key={`${char}-${i}`}
        className="hero-letter inline-block"
        style={{
          animationDelay: `${(i + delayOffset) * 0.03}s`,
          whiteSpace: char === ' ' ? 'pre' : undefined,
        }}
      >
        {char === ' ' ? ' ' : char}
      </span>
    ))}
  </span>
);

const Face = ({ posts = [] }) => {
  const { scrollY } = useScroll();
  const rawAvatarY = useTransform(scrollY, [0, 800], [0, -50]);
  const avatarY = useSpring(rawAvatarY, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // L'entrée du hero attend `load` (premier rendu effectif) et les polices :
  // déclenchée au montage, elle se terminait pendant que l'iPhone affichait
  // encore du blanc, et le visiteur ne voyait que le résultat final.
  // Le mouvement réduit est géré en CSS, qui garde un fondu sans translation.
  const [heroEnter, setHeroEnter] = useState(false);

  useEffect(() => {
    let frame = 0;

    const start = () => {
      frame = window.requestAnimationFrame(() => setHeroEnter(true));
    };
    const onLoad = () => document.fonts.ready.then(start, start);

    if (document.readyState === 'complete') onLoad();
    else window.addEventListener('load', onLoad, { once: true });

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('load', onLoad);
    };
  }, []);

  return (
    <main
      id="main"
      tabIndex={-1}
      className="bg-os-bg text-os-text pt-20 overflow-x-clip focus:outline-none"
    >
      <div className="grain-overlay" />

      {/* ===== HERO ===== */}
      <section
        id="about"
        className={`relative px-5 sm:px-10 lg:px-20 xl:px-24 pt-12 sm:pt-20 lg:pt-24 pb-16 sm:pb-24 lg:pb-32 ${
          heroEnter ? 'hero-enter' : ''
        }`}
      >
        <div className="max-w-[1400px] mx-auto relative">

          {/* Name + Avatar — un seul h1, ses deux lignes sont des spans */}
          <div className="relative">
            <h1 className="text-[clamp(2.8rem,13vw,14rem)] font-display font-bold leading-[0.82] tracking-[-0.04em] text-center">
              {/* Les lettres visuelles sont décoratives : le nom complet est
                  fourni ici, en un seul bloc, pour les lecteurs d'écran. */}
              <span className="sr-only">Jean-David Zamblezie</span>
              <span className="block">
                <AnimatedLetters text="Jean-David" />
              </span>

              <span className="flex flex-col lg:flex-row lg:items-end lg:justify-center gap-6 lg:gap-0 mt-2 sm:mt-3 lg:mt-0 relative">
                <span className="block">
                  <AnimatedLetters text="Zamblezie" delayOffset={12} />
                </span>

                <motion.span
                  style={{ y: avatarY }}
                  className="lg:absolute lg:bottom-[-1rem] lg:left-[-2%] xl:left-[0%] flex-shrink-0 self-center lg:self-auto mt-6 lg:mt-0 block"
                >
                  {/* Image décorative : le nom est déjà porté par le h1.
                      Elle reste visible dès le premier rendu (LCP), puis un
                      léger zoom CSS donne l'entrée sans la masquer. */}
                  <span className="hero-avatar-enter block">
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
                      />
                    </picture>
                  </span>
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
              <span className="border-b border-os-text pb-0.5 group-hover:text-os-body group-hover:border-os-body transition-colors duration-500">
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
      <SkillsSection />

      {/* ===== NOTES ===== */}
      <NotesSection posts={posts} />

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
                    <span className="text-xs sm:text-sm text-os-body block mb-0.5">
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
    </main>
  );
};

export default Face;
