import { motion } from 'framer-motion';

/**
 * ToggleFace — Enhanced face transition with particle burst effect
 * @param {boolean} isDevMode
 * @param {ReactNode} children
 */
const ToggleFace = ({ isDevMode, children }) => {
  return (
    <div className="relative">
      {/* Transition flash overlay */}
      <motion.div
        key={isDevMode ? 'dev-flash' : 'normal-flash'}
        initial={{ opacity: 0.3 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className={`fixed inset-0 z-[9998] pointer-events-none ${
          isDevMode ? 'bg-df-accent/10' : 'bg-nf-accent/10'
        }`}
      />

      {/* Content with flip animation */}
      <motion.div
        key={isDevMode ? 'dev' : 'normal'}
        initial={{ rotateY: 90, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        exit={{ rotateY: -90, opacity: 0 }}
        transition={{
          duration: 0.7,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        style={{ transformStyle: 'preserve-3d' }}
        className="w-full"
      >
        {children}
      </motion.div>
    </div>
  );
};

export default ToggleFace;
