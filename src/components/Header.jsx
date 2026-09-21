import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCode, FaBars, FaTimes } from 'react-icons/fa';
import logo from '../assets/Img/logo.png';
import logoWebp from '../assets/Img/logo.webp';

const navLinks = [
  { label: 'À propos', id: 'about' },
  { label: 'Compétences', id: 'skills' },
  { label: 'Contact', id: 'contact' },
];

const Header = ({ isDevMode, toggleMode }) => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('about');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);

      // Scroll spy
      const sections = navLinks.map((link) => document.getElementById(link.id));
      const scrollPos = window.scrollY + 150;

      for (let i = sections.length - 1; i >= 0; i--) {
        if (sections[i] && sections[i].offsetTop <= scrollPos) {
          setActiveSection(navLinks[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          isDevMode
            ? 'bg-[#0a0a0a]/90 backdrop-blur-md border-b border-[#222]'
            : scrolled
              ? 'bg-white/85 backdrop-blur-xl border-b border-os-border/60 shadow-[0_1px_40px_-12px_rgba(0,0,0,0.05)]'
              : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-20 xl:px-24 flex items-center justify-between h-16 sm:h-[4.5rem] lg:h-20">
          {/* Logo */}
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setMobileMenuOpen(false);
            }}
            className="flex items-center group"
          >
            <picture>
              <source srcSet={logoWebp} type="image/webp" />
              <img
                src={logo}
                alt="Logo Jean-David Zamblezie"
                width="240"
                height="170"
                className="h-12 sm:h-14 lg:h-16 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
              />
            </picture>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center">
            {isDevMode ? (
              <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.15em] text-dev-muted uppercase">
                jean-david@portfolio:~$<span className="inline-block w-1.5 h-3.5 bg-dev-green ml-1 align-middle animate-blink" />
              </span>
            ) : (
              <div className="flex items-center gap-1">
                {navLinks.map((link) => {
                  const isActive = activeSection === link.id;
                  return (
                    <button
                      key={link.id}
                      onClick={() => scrollToSection(link.id)}
                      className={`relative px-4 py-2 text-[11px] uppercase tracking-[0.15em] font-medium font-display transition-colors duration-300 rounded-full ${
                        isActive
                          ? 'text-os-text'
                          : 'text-os-muted hover:text-os-text'
                      }`}
                    >
                      {link.label}
                      {isActive && (
                        <motion.span
                          layoutId="activeNav"
                          className="absolute inset-0 bg-os-surface rounded-full -z-10"
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </nav>

          {/* Right: Mobile hamburger + Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Section indicator dot (desktop only) */}
            <AnimatePresence mode="wait">
              {!isDevMode && (
                <motion.span
                  key={activeSection}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  className="hidden lg:block w-1.5 h-1.5 rounded-full bg-os-text"
                />
              )}
            </AnimatePresence>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-full transition-colors duration-300"
              aria-label="Ouvrir le menu"
            >
              <FaBars
                size={18}
                className={isDevMode ? 'text-dev-muted' : scrolled ? 'text-os-text' : 'text-os-text'}
              />
            </button>

            {/* Dev Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleMode}
              className={`flex items-center gap-2 sm:gap-2.5 px-3 sm:px-4 py-2 rounded-full text-[10px] uppercase tracking-[0.15em] font-medium font-display transition-all duration-300 ${
                isDevMode
                  ? 'border border-dev-green text-dev-green hover:bg-dev-green hover:text-black'
                  : scrolled
                    ? 'border border-os-border text-os-muted hover:border-os-text hover:text-os-text hover:bg-os-text hover:text-white'
                    : 'border border-os-border/50 text-os-muted hover:border-os-text hover:text-os-text'
              }`}
            >
              <FaCode size={11} />
              <span className="hidden sm:inline">{isDevMode ? 'Dev' : 'Switch'}</span>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* ===== Mobile Menu Overlay ===== */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className={`fixed inset-0 z-[9998] md:hidden flex flex-col ${
              isDevMode ? 'bg-dev-bg/98 backdrop-blur-xl' : 'bg-white/98 backdrop-blur-xl'
            }`}
          >
            {/* Header bar inside overlay */}
            <div className="flex items-center justify-between px-5 h-16 sm:h-[4.5rem]">
              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setMobileMenuOpen(false);
                }}
                className="flex items-center group"
              >
                <picture>
                  <source srcSet={logoWebp} type="image/webp" />
                  <img
                    src={logo}
                    alt="Logo Jean-David Zamblezie"
                    width="240"
                    height="170"
                    className="h-12 sm:h-14 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                </picture>
              </button>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className={`p-2 rounded-full transition-colors duration-300 ${
                  isDevMode
                    ? 'text-dev-muted hover:text-dev-green'
                    : 'text-os-muted hover:text-os-text'
                }`}
                aria-label="Fermer le menu"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Nav links — only show in normal mode */}
            {isDevMode ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                  className="text-center space-y-4"
                >
                  <p className="font-mono text-[10px] tracking-[0.3em] text-dev-muted uppercase">
                    Prometheus OS Terminal v2.0
                  </p>
                  <p className="font-mono text-sm text-dev-text">
                    jean-david@portfolio:~$ help
                  </p>
                  <p className="font-mono text-xs text-dev-muted leading-relaxed max-w-xs mx-auto">
                    available: about, skills, contact, neofetch, clear
                  </p>
                </motion.div>
              </div>
            ) : (
              <nav className="flex-1 flex flex-col items-center justify-center gap-8 sm:gap-10">
                {navLinks.map((link, i) => (
                  <motion.button
                    key={link.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.1 + i * 0.08,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                    onClick={() => scrollToSection(link.id)}
                    className="group text-center"
                  >
                    <span className="block text-[10px] uppercase tracking-[0.3em] font-medium mb-2 text-os-muted">
                      0{i + 1}
                    </span>
                    <span className="text-4xl sm:text-5xl font-display font-bold tracking-tight text-os-text group-hover:text-os-muted transition-colors duration-300">
                      {link.label}
                    </span>
                  </motion.button>
                ))}
              </nav>
            )}

            {/* Footer of mobile menu */}
            <div className="px-5 py-6 flex items-center justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  toggleMode();
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full text-[10px] uppercase tracking-[0.15em] font-medium font-display transition-all duration-300 ${
                  isDevMode
                    ? 'border border-dev-green text-dev-green hover:bg-dev-green hover:text-black'
                    : 'border border-os-border text-os-muted hover:border-os-text hover:text-os-text hover:bg-os-text hover:text-white'
                }`}
              >
                <FaCode size={11} />
                <span>{isDevMode ? 'Passer en mode Normal' : 'Passer en mode Dev'}</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
