import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Loader2, ChevronRight, MapPin, Building2 } from 'lucide-react';
import { studentAPI } from '../../services/api';
import ApplicationTimeline from '../../components/ApplicationTimeline';
import EmptyState from '../../components/EmptyState';
import Modal from '../../components/Modal';

const STATUS_CONFIG = {
  sent: { label: 'Enviada', bg: 'bg-blue-100', text: 'text-blue-700' },
  reviewing: { label: 'En revisión', bg: 'bg-yellow-100', text: 'text-yellow-700' },
  preselected: { label: 'Preseleccionado', bg: 'bg-purple-100', text: 'text-purple-700' },
  interview: { label: 'Entrevista', bg: 'bg-emerald-100', text: 'text-emerald-700' },
  selected: { label: '¡Seleccionado!', bg: 'bg-emerald-100', text: 'text-emerald-700' },
  rejected: { label: 'No seleccionado', bg: 'bg-red-100', text: 'text-red-600' },
};

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    studentAPI.getApplications().then(res => {
      setApplications(res.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filters = [
    { key: 'all', label: 'Todas' },
    { key: 'sent', label: 'Enviadas' },
    { key: 'reviewing', label: 'En revisión' },
    { key: 'interview', label: 'Entrevista' },
    { key: 'selected', label: 'Seleccionado' },
    { key: 'rejected', label: 'No seleccionado' },
  ];

  const filtered = filter === 'all' ? applications : applications.filter(a => a.status === filter);

  const getStatusCount = (status) => applications.filter(a => a.status === status).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Outfit' }}>Mis postulaciones</h1>
        <Link to="/empleos" className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
          Buscar más <ChevronRight size={14} />
        </Link>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {['sent','reviewing','preselected','interview','selected','rejected'].map(status => {
          const c = STATUS_CONFIG[status];
          const count = getStatusCount(status);
          return (
            <button
              key={status}
              onClick={() => setFilter(status === filter ? 'all' : status)}
              className={`p-3 rounded-xl text-center transition-all ${filter === status ? c.bg + ' ring-2 ring-blue-300' : 'bg-white border border-gray-100'}`}
            >
              <p className={`text-xl font-bold ${filter === status ? c.text : 'text-gray-800'}`}>{count}</p>
              <p className="text-xs text-gray-500 mt-0.5">{c.label}</p>
            </button>
          );
        })}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              filter === f.key ? 'bg-blue-600 text-white shadow' : 'bg-white text-gray-600 border border-gray-200 hover:bg-blue-50 hover:text-blue-700'
            }`}
          >
            {f.label}
            {f.key !== 'all' && (
              <span className="ml-1.5 opacity-70">{getStatusCount(f.key)}</span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 size={28} className="text-blue-400 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          type="applications"
          title={filter === 'all' ? 'No tienes postulaciones' : 'No hay postulaciones con este estado'}
          description={filter === 'all' ? 'Empieza a postularte a vacantes que se ajusten a tu perfil.' : 'Filtra por otro estado o ve todas tus postulaciones.'}
          actionLabel={filter === 'all' ? 'Buscar empleos' : undefined}
          actionTo={filter === 'all' ? '/empleos' : undefined}
          actionFn={filter !== 'all' ? () => setFilter('all') : undefined}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map(app => {
            const sc = STATUS_CONFIG[app.status] || STATUS_CONFIG.sent;
            return (
              <div
                key={app.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all cursor-pointer"
                onClick={() => setSelected(app)}
              >
                <div className="flex items-start gap-4">
                  {/* Company logo */}
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg flex-shrink-0">
                    {app.company_name?.charAt(0)?.toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{app.job_title}</h3>
                        <p className="text-sm text-blue-600 font-medium">{app.company_name}</p>
                      </div>
                      <span className={`flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${sc.bg} ${sc.text}`}>
                        {sc.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <MapPin size={11} /> {app.city}
                      </span>
                      <span>{app.modality}</span>
                      <span className="ml-auto">
                        {new Date(app.applied_at).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <Modal
          isOpen={!!selected}
          onClose={() => setSelected(null)}
          title="Detalle de postulación"
          size="md"
        >
          <div className="space-y-5">
            {/* Job info */}
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">
                {selected.company_name?.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{selected.job_title}</p>
                <p className="text-sm text-blue-600">{selected.company_name}</p>
                <p className="text-xs text-gray-400">{selected.city} · {selected.modality}</p>
              </div>
              <Link
                to={`/empleos/${selected.job_id}`}
                className="ml-auto text-xs text-blue-600 hover:underline"
                onClick={() => setSelected(null)}
              >
                Ver vacante →
              </Link>
            </div>

            {/* Timeline */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Estado de tu postulación</h3>
              <ApplicationTimeline status={selected.status} />
            </div>

            {/* Cover letter */}
            {selected.cover_letter && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">Tu carta de presentación</h3>
                <div className="p-4 bg-gray-50 rounded-xl text-sm text-gray-600 leading-relaxed">
                  {selected.cover_letter}
                </div>
              </div>
            )}

            {/* Feedback */}
            {selected.feedback && (
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-xs font-semibold text-blue-700 mb-1">Comentarios de la empresa</p>
                <p className="text-sm text-blue-800">{selected.feedback}</p>
              </div>
            )}

            <p className="text-xs text-gray-400 text-center">
              Postulado el {new Date(selected.applied_at).toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}
