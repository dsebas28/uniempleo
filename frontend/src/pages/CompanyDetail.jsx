import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Briefcase, Globe, ChevronLeft, Loader2, Building2 } from 'lucide-react';
import { Linkedin, Instagram } from '../components/SocialIcons';
import { companiesAPI } from '../services/api';
import JobCard from '../components/JobCard';

export default function CompanyDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    companiesAPI.getById(id).then(res => { setData(res.data); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 size={40} className="text-blue-500 animate-spin" />
    </div>
  );

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Building2 size={48} className="text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-700">Empresa no encontrada</h2>
        <Link to="/empresas" className="text-blue-600 hover:underline mt-2 block">Ver todas las empresas</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Link to="/empresas" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors">
            <ChevronLeft size={16} /> Volver a empresas
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
              <div className="flex items-start gap-5 mb-5">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-100 flex items-center justify-center text-blue-700 font-bold text-3xl flex-shrink-0">
                  {data.name?.charAt(0)}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Outfit' }}>{data.name}</h1>
                  <span className="inline-block mt-1 text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full">{data.sector}</span>
                  <div className="flex items-center gap-1.5 mt-2 text-sm text-gray-500">
                    <MapPin size={14} className="text-gray-400" /> {data.city}
                  </div>
                </div>
              </div>

              {data.description && (
                <div>
                  <h2 className="font-semibold text-gray-900 mb-2">Sobre nosotros</h2>
                  <p className="text-sm text-gray-600 leading-relaxed">{data.description}</p>
                </div>
              )}

              {data.mission && (
                <div className="mt-4 p-4 bg-blue-50 rounded-xl border-l-4 border-blue-400">
                  <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">Misión</p>
                  <p className="text-sm text-blue-800">{data.mission}</p>
                </div>
              )}
            </div>

            {/* Jobs */}
            {data.jobs?.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Outfit' }}>
                  Vacantes disponibles ({data.jobs.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.jobs.map(job => (
                    <JobCard key={job.id} job={{ ...job, company_name: data.name }} />
                  ))}
                </div>
              </div>
            )}

            {data.jobs?.length === 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
                <Briefcase size={32} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No hay vacantes disponibles en este momento</p>
                <Link to="/empleos" className="text-blue-600 text-sm hover:underline mt-2 block">Ver todas las vacantes</Link>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div>
            <div className="sticky top-24 space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-semibold text-gray-900 mb-4">Información</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <Building2 size={16} className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-400">Sector</p>
                      <p className="font-medium text-gray-800">{data.sector}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin size={16} className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-400">Ciudad</p>
                      <p className="font-medium text-gray-800">{data.city}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Briefcase size={16} className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-400">Vacantes activas</p>
                      <p className="font-medium text-emerald-600">{data.jobs?.length || 0} disponibles</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social links (demo) */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm">Redes sociales</h3>
                <div className="space-y-2">
                  {[
                    { icon: Globe, label: data.website || 'www.empresa.com', href: '#' },
                    { icon: Linkedin, label: `/${data.name?.toLowerCase().replace(/\s/g, '')}`, href: '#' },
                    { icon: Instagram, label: `@${data.name?.toLowerCase().replace(/\s/g, '')}`, href: '#' },
                  ].map(({ icon: Icon, label, href }) => (
                    <a key={label} href={href} className="flex items-center gap-3 text-sm text-gray-500 hover:text-blue-600 transition-colors">
                      <Icon size={15} className="text-gray-400" />
                      <span className="text-xs truncate">{label}</span>
                    </a>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-3 italic">* Redes de demostración</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
