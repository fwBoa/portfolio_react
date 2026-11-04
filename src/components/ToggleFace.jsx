import { motion, AnimatePresence } from 'framer-motion';

/**
 * ToggleFace — bascule animée entre la face normale et la face dev.
 *
 * `initial={false}` sur l'AnimatePresence : pas de flip au premier chargement
 * (sur mobile, la rotation rejouée pendant l'hydratation écrasait toute la
 * page). Les bascules suivantes, elles, sont animées. `transformPerspective`
 * est indispensable, sinon un rotateY se réduit à un écrasement à plat.
 * L'AnimatePresence enveloppe l'élément keyé lui-même, sinon le `exit` ne
 * part jamais.
 */
const ToggleFace = ({ isDevMode, children }) => (
  <AnimatePresence mode="wait" initial={false}>
    {/* ponytail: transform permanent → .grain-overlay (position: fixed) suit la page. */}
    <motion.div
      key={isDevMode ? 'dev' : 'normal'}
      initial={{ rotateY: 90, opacity: 0 }}
      animate={{ rotateY: 0, opacity: 1 }}
      exit={{ rotateY: -90, opacity: 0 }}
      transition={{
        duration: 0.7,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      style={{ transformPerspective: 1200 }}
      className="w-full"
    >
      {children}
    </motion.div>
  </AnimatePresence>
);

export default ToggleFace;
