import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Search, MapPin, Clock, Award, Filter } from 'lucide-react';
import { jobsAPI } from '../services/api';
import JobCard from '../components/JobCard';
import { JobCardSkeleton } from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import { COLOMBIA_CITIES } from '../data/colombia';

const CAREERS = ['Todas las carreras', 'Ingeniería de Sistemas', 'Administración de Empresas', 'Contaduría Pública', 'Diseño Gráfico', 'Ingeniería Industrial', 'Psicología', 'Comunicación Social', 'Economía', 'Marketing'];
const CITIES = ['Todas las ciudades', ...COLOMBIA_CITIES];
const DURATIONS = ['Cualquier duración', '3 meses', '6 meses', '12 meses'];

export default function Internships() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState('');
  const [modality, setModality] = useState('');
  const [search, setSearch] = useState('');

  const fetchInternships = async () => {
    setLoading(true);
    try {
      const params = { isInternship: 'true', limit: 30 };
      if (city && city !== 'Todas las ciudades') params.city = city;
      if (modality) params.modality = modality;
      if (search) params.keyword = search;
      const res = await jobsAPI.getAll(params);
      setJobs(res.data.jobs || []);
    } catch { setJobs([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchInternships(); }, []);

  const handleSearch = (e) => { e.preventDefault(); fetchInternships(); };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-900 via-blue-800 to-blue-700 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-sm text-blue-100 mb-5">
            <GraduationCap size={15} /> Prácticas universitarias
          </div>
          <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Outfit' }}>
            Prácticas profesionales
          </h1>
          <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
            Encuentra prácticas y contratos de aprendizaje alineados con tu carrera universitaria.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-6 justify-center mb-8">
            {[
              { icon: Award, label: 'Sin experiencia requerida', color: 'text-yellow-300' },
              { icon: Clock, label: 'Duración 3 – 12 meses', color: 'text-green-300' },
              { icon: GraduationCap, label: 'Validez académica', color: 'text-blue-300' },
            ].map(({ icon: Icon, label, color }) => (
              <div key={label} className="flex items-center gap-2 text-sm text-white">
                <Icon size={16} className={color} />
                <span>{label}</span>
              </div>
            ))}
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex gap-2">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Carrera, empresa o área..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl text-gray-800 text-sm outline-none"
              />
            </div>
            <button type="submit" className="px-5 py-3 bg-white text-blue-700 font-bold text-sm rounded-xl hover:bg-blue-50 transition-colors">
              Buscar
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <select
            value={city}
            onChange={(e) => { setCity(e.target.value); }}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 bg-white outline-none input-focus"
          >
            {CITIES.map(c => <option key={c} value={c === 'Todas las ciudades' ? '' : c}>{c}</option>)}
          </select>
          <select
            value={modality}
            onChange={(e) => setModality(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 bg-white outline-none input-focus"
          >
            <option value="">Cualquier modalidad</option>
            <option value="Remoto">Remoto</option>
            <option value="Híbrido">Híbrido</option>
            <option value="Presencial">Presencial</option>
          </select>
          <button
            onClick={fetchInternships}
            className="px-4 py-2.5 text-sm font-semibold text-white rounded-xl btn-primary"
          >
            Aplicar filtros
          </button>
        </div>

        {/* Info banner */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 flex items-start gap-3">
          <GraduationCap size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-blue-800">¿Buscas prácticas para tu universidad?</p>
            <p className="text-xs text-blue-600 mt-0.5">
              Todas las oportunidades listadas aquí cuentan como prácticas profesionales válidas. 
              Habla con tu coordinador académico para más información.
            </p>
          </div>
        </div>

        {/* Results */}
        {!loading && (
          <p className="text-sm text-gray-500 mb-5">
            <span className="font-semibold text-gray-900">{jobs.length}</span> práctica{jobs.length !== 1 ? 's' : ''} disponible{jobs.length !== 1 ? 's' : ''}
          </p>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <JobCardSkeleton key={i} />)}
          </div>
        ) : jobs.length === 0 ? (
          <EmptyState
            type="jobs"
            title="No hay prácticas disponibles"
            description="Prueba con otros filtros o busca en la sección de empleos."
            actionLabel="Ver todos los empleos"
            actionTo="/empleos"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {jobs.map(job => <JobCard key={job.id} job={job} />)}
          </div>
        )}
      </div>
    </div>
  );
}
