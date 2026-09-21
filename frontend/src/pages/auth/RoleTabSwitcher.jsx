import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Building2, ShieldCheck } from 'lucide-react';

const ROLES = [
  { key: 'student', to: '/login/estudiante', label: 'Estudiante', icon: GraduationCap },
  { key: 'company', to: '/login/empresa', label: 'Empresa', icon: Building2 },
  { key: 'admin', to: '/login/admin', label: 'Admin', icon: ShieldCheck },
];

/**
 * Tabs para saltar entre los 3 portales de acceso sin volver a /login.
 * El fondo activo (la "píldora") se desliza con layoutId — al navegar entre
 * páginas de login, framer-motion anima la transición como un solo elemento.
 */
export default function RoleTabSwitcher({ active, variant = 'light' }) {
  const isDark = variant === 'dark';
  return (
    <div
      className={`inline-grid grid-cols-3 gap-1 p-1 rounded-xl ${
        isDark ? 'bg-white/5 border border-white/10' : 'bg-slate-100 dark:bg-white/5 border border-slate-200/60 dark:border-white/10'
      }`}
      role="tablist"
      aria-label="Elegir portal de acceso"
    >
      {ROLES.map((role) => {
        const isActive = role.key === active;
        const Icon = role.icon;
        return (
          <Link
            key={role.key}
            to={role.to}
            role="tab"
            aria-selected={isActive}
            className={`relative px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors duration-200 ${
              isActive
                ? (isDark ? 'text-white' : 'text-brand-900 dark:text-white')
                : (isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200')
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="role-tab-pill"
                className={`absolute inset-0 rounded-lg ${isDark ? 'bg-white/15' : 'bg-white dark:bg-white/15 shadow-sm'}`}
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            <Icon size={13} className="relative z-10" aria-hidden="true" />
            <span className="relative z-10 hidden sm:inline">{role.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
