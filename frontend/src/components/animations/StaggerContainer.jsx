import { motion, useReducedMotion } from 'framer-motion';
import { fadeUp, scaleIn, stagger } from './variants';

const ITEM_VARIANTS = { fadeUp, scaleIn };

/**
 * Contenedor que revela a sus hijos directos en cascada. Cada hijo debe ser
 * <StaggerContainer.Item> (o usar `variants={fadeUp}` manualmente si necesita
 * otra variante). Dispara al entrar en viewport, una sola vez.
 */
export default function StaggerContainer({
  children,
  as = 'div',
  staggerDelay = 0.08,
  delayChildren = 0,
  className = '',
  ...rest
}) {
  const reduceMotion = useReducedMotion();
  const Tag = motion[as];

  if (reduceMotion) {
    const Plain = as;
    return <Plain className={className} {...rest}>{children}</Plain>;
  }

  return (
    <Tag
      className={className}
      variants={stagger(staggerDelay, delayChildren)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.12 }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Hijo de StaggerContainer: hereda el timing escalonado del padre. */
function Item({ children, as = 'div', variant = 'fadeUp', className = '', ...rest }) {
  const reduceMotion = useReducedMotion();
  const Tag = motion[as];
  if (reduceMotion) {
    const Plain = as;
    return <Plain className={className} {...rest}>{children}</Plain>;
  }
  return (
    <Tag className={className} variants={ITEM_VARIANTS[variant] || fadeUp} {...rest}>
      {children}
    </Tag>
  );
}

StaggerContainer.Item = Item;
