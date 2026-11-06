import { motion, AnimatePresence } from 'framer-motion';

/**
 * ToggleFace — fondu court entre la face publique et le terminal.
 *
 * `initial={false}` sur l'AnimatePresence : pas de fondu au premier
 * chargement, seulement lors des bascules. Le léger glissement vertical est
 * désactivé par `MotionConfig reducedMotion="user"` quand le système demande
 * moins de mouvement ; l'opacité, elle, reste.
 *
 * Aucune transformation permanente sur le conteneur : le `position: sticky`
 * des cartes de compétences n'a pas de containing block parasite.
 */
const ToggleFace = ({ isDevMode, children }) => (
  <AnimatePresence mode="wait" initial={false}>
    <motion.div
      key={isDevMode ? 'dev' : 'normal'}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
      className="w-full"
    >
      {children}
    </motion.div>
  </AnimatePresence>
);

export default ToggleFace;
