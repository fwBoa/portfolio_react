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
    desc: "Je conçois des sites et applications web sur mesure, conçus pour répondre à des besoins précis : vitrine, SaaS, CRM, service en ligne, outil métier ou plateforme interactive. Je travaille de la structure à l'interface pour proposer une expérience fluide, accessible et alignée avec les objectifs du projet. Chaque choix technique sert avant tout la clarté du parcours utilisateur et la fiabilité du produit sur le long terme.",
    items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Vite'],
  },
  {
    num: '02',
    title: 'IA & Automatisation',
    desc: "Je conçois des systèmes agentiques capables d'autonomiser des tâches complexes grâce aux modèles de langage (LLM). Mon approche combine LangChain pour l'orchestration et les protocoles MCP (Model Context Protocol) pour connecter les agents à des outils et des données en temps réel. J'ai une expérience pratique des pipelines RAG, des workflows n8n et des architectures multi-agents collaboratifs. L'objectif est toujours le même : transformer des processus manuels en automatisations fiables, mesurables et scalables.",
    items: ['Python', 'LangChain', 'n8n', 'MCP', 'Agentic Workflows'],
  },
  {
    num: '03',
    title: 'Infrastructure & Design',
    desc: "Un projet solide repose sur une infrastructure propre et une base de données bien pensée. Je gère le versioning avec Git, la containerisation avec Docker et le déploiement continu sur Vercel. Côté données, je privilégie PostgreSQL et Supabase pour leur fiabilité et leur intégration temps réel. Le design n'est pas un afterthought : j'utilise Figma pour prototyper et valider les interfaces avant de passer au code. Mon rôle est d'assurer la cohérence entre le visuel, l'architecture technique et la performance en production.",
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

  const { scrollY } = useScroll();
  const rawAvatarY = useTransform(scrollY, [0, 800], [0, -50]);
  const avatarY = useSpring(rawAvatarY, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <main className="min-h-screen bg-os-bg text-os-text pt-20 overflow-x-hidden">
      <div className="grain-overlay" />

      {/* ===== HERO ===== */}
      <section id="about" className="relative px-5 sm:px-10 lg:px-20 xl:px-24 pt-12 sm:pt-20 lg:pt-24 pb-16 sm:pb-24 lg:pb-32">
        <div className="max-w-[1400px] mx-auto relative">

          {/* Name + Avatar */}
          <div className="relative">
            <h1 className="text-[clamp(2.8rem,13vw,14rem)] font-display font-bold leading-[0.82] tracking-[-0.04em] text-center">
              <AnimatedLetters text="Jean-David" />
            </h1>

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-center gap-6 lg:gap-0 mt-2 sm:mt-3 lg:mt-0 relative">
              <h1 className="text-[clamp(2.8rem,13vw,14rem)] font-display font-bold leading-[0.82] tracking-[-0.04em] text-center">
                <AnimatedLetters text="Zamblezie" delayOffset={12} />
              </h1>

              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -3 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1], delay: 0.5 }}
                style={{ y: avatarY }}
                className="lg:absolute lg:bottom-[-1rem] lg:left-[-2%] xl:left-[0%] flex-shrink-0 self-center lg:self-auto mt-6 lg:mt-0"
              >
                <img
                  src={avatar}
                  alt="Jean-David Zamblezie"
                  className="w-36 sm:w-44 md:w-52 lg:w-60 h-auto object-contain max-w-full"
                  loading="eager"
                />
              </motion.div>
            </div>
          </div>

          {/* Tagline + CV */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="mt-16 sm:mt-20 lg:mt-28 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 sm:gap-8"
          >
            <p className="text-os-muted text-sm sm:text-base lg:text-lg max-w-sm leading-relaxed">
              Web Developer · AI Automation · Agentic Engineer
            </p>

            <a
              href={cv}
              download="CV_Jean-David_Zamblezie.pdf"
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

            {/* Watermark number — offset right so it doesn't overlap title */}
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="absolute top-1/2 left-[80%] sm:left-[70%] lg:left-[75%] -translate-x-1/2 -translate-y-1/2 text-[clamp(7rem,22vw,24rem)] font-display font-bold text-os-border/10 sm:text-os-border/20 select-none pointer-events-none leading-none"
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
                      <span key={item} className="text-sm sm:text-base lg:text-lg text-os-muted font-medium">
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
                className="mt-10 sm:mt-14 lg:mt-20 text-os-muted text-sm sm:text-base lg:text-lg max-w-2xl leading-[1.8]"
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
              <p className="text-os-muted text-sm sm:text-base lg:text-lg leading-relaxed max-w-md">
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
              className="lg:pt-4 space-y-1"
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
              <p className="text-os-muted text-sm">
                © {new Date().getFullYear()} — Tous droits réservés.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
              <a
                href="https://github.com/fwboa"
                target="_blank"
                rel="noopener noreferrer"
                className="text-os-muted hover:text-os-text transition-colors duration-300 text-sm"
              >
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/jean-david-zamblezie-84410b258/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-os-muted hover:text-os-text transition-colors duration-300 text-sm"
              >
                LinkedIn
              </a>
              <button
                onClick={() => setShowLegal(true)}
                className="text-os-muted hover:text-os-text transition-colors duration-300 text-sm"
              >
                Mentions légales
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* ===== LEGAL MODAL ===== */}
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
                className="absolute inset-0 bg-os-text/20 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                className="absolute inset-4 sm:inset-6 lg:inset-auto lg:top-20 lg:left-1/2 lg:-translate-x-1/2 lg:w-full lg:max-w-2xl bg-white border border-os-text rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh]"
              >
                <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 sm:py-4 border-b border-os-border">
                  <span className="text-xs text-os-muted font-medium">
                    Mentions légales
                  </span>
                  <button
                    onClick={() => setShowLegal(false)}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-os-border flex items-center justify-center text-os-muted hover:border-os-text hover:text-os-text transition-all duration-300"
                  >
                    <FaTimes size={13} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-5 sm:p-10 space-y-6 sm:space-y-8">
                  {legalContent.map((section) => (
                    <div key={section.title}>
                      <h3 className="text-sm font-bold mb-2 sm:mb-3 text-os-text">{section.title}</h3>
                      <p className="text-os-muted text-sm leading-relaxed whitespace-pre-line">
                        {section.body}
                      </p>
                    </div>
                  ))}
                  <div className="pt-3 sm:pt-4 border-t border-os-border">
                    <p className="text-xs text-os-muted">
                      Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
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
