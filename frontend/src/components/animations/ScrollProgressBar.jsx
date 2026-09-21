import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion';

/**
 * Barra delgada fija arriba de todo que refleja el progreso de scroll de la
 * página (0→100%). Va por encima del Navbar (mismo z-index alto).
 */
export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const reduceMotion = useReducedMotion();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: reduceMotion ? 1000 : 300,
    damping: reduceMotion ? 100 : 40,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] origin-left z-[60] bg-gradient-to-r from-brand-500 via-brand-400 to-accent-400"
      style={{ scaleX }}
      aria-hidden="true"
    />
  );
}
