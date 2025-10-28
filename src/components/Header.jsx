import React from 'react';
import { motion } from 'framer-motion';
import { FaSun, FaMoon, FaCode, FaUser } from 'react-icons/fa';
import logo from '../assets/Img/logo.png';

/**
 * Composant Header - Barre de navigation avec toggle pour basculer entre les faces
 * @param {boolean} isDevMode - État du mode développeur
 * @param {function} toggleMode - Fonction pour basculer entre les modes
 */
const Header = ({ isDevMode, toggleMode }) => {
  // Fonction pour le défilement fluide vers une section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 120; // Hauteur du header + marge
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md ${isDevMode
          ? 'bg-dev-dark/95 border-b-2 border-dev-accent shadow-lg shadow-dev-accent/20'
          : 'bg-white/95 shadow-lg border-b border-gray-200'
        } transition-all duration-300`}
    >
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-5">
        <div className="flex items-center justify-between gap-4">
          {/* Logo / Nom */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center flex-shrink-0 cursor-pointer"
          >
            {isDevMode ? (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xl sm:text-2xl font-bold text-dev-accent font-mono relative"
              >
                {'<JD />'}
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="inline-block ml-1 text-dev-accent"
                >
                  _
                </motion.span>
              </motion.span>
            ) : (
              <motion.img
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={logo}
                alt="Logo Jean-David"
                className="h-12 sm:h-16 md:h-20 w-auto object-contain drop-shadow-md"
              />
            )}
          </motion.div>


          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {isDevMode ? (
              // Navigation mode développeur
              <>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => scrollToSection('terminal')}
                  className="text-dev-accent hover:text-white transition-colors font-mono cursor-pointer text-sm sm:text-base relative group"
                >
                  $ terminal
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-dev-accent group-hover:w-full transition-all duration-300"></span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => scrollToSection('code')}
                  className="text-dev-accent hover:text-white transition-colors font-mono cursor-pointer text-sm sm:text-base relative group"
                >
                  {'{ code }'}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-dev-accent group-hover:w-full transition-all duration-300"></span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => scrollToSection('stats')}
                  className="text-dev-accent hover:text-white transition-colors font-mono cursor-pointer text-sm sm:text-base relative group"
                >
                  // stats
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-dev-accent group-hover:w-full transition-all duration-300"></span>
                </motion.button>
              </>
            ) : (
              // Navigation mode normal
              <>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => scrollToSection('about')}
                  className="text-minimal-text hover:text-[#2a5159] transition-colors cursor-pointer font-medium text-sm sm:text-base relative group"
                >
                  À propos
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-minimal-text group-hover:w-full transition-all duration-300"></span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => scrollToSection('projects')}
                  className="text-minimal-text hover:text-[#2a5159] transition-colors cursor-pointer font-medium text-sm sm:text-base relative group"
                >
                  Projets
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-minimal-text group-hover:w-full transition-all duration-300"></span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => scrollToSection('contact')}
                  className="text-minimal-text hover:text-[#2a5159] transition-colors cursor-pointer font-medium text-sm sm:text-base relative group"
                >
                  Contact
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-minimal-text group-hover:w-full transition-all duration-300"></span>
                </motion.button>
              </>
            )}
          </nav>

          {/* Toggle Button avec label */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`hidden sm:block text-xs sm:text-sm font-semibold tracking-wide ${
                isDevMode ? 'text-dev-accent font-mono' : 'text-minimal-text'
              }`}
            >
              {isDevMode ? '< DEV />' : 'NORMAL'}
            </motion.span>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleMode}
              className={`relative w-14 h-7 sm:w-16 sm:h-8 rounded-full p-1 transition-all duration-300 ${
                isDevMode 
                  ? 'bg-dev-accent shadow-lg shadow-dev-accent/50' 
                  : 'bg-gray-300 shadow-md'
              }`}
              aria-label="Basculer le mode"
            >
              {/* Animation pulsante pour attirer l'attention */}
              {!isDevMode && (
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 rounded-full bg-minimal-text"
                />
              )}
              
              <motion.div
                animate={{ x: isDevMode ? 28 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className={`relative w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center shadow-lg ${
                  isDevMode ? 'bg-dev-dark' : 'bg-white'
                }`}
              >
                {isDevMode ? (
                  <FaCode className="text-dev-accent text-xs sm:text-sm" />
                ) : (
                  <FaUser className="text-gray-600 text-xs sm:text-sm" />
                )}
              </motion.div>
            </motion.button>
          </div>
        </div>

        {/* Navigation mobile */}
        <nav className="md:hidden mt-4 flex justify-around border-t border-gray-200 pt-3">
          {isDevMode ? (
            <>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection('terminal')}
                className="text-dev-accent font-mono text-xs sm:text-sm hover:text-white transition-colors"
              >
                $ terminal
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection('code')}
                className="text-dev-accent font-mono text-xs sm:text-sm hover:text-white transition-colors"
              >
                {'{ code }'}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection('stats')}
                className="text-dev-accent font-mono text-xs sm:text-sm hover:text-white transition-colors"
              >
                // stats
              </motion.button>
            </>
          ) : (
            <>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection('about')}
                className="text-minimal-text text-xs sm:text-sm font-medium hover:text-[#2a5159] transition-colors"
              >
                À propos
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection('projects')}
                className="text-minimal-text text-xs sm:text-sm font-medium hover:text-[#2a5159] transition-colors"
              >
                Projets
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection('contact')}
                className="text-minimal-text text-xs sm:text-sm font-medium hover:text-[#2a5159] transition-colors"
              >
                Contact
              </motion.button>
            </>
          )}
        </nav>
      </div>
    </motion.header>
  );
};

export default Header;
