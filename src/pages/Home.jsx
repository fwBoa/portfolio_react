import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import ToggleFace from '../components/ToggleFace';
import Face from '../components/Face';
import DevFace from '../components/DevFace';

/**
 * Page Home - Composant principal qui gère l'état et le basculement entre les deux faces
 */
const Home = () => {
  const [isDevMode, setIsDevMode] = useState(false);
  const [konamiCode, setKonamiCode] = useState([]);

  // Séquence du code Konami
  const konamiSequence = [
    'ArrowUp',
    'ArrowUp',
    'ArrowDown',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowLeft',
    'ArrowRight',
    'b',
    'a',
  ];

  // Fonction pour basculer entre les modes
  const toggleMode = () => {
    setIsDevMode((prev) => !prev);
    
    // Sauvegarde la préférence dans le localStorage
    localStorage.setItem('devMode', JSON.stringify(!isDevMode));
  };

  // Charge la préférence au montage
  useEffect(() => {
    const savedMode = localStorage.getItem('devMode');
    if (savedMode) {
      setIsDevMode(JSON.parse(savedMode));
    }
  }, []);

  // Easter egg : Code Konami
  useEffect(() => {
    const handleKeyPress = (e) => {
      const newSequence = [...konamiCode, e.key].slice(-10);
      setKonamiCode(newSequence);

      // Vérifie si la séquence Konami est complète
      if (JSON.stringify(newSequence) === JSON.stringify(konamiSequence)) {
        console.log('🎮 Code Konami activé !');
        console.log(`
██╗  ██╗ ██████╗ ███╗   ██╗ █████╗ ███╗   ███╗██╗
██║ ██╔╝██╔═══██╗████╗  ██║██╔══██╗████╗ ████║██║
█████╔╝ ██║   ██║██╔██╗ ██║███████║██╔████╔██║██║
██╔═██╗ ██║   ██║██║╚██╗██║██╔══██║██║╚██╔╝██║██║
██║  ██╗╚██████╔╝██║ ╚████║██║  ██║██║ ╚═╝ ██║██║
╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝

Félicitations ! Vous avez débloqué l'easter egg !
Vous êtes un vrai gamer 🎮
        `);
        setKonamiCode([]);
        
        // Active le mode développeur si ce n'est pas déjà fait
        if (!isDevMode) {
          setIsDevMode(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [konamiCode, isDevMode, konamiSequence]);

  // Easter egg : Triple clic
  useEffect(() => {
    let clickCount = 0;
    let clickTimer;

    const handleClick = () => {
      clickCount++;
      
      if (clickCount === 3) {
        console.log('🎯 Triple clic détecté !');
        console.log('Easter egg trouvé ! Voici un message secret : "Le code est de l\'art" 🎨');
        clickCount = 0;
      }

      clearTimeout(clickTimer);
      clickTimer = setTimeout(() => {
        clickCount = 0;
      }, 500);
    };

    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
      clearTimeout(clickTimer);
    };
  }, []);

  // EASTER EGG DÉSACTIVÉ - Détection du scroll pour basculer (bonus)
  // useEffect(() => {
  //   let lastScrollY = window.scrollY;
  //   let scrollCount = 0;

  //   const handleScroll = () => {
  //     const currentScrollY = window.scrollY;
      
  //     // Détecte un scroll rapide vers le bas
  //     if (currentScrollY > lastScrollY + 100) {
  //       scrollCount++;
        
  //       if (scrollCount >= 5) {
  //         console.log('🎢 Scroll rapide détecté ! Basculement automatique...');
  //         toggleMode();
  //         scrollCount = 0;
  //       }
  //     }
      
  //     lastScrollY = currentScrollY;
  //   };

  //   // Réinitialise le compteur après 2 secondes
  //   const resetScrollCount = setInterval(() => {
  //     scrollCount = 0;
  //   }, 2000);

  //   window.addEventListener('scroll', handleScroll);
  //   return () => {
  //     window.removeEventListener('scroll', handleScroll);
  //     clearInterval(resetScrollCount);
  //   };
  // }, []);

  // Raccourci clavier Ctrl/Cmd + Shift + D pour basculer
  useEffect(() => {
    const handleKeyPress = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        toggleMode();
        console.log(`🔄 Mode ${isDevMode ? 'Normal' : 'Développeur'} activé !`);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isDevMode]);

  // Message de bienvenue dans la console (s'affiche une seule fois)
  useEffect(() => {
    // Vérifier si le message a déjà été affiché
    if (!window.portfolioWelcomeDisplayed) {
      console.log(`
%c
Bienvenue dans mon portfolio !
j'ai laissé pas mal d'easter eggs dans la console et aussi directement sur le site. N'hésite pas à me contacter si tu en découvres un ou plusieurs !
`, 'color: #00ff41; font-family: monospace; font-size: 12px;');
      window.portfolioWelcomeDisplayed = true;
    }
  }, []);

  return (
    <div className={`min-h-screen ${isDevMode ? 'bg-dev-dark' : 'bg-minimal-bg'}`}>
      {/* Header avec toggle */}
      <Header isDevMode={isDevMode} toggleMode={toggleMode} />

      {/* Contenu avec animation de transition */}
      <AnimatePresence mode="wait">
        <ToggleFace isDevMode={isDevMode}>
          {isDevMode ? <DevFace /> : <Face />}
        </ToggleFace>
      </AnimatePresence>

      {/* Indicateur de mode (optionnel), pour l'instant inutilisé */}
      {/* <div className="fixed bottom-4 right-4 z-40">
        <div
          className={`px-4 py-2 rounded-full text-xs font-mono ${
            isDevMode
              ? 'bg-dev-accent text-dev-dark'
              : 'bg-minimal-text text-white'
          }`}
        >
          {isDevMode ? '⚡ DEV MODE' : '✨ NORMAL'}
        </div>
      </div> */}
    </div>
  );
};

export default Home;
