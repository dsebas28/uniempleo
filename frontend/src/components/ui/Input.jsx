import { forwardRef } from 'react';

// Input con label, ícono opcional y estados focus/error consistentes en todo el sitio.
const Input = forwardRef(function Input(
  { label, icon: Icon, error, hint, id, className = '', wrapperClassName = '', ...rest },
  ref
) {
  return (
    <div className={wrapperClassName}>
      {label && (
        <label htmlFor={id} className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          ref={ref}
          id={id}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          style={Icon ? { paddingLeft: '2.75rem' } : undefined}
          className={`w-full py-2.5 pr-4 text-sm rounded-lg border transition-all ${
            error
              ? 'border-rose-400 bg-rose-50/40 dark:bg-rose-500/10 focus:ring-4 focus:ring-rose-500/10'
              : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 focus:border-brand-600 focus:ring-4 focus:ring-brand-500/10'
          } ${className}`}
          {...rest}
        />
      </div>
      {error && <p id={`${id}-error`} className="text-xs text-rose-600 dark:text-rose-400 mt-1.5 font-medium">{error}</p>}
      {!error && hint && <p id={`${id}-hint`} className="text-xs text-slate-400 mt-1.5">{hint}</p>}
    </div>
  );
});

export default Input;
