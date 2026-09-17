import { Briefcase, Search, Building2, BookOpen, Bell, FileText, Inbox } from 'lucide-react';
import { Link } from 'react-router-dom';

const iconMap = {
  jobs: Search,
  companies: Building2,
  applications: FileText,
  courses: BookOpen,
  notifications: Bell,
  saved: Briefcase,
  default: Inbox,
};

export default function EmptyState({ type = 'default', title, description, actionLabel, actionTo, actionFn }) {
  const Icon = iconMap[type] || iconMap.default;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 rounded-2xl bg-slate-50 dark:bg-white/5 border-2 border-dashed border-slate-200 dark:border-white/10 flex items-center justify-center mb-6">
        <Icon size={32} className="text-slate-300 dark:text-slate-600" />
      </div>
      <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">{title || 'Sin resultados'}</h3>
      <p className="text-sm text-slate-400 dark:text-slate-500 max-w-sm leading-relaxed mb-6">
        {description || 'No se encontraron elementos para mostrar.'}
      </p>
      {(actionLabel && actionTo) && (
        <Link
          to={actionTo}
          className="px-6 py-2.5 text-sm font-semibold text-white rounded-xl btn-primary"
        >
          {actionLabel}
        </Link>
      )}
      {(actionLabel && actionFn) && (
        <button
          onClick={actionFn}
          className="px-6 py-2.5 text-sm font-semibold text-white rounded-xl btn-primary"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
