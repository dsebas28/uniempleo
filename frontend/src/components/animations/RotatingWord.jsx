import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

/**
 * Palabra dentro de una frase que rota entre varias opciones en loop
 * (ej. "empleo" / "práctica" / "oportunidad"). Reserva el ancho de la palabra
 * más larga para que el resto del texto no salte al cambiar.
 */
export default function RotatingWord({ words, interval = 2400, className = '' }) {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % words.length), interval);
    return () => clearInterval(timer);
  }, [words.length, interval, reduceMotion]);

  if (reduceMotion) {
    return <span className={className}>{words[0]}</span>;
  }

  return (
    <span className={`relative inline-grid ${className}`} style={{ verticalAlign: 'bottom' }}>
      {/* Palabra invisible más larga: reserva el espacio para evitar layout shift */}
      <span className="invisible col-start-1 row-start-1" aria-hidden="true">
        {words.reduce((a, b) => (a.length >= b.length ? a : b))}
      </span>
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          className="col-start-1 row-start-1"
          initial={{ opacity: 0, y: 16, rotateX: -40 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          exit={{ opacity: 0, y: -16, rotateX: 40 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
