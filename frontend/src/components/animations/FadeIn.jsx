import { motion, useReducedMotion } from 'framer-motion';
import { EASE_OUT } from './variants';

const OFFSETS = {
  up: { y: 28 },
  down: { y: -28 },
  left: { x: -40 },
  right: { x: 40 },
  scale: { scale: 0.92 },
  none: {},
};

/**
 * Aparece con fade (+ opcional slide/scale) la primera vez que entra en pantalla.
 * `once=false` para que se repita cada vez que vuelve a entrar; `trigger="mount"`
 * para animar de inmediato en vez de esperar el scroll (útil sobre el pliegue).
 */
export default function FadeIn({
  children,
  as = 'div',
  direction = 'up',
  delay = 0,
  duration = 0.55,
  trigger = 'inView',
  once = true,
  className = '',
  ...rest
}) {
  const reduceMotion = useReducedMotion();
  const Tag = motion[as];
  const offset = OFFSETS[direction] || {};

  if (reduceMotion) {
    const Plain = as;
    return <Plain className={className} {...rest}>{children}</Plain>;
  }

  const initial = { opacity: 0, ...offset };
  const target = { opacity: 1, y: 0, x: 0, scale: 1 };
  const transition = { duration, delay, ease: EASE_OUT };

  const viewportProps = trigger === 'inView'
    ? { initial, whileInView: target, viewport: { once, amount: 0.12 } }
    : { initial, animate: target };

  return (
    <Tag className={className} transition={transition} {...viewportProps} {...rest}>
      {children}
    </Tag>
  );
}
