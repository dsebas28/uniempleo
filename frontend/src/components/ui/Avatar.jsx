const SIZE_CLASS = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-16 h-16 text-xl',
  xl: 'w-20 h-20 text-2xl',
};

// Paleta determinística: el mismo nombre siempre cae en el mismo gradiente,
// para que un usuario se reconozca por su color de avatar entre pantallas.
const GRADIENTS = [
  'from-brand-500 to-brand-700',
  'from-accent-400 to-accent-600',
  'from-sky-400 to-sky-600',
  'from-amber-400 to-amber-600',
  'from-rose-400 to-rose-600',
];

function gradientFor(seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return GRADIENTS[hash % GRADIENTS.length];
}

// Avatar con foto si existe, o iniciales de respaldo sobre un gradiente estable.
export default function Avatar({ src, name = '', size = 'md', className = '', ringed = false }) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join('') || '?';

  const ring = ringed ? 'ring-4 ring-white dark:ring-brand-950' : '';

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${SIZE_CLASS[size]} rounded-full object-cover flex-shrink-0 ${ring} ${className}`}
      />
    );
  }

  return (
    <div
      className={`${SIZE_CLASS[size]} rounded-full bg-gradient-to-br ${gradientFor(name || 'U')} flex items-center justify-center text-white font-bold flex-shrink-0 ${ring} ${className}`}
      aria-label={name}
    >
      {initials}
    </div>
  );
}
