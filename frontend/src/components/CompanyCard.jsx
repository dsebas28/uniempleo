import { Link } from 'react-router-dom';
import { MapPin, Briefcase, Building2, ExternalLink } from 'lucide-react';

export default function CompanyCard({ company }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm card-hover overflow-hidden group">
      <Link to={`/empresas/${company.id}`} className="block p-6">
        {/* Logo + name */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 flex items-center justify-center text-gray-700 font-bold text-xl flex-shrink-0 overflow-hidden">
            {company.logo ? (
              <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
            ) : (
              company.name.charAt(0).toUpperCase()
            )}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors truncate">
              {company.name}
            </h3>
            <span className="text-xs text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full font-medium">
              {company.sector}
            </span>
          </div>
        </div>

        {/* Description */}
        {company.description && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">
            {company.description}
          </p>
        )}

        {/* Details */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <MapPin size={13} className="text-gray-400" />
            <span>{company.city}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Briefcase size={13} className="text-gray-400" />
            <span className="font-medium text-emerald-600">
              {company.job_count || 0} vacante{company.job_count !== 1 ? 's' : ''} activa{company.job_count !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </Link>

      <div className="px-6 pb-5">
        <Link
          to={`/empresas/${company.id}`}
          className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-semibold text-gray-700 border-2 border-gray-200 rounded-xl hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-200"
        >
          Ver empresa <ExternalLink size={14} />
        </Link>
      </div>
    </div>
  );
}
