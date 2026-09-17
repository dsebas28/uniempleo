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
      <div className="w-20 h-20 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center mb-6">
        <Icon size={32} className="text-gray-300" />
      </div>
      <h3 className="text-lg font-semibold text-gray-700 mb-2">{title || 'Sin resultados'}</h3>
      <p className="text-sm text-gray-400 max-w-sm leading-relaxed mb-6">
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
