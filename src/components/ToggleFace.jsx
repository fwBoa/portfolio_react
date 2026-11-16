import { motion, AnimatePresence, useIsPresent } from 'framer-motion';

// Les deux faces occupent la même cellule pendant le fondu. La face sortante
// reste dans le flux jusqu'à la fin, mais ne reçoit plus de clic ni de focus.
const FaceLayer = ({ children }) => {
  const isPresent = useIsPresent();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
      inert={!isPresent}
      aria-hidden={isPresent ? undefined : true}
      className="col-start-1 row-start-1 min-w-0 w-full self-start"
    >
      {children}
    </motion.div>
  );
};

/**
 * Fondu simultané : `wait` laissait le canevas seul entre les deux faces,
 * ce qui produisait un flash, surtout au retour vers le fond blanc.
 * Pas de translation du document entier ni d'animation au premier rendu.
 */
const ToggleFace = ({ isDevMode, children }) => (
  <div className="grid w-full">
    <AnimatePresence initial={false}>
      <FaceLayer key={isDevMode ? 'dev' : 'normal'}>
        {children}
      </FaceLayer>
    </AnimatePresence>
  </div>
);

export default ToggleFace;
