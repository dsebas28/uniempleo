import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Users, Eye, PlusCircle, TrendingUp, Loader2, ArrowRight } from 'lucide-react';
import { companyAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StatsCard from '../../components/StatsCard';
import EmptyState from '../../components/EmptyState';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

const STATUS_LABELS = { sent: 'Enviadas', reviewing: 'En revisión', preselected: 'Preselect.', interview: 'Entrevista', selected: 'Seleccionado', rejected: 'Rechazado' };
const STATUS_COLORS_MAP = { sent: '#3b82f6', reviewing: '#f59e0b', preselected: '#8b5cf6', interview: '#10b981', selected: '#059669', rejected: '#ef4444' };
const APP_STATUS_MAP = { sent: 'bg-brand-100 text-brand-700', reviewing: 'bg-yellow-100 text-yellow-700', preselected: 'bg-purple-100 text-purple-700', interview: 'bg-emerald-100 text-emerald-700', selected: 'bg-emerald-100 text-emerald-800 font-bold', rejected: 'bg-red-100 text-red-600' };

export default function CompanyDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    companyAPI.getDashboard().then(res => { setData(res.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 size={32} className="text-brand-500 animate-spin" />
    </div>
  );

  const kpis = data?.kpis || {};
  const recentApps = data?.recentApplications || [];
  const appsByStatus = data?.appsByStatus || [];
  const chartData = appsByStatus.map(s => ({
    status: STATUS_LABELS[s.status] || s.status,
    count: s.count,
    color: STATUS_COLORS_MAP[s.status] || '#94a3b8',
  }));

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white" style={{ fontFamily: 'Plus Jakarta Sans' }}>
            Hola, {user?.profile?.name || user?.companyName || user?.email?.split('@')[0] || 'Empresa'} 👋
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">Panel de gestión de vacantes y candidatos.</p>
        </div>
        <Link to="/empresa/vacantes/nueva" className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-xl bg-brand-600 hover:bg-brand-700 transition-colors">
          <PlusCircle size={15} /> Nueva vacante
        </Link>
      </div>


      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard label="Vacantes activas" value={kpis.activeJobs || 0} icon={Briefcase} color="blue" />
        <StatsCard label="Postulaciones totales" value={kpis.totalApps || 0} icon={Users} color="green" />
        <StatsCard label="En revisión" value={kpis.reviewing || 0} icon={Eye} color="orange" />
        <StatsCard label="Seleccionados" value={kpis.selected || 0} icon={TrendingUp} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="bg-white dark:bg-white/[0.04] rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm p-6">
          <h2 className="font-semibold text-slate-900 mb-5">Postulaciones por estado</h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="status" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', fontSize: '12px' }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-slate-400 text-sm">
              No hay datos de postulaciones aún.
              <Link to="/empresa/vacantes/nueva" className="text-brand-600 ml-1 hover:underline">Publica tu primera vacante</Link>
            </div>
          )}
        </div>

        {/* Recent applications */}
        <div className="bg-white dark:bg-white/[0.04] rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900">Postulaciones recientes</h2>
            <Link to="/empresa/candidatos" className="text-xs text-brand-600 hover:text-brand-700 flex items-center gap-1">
              Ver todas <ArrowRight size={12} />
            </Link>
          </div>

          {recentApps.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">Aún no tienes postulaciones</div>
          ) : (
            <div className="space-y-3">
              {recentApps.slice(0, 5).map(app => {
                const sc = APP_STATUS_MAP[app.status] || 'bg-slate-100 text-slate-600';
                return (
                  <div key={app.id} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                      {app.student_name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{app.student_name}</p>
                      <p className="text-xs text-slate-400 truncate">{app.job_title}</p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${sc} flex-shrink-0`}>
                      {STATUS_LABELS[app.status] || app.status}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: PlusCircle, title: 'Publicar vacante', desc: 'Crea una nueva oferta de empleo', to: '/empresa/vacantes/nueva', color: 'blue' },
          { icon: Users, title: 'Ver candidatos', desc: 'Gestiona todas las postulaciones', to: '/empresa/candidatos', color: 'green' },
          { icon: Briefcase, title: 'Mis vacantes', desc: 'Administra tus ofertas activas', to: '/empresa/vacantes', color: 'purple' },
        ].map(({ icon: Icon, title, desc, to, color }) => (
          <Link
            key={to}
            to={to}
            className="flex items-center gap-4 p-5 bg-white dark:bg-white/[0.04] rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm hover:shadow-md transition-all group"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
              color === 'blue' ? 'bg-brand-100 text-brand-600 group-hover:bg-brand-600 group-hover:text-white' :
              color === 'green' ? 'bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white' :
              'bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white'
            } transition-all duration-200`}>
              <Icon size={22} />
            </div>
            <div>
              <p className="font-semibold text-slate-900 group-hover:text-brand-700 transition-colors">{title}</p>
              <p className="text-xs text-slate-400">{desc}</p>
            </div>
            <ArrowRight size={16} className="text-slate-300 ml-auto group-hover:text-brand-500 transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  );
}
