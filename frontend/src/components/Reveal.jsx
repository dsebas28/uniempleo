import { motion, useReducedMotion } from 'framer-motion';

// Fades/slides a section in the first time it scrolls into view, via framer-motion.
// Respects prefers-reduced-motion (skips the animation, renders in its final state).
export default function Reveal({ children, delay = 0, className = '', as = 'div', ...rest }) {
  const MotionTag = motion[as];
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    const Tag = as;
    return <Tag className={className} {...rest}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, delay: delay / 1000, ease: [0.16, 1, 0.3, 1] }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}
