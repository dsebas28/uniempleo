import { useState, useEffect } from 'react';
import { 
  BarChart3, PieChart as PieIcon, TrendingUp, MapPin, 
  Briefcase, GraduationCap, Download, Loader2, Calendar, 
  Layers, Users, CheckCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, 
  PieChart, Pie, Cell, Legend, LineChart, Line, AreaChart, Area 
} from 'recharts';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

const COLORS = ['#4F46E5', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#64748B'];

export default function AdminReports() {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState({
    jobsByArea: [],
    jobsByCity: [],
    jobsByModality: [],
    appsByStatus: [],
    coursesByArea: [],
    userGrowth: []
  });

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getReports();
      setReports(res.data || {});
    } catch (err) {
      console.error('Error al cargar reportes:', err);
      toast.error('No se pudieron cargar las estadísticas y reportes');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-16 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-3" />
        <p className="text-sm text-slate-500 font-medium">Generando análisis y reportes de la plataforma...</p>
      </div>
    );
  }

  const modalityData = (reports.jobsByModality || []).map(m => ({
    name: m.modality === 'remoto' ? 'Remoto' : m.modality === 'hibrido' ? 'Híbrido' : 'Presencial',
    value: m.count
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <BarChart3 className="w-7 h-7 text-indigo-600" />
            Reportes e Inteligencia Laboral
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Métricas estratégicas de empleabilidad universitaria, demanda por ciudades y comportamiento de contratación.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer"
        >
          <Download className="w-4 h-4" />
          Exportar / Imprimir Reporte
        </button>
      </div>

      {/* Grid of Visual Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Cities */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Demanda Laboral por Ciudad</h3>
              <p className="text-xs text-slate-400">Distribución territorial de vacantes universitarias</p>
            </div>
            <span className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <MapPin className="w-4 h-4" />
            </span>
          </div>

          <div className="h-64">
            {reports.jobsByCity && reports.jobsByCity.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reports.jobsByCity} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                  <XAxis dataKey="city" tick={{ fontSize: 10 }} interval={0} angle={-25} textAnchor="end" />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="count" fill="#6366F1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">Sin datos de ciudades</div>
            )}
          </div>
        </div>

        {/* Modality Split */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Modalidad de Trabajo</h3>
              <p className="text-xs text-slate-400">Remoto vs Híbrido vs Presencial</p>
            </div>
            <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <PieIcon className="w-4 h-4" />
            </span>
          </div>

          <div className="h-64">
            {modalityData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={modalityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {modalityData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">Sin datos de modalidades</div>
            )}
          </div>
        </div>

        {/* Applications Conversion / Funnel by Status */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Embudo de Postulaciones</h3>
              <p className="text-xs text-slate-400">Volumen en cada etapa del proceso de selección</p>
            </div>
            <span className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Layers className="w-4 h-4" />
            </span>
          </div>

          <div className="h-64">
            {reports.appsByStatus && reports.appsByStatus.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reports.appsByStatus} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                  <XAxis dataKey="status" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="count" fill="#F59E0B" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">Sin postulaciones para analizar</div>
            )}
          </div>
        </div>

        {/* Courses Academy Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Cursos y Capacitaciones por Área</h3>
              <p className="text-xs text-slate-400">Contenido educativo de UniEmpleo Academy</p>
            </div>
            <span className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <GraduationCap className="w-4 h-4" />
            </span>
          </div>

          <div className="h-64">
            {reports.coursesByArea && reports.coursesByArea.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reports.coursesByArea} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                  <XAxis dataKey="area" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="count" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">Sin catálogo de cursos activo</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
