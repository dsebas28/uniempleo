import { useState, useEffect } from 'react';
import { Mail, Search, Loader2, Eye, Info } from 'lucide-react';
import { adminAPI } from '../../services/api';
import Modal from '../../components/Modal';
import EmptyState from '../../components/EmptyState';
import toast from 'react-hot-toast';

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso.replace(' ', 'T') + 'Z');
  return d.toLocaleString('es-CO', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function AdminEmailOutbox() {
  const [loading, setLoading] = useState(true);
  const [emails, setEmails] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    adminAPI.getEmailLog()
      .then(res => setEmails(res.data?.emails || []))
      .catch(() => toast.error('No se pudo cargar la bandeja de alertas'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = emails.filter(e => {
    const q = searchQuery.toLowerCase();
    return !q || e.to_email?.toLowerCase().includes(q) || e.subject?.toLowerCase().includes(q) || e.student_name?.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Mail className="w-7 h-7 text-indigo-600" />
            Alertas de empleo — Bandeja de correos
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Correos generados automáticamente al publicar una vacante que coincide con una alerta de un estudiante.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-indigo-700 whitespace-nowrap">
          <Mail className="w-4 h-4" />
          {emails.length} correo{emails.length !== 1 ? 's' : ''} generado{emails.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Simulation notice */}
      <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 text-amber-800 text-sm px-4 py-3 rounded-xl">
        <Info size={16} className="flex-shrink-0 mt-0.5" />
        <p>Este es un entorno de demostración: los correos se registran aquí en vez de enviarse a una bandeja real. Conectar un proveedor SMTP (Gmail, Resend, SendGrid) activaría el envío real sin cambiar la lógica de coincidencia.</p>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por estudiante, correo o asunto..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 size={28} className="text-indigo-400 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState type="notifications" title="Aún no se ha generado ninguna alerta" description="Cuando un estudiante configure una alerta y se publique una vacante compatible, el correo simulado aparecerá aquí." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  <th className="px-5 py-3">Fecha</th>
                  <th className="px-5 py-3">Estudiante</th>
                  <th className="px-5 py-3">Vacante</th>
                  <th className="px-5 py-3">Asunto</th>
                  <th className="px-5 py-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(email => (
                  <tr key={email.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3 text-slate-500 whitespace-nowrap font-variant-numeric-tabular">{formatDate(email.sent_at)}</td>
                    <td className="px-5 py-3">
                      <p className="font-medium text-slate-800">{email.student_name || '—'}</p>
                      <p className="text-xs text-slate-400">{email.to_email}</p>
                    </td>
                    <td className="px-5 py-3 text-slate-600">{email.job_title || '—'}</td>
                    <td className="px-5 py-3 text-slate-600 max-w-xs truncate">{email.subject}</td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => setSelected(email)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors"
                      >
                        <Eye size={13} /> Ver correo
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Vista previa del correo" size="lg">
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide mb-0.5">Para</p>
                <p className="text-slate-800 font-medium">{selected.to_email}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide mb-0.5">Enviado</p>
                <p className="text-slate-800 font-medium">{formatDate(selected.sent_at)}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide mb-0.5">Asunto</p>
              <p className="text-slate-900 font-semibold">{selected.subject}</p>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 whitespace-pre-wrap text-sm text-slate-700 leading-relaxed">
              {selected.body}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
