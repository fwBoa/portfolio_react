import { motion } from 'framer-motion';
import { FaCode } from 'react-icons/fa';
import logo from '../../assets/Img/logo.png';
import logoWebp from '../../assets/Img/logo.webp';

/**
 * En-tête du mode Dev. Le site public utilise SiteHeaderFusion ; ce composant
 * ne rend que la barre noire du terminal, avec la sortie vers le mode normal.
 */
const SiteHeader = ({ toggleMode }) => (
  <motion.header
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
    className="fixed top-0 left-0 right-0 z-50 border-b border-[#222] bg-[#0a0a0a]"
  >
    <div className="max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-20 xl:px-24 flex items-center justify-between h-16 sm:h-[4.5rem] lg:h-20">
      <a href="/" className="flex items-center group">
        <picture>
          <source srcSet={logoWebp} type="image/webp" />
          <img
            src={logo}
            alt="Logo Jean-David Zamblezie"
            width="192"
            height="192"
            className="h-10 sm:h-11 lg:h-12 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
          />
        </picture>
      </a>

      <nav className="hidden md:flex items-center">
        <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.15em] text-dev-muted uppercase">
          jean-david@portfolio:~$
          <span className="inline-block w-1.5 h-3.5 bg-dev-green ml-1 align-middle animate-blink" />
        </span>
      </nav>

      <div className="flex items-center gap-2 sm:gap-3">
        <span className="hidden font-mono text-[10px] uppercase tracking-[0.15em] text-dev-muted md:inline">
          Prometheus OS
        </span>

        {toggleMode && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleMode}
            aria-label="Quitter le mode Dev"
            title="Quitter le mode Dev"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-dev-green px-3 text-[10px] font-medium uppercase tracking-[0.15em] font-display text-dev-green transition-all duration-300 hover:bg-dev-green hover:text-black sm:gap-2.5 sm:px-4"
          >
            <FaCode size={11} aria-hidden="true" />
            <span>Normal</span>
          </motion.button>
        )}
      </div>
    </div>
  </motion.header>
);

export default SiteHeader;
