import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Eye, Edit, Pause, Play, Trash2, Users, Loader2, MoreVertical } from 'lucide-react';
import { companyAPI } from '../../services/api';
import EmptyState from '../../components/EmptyState';
import toast from 'react-hot-toast';

const STATUS_STYLE = {
  active: 'bg-emerald-100 text-emerald-700',
  paused: 'bg-yellow-100 text-yellow-700',
  closed: 'bg-slate-100 text-slate-500',
};
const STATUS_LABEL = { active: 'Activa', paused: 'Pausada', closed: 'Cerrada' };

export default function MyJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMenuOpen, setActionMenuOpen] = useState(null);

  useEffect(() => {
    companyAPI.getJobs().then(res => { setJobs(res.data || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleStatusChange = async (jobId, newStatus) => {
    try {
      await companyAPI.updateJobStatus(jobId, newStatus);
      setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: newStatus } : j));
      toast.success('Estado actualizado');
    } catch { toast.error('Error al actualizar'); }
    setActionMenuOpen(null);
  };

  const handleDelete = async (jobId) => {
    if (!confirm('¿Eliminar esta vacante? Esta acción no se puede deshacer.')) return;
    try {
      await companyAPI.deleteJob(jobId);
      setJobs(prev => prev.filter(j => j.id !== jobId));
      toast.success('Vacante eliminada');
    } catch { toast.error('Error al eliminar'); }
    setActionMenuOpen(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans' }}>Mis vacantes</h1>
        <Link to="/empresa/vacantes/nueva" className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white rounded-xl btn-primary">
          <PlusCircle size={16} /> Publicar vacante
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 size={28} className="text-brand-400 animate-spin" />
        </div>
      ) : jobs.length === 0 ? (
        <EmptyState
          type="jobs"
          title="No tienes vacantes publicadas"
          description="Publica tu primera vacante y empieza a recibir candidatos."
          actionLabel="Publicar primera vacante"
          actionTo="/empresa/vacantes/nueva"
        />
      ) : (
        <div className="bg-white dark:bg-white/[0.04] rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-12 gap-4 px-5 py-3 bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wide">
            <div className="col-span-4">Vacante</div>
            <div className="col-span-2">Modalidad</div>
            <div className="col-span-2">Estado</div>
            <div className="col-span-2 text-center">Postulantes</div>
            <div className="col-span-1 text-center">Fecha</div>
            <div className="col-span-1" />
          </div>

          {jobs.map((job, idx) => (
            <div
              key={job.id}
              className={`grid grid-cols-12 gap-4 items-center px-5 py-4 hover:bg-slate-50 transition-colors ${idx > 0 ? 'border-t border-slate-50' : ''}`}
            >
              <div className="col-span-4 min-w-0">
                <Link to={`/empleos/${job.id}`} className="font-semibold text-slate-900 hover:text-brand-600 transition-colors text-sm truncate block">
                  {job.title}
                </Link>
                <p className="text-xs text-slate-400 mt-0.5">{job.city} · {job.area}</p>
              </div>

              <div className="col-span-2">
                <span className="text-xs text-slate-600">{job.modality}</span>
              </div>

              <div className="col-span-2">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLE[job.status] || 'bg-slate-100 text-slate-500'}`}>
                  {STATUS_LABEL[job.status] || job.status}
                </span>
              </div>

              <div className="col-span-2 text-center">
                <Link to={`/empresa/candidatos?jobId=${job.id}`} className="flex items-center justify-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors">
                  <Users size={14} /> {job.application_count ?? job.applicants_count ?? 0}
                </Link>
              </div>

              <div className="col-span-1 text-center">
                <span className="text-xs text-slate-400">
                  {new Date(job.created_at).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })}
                </span>
              </div>

              <div className="col-span-1 relative flex justify-end">
                <button
                  onClick={() => setActionMenuOpen(actionMenuOpen === job.id ? null : job.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <MoreVertical size={16} />
                </button>

                {actionMenuOpen === job.id && (
                  <div className="absolute right-0 top-8 z-20 bg-white border border-slate-100 rounded-xl shadow-lg min-w-40 py-1 overflow-hidden">
                    <Link
                      to={`/empleos/${job.id}`}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      onClick={() => setActionMenuOpen(null)}
                    >
                      <Eye size={14} /> Ver vacante
                    </Link>
                    <Link
                      to={`/empresa/vacantes/${job.id}/editar`}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      onClick={() => setActionMenuOpen(null)}
                    >
                      <Edit size={14} /> Editar
                    </Link>
                    {job.status === 'active' ? (
                      <button
                        onClick={() => handleStatusChange(job.id, 'paused')}
                        className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-yellow-700 hover:bg-yellow-50 transition-colors"
                      >
                        <Pause size={14} /> Pausar
                      </button>
                    ) : job.status === 'paused' ? (
                      <button
                        onClick={() => handleStatusChange(job.id, 'active')}
                        className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-emerald-700 hover:bg-emerald-50 transition-colors"
                      >
                        <Play size={14} /> Reactivar
                      </button>
                    ) : null}
                    <button
                      onClick={() => handleDeleteJob(job.id)}
                      className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={14} /> Eliminar
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  function handleDeleteJob(id) { handleDelete(id); }
}
