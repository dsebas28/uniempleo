import { TrendingUp, TrendingDown } from 'lucide-react';

const COLOR_CLASS = {
  brand: 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300',
  accent: 'bg-accent-50 text-accent-700 dark:bg-accent-500/15 dark:text-accent-300',
  secondary: 'bg-sky-50 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300',
  warning: 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
};

// Tarjeta de métrica: ícono + valor grande + etiqueta + tendencia opcional.
// Usar en todos los dashboards (estudiante, empresa, admin) para que las
// cifras clave se vean igual en todo el sitio.
export default function StatCard({ icon: Icon, label, value, color = 'brand', trend, trendLabel, subtitle }) {
  const positive = typeof trend === 'number' && trend >= 0;
  return (
    <div className="bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${COLOR_CLASS[color] || COLOR_CLASS.brand}`}>
          <Icon size={19} />
        </div>
        {typeof trend === 'number' && (
          <span className={`inline-flex items-center gap-0.5 text-xs font-bold ${positive ? 'text-accent-600 dark:text-accent-400' : 'text-rose-600 dark:text-rose-400'}`}>
            {positive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="font-display text-2xl font-extrabold text-slate-900 dark:text-white leading-none">{value}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1.5">{label}</p>
      {subtitle && <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">{subtitle}</p>}
      {trendLabel && <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">{trendLabel}</p>}
    </div>
  );
}
