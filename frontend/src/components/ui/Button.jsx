import { Loader2 } from 'lucide-react';

const VARIANT_CLASS = {
  primary: 'btn-primary text-white',
  accent: 'btn-accent',
  secondary: 'btn-secondary text-white',
  ghost: 'btn-ghost',
  danger: 'btn-danger text-white',
};

const SIZE_CLASS = {
  sm: 'text-xs px-3 py-2 gap-1.5 rounded-lg',
  md: 'text-sm px-4 py-2.5 gap-2 rounded-xl',
  lg: 'text-base px-6 py-3.5 gap-2.5 rounded-xl',
};

const ICON_SIZE = { sm: 14, md: 16, lg: 18 };

// Botón base del sistema: variant primary/accent/secondary/ghost/danger, size sm/md/lg, estado loading.
export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  children,
  type = 'button',
  ...rest
}) {
  const isDisabled = disabled || loading;
  return (
    <button
      type={type}
      disabled={isDisabled}
      className={`inline-flex items-center justify-center font-semibold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed ${VARIANT_CLASS[variant] || VARIANT_CLASS.primary} ${SIZE_CLASS[size] || SIZE_CLASS.md} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...rest}
    >
      {loading ? (
        <Loader2 size={ICON_SIZE[size]} className="animate-spin" />
      ) : (
        Icon && iconPosition === 'left' && <Icon size={ICON_SIZE[size]} />
      )}
      {children}
      {!loading && Icon && iconPosition === 'right' && <Icon size={ICON_SIZE[size]} />}
    </button>
  );
}
