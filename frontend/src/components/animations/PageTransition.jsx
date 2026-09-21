import { motion, useReducedMotion } from 'framer-motion';

/**
 * Envuelve el contenido de una ruta para que entre/salga con fade + slide.
 * Se usa junto a <AnimatePresence mode="wait"> en el router (ver App.jsx),
 * con una `key` única por ruta para que AnimatePresence detecte el cambio.
 */
export default function PageTransition({ children }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return children;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
