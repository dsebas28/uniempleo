import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Clock, DollarSign, Heart, Building2, Award } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { studentAPI } from '../services/api';
import { timeAgo } from '../utils/date';
import toast from 'react-hot-toast';

const modalityColors = {
  'Remoto': 'bg-emerald-50 text-emerald-700',
  'Híbrido': 'bg-blue-50 text-blue-700',
  'Presencial': 'bg-orange-50 text-orange-700',
};

const contractColors = {
  'Tiempo completo': 'bg-gray-100 text-gray-700',
  'Medio tiempo': 'bg-purple-50 text-purple-700',
  'Prácticas': 'bg-yellow-50 text-yellow-700',
  'Freelance': 'bg-pink-50 text-pink-700',
  'Contrato de aprendizaje': 'bg-indigo-50 text-indigo-700',
};

function formatSalary(min, max) {
  if (!min && !max) return 'A convenir';
  const fmt = (v) => v >= 1_000_000
    ? `$${(v / 1_000_000).toFixed(1)}M`
    : `$${(v / 1000).toFixed(0)}K`;
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  if (min) return `Desde ${fmt(min)}`;
  return `Hasta ${fmt(max)}`;
}

export default function JobCard({ job, saved: initialSaved = false, onSaveToggle }) {
  const { isAuthenticated, isStudent } = useAuth();
  const [saved, setSaved] = useState(initialSaved);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) { navigate('/login/estudiante'); return; }
    if (!isStudent) return;
    setSaving(true);
    try {
      if (saved) {
        await studentAPI.unsaveJob(job.id);
        setSaved(false);
        toast.success('Vacante eliminada de guardados');
      } else {
        await studentAPI.saveJob(job.id);
        setSaved(true);
        toast.success('Vacante guardada');
      }
      onSaveToggle?.(job.id, !saved);
    } catch {
      toast.error('Error al guardar vacante');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-white/[0.06] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm card-hover group cursor-pointer overflow-hidden">
      <Link to={`/empleos/${job.id}`} className="block p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-start gap-3 min-w-0">
            {/* Logo placeholder */}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-50 to-brand-100 dark:from-white/10 dark:to-white/5 border border-brand-100 dark:border-white/10 flex items-center justify-center flex-shrink-0 text-brand-700 dark:text-brand-300 font-bold text-lg overflow-hidden">
              {job.company_logo ? (
                <img src={job.company_logo} alt={job.company_name} className="w-full h-full object-cover" />
              ) : (
                (job.company_name || 'E').charAt(0).toUpperCase()
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-500 dark:text-slate-400 truncate">{job.company_name}</p>
              <h3 className="font-semibold text-gray-900 dark:text-white text-base leading-tight mt-0.5 group-hover:text-brand-700 dark:group-hover:text-brand-300 transition-colors line-clamp-2">
                {job.title}
              </h3>
            </div>
          </div>
          {isStudent && (
            <button
              onClick={handleSave}
              disabled={saving}
              className={`flex-shrink-0 p-2 rounded-lg transition-all duration-200 ${
                saved ? 'text-rose-600 bg-rose-50 dark:bg-rose-500/10' : 'text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10'
              }`}
              aria-label={saved ? 'Eliminar de favoritos' : 'Guardar en favoritos'}
            >
              <Heart size={18} fill={saved ? 'currentColor' : 'none'} />
            </button>
          )}
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${modalityColors[job.modality] || 'bg-gray-100 text-gray-600'}`}>
            {job.modality}
          </span>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${contractColors[job.contract_type] || 'bg-gray-100 text-gray-600'}`}>
            {job.contract_type}
          </span>
          {job.no_experience_ok ? (
            <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-green-50 text-green-700 flex items-center gap-1">
              <Award size={11} /> Sin exp.
            </span>
          ) : (
            <span className="text-xs text-gray-400 px-2.5 py-1 rounded-lg bg-gray-50">
              {job.experience_years === 0 ? 'Sin experiencia' : `${job.experience_years}+ años exp.`}
            </span>
          )}
        </div>

        {/* Details */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400">
            <MapPin size={13} className="text-gray-400 dark:text-slate-500 flex-shrink-0" />
            <span className="truncate">{job.city}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400">
            <DollarSign size={13} className="text-gray-400 dark:text-slate-500 flex-shrink-0" />
            <span className="font-medium text-gray-700 dark:text-slate-200">{formatSalary(job.salary_min, job.salary_max)}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400">
            <Clock size={13} className="text-gray-400 dark:text-slate-500 flex-shrink-0" />
            <span>{timeAgo(job.created_at)}</span>
            {job.applicants_count > 0 && (
              <span className="ml-auto text-brand-600 dark:text-brand-300 font-medium">{job.applicants_count} postulantes</span>
            )}
          </div>
        </div>
      </Link>

      {/* Footer */}
      <div className="px-5 pb-4">
        <Link
          to={`/empleos/${job.id}`}
          className="block w-full text-center py-2.5 text-sm font-semibold text-brand-700 dark:text-brand-300 border-2 border-brand-100 dark:border-white/10 rounded-xl hover:bg-brand-700 hover:text-white hover:border-brand-700 dark:hover:bg-brand-600 dark:hover:border-brand-600 transition-all duration-200"
        >
          Ver oferta
        </Link>
      </div>
    </div>
  );
}
