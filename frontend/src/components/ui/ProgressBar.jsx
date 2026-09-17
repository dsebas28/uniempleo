// Barra de progreso con el degradado índigo→esmeralda del sistema.
export default function ProgressBar({ value = 0, max = 100, size = 'md', label, showValue = false, className = '' }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const heightClass = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-3.5' }[size] || 'h-2.5';

  return (
    <div className={className}>
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
          {label && <span>{label}</span>}
          {showValue && <span className="font-bold text-slate-700 dark:text-slate-200">{Math.round(pct)}%</span>}
        </div>
      )}
      <div className={`w-full ${heightClass} bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden`}>
        <div className={`progress-bar ${heightClass}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
