import { useState, useEffect } from 'react';
import { BellRing, Loader2, Plus, Trash2, MapPin, Briefcase, Laptop, Tag } from 'lucide-react';
import { studentAPI } from '../../services/api';
import Modal from '../../components/Modal';
import EmptyState from '../../components/EmptyState';
import { COLOMBIA_CITIES } from '../../data/colombia';
import toast from 'react-hot-toast';

const AREAS = ['Tecnología', 'Marketing', 'Diseño', 'Administración', 'Contabilidad', 'Recursos Humanos', 'Ingeniería', 'Salud', 'Educación', 'Legal', 'Ventas', 'Logística'];
const MODALITIES = ['Remoto', 'Híbrido', 'Presencial'];
const CITIES = COLOMBIA_CITIES;

const emptyForm = { area: '', city: '', modality: '', keywords: '' };

export default function JobAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => {
    studentAPI.getJobAlerts().then(res => {
      setAlerts(res.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(load, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.area && !form.city && !form.modality && !form.keywords.trim()) {
      toast.error('Define al menos un criterio para la alerta');
      return;
    }
    setSaving(true);
    try {
      await studentAPI.createJobAlert(form);
      toast.success('Alerta de empleo creada');
      setModalOpen(false);
      setForm(emptyForm);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al crear la alerta');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (alert) => {
    const next = !alert.active;
    setAlerts(prev => prev.map(a => a.id === alert.id ? { ...a, active: next ? 1 : 0 } : a));
    try {
      await studentAPI.toggleJobAlert(alert.id, next);
    } catch {
      toast.error('No se pudo actualizar la alerta');
      load();
    }
  };

  const handleDelete = async (id) => {
    try {
      await studentAPI.deleteJobAlert(id);
      setAlerts(prev => prev.filter(a => a.id !== id));
      toast.success('Alerta eliminada');
    } catch {
      toast.error('No se pudo eliminar la alerta');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Outfit' }}>Alertas de empleo</h1>
          <p className="text-sm text-gray-500 mt-1">Te avisamos por correo apenas se publique una vacante que coincida con tus criterios.</p>
        </div>
        <button
          onClick={() => { setForm(emptyForm); setModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white rounded-xl btn-primary whitespace-nowrap"
        >
          <Plus size={16} /> Nueva alerta
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 size={28} className="text-blue-400 animate-spin" />
        </div>
      ) : alerts.length === 0 ? (
        <EmptyState
          type="notifications"
          title="No tienes alertas configuradas"
          description="Crea una alerta con tu área, ciudad o modalidad preferida y te notificaremos por correo cuando se publique una vacante compatible."
          actionLabel="Crear mi primera alerta"
          actionFn={() => setModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alerts.map(alert => (
            <div key={alert.id} className={`rounded-2xl border p-4 transition-colors ${alert.active ? 'bg-white border-gray-100 shadow-sm' : 'bg-gray-50 border-gray-100'}`}>
              <div className="flex items-start justify-between gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${alert.active ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                  <BellRing size={18} />
                </div>
                <div className="flex items-center gap-1.5 ml-auto">
                  <button
                    onClick={() => handleToggle(alert)}
                    className={`relative w-9 h-5 rounded-full transition-colors ${alert.active ? 'bg-blue-600' : 'bg-gray-300'}`}
                    title={alert.active ? 'Pausar alerta' : 'Activar alerta'}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${alert.active ? 'translate-x-4' : 'translate-x-0.5'}`} />
                  </button>
                  <button
                    onClick={() => handleDelete(alert.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Eliminar alerta"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-3">
                {alert.area && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 text-xs font-medium"><Briefcase size={11} /> {alert.area}</span>
                )}
                {alert.city && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 text-xs font-medium"><MapPin size={11} /> {alert.city}</span>
                )}
                {alert.modality && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 text-xs font-medium"><Laptop size={11} /> {alert.modality}</span>
                )}
                {alert.keywords && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 text-xs font-medium"><Tag size={11} /> "{alert.keywords}"</span>
                )}
                {!alert.area && !alert.city && !alert.modality && !alert.keywords && (
                  <span className="text-xs text-gray-400">Todas las vacantes nuevas</span>
                )}
              </div>

              <p className={`text-xs mt-3 ${alert.active ? 'text-emerald-600' : 'text-gray-400'}`}>
                {alert.active ? '● Activa — recibirás correos' : '○ Pausada'}
              </p>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Nueva alerta de empleo">
        <form onSubmit={handleCreate} className="space-y-4">
          <p className="text-sm text-gray-500 -mt-1">Deja en blanco los criterios que no te importen.</p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Área</label>
            <select
              value={form.area}
              onChange={(e) => setForm(f => ({ ...f, area: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
            >
              <option value="">Cualquier área</option>
              {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Ciudad</label>
            <select
              value={form.city}
              onChange={(e) => setForm(f => ({ ...f, city: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
            >
              <option value="">Cualquier ciudad</option>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Modalidad</label>
            <div className="flex gap-2">
              {MODALITIES.map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, modality: f.modality === m ? '' : m }))}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg border-2 transition-all ${
                    form.modality === m ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Palabra clave (opcional)</label>
            <input
              type="text"
              value={form.keywords}
              onChange={(e) => setForm(f => ({ ...f, keywords: e.target.value }))}
              placeholder="Ej: React, analista, pasantía..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
            />
            <p className="text-xs text-gray-400 mt-1">Busca esta palabra en el título o descripción de la vacante.</p>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-2.5 text-sm font-semibold text-gray-600 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 text-sm font-semibold text-white rounded-xl btn-primary disabled:opacity-60">
              {saving ? 'Creando...' : 'Crear alerta'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
