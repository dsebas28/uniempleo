import { useState, useEffect } from 'react';
import { 
  Building2, Search, Filter, ShieldCheck, ShieldAlert, 
  ExternalLink, Globe, Phone, MapPin, CheckCircle, XCircle, 
  Loader2, AlertCircle, Eye, Mail, Check, X
} from 'lucide-react';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminCompanies() {
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getCompanies();
      setCompanies(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error al cargar empresas:', err);
      toast.error('No se pudieron cargar las empresas');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleApprove = async (company) => {
    const newApproved = company.approved ? 0 : 1;
    try {
      setUpdatingId(company.id);
      await adminAPI.approveCompany(company.id, { approved: newApproved });
      toast.success(newApproved ? 'Empresa aprobada y verificada' : 'Empresa desaprobada');
      setCompanies(prev => prev.map(c => c.id === company.id ? { ...c, approved: newApproved } : c));
      if (selectedCompany && selectedCompany.id === company.id) {
        setSelectedCompany(prev => ({ ...prev, approved: newApproved }));
      }
    } catch (err) {
      console.error('Error al actualizar empresa:', err);
      toast.error('Error al cambiar el estado de verificación');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredCompanies = companies.filter(c => {
    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'approved' && c.approved === 1) ||
      (statusFilter === 'pending' && c.approved === 0);

    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      !query || 
      c.name?.toLowerCase().includes(query) ||
      c.sector?.toLowerCase().includes(query) ||
      c.city?.toLowerCase().includes(query);

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Building2 className="w-7 h-7 text-brand-600" />
            Validación y Gestión de Empresas
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Verifica la legitimidad de las organizaciones para proteger a los estudiantes y autorizar la publicación de vacantes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-700">
            <ShieldCheck className="w-4 h-4" />
            {companies.filter(c => c.approved === 1).length} Verificadas
          </div>
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-amber-700">
            <ShieldAlert className="w-4 h-4" />
            {companies.filter(c => c.approved === 0).length} Pendientes
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre de empresa, sector o ciudad..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'Todas' },
            { id: 'approved', label: 'Verificadas' },
            { id: 'pending', label: 'Pendientes de Aprobación' },
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

      {/* Companies Table */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 text-brand-600 animate-spin mb-3" />
          <p className="text-sm text-slate-500 font-medium">Cargando directorio de empresas...</p>
        </div>
      ) : filteredCompanies.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No hay empresas registradas</h3>
          <p className="text-xs text-slate-500 mt-1">No se encontraron resultados para los filtros actuales.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-white/[0.04] rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Empresa</th>
                  <th className="py-3.5 px-4">Sector</th>
                  <th className="py-3.5 px-4">Ubicación</th>
                  <th className="py-3.5 px-4">Contacto</th>
                  <th className="py-3.5 px-4">Estado</th>
                  <th className="py-3.5 px-6 text-right">Aprobación / Verificación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredCompanies.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-sm text-slate-700 flex-shrink-0">
                          {c.logo ? (
                            <img src={c.logo} alt={c.name} className="w-full h-full object-cover rounded-xl" />
                          ) : (
                            c.name?.[0] || 'E'
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                            {c.name}
                            {c.website && (
                              <a href={c.website} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-brand-600">
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                          <button
                            onClick={() => setSelectedCompany(c)}
                            className="text-[11px] text-brand-600 hover:underline flex items-center gap-0.5 mt-0.5"
                          >
                            Ver expediente
                          </button>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 font-medium text-slate-700 text-xs">
                      {c.sector || 'No especificado'}
                    </td>

                    <td className="py-4 px-4 text-xs text-slate-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{c.city || 'Colombia'}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span className="truncate max-w-[150px]">{c.email}</span>
                      </div>
                      {c.phone && (
                        <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                          <Phone className="w-3 h-3" />
                          <span>{c.phone}</span>
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      {c.approved ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          Verificada
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                          <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                          Por Revisar
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleToggleApprove(c)}
                        disabled={updatingId === c.id}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-50 ${
                          c.approved
                            ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
                        }`}
                      >
                        {updatingId === c.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : c.approved ? (
                          <>
                            <X className="w-3.5 h-3.5" />
                            Revocar
                          </>
                        ) : (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            Aprobar
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Company Detail Modal */}
      {selectedCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center font-bold text-brand-700 text-lg">
                  {selectedCompany.name?.[0] || 'E'}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedCompany.name}</h3>
                  <p className="text-xs text-slate-400">{selectedCompany.sector} • {selectedCompany.city}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCompany(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-600">
              <div>
                <span className="font-bold text-slate-900 block mb-1">Descripción:</span>
                <p className="p-3 bg-slate-50 rounded-xl leading-relaxed border border-slate-100">
                  {selectedCompany.description || 'Sin descripción ingresada.'}
                </p>
              </div>

              {selectedCompany.mission && (
                <div>
                  <span className="font-bold text-slate-900 block mb-1">Misión / Propuesta:</span>
                  <p className="p-3 bg-slate-50 rounded-xl leading-relaxed border border-slate-100">
                    {selectedCompany.mission}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Email Registrado</span>
                  <span className="font-medium text-slate-800">{selectedCompany.email}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Teléfono</span>
                  <span className="font-medium text-slate-800">{selectedCompany.phone || 'No registrado'}</span>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center rounded-b-3xl">
              <button
                onClick={() => handleToggleApprove(selectedCompany)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold ${
                  selectedCompany.approved
                    ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                {selectedCompany.approved ? 'Revocar Verificación' : 'Aprobar Organización'}
              </button>
              <button
                onClick={() => setSelectedCompany(null)}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-100"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
