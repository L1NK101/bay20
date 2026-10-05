import { motion, AnimatePresence } from 'framer-motion';
import './PageTransition.css';

/**
 * Cinematic curtain-wipe transition between screens.
 */
export default function PageTransition({ show, onComplete }) {
  return (
    <AnimatePresence onExitComplete={onComplete}>
      {show && (
        <motion.div
          className="page-transition"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          exit={{ scaleY: 0 }}
          transition={{
            duration: 0.7,
            ease: [0.65, 0, 0.35, 1],
          }}
          style={{ transformOrigin: 'top' }}
        />
      )}
    </AnimatePresence>
  );
}
