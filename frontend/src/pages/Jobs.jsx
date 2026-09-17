import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ChevronDown, MapPin, Filter } from 'lucide-react';
import { jobsAPI } from '../services/api';
import JobCard from '../components/JobCard';
import { JobCardSkeleton } from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';

const AREAS = ['Tecnología', 'Marketing', 'Diseño', 'Administración', 'Contabilidad', 'Recursos Humanos', 'Ingeniería', 'Salud', 'Educación', 'Legal'];
const MODALITIES = ['Remoto', 'Híbrido', 'Presencial'];
const CONTRACT_TYPES = ['Tiempo completo', 'Medio tiempo', 'Prácticas', 'Freelance', 'Contrato de aprendizaje'];
const CITIES = ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Bucaramanga', 'Pereira'];

export default function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    city: '',
    modality: '',
    contractType: '',
    area: '',
    noExperience: false,
    isInternship: false,
    page: 1,
  });

  const fetchJobs = async (f = filters) => {
    setLoading(true);
    try {
      const params = {};
      if (f.keyword) params.keyword = f.keyword;
      if (f.city) params.city = f.city;
      if (f.modality) params.modality = f.modality;
      if (f.contractType) params.contractType = f.contractType;
      if (f.area) params.area = f.area;
      if (f.noExperience) params.noExperience = 'true';
      if (f.isInternship) params.isInternship = 'true';
      params.page = f.page;
      params.limit = 12;

      const res = await jobsAPI.getAll(params);
      setJobs(res.data.jobs || []);
      setTotal(res.data.total || 0);
      setTotalPages(res.data.totalPages || 1);
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const newFilters = { ...filters, page: 1 };
    setFilters(newFilters);
    fetchJobs(newFilters);
  };

  const updateFilter = (key, value) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    setFilters(newFilters);
    fetchJobs(newFilters);
  };

  const clearFilters = () => {
    const reset = { keyword: '', city: '', modality: '', contractType: '', area: '', noExperience: false, isInternship: false, page: 1 };
    setFilters(reset);
    fetchJobs(reset);
  };

  const activeFilterCount = [filters.city, filters.modality, filters.contractType, filters.area, filters.noExperience, filters.isInternship]
    .filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cargo, empresa o palabra clave..."
                value={filters.keyword}
                onChange={(e) => setFilters(prev => ({ ...prev, keyword: e.target.value }))}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none input-focus bg-gray-50 focus:bg-white"
              />
            </div>
            <button type="submit" className="px-5 py-2.5 text-sm font-semibold text-white rounded-xl btn-primary flex-shrink-0">
              Buscar
            </button>
            <button
              type="button"
              onClick={() => setFiltersOpen(!filtersOpen)}
              className={`relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl border transition-all ${
                filtersOpen || activeFilterCount > 0
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              <SlidersHorizontal size={16} />
              <span className="hidden sm:inline">Filtros</span>
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </form>

          {/* Filters panel */}
          {filtersOpen && (
            <div className="mt-4 pt-4 border-t border-gray-100 animate-fade-in">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {/* City */}
                <select
                  value={filters.city}
                  onChange={(e) => updateFilter('city', e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 bg-white outline-none input-focus"
                >
                  <option value="">Ciudad</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>

                {/* Modality */}
                <select
                  value={filters.modality}
                  onChange={(e) => updateFilter('modality', e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 bg-white outline-none input-focus"
                >
                  <option value="">Modalidad</option>
                  {MODALITIES.map(m => <option key={m} value={m}>{m}</option>)}
                </select>

                {/* Contract type */}
                <select
                  value={filters.contractType}
                  onChange={(e) => updateFilter('contractType', e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 bg-white outline-none input-focus"
                >
                  <option value="">Tipo de contrato</option>
                  {CONTRACT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>

                {/* Area */}
                <select
                  value={filters.area}
                  onChange={(e) => updateFilter('area', e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 bg-white outline-none input-focus"
                >
                  <option value="">Área profesional</option>
                  {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>

                {/* Checkboxes */}
                <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white cursor-pointer hover:bg-blue-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={filters.noExperience}
                    onChange={(e) => updateFilter('noExperience', e.target.checked)}
                    className="accent-blue-600"
                  />
                  <span className="text-xs font-medium text-gray-700">Sin experiencia</span>
                </label>

                <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white cursor-pointer hover:bg-blue-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={filters.isInternship}
                    onChange={(e) => updateFilter('isInternship', e.target.checked)}
                    className="accent-blue-600"
                  />
                  <span className="text-xs font-medium text-gray-700">Solo prácticas</span>
                </label>
              </div>

              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="mt-3 flex items-center gap-1.5 text-xs font-medium text-red-600 hover:text-red-700 transition-colors"
                >
                  <X size={13} /> Limpiar filtros ({activeFilterCount})
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Count bar */}
        <div className="flex items-center justify-between mb-6">
          <div>
            {!loading && (
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">{total.toLocaleString()}</span> vacante{total !== 1 ? 's' : ''} encontrada{total !== 1 ? 's' : ''}
                {filters.keyword && <span className="text-blue-600"> para "{filters.keyword}"</span>}
              </p>
            )}
          </div>
          {activeFilterCount > 0 && (
            <button onClick={clearFilters} className="text-xs text-gray-500 hover:text-red-600 transition-colors flex items-center gap-1">
              <X size={12} /> Limpiar filtros
            </button>
          )}
        </div>

        {/* Active filter pills */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {filters.city && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                <MapPin size={11} /> {filters.city}
                <button onClick={() => updateFilter('city', '')} className="ml-1 hover:text-blue-900"><X size={11} /></button>
              </span>
            )}
            {filters.modality && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                {filters.modality}
                <button onClick={() => updateFilter('modality', '')} className="ml-1 hover:text-blue-900"><X size={11} /></button>
              </span>
            )}
            {filters.area && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                {filters.area}
                <button onClick={() => updateFilter('area', '')} className="ml-1 hover:text-blue-900"><X size={11} /></button>
              </span>
            )}
            {filters.noExperience && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                Sin experiencia
                <button onClick={() => updateFilter('noExperience', false)} className="ml-1 hover:text-emerald-900"><X size={11} /></button>
              </span>
            )}
            {filters.isInternship && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                Solo prácticas
                <button onClick={() => updateFilter('isInternship', false)} className="ml-1 hover:text-yellow-900"><X size={11} /></button>
              </span>
            )}
          </div>
        )}

        {/* Job grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 9 }).map((_, i) => <JobCardSkeleton key={i} />)}
          </div>
        ) : jobs.length === 0 ? (
          <EmptyState
            type="jobs"
            title="No se encontraron vacantes"
            description="Intenta cambiar los filtros o buscar con otras palabras clave."
            actionLabel="Ver todas las vacantes"
            actionFn={clearFilters}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {jobs.map(job => <JobCard key={job.id} job={job} />)}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => {
                      const newFilters = { ...filters, page: p };
                      setFilters(newFilters);
                      fetchJobs(newFilters);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${
                      filters.page === p
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-blue-50 hover:text-blue-700'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
