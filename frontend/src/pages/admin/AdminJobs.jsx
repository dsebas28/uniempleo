import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, Search, Filter, Eye, ExternalLink, MapPin, 
  DollarSign, Clock, CheckCircle, PauseCircle, XCircle, 
  Loader2, AlertCircle, Building2
} from 'lucide-react';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminJobs() {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getJobs();
      setJobs(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error al cargar vacantes:', err);
      toast.error('No se pudieron cargar las vacantes');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (jobId, newStatus) => {
    try {
      setUpdatingId(jobId);
      await adminAPI.updateJob(jobId, { status: newStatus });
      toast.success('Estado de la vacante actualizado');
      setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: newStatus } : j));
    } catch (err) {
      console.error('Error al moderar vacante:', err);
      toast.error('Error al actualizar vacante');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredJobs = jobs.filter(j => {
    const matchesStatus = statusFilter === 'all' || j.status === statusFilter;
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      !query ||
      j.title?.toLowerCase().includes(query) ||
      j.company_name?.toLowerCase().includes(query) ||
      j.area?.toLowerCase().includes(query) ||
      j.city?.toLowerCase().includes(query);

    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"><CheckCircle className="w-3 h-3" /> Activa</span>;
      case 'paused':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200"><PauseCircle className="w-3 h-3" /> Pausada</span>;
      case 'closed':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200"><XCircle className="w-3 h-3" /> Cerrada</span>;
      default:
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-slate-100">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Briefcase className="w-7 h-7 text-brand-600" />
            Moderación de Vacantes y Empleos
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Supervisa todas las convocatorias publicadas, verifica condiciones de calidad y modera ofertas laborales.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-brand-50 border border-brand-100 px-4 py-2 rounded-xl text-xs font-semibold text-brand-700">
          <span>{jobs.length} Ofertas Registradas</span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por cargo, empresa, área o ciudad..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'Todas' },
            { id: 'active', label: 'Activas' },
            { id: 'paused', label: 'Pausadas' },
            { id: 'closed', label: 'Cerradas' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === tab.id
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs Table */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 text-brand-600 animate-spin mb-3" />
          <p className="text-sm text-slate-500 font-medium">Cargando ofertas de trabajo...</p>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No se encontraron vacantes</h3>
          <p className="text-xs text-slate-500 mt-1">Prueba con otros términos de búsqueda.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-white/[0.04] rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Cargo / Título</th>
                  <th className="py-3.5 px-4">Empresa</th>
                  <th className="py-3.5 px-4">Ubicación & Modalidad</th>
                  <th className="py-3.5 px-4">Área</th>
                  <th className="py-3.5 px-4">Estado Actual</th>
                  <th className="py-3.5 px-6 text-right">Moderación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredJobs.map((j) => (
                  <tr key={j.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-900 line-clamp-1">{j.title}</div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <span>{j.contract_type || 'Prácticas'}</span>
                        {j.is_internship ? (
                          <span className="text-[10px] font-bold text-brand-600 bg-brand-50 px-1.5 py-0.2 rounded">Práctica</span>
                        ) : null}
                      </div>
                    </td>

                    <td className="py-4 px-4 font-medium text-slate-700 text-xs">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span className="line-clamp-1">{j.company_name}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-xs text-slate-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{j.city}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 capitalize mt-0.5">
                        {j.modality}
                      </div>
                    </td>

                    <td className="py-4 px-4 text-xs font-medium text-slate-700">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px]">
                        {j.area}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      {getStatusBadge(j.status)}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/empleos/${j.id}`}
                          target="_blank"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-slate-100 transition-colors"
                          title="Ver vacante pública"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>

                        <select
                          disabled={updatingId === j.id}
                          value={j.status}
                          onChange={(e) => handleStatusChange(j.id, e.target.value)}
                          className="text-xs font-semibold px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer text-slate-700"
                        >
                          <option value="active">Activa</option>
                          <option value="paused">Pausada</option>
                          <option value="closed">Cerrada</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
