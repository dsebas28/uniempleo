import { useRef, useState } from 'react';
import { motion, useMotionValue, useMotionTemplate, useSpring, useReducedMotion } from 'framer-motion';

const PULL = 0.35; // fuerza del "imán" — clamada para que nunca se salga de su caja
const MAX_PULL = 14; // px máximos de desplazamiento

/**
 * Botón que se acerca sutilmente al cursor (efecto "magnético") y muestra un
 * brillo radial que sigue el mouse. Se desactiva en touch/mobile y con
 * prefers-reduced-motion (queda como botón normal, sin perder funcionalidad).
 */
export default function MagneticButton({ children, as = 'button', className = '', onClick, ...rest }) {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
  const [isTouch] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches
  );
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 15, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 200, damping: 15, mass: 0.4 });
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);
  const glowOpacityRaw = useMotionValue(0);
  const glowOpacity = useSpring(glowOpacityRaw, { stiffness: 300, damping: 30 });
  const glowBackground = useMotionTemplate`radial-gradient(140px circle at ${glowX}% ${glowY}%, rgba(255,255,255,0.35), transparent 70%)`;

  const disabled = reduceMotion || isTouch;

  const handleMouseMove = (e) => {
    if (disabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    x.set(Math.max(-MAX_PULL, Math.min(MAX_PULL, relX * PULL)));
    y.set(Math.max(-MAX_PULL, Math.min(MAX_PULL, relY * PULL)));
    glowX.set(((e.clientX - rect.left) / rect.width) * 100);
    glowY.set(((e.clientY - rect.top) / rect.height) * 100);
  };

  const handleMouseEnter = () => { if (!disabled) glowOpacityRaw.set(1); };
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    glowOpacityRaw.set(0);
  };

  // `as` puede ser una etiqueta intrínseca ('button', 'a') o un componente
  // (ej. React Router <Link>) — framer-motion necesita motion.create() para lo segundo.
  const Tag = typeof as === 'string' ? motion[as] : motion.create(as);

  return (
    <Tag
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={disabled ? undefined : { x: springX, y: springY }}
      whileTap={disabled ? undefined : { scale: 0.96 }}
      className={`relative isolate overflow-hidden ${className}`}
      {...rest}
    >
      {!disabled && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: glowBackground, opacity: glowOpacity }}
        />
      )}
      <span className="relative z-10 inline-flex items-center justify-center gap-2 w-full h-full">
        {children}
      </span>
    </Tag>
  );
}
