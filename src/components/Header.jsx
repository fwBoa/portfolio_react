import React from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaCode } from 'react-icons/fa';
import logo from '../assets/Img/logo.png';

const Header = ({ isDevMode, toggleMode }) => {
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

  return (
    <motion.header
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 sm:px-12 lg:px-24 py-4 border-b transition-colors duration-300 ${
        isDevMode
          ? 'bg-[#0a0a0a] border-[#222] text-[#00ff41]'
          : 'bg-white/90 backdrop-blur-sm border-neutral-100 text-black'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-2">
        <img
          src={logo}
          alt="Logo Jean-David Zamblezie"
          className="h-8 w-auto object-contain"
        />
      </div>

      {/* Nav */}
      <nav className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => (
          <motion.button
            key={link.id}
            whileHover={{ y: -1 }}
            onClick={() => scrollToSection(link.id)}
            className={`text-sm transition-colors ${
              isDevMode
                ? 'text-neutral-400 hover:text-[#00ff41]'
                : 'text-neutral-500 hover:text-black'
            }`}
          >
            {link.label}
          </motion.button>
        ))}
      </nav>

      {/* Dev Toggle */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleMode}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
          isDevMode
            ? 'border-[#00ff41] text-[#00ff41] hover:bg-[#00ff41] hover:text-black'
            : 'border-neutral-200 text-neutral-500 hover:border-black hover:text-black'
        }`}
      >
        {isDevMode ? (
          <>
            <FaCode size={12} />
            <span>DEV</span>
          </>
        ) : (
          <>
            <FaUser size={12} />
            <span>NORMAL</span>
          </>
        )}
      </motion.button>
    </motion.header>
  );
};

export default Header;
