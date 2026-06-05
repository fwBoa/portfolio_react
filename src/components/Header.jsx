import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaCode } from 'react-icons/fa';
import logo from '../assets/Img/logo.png';

const Header = ({ isDevMode, toggleMode }) => {
  const [scrolled, setScrolled] = useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const navLinks = [
    { label: 'À propos', id: 'about' },
    { label: 'Compétences', id: 'skills' },
    { label: 'Contact', id: 'contact' },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 sm:px-12 lg:px-24 py-4 sm:py-5 border-b transition-all duration-500 ${
        isDevMode
          ? 'bg-[#0a0a0a] border-[#222] text-[#00ff41]'
          : scrolled
            ? 'bg-white/95 backdrop-blur-md border-neutral-100 text-black'
            : 'bg-white/80 backdrop-blur-sm border-transparent text-black'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center">
        <img
          src={logo}
          alt="Logo Jean-David Zamblezie"
          className="h-9 w-auto object-contain"
        />
      </div>

      {/* Nav — editorial with animated underline */}
      <nav className="hidden md:flex items-center gap-10">
        {navLinks.map((link) => (
          <button
            key={link.id}
            onClick={() => scrollToSection(link.id)}
            className={`group relative text-[11px] uppercase tracking-[0.2em] font-medium transition-colors duration-300 ${
              isDevMode
                ? 'text-neutral-500 hover:text-[#00ff41]'
                : 'text-neutral-400 hover:text-black'
            }`}
          >
            {link.label}
            <span className={`absolute -bottom-1 left-0 h-px w-0 group-hover:w-full transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
              isDevMode ? 'bg-[#00ff41]' : 'bg-black'
            }`} />
          </button>
        ))}
      </nav>

      {/* Dev Toggle — minimal pill */}
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={toggleMode}
        className={`flex items-center gap-2 px-4 py-2 rounded-full border text-[10px] uppercase tracking-[0.15em] font-medium transition-all duration-300 ${
          isDevMode
            ? 'border-[#00ff41] text-[#00ff41] hover:bg-[#00ff41] hover:text-black'
            : 'border-neutral-200 text-neutral-500 hover:border-black hover:text-black hover:bg-black hover:text-white'
        }`}
      >
        {isDevMode ? (
          <>
            <FaCode size={11} />
            <span>Dev</span>
          </>
        ) : (
          <>
            <FaUser size={11} />
            <span>Human</span>
          </>
        )}
      </motion.button>
    </motion.header>
  );
};

export default Header;
