import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';

const MAX_TILT = 8; // grados máximos de inclinación

/**
 * Envoltorio que inclina su contenido en 3D siguiendo el cursor (perspectiva +
 * rotateX/rotateY), con una elevación de sombra al hover. Se desactiva en
 * touch/mobile y con prefers-reduced-motion, quedando como una tarjeta normal.
 */
export default function TiltCard({ children, className = '', ...rest }) {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
  const [isTouch] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches
  );
  const disabled = reduceMotion || isTouch;

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const springPx = useSpring(px, { stiffness: 250, damping: 25 });
  const springPy = useSpring(py, { stiffness: 250, damping: 25 });
  const rotateX = useTransform(springPy, [0, 1], [MAX_TILT, -MAX_TILT]);
  const rotateY = useTransform(springPx, [0, 1], [-MAX_TILT, MAX_TILT]);

  const handleMouseMove = (e) => {
    if (disabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  if (disabled) {
    return <div className={className} {...rest}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ y: -6 }}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
