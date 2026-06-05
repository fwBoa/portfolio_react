import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const Face = () => {
  const [showLegal, setShowLegal] = useState(false);

  return (
    <div className="min-h-screen bg-white text-black pt-20">
      {/* ===== HERO ===== */}
      <section id="about" className="px-6 sm:px-12 lg:px-24 py-20 sm:py-32 lg:py-40">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-16 lg:gap-24 items-start">
            {/* Text */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="order-2 lg:order-1"
            >
              <motion.p
                variants={itemVariants}
                className="text-neutral-400 text-xs sm:text-sm tracking-[0.25em] uppercase mb-8"
              >
                Web Developer · AI Automation · Agentic Engineer
              </motion.p>

              <motion.h1
                variants={itemVariants}
                className="text-[clamp(3rem,8vw,6.5rem)] font-bold leading-[0.95] tracking-[-0.03em] mb-10"
              >
                Jean-David
                <br />
                Zamblezie
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="text-neutral-500 text-base sm:text-lg max-w-md leading-[1.7] mb-12"
              >
                Développeur web spécialisé en automatisation IA et ingénierie
                agentique. Applications modernes avec React, Next.js et
                TypeScript.
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-5">
                <a
                  href={cv}
                  download="CV_Jean-David_Zamblezie.pdf"
                  className="group inline-flex items-center gap-2.5 px-6 py-3 bg-black text-white rounded-lg text-sm font-medium hover:bg-neutral-800 transition-all duration-300"
                >
                  <FaDownload size={14} />
                  <span>Télécharger le CV</span>
                </a>

                <div className="flex items-center gap-3">
                  {[
                    { icon: FaGithub, href: 'https://github.com/fwboa', label: 'GitHub' },
                    { icon: FaLinkedin, href: 'https://www.linkedin.com/in/jean-david-zamblezie-84410b258/', label: 'LinkedIn' },
                    { icon: FaEnvelope, href: 'mailto:jeandavidzamblezie@outlook.fr', label: 'Email' },
                  ].map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                      className="w-11 h-11 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-400 hover:border-black hover:text-black hover:scale-110 transition-all duration-300"
                    >
                      <link.icon size={16} />
                    </a>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Avatar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="order-1 lg:order-2 flex justify-center lg:justify-end lg:pt-8"
            >
              <div className="relative">
                <img
                  src={avatar}
                  alt="Jean-David Zamblezie"
                  className="w-full max-w-[260px] lg:max-w-[300px] h-auto object-contain"
                  loading="eager"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== SKILLS ===== */}
      <section id="skills" className="px-6 sm:px-12 lg:px-24 py-32 sm:py-40 border-t border-neutral-100">
        <div className="max-w-6xl mx-auto">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
            className="mb-20"
          >
            <span className="inline-block rounded-full px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] font-medium bg-neutral-100 text-neutral-500">
              Expertise
            </span>
          </motion.div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card 1: Web — Large, spans 2 rows */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.9, ease: [0.32, 0.72, 0, 1], delay: 0 }}
              className="md:row-span-2"
            >
              <div className="h-full p-2 bg-neutral-50 rounded-[1.5rem] ring-1 ring-black/[0.04] hover:ring-black/[0.08] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]">
                <div className="h-full bg-white rounded-[calc(1.5rem-0.5rem)] p-8 sm:p-10 shadow-[inset_0_1px_0_rgba(0,0,0,0.03)] flex flex-col">
                  <div className="flex items-baseline gap-3 mb-6">
                    <span className="font-mono text-neutral-300 text-sm">{skills[0].num}</span>
                    <h3 className="font-bold text-xl sm:text-2xl tracking-tight">{skills[0].title}</h3>
                  </div>

                  <p className="text-neutral-500 leading-[1.7] mb-8 max-w-sm">
                    {skills[0].desc}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-auto">
                    {skills[0].items.map((item) => (
                      <span
                        key={item}
                        className="px-3.5 py-2 text-sm rounded-full bg-neutral-50 text-neutral-600 hover:bg-neutral-100 hover:text-black transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card 2: AI */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.9, ease: [0.32, 0.72, 0, 1], delay: 0.1 }}
            >
              <div className="h-full p-2 bg-neutral-50 rounded-[1.5rem] ring-1 ring-black/[0.04] hover:ring-black/[0.08] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]">
                <div className="h-full bg-white rounded-[calc(1.5rem-0.5rem)] p-8 sm:p-10 shadow-[inset_0_1px_0_rgba(0,0,0,0.03)] flex flex-col">
                  <div className="flex items-baseline gap-3 mb-6">
                    <span className="font-mono text-neutral-300 text-sm">{skills[1].num}</span>
                    <h3 className="font-bold text-xl sm:text-2xl tracking-tight">{skills[1].title}</h3>
                  </div>

                  <p className="text-neutral-500 leading-[1.7] mb-8 max-w-sm">
                    {skills[1].desc}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-auto">
                    {skills[1].items.map((item) => (
                      <span
                        key={item}
                        className="px-3.5 py-2 text-sm rounded-full bg-neutral-50 text-neutral-600 hover:bg-neutral-100 hover:text-black transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card 3: Infrastructure */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.9, ease: [0.32, 0.72, 0, 1], delay: 0.2 }}
            >
              <div className="h-full p-2 bg-neutral-50 rounded-[1.5rem] ring-1 ring-black/[0.04] hover:ring-black/[0.08] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]">
                <div className="h-full bg-white rounded-[calc(1.5rem-0.5rem)] p-8 sm:p-10 shadow-[inset_0_1px_0_rgba(0,0,0,0.03)] flex flex-col">
                  <div className="flex items-baseline gap-3 mb-6">
                    <span className="font-mono text-neutral-300 text-sm">{skills[2].num}</span>
                    <h3 className="font-bold text-xl sm:text-2xl tracking-tight">{skills[2].title}</h3>
                  </div>

                  <p className="text-neutral-500 leading-[1.7] mb-8 max-w-sm">
                    {skills[2].desc}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-auto">
                    {skills[2].items.map((item) => (
                      <span
                        key={item}
                        className="px-3.5 py-2 text-sm rounded-full bg-neutral-50 text-neutral-600 hover:bg-neutral-100 hover:text-black transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section id="contact" className="px-6 sm:px-12 lg:px-24 py-24 sm:py-32 border-t border-neutral-100">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-neutral-300 text-xs tracking-[0.25em] uppercase mb-16">
              Contact
            </p>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-16">
              {/* Left: CTA */}
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">
                  Travaillons
                  <br />
                  ensemble.
                </h2>
                <p className="text-neutral-500 leading-[1.7] max-w-sm">
                  Vous avez un projet, une opportunité, ou juste envie d'échanger ?
                  Je suis toujours ouvert aux nouvelles collaborations.
                </p>
              </div>

              {/* Right: Links */}
              <div className="space-y-6">
                {[
                  {
                    icon: FaEnvelope,
                    href: 'mailto:jeandavidzamblezie@outlook.fr',
                    label: 'jeandavidzamblezie@outlook.fr',
                  },
                  {
                    icon: FaGithub,
                    href: 'https://github.com/fwboa',
                    label: 'github.com/fwboa',
                    external: true,
                  },
                  {
                    icon: FaLinkedin,
                    href: 'https://www.linkedin.com/in/jean-david-zamblezie-84410b258/',
                    label: 'linkedin.com/in/jean-david-zamblezie',
                    external: true,
                  },
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    className="group flex items-center gap-4 py-3"
                  >
                    <span className="w-12 h-12 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-400 group-hover:border-black group-hover:text-black transition-all duration-300">
                      <link.icon size={18} />
                    </span>
                    <div className="flex-1">
                      <span className="text-neutral-600 group-hover:text-black transition-colors duration-300 text-base link-underline">
                        {link.label}
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
                        strokeLinejoin="round"
                        className="text-neutral-300 group-hover:text-black transition-all duration-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0"
                      >
                        <path d="M7 17L17 7" />
                        <path d="M7 7h10v10" />
                      </svg>
                    )}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="px-6 sm:px-12 lg:px-24 py-10 border-t border-neutral-100">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium tracking-tight">Jean-David Zamblezie</p>
            <p className="text-xs text-neutral-400 mt-0.5">
              Web Developer · AI Automation · Agentic Engineer
            </p>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setShowLegal(true)}
              className="text-xs text-neutral-400 hover:text-black transition-colors duration-300"
            >
              Mentions légales
            </button>
            <span className="text-xs text-neutral-300">© {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>

      {/* ===== LEGAL MODAL ===== */}
      <AnimatePresence>
        {showLegal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setShowLegal(false)}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60]"
            />

            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ type: 'spring', damping: 30, stiffness: 350 }}
              className="fixed inset-4 sm:inset-auto sm:top-24 sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-2xl z-[70] bg-white border border-black rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
                <span className="text-xs text-neutral-400 font-mono tracking-wider">
                  MENTIONS LÉGALES
                </span>
                <button
                  onClick={() => setShowLegal(false)}
                  className="w-9 h-9 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-400 hover:border-black hover:text-black transition-all duration-300"
                >
                  <FaTimes size={14} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-8">
                {legalContent.map((section) => (
                  <div key={section.title}>
                    <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                      <span className="text-neutral-300 text-xs">#</span>
                      {section.title}
                    </h3>
                    <p className="text-neutral-500 text-sm leading-relaxed whitespace-pre-line">
                      {section.body}
                    </p>
                  </div>
                ))}

                <div className="pt-4 border-t border-neutral-100">
                  <p className="text-xs text-neutral-400">
                    Dernière mise à jour :{' '}
                    {new Date().toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-neutral-100 flex justify-end">
                <button
                  onClick={() => setShowLegal(false)}
                  className="px-6 py-2.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors duration-300"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Face;
