import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope, FaDownload, FaTimes } from 'react-icons/fa';
import avatar from '../assets/Img/avatarportfoliobackgroundremove.png';
import cv from '../assets/doc/cv_alternance.pdf';

const skills = [
  {
    num: '01',
    title: 'Développement Web',
    desc: "Conception d'applications web modernes, performantes et scalables. Architecture frontend, APIs REST, et déploiement continu.",
    items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Vite'],
  },
  {
    num: '02',
    title: 'IA & Automatisation',
    desc: "Création d'agents autonomes et workflows automatisés. Intégration LLM, pipelines RAG, et systèmes agentiques.",
    items: ['Python', 'LangChain', 'OpenAI API', 'n8n', 'MCP', 'Agentic Workflows'],
  },
  {
    num: '03',
    title: 'Infrastructure & Design',
    desc: "Infrastructure technique, versionning, et déploiement. Design d'interfaces et bases de données relationnelles.",
    items: ['Git', 'Docker', 'Figma', 'PostgreSQL', 'Supabase', 'Vercel'],
  },
];

const legalContent = [
  {
    title: 'Éditeur du site',
    body: 'Nom : Jean-David Zamblezie\nStatut : Développeur web\nEmail : jeandavidzamblezie@outlook.fr',
  },
  {
    title: 'Hébergement',
    body: 'Vercel\n340 S Lemon Ave #4133, Walnut, CA 91789, USA',
  },
  {
    title: 'Propriété intellectuelle',
    body: "L'ensemble du contenu de ce site est la propriété exclusive de Jean-David Zamblezie. Toute reproduction sans autorisation écrite préalable est interdite.",
  },
  {
    title: 'Données personnelles (RGPD)',
    body: "Les informations recueillies via le formulaire de contact sont utilisées uniquement pour répondre à vos demandes et ne sont jamais transmises à des tiers.\n\nPour exercer vos droits, contactez : jeandavidzamblezie@outlook.fr",
  },
  {
    title: 'Cookies',
    body: "Ce site n'utilise pas de cookies de tracking. Seuls des cookies techniques strictement nécessaires peuvent être utilisés.",
  },
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

  // Parallax for avatar
  const { scrollY } = useScroll();
  const rawAvatarY = useTransform(scrollY, [0, 800], [0, -50]);
  const avatarY = useSpring(rawAvatarY, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <div className="min-h-screen bg-white text-black pt-20 overflow-x-hidden">
      {/* Grain texture overlay */}
      <div className="grain-overlay" />

      {/* ===== HERO — EDITORIAL FASHION ===== */}
      <section id="about" className="relative px-5 sm:px-10 lg:px-20 xl:px-24 pt-12 sm:pt-16 pb-20 sm:pb-32 lg:pb-48">
        <div className="max-w-[1400px] mx-auto relative">

          {/* Masthead label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex justify-between items-start mb-10 sm:mb-16 lg:mb-20"
          >
            <span className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-medium">
              Web Developer · AI Automation · Agentic Engineer
            </span>
          </motion.div>

          {/* Massive Name + Avatar composition */}
          <div className="relative">
            <h1 className="text-[clamp(2.5rem,12vw,13rem)] font-bold leading-[0.85] tracking-[-0.04em]">
              <AnimatedLetters text="Jean-David" />
            </h1>

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 lg:gap-0 mt-1 sm:mt-2 lg:mt-0">
              <h1 className="text-[clamp(2.5rem,12vw,13rem)] font-bold leading-[0.85] tracking-[-0.04em] lg:text-right lg:ml-auto">
                <AnimatedLetters text="Zamblezie" delayOffset={12} />
              </h1>

              {/* Avatar — floating, offset, fashion editorial style + parallax */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -3 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1], delay: 0.5 }}
                style={{ y: avatarY }}
                className="lg:absolute lg:bottom-0 lg:left-[3%] xl:left-[6%] flex-shrink-0 self-center lg:self-auto mt-4 lg:mt-0"
              >
                <img
                  src={avatar}
                  alt="Jean-David Zamblezie"
                  className="w-32 sm:w-40 md:w-48 lg:w-56 h-auto object-contain max-w-full"
                  loading="eager"
                />
              </motion.div>
            </div>
          </div>

          {/* Bottom hero bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="mt-12 sm:mt-16 lg:mt-24 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 sm:gap-8"
          >
            <p className="text-neutral-500 text-xs sm:text-sm lg:text-base max-w-[16rem] sm:max-w-xs leading-relaxed">
              Développeur web spécialisé en automatisation IA et ingénierie agentique.
            </p>

            <div className="flex items-center gap-6">
              <a
                href={cv}
                download="CV_Jean-David_Zamblezie.pdf"
                className="group flex items-center gap-2.5 sm:gap-3 text-xs sm:text-sm font-medium"
              >
                <span className="border-b border-black pb-0.5 group-hover:text-neutral-500 group-hover:border-neutral-500 transition-colors duration-500">
                  Télécharger le CV
                </span>
                <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-neutral-200 flex items-center justify-center group-hover:border-black group-hover:bg-black group-hover:text-white transition-all duration-500">
                  <FaDownload size={11} />
                </span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== SKILLS — FASHION EDITORIAL WATERMARKS ===== */}
      <section id="skills" className="relative">
        {skills.map((cat, index) => (
          <div
            key={cat.num}
            className="relative px-5 sm:px-10 lg:px-20 xl:px-24 py-16 sm:py-24 lg:py-36"
          >
            {/* Line reveal separator */}
            {index > 0 && (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                variants={lineReveal}
                className="absolute top-0 left-5 sm:left-10 lg:left-20 xl:left-24 right-5 sm:right-10 lg:right-20 xl:right-24 h-px bg-neutral-100 origin-left"
              />
            )}

            {/* Giant watermark number */}
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[clamp(6rem,20vw,22rem)] font-bold text-neutral-100 select-none pointer-events-none leading-none"
            >
              {cat.num}
            </motion.span>

            <div className="max-w-[1400px] mx-auto relative z-10">
              {/* Title + skill tags row */}
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6 sm:gap-8 lg:gap-16 items-start">
                <motion.div
                  custom={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.4 }}
                  variants={revealUp}
                >
                  <span className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-medium block mb-3 sm:mb-4">
                    {cat.num} — Compétences
                  </span>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight leading-tight">
                    {cat.title}
                  </h2>
                </motion.div>

                <motion.div
                  custom={index + 1}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.4 }}
                  variants={revealUp}
                  className="lg:pt-10"
                >
                  <div className="flex flex-wrap gap-x-4 sm:gap-x-6 gap-y-1.5 sm:gap-y-2">
                    {cat.items.map((item, i) => (
                      <span key={item} className="text-xs sm:text-sm lg:text-base text-neutral-600">
                        {item}
                        {i < cat.items.length - 1 && (
                          <span className="text-neutral-300 ml-4 sm:ml-6">·</span>
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
                className="mt-8 sm:mt-12 lg:mt-16 text-neutral-500 text-xs sm:text-sm lg:text-base max-w-xl leading-[1.8]"
              >
                {cat.desc}
              </motion.p>
            </div>
          </div>
        ))}
      </section>

      {/* Line reveal before contact */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={lineReveal}
        className="mx-5 sm:mx-10 lg:mx-20 xl:mx-24 h-px bg-neutral-100 origin-left"
      />

      {/* ===== CONTACT — EDITORIAL ===== */}
      <section id="contact" className="px-5 sm:px-10 lg:px-20 xl:px-24 py-20 sm:py-28 lg:py-40 xl:py-48">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 sm:gap-16 lg:gap-24">
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <span className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-medium block mb-5 sm:mb-6">
                Contact
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-[1.05] mb-6 sm:mb-8">
                Travaillons
                <br />
                ensemble.
              </h2>
              <p className="text-neutral-500 text-xs sm:text-sm lg:text-base leading-relaxed max-w-sm">
                Vous avez un projet, une opportunité, ou juste envie d'échanger ?
                Je suis toujours ouvert aux nouvelles collaborations.
              </p>
            </motion.div>

            {/* Right — Links */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1], delay: 0.15 }}
              className="lg:pt-16 space-y-6 sm:space-y-8"
            >
              {[
                {
                  label: 'Email',
                  value: 'jeandavidzamblezie@outlook.fr',
                  href: 'mailto:jeandavidzamblezie@outlook.fr',
                  icon: FaEnvelope,
                },
                {
                  label: 'GitHub',
                  value: 'github.com/fwboa',
                  href: 'https://github.com/fwboa',
                  icon: FaGithub,
                  external: true,
                },
                {
                  label: 'LinkedIn',
                  value: 'linkedin.com/in/jean-david-zamblezie',
                  href: 'https://www.linkedin.com/in/jean-david-zamblezie-84410b258/',
                  icon: FaLinkedin,
                  external: true,
                },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                  className="group flex items-center gap-3 sm:gap-4 py-2.5 sm:py-3"
                >
                  <link.icon
                    size={16}
                    className="text-neutral-300 group-hover:text-black transition-colors duration-500 sm:w-[18px] sm:h-[18px]"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] sm:text-xs text-neutral-400 uppercase tracking-wider block mb-0.5">
                      {link.label}
                    </span>
                    <span className="text-base sm:text-lg lg:text-xl text-neutral-800 group-hover:text-black transition-colors duration-500 border-b border-transparent group-hover:border-black pb-0.5 truncate block">
                      {link.value}
                    </span>
                  </div>
                  {link.external && (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      className="text-neutral-300 group-hover:text-black transition-all duration-500 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 flex-shrink-0"
                    >
                      <path d="M7 17L17 7" />
                      <path d="M7 7h10v10" />
                    </svg>
                  )}
                </a>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="px-5 sm:px-10 lg:px-20 xl:px-24 py-6 sm:py-8 border-t border-neutral-100">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <p className="text-[10px] sm:text-xs text-neutral-400 tracking-wider">
            © {new Date().getFullYear()} Jean-David Zamblezie
          </p>
          <button
            onClick={() => setShowLegal(true)}
            className="text-[10px] sm:text-xs text-neutral-400 hover:text-black transition-colors duration-500 tracking-wider"
          >
            Mentions légales
          </button>
        </div>
      </footer>

      {/* ===== LEGAL MODAL — Portal ===== */}
      {createPortal(
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
                className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                className="absolute inset-3 sm:inset-6 lg:inset-auto lg:top-20 lg:left-1/2 lg:-translate-x-1/2 lg:w-full lg:max-w-2xl bg-white border border-black rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh]"
              >
                <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 sm:py-4 border-b border-neutral-100">
                  <span className="text-[10px] sm:text-xs text-neutral-400 font-medium tracking-wider uppercase">
                    Mentions légales
                  </span>
                  <button
                    onClick={() => setShowLegal(false)}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-400 hover:border-black hover:text-black transition-all duration-300"
                  >
                    <FaTimes size={13} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-5 sm:p-10 space-y-6 sm:space-y-8">
                  {legalContent.map((section) => (
                    <div key={section.title}>
                      <h3 className="text-xs sm:text-sm font-bold mb-2 sm:mb-3">{section.title}</h3>
                      <p className="text-neutral-500 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                        {section.body}
                      </p>
                    </div>
                  ))}
                  <div className="pt-3 sm:pt-4 border-t border-neutral-100">
                    <p className="text-[10px] sm:text-xs text-neutral-400">
                      Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="px-5 sm:px-6 py-3 sm:py-4 border-t border-neutral-100 flex justify-end">
                  <button
                    onClick={() => setShowLegal(false)}
                    className="px-5 sm:px-6 py-2 sm:py-2.5 bg-black text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-neutral-800 transition-colors duration-300"
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
    </div>
  );
};

export default Face;
