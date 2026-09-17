// Átomo de carga: usa la animación .skeleton (shimmer) definida en index.css.
export default function Skeleton({ width, height = '1rem', rounded = 'rounded', className = '' }) {
  return (
    <div
      className={`skeleton ${rounded} ${className}`}
      style={{ width: width ?? '100%', height }}
    />
  );
}
