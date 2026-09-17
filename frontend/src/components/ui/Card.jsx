// Contenedor base: superficie + borde + radio + sombra consistentes en todo el sitio.
export default function Card({ as: Tag = 'div', padding = 'md', className = '', children, ...rest }) {
  const paddingClass = { none: '', sm: 'p-4', md: 'p-6', lg: 'p-8' }[padding] ?? 'p-6';
  return (
    <Tag
      className={`bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm ${paddingClass} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function CardHeader({ title, subtitle, action, className = '' }) {
  return (
    <div className={`flex items-start justify-between gap-3 mb-5 ${className}`}>
      <div>
        <h3 className="font-display font-bold text-slate-900 dark:text-white text-lg">{title}</h3>
        {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
