export function LogoMark({ size = 40, className = '', bg = '#172f57', stroke = '#ffffff', dot = '#f5930f' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className={className} aria-hidden="true">
      <rect x="0" y="0" width="40" height="40" rx="11" fill={bg} />
      <path
        d="M12.5 14 V23 C12.5 27.14 15.86 30.5 20 30.5 C24.14 30.5 27.5 27.14 27.5 23 V17"
        fill="none" stroke={stroke} strokeWidth="4.3" strokeLinecap="round" strokeLinejoin="round"
      />
      <path
        d="M23.3 12.3 L27.9 9.3 L28.7 14.7"
        fill="none" stroke={stroke} strokeWidth="4.3" strokeLinecap="round" strokeLinejoin="round"
      />
      <circle cx="10.5" cy="10.5" r="3" fill={dot} />
    </svg>
  );
}

/**
 * Full lockup: icon + "uni/empleo" wordmark.
 * variant "light" is for use on dark backgrounds (white wordmark, amber icon bg).
 */
export default function Logo({ size = 40, tagline = false, variant = 'default', className = '' }) {
  const light = variant === 'light';
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <LogoMark
        size={size}
        bg={light ? '#f5930f' : '#172f57'}
        stroke={light ? '#0f2140' : '#ffffff'}
        dot={light ? '#0f2140' : '#f5930f'}
      />
      <div className="leading-none">
        <span className="font-extrabold tracking-tight" style={{ fontFamily: 'Outfit', fontSize: size * 0.5 }}>
          <span style={{ color: light ? '#ffffff' : '#244a85' }}>uni</span>
          <span style={{ color: light ? '#ffb648' : '#0f2140' }}>empleo</span>
        </span>
        {tagline && (
          <p className={`text-[11px] font-medium tracking-wide mt-0.5 ${light ? 'text-brand-200' : 'text-slate-500'}`}>
            Tu talento, tu primer empleo
          </p>
        )}
      </div>
    </div>
  );
}
