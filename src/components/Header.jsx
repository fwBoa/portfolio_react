import React from 'react';
import { motion } from 'framer-motion';
import { FaSun, FaMoon, FaCode, FaUser } from 'react-icons/fa';

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
      className={`fixed top-0 left-0 right-0 z-50 ${isDevMode
          ? 'bg-dev-dark border-b border-dev-accent'
          : 'bg-white shadow-md'
        } transition-colors duration-300`}
    >
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo / Nom */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center flex-shrink-0"
          >
            {isDevMode ? (
              <span className="text-xl sm:text-2xl font-bold text-dev-accent font-mono">
                {'<JD />'}
              </span>
            ) : (
              <img
                src="src/assets/Img/logo.png"
                alt="Logo Jean-David"
                className="h-12 sm:h-16 md:h-20 w-auto object-contain"
              />
            )}
          </motion.div>


          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {isDevMode ? (
              // Navigation mode développeur
              <>
                <button
                  onClick={() => scrollToSection('terminal')}
                  className="text-dev-accent hover:opacity-80 transition-opacity font-mono cursor-pointer"
                >
                  $ terminal
                </button>
                <button
                  onClick={() => scrollToSection('code')}
                  className="text-dev-accent hover:opacity-80 transition-opacity font-mono cursor-pointer"
                >
                  {'{ code }'}
                </button>
                <button
                  onClick={() => scrollToSection('stats')}
                  className="text-dev-accent hover:opacity-80 transition-opacity font-mono cursor-pointer"
                >
                  // stats
                </button>
              </>
            ) : (
              // Navigation mode normal
              <>
                <button
                  onClick={() => scrollToSection('about')}
                  className="text-minimal-text hover:text-gray-600 transition-colors cursor-pointer"
                >
                  À propos
                </button>
                <button
                  onClick={() => scrollToSection('projects')}
                  className="text-minimal-text hover:text-gray-600 transition-colors cursor-pointer"
                >
                  Projets
                </button>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="text-minimal-text hover:text-gray-600 transition-colors cursor-pointer"
                >
                  Contact
                </button>
              </>
            )}
          </nav>

          {/* Toggle Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleMode}
            className={`relative w-14 h-7 sm:w-16 sm:h-8 rounded-full p-1 transition-colors duration-300 flex-shrink-0 ${isDevMode ? 'bg-dev-accent' : 'bg-gray-300'
              }`}
            aria-label="Basculer le mode"
          >
            <motion.div
              animate={{ x: isDevMode ? 28 : 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center ${isDevMode ? 'bg-dev-dark' : 'bg-white'
                }`}
            >
              {isDevMode ? (
                <FaCode className="text-dev-accent text-xs" />
              ) : (
                <FaUser className="text-gray-600 text-xs" />
              )}
            </motion.div>
          </motion.button>
        </div>

        {/* Navigation mobile */}
        <nav className="md:hidden mt-4 flex justify-around">
          {isDevMode ? (
            <>
              <button onClick={() => scrollToSection('terminal')} className="text-dev-accent font-mono text-sm">
                terminal
              </button>
              <button onClick={() => scrollToSection('code')} className="text-dev-accent font-mono text-sm">
                code
              </button>
              <button onClick={() => scrollToSection('stats')} className="text-dev-accent font-mono text-sm">
                stats
              </button>
            </>
          ) : (
            <>
              <button onClick={() => scrollToSection('about')} className="text-minimal-text text-sm">
                À propos
              </button>
              <button onClick={() => scrollToSection('projects')} className="text-minimal-text text-sm">
                Projets
              </button>
              <button onClick={() => scrollToSection('contact')} className="text-minimal-text text-sm">
                Contact
              </button>
            </>
          )}
        </nav>
      </div>
    </motion.header>
  );
};

export default Header;
