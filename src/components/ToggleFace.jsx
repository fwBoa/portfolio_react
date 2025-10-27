import React from 'react';
import { motion } from 'framer-motion';

/**
 * Composant ToggleFace - Gère l'animation de transition entre les deux faces
 * @param {boolean} isDevMode - État du mode développeur
 * @param {React.Component} children - Contenu à afficher
 */
const ToggleFace = ({ isDevMode, children }) => {
  return (
    <motion.div
      key={isDevMode ? 'dev' : 'minimal'}
      initial={{ rotateY: 90, opacity: 0 }}
      animate={{ rotateY: 0, opacity: 1 }}
      exit={{ rotateY: -90, opacity: 0 }}
      transition={{
        duration: 0.6,
        ease: 'easeInOut',
      }}
      style={{
        transformStyle: 'preserve-3d',
      }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
};

export default ToggleFace;
