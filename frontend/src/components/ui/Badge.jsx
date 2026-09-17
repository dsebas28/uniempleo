const VARIANT_CLASS = {
  neutral: 'bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-300',
  brand: 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-200',
  success: 'bg-accent-50 text-accent-700 dark:bg-accent-500/15 dark:text-accent-300',
  warning: 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  error: 'bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300',
  info: 'bg-sky-50 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300',
};

// Badge con variantes semánticas — reemplaza los colores sueltos usados en distintas
// páginas para modalidad, nivel de inglés, disponibilidad, estado, etc.
export default function Badge({ variant = 'neutral', icon: Icon, className = '', children }) {
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg ${VARIANT_CLASS[variant] || VARIANT_CLASS.neutral} ${className}`}>
      {Icon && <Icon size={11} />}
      {children}
    </span>
  );
}

// Mapeos de dominio → variante, para que el mismo valor (ej. "Remoto") siempre
// use el mismo color sin importar en qué página aparezca.
export const MODALITY_VARIANT = { Remoto: 'success', Híbrido: 'info', Presencial: 'warning' };
export const LEVEL_VARIANT = {
  Básico: 'neutral',
  'Pre-intermedio': 'info',
  Intermedio: 'brand',
  'Intermedio-alto': 'brand',
  Avanzado: 'success',
};
export const AVAILABILITY_VARIANT = { Inmediata: 'success', '1 mes': 'info', '2 meses': 'warning', '3 meses': 'neutral' };
export const STATUS_VARIANT = {
  sent: 'neutral',
  reviewing: 'info',
  preselected: 'brand',
  interview: 'warning',
  selected: 'success',
  rejected: 'error',
  active: 'success',
  paused: 'warning',
  closed: 'neutral',
};
