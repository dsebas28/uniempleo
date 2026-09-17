import { useState, useEffect } from 'react';
import { Search, Building2, MapPin, Briefcase } from 'lucide-react';
import { companiesAPI } from '../services/api';
import CompanyCard from '../components/CompanyCard';
import { CompanyCardSkeleton } from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';

const SECTORS = ['Tecnología', 'Salud', 'Educación', 'Finanzas', 'Manufactura', 'Retail', 'Consultoría', 'Medios', 'Transporte'];

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sector, setSector] = useState('');

  useEffect(() => {
    companiesAPI.getAll().then(res => {
      setCompanies(res.data || []);
      setFiltered(res.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = companies;
    if (search) result = result.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.sector?.toLowerCase().includes(search.toLowerCase()));
    if (sector) result = result.filter(c => c.sector === sector);
    setFiltered(result);
  }, [search, sector, companies]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Directorio</span>
          <h1 className="text-4xl font-bold text-gray-900 mt-2 mb-3" style={{ fontFamily: 'Outfit' }}>
            Empresas aliadas
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            Descubre las empresas que confían en UniEmpleo para encontrar el mejor talento universitario.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar empresa..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none input-focus bg-white"
            />
          </div>
          <select
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 bg-white outline-none input-focus"
          >
            <option value="">Todos los sectores</option>
            {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Results count */}
        {!loading && (
          <p className="text-sm text-gray-500 mb-6">
            <span className="font-semibold text-gray-900">{filtered.length}</span> empresa{filtered.length !== 1 ? 's' : ''} encontrada{filtered.length !== 1 ? 's' : ''}
          </p>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 9 }).map((_, i) => <CompanyCardSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            type="companies"
            title="No se encontraron empresas"
            description="Intenta con otros términos de búsqueda."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(company => <CompanyCard key={company.id} company={company} />)}
          </div>
        )}
      </div>
    </div>
  );
}
