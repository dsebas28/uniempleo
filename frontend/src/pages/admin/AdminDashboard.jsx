import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, Building2, Briefcase, FileCheck, CheckCircle2, 
  TrendingUp, ArrowUpRight, ShieldCheck, AlertTriangle, 
  Loader2, Activity, PieChart as PieChartIcon, BarChart3, ChevronRight
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  sent: '#3B82F6',
  reviewing: '#F59E0B',
  preselected: '#6366F1',
  interview: '#A855F7',
  selected: '#10B981',
  rejected: '#EF4444'
};

const STATUS_LABELS = {
  sent: 'Postulado',
  reviewing: 'En Revisión',
  preselected: 'Preseleccionado',
  interview: 'Entrevista',
  selected: 'Seleccionado',
  rejected: 'Rechazado'
};

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    kpis: {},
    recentUsers: [],
    jobsByArea: [],
    jobsByCity: [],
    appsByStatus: [],
    jobsByModality: []
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getDashboard();
      setData(res.data || {});
    } catch (err) {
      console.error('Error al cargar dashboard admin:', err);
      toast.error('No se pudo cargar la información del panel');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-16 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-3" />
        <p className="text-sm text-slate-500 font-medium">Cargando métricas de la plataforma...</p>
      </div>
    );
  }

  const kpis = data.kpis || {};
  const statusPieData = (data.appsByStatus || []).map(item => ({
    name: STATUS_LABELS[item.status] || item.status,
    value: item.count,
    color: STATUS_COLORS[item.status] || '#94A3B8'
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="w-7 h-7 text-indigo-600" />
            Panel General de Administración
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Supervisión global de UniEmpleo: estudiantes, empresas registradas, ofertas laborales y postulaciones.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/reportes"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-all"
          >
            <BarChart3 className="w-4 h-4" />
            Ver Reportes Avanzados
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Estudiantes</span>
            <span className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-3">{kpis.students || 0}</div>
          <div className="text-[11px] text-slate-400 mt-1">Registrados activos</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Empresas</span>
            <span className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-3">{kpis.companies || 0}</div>
          <div className="text-[11px] text-slate-400 mt-1">En el ecosistema</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Vacantes Activas</span>
            <span className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-3">{kpis.activeJobs || 0}</div>
          <div className="text-[11px] text-slate-400 mt-1">De {kpis.jobs || 0} creadas</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Postulaciones</span>
            <span className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <FileCheck className="w-5 h-5" />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-3">{kpis.applications || 0}</div>
          <div className="text-[11px] text-slate-400 mt-1">Interacciones de empleo</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Contratados</span>
            <span className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </span>
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-3">{kpis.hired || 0}</div>
          <div className="text-[11px] text-emerald-700/70 font-medium mt-1">Casos de éxito</div>
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Jobs by Area Bar Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Vacantes por Área Profesional</h3>
              <p className="text-xs text-slate-400">Distribución de oportunidades laborales</p>
            </div>
            <span className="p-2 rounded-lg bg-slate-50 text-slate-500">
              <BarChart3 className="w-4 h-4" />
            </span>
          </div>

          <div className="h-64">
            {data.jobsByArea && data.jobsByArea.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.jobsByArea} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="area" tick={{ fontSize: 11 }} width={90} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="count" fill="#4F46E5" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                Sin datos suficientes de vacantes por área
              </div>
            )}
          </div>
        </div>

        {/* Applications by Status Pie Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Estado de las Postulaciones</h3>
              <p className="text-xs text-slate-400">Progreso de las solicitudes de empleo</p>
            </div>
            <span className="p-2 rounded-lg bg-slate-50 text-slate-500">
              <PieChartIcon className="w-4 h-4" />
            </span>
          </div>

          <div className="h-64">
            {statusPieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                Sin postulaciones registradas actualmente
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Usuarios Registrados Recientemente</h3>
            <p className="text-xs text-slate-400 mt-0.5">Últimas cuentas de estudiantes y empresas creadas</p>
          </div>
          <Link
            to="/admin/usuarios"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            Ver todos los usuarios
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-6">ID</th>
                <th className="py-3 px-4">Correo Electrónico</th>
                <th className="py-3 px-4">Rol</th>
                <th className="py-3 px-4">Fecha de Registro</th>
                <th className="py-3 px-6 text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {(data.recentUsers || []).map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-6 font-mono text-slate-400">#{u.id}</td>
                  <td className="py-3.5 px-4 font-medium text-slate-800">{u.email}</td>
                  <td className="py-3.5 px-4">
                    {u.role === 'student' ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        Estudiante
                      </span>
                    ) : u.role === 'company' ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        Empresa
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                        Admin
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    {new Date(u.created_at).toLocaleDateString('es-CO', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    {u.active ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Activo
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        Inactivo
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
