import { forwardRef, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Input con label flotante animado (sube y encoge al enfocar o al tener
 * contenido) y borde que se ilumina con un glow suave al enfocar. Mantiene
 * la misma API que un <input> controlado normal + `label`, `icon`, `error`.
 */
const FloatingInput = forwardRef(function FloatingInput(
  { id, label, icon: Icon, error, value, onChange, type = 'text', rightElement, className = '', ...rest },
  ref
) {
  const [focused, setFocused] = useState(false);
  const floated = focused || !!value;

  return (
    <div className={className}>
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 z-10">
            <Icon className="w-4 h-4" />
          </div>
        )}

        <input
          ref={ref}
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={(e) => { setFocused(true); rest.onFocus?.(e); }}
          onBlur={(e) => { setFocused(false); rest.onBlur?.(e); }}
          placeholder=""
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          style={{ paddingLeft: Icon ? '2.75rem' : '1rem', paddingRight: rightElement ? '2.75rem' : '1rem' }}
          className={`peer w-full pt-6 pb-2 text-sm rounded-xl border bg-white dark:bg-white/5 transition-colors duration-200 ${
            error
              ? 'border-rose-400 bg-rose-50/40 dark:bg-rose-500/10 focus:ring-4 focus:ring-rose-500/10'
              : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 focus:border-brand-600 focus:ring-4 focus:ring-brand-500/10'
          }`}
          {...rest}
        />

        {/* Label flotante */}
        <motion.label
          htmlFor={id}
          className={`absolute pointer-events-none origin-left ${Icon ? 'left-[2.75rem]' : 'left-4'} ${
            error ? 'text-rose-500' : focused ? 'text-brand-600 dark:text-brand-300' : 'text-slate-400 dark:text-slate-500'
          }`}
          animate={floated ? { top: '0.5rem', scale: 0.78, y: 0 } : { top: '50%', scale: 1, y: '-50%' }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
        >
          {label}
        </motion.label>

        {rightElement && (
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center">{rightElement}</div>
        )}

        {/* Glow de foco (además del ring de Tailwind, un halo suave detrás) */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px rounded-xl -z-10"
          animate={{ opacity: focused && !error ? 1 : 0 }}
          transition={{ duration: 0.25 }}
          style={{ boxShadow: '0 0 24px rgba(79,70,229,0.25)' }}
        />
      </div>
      {error && (
        <motion.p
          id={`${id}-error`}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-rose-600 dark:text-rose-400 mt-1.5 font-medium"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
});

export default FloatingInput;
