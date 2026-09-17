import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Bookmark, MessageSquare, User, ArrowRight, TrendingUp, Loader2 } from 'lucide-react';
import { studentAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StatsCard from '../../components/StatsCard';
import JobCard from '../../components/JobCard';
import EmptyState from '../../components/EmptyState';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const STATUS_LABELS = {
  sent: 'Enviadas', reviewing: 'En revisión', preselected: 'Preseleccionado',
  interview: 'Entrevista', selected: 'Seleccionado', rejected: 'Rechazado'
};
const STATUS_COLORS = {
  sent: '#3b82f6', reviewing: '#f59e0b', preselected: '#8b5cf6',
  interview: '#10b981', selected: '#059669', rejected: '#ef4444'
};

const MONTH_NAMES = { '01':'Ene','02':'Feb','03':'Mar','04':'Abr','05':'May','06':'Jun','07':'Jul','08':'Ago','09':'Sep','10':'Oct','11':'Nov','12':'Dic' };

export default function StudentDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentAPI.getDashboard().then(res => {
      setData(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 size={32} className="text-blue-500 animate-spin" />
    </div>
  );

  const kpis = data?.kpis || {};
  const appsByMonth = (data?.appsByMonth || []).map(m => ({
    month: MONTH_NAMES[m.month?.split('-')[1]] || m.month,
    postulaciones: m.count,
  }));
  const appsByStatus = (data?.appsByStatus || []).map(s => ({
    name: STATUS_LABELS[s.status] || s.status,
    value: s.count,
    fill: STATUS_COLORS[s.status] || '#94a3b8',
  }));
  const recommended = data?.recommended || [];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white" style={{ fontFamily: 'Plus Jakarta Sans' }}>
            Hola, {(user?.profile?.full_name || user?.fullName || user?.email?.split('@')[0] || 'Estudiante').split(' ')[0]} 👋
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">Aquí tienes un resumen de tu actividad en UniEmpleo.</p>
        </div>
        <Link to="/empleos" className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-xl bg-blue-600 hover:bg-blue-700 transition-colors">
          <Briefcase size={15} /> Buscar empleos
        </Link>
      </div>


      {/* Profile completion alert */}
      {kpis.profileCompletion < 70 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
            <User size={16} className="text-amber-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-800">Tu perfil está incompleto ({kpis.profileCompletion}%)</p>
            <p className="text-xs text-amber-600">Un perfil completo aumenta 3x tus probabilidades de ser contactado.</p>
          </div>
          <Link to="/perfil" className="text-xs font-semibold text-amber-700 hover:text-amber-900 flex items-center gap-1">
            Completar <ArrowRight size={12} />
          </Link>
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard label="Postulaciones" value={kpis.totalApps || 0} icon={Briefcase} color="blue" />
        <StatsCard label="Vacantes guardadas" value={kpis.savedJobs || 0} icon={Bookmark} color="purple" />
        <StatsCard label="Entrevistas" value={kpis.interviews || 0} icon={MessageSquare} color="green" />
        <StatsCard label="Perfil completado" value={`${kpis.profileCompletion || 0}%`} icon={User} color="orange" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Postulations by month */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-gray-900">Postulaciones por mes</h2>
            <TrendingUp size={18} className="text-blue-400" />
          </div>
          {appsByMonth.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={appsByMonth} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="postGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', fontSize: '12px' }} />
                <Area type="monotone" dataKey="postulaciones" stroke="#3b82f6" strokeWidth={2} fill="url(#postGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-44 flex items-center justify-center text-gray-400 text-sm">
              No hay postulaciones aún. <Link to="/empleos" className="text-blue-600 ml-1 hover:underline">¡Busca empleos!</Link>
            </div>
          )}
        </div>

        {/* Status distribution */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-5">Estado de postulaciones</h2>
          {appsByStatus.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={appsByStatus} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                  {appsByStatus.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Pie>
                <Legend iconType="circle" iconSize={8} formatter={(value) => <span style={{ fontSize: '11px', color: '#475569' }}>{value}</span>} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-44 flex items-center justify-center text-gray-400 text-sm">
              No hay postulaciones para mostrar
            </div>
          )}
        </div>
      </div>

      {/* Recommended jobs */}
      {recommended.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Vacantes recomendadas para ti</h2>
            <Link to="/empleos" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
              Ver todas <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommended.slice(0, 3).map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      )}

      {kpis.totalApps === 0 && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-8 text-center">
          <Briefcase size={40} className="text-blue-300 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-800 mb-2">¡Empieza a postularte!</h3>
          <p className="text-sm text-gray-500 mb-4">Aún no tienes postulaciones. Explora las vacantes disponibles.</p>
          <Link to="/empleos" className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-xl btn-primary">
            <Briefcase size={15} /> Explorar empleos
          </Link>
        </div>
      )}
    </div>
  );
}
