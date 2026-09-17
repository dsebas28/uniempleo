import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin, Clock, DollarSign, Briefcase, Award, Building2,
  Users, Calendar, ChevronLeft, Heart,
  CheckCircle, ArrowRight, Globe, Loader2
} from 'lucide-react';
import { jobsAPI, studentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';

function formatSalary(min, max) {
  if (!min && !max) return 'A convenir';
  const fmt = (v) => v >= 1_000_000 ? `$${(v/1_000_000).toFixed(1)}M` : `$${(v/1000).toFixed(0)}K`;
  if (min && max) return `${fmt(min)} – ${fmt(max)} / mes`;
  if (min) return `Desde ${fmt(min)} / mes`;
  return `Hasta ${fmt(max)} / mes`;
}

export default function JobDetail() {
  const { id } = useParams();
  const { isAuthenticated, isStudent } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [applied, setApplied] = useState(false);
  const [applyModal, setApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [hasResume, setHasResume] = useState(true);

  useEffect(() => {
    jobsAPI.getById(id).then(res => {
      setJob(res.data);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });

    if (isAuthenticated && isStudent) {
      studentAPI.getApplications().then(res => {
        const apps = res.data || [];
        setApplied(apps.some(a => a.job_id === parseInt(id)));
      }).catch(() => {});
      studentAPI.getSavedJobs().then(res => {
        const savedJobs = res.data || [];
        setSaved(savedJobs.some(sj => sj.id === parseInt(id)));
      }).catch(() => {});
      studentAPI.getProfile().then(res => {
        setHasResume(Boolean(res.data?.cv_pdf));
      }).catch(() => {});
    }
  }, [id, isAuthenticated, isStudent]);

  const handleSave = async () => {
    if (!isAuthenticated) { navigate('/login/estudiante'); return; }
    if (!isStudent) return;
    try {
      if (saved) {
        await studentAPI.unsaveJob(id);
        setSaved(false);
        toast.success('Eliminada de guardados');
      } else {
        await studentAPI.saveJob(id);
        setSaved(true);
        toast.success('Vacante guardada');
      }
    } catch { toast.error('Error'); }
  };

  const handleApply = async () => {
    if (!isAuthenticated) { navigate('/login/estudiante'); return; }
    if (!isStudent) { toast.error('Solo estudiantes pueden postularse'); return; }
    setApplyModal(true);
  };

  const confirmApply = async () => {
    setApplying(true);
    try {
      await studentAPI.apply(id, { coverLetter });
      setApplied(true);
      setApplyModal(false);
      setSuccessModal(true);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al postularse');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={40} className="text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Cargando vacante...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Briefcase size={48} className="text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Vacante no encontrada</h2>
          <Link to="/empleos" className="text-blue-600 hover:text-blue-700">Ver todas las vacantes</Link>
        </div>
      </div>
    );
  }

  const parseList = (str) => {
    if (!str) return [];
    return str.split('\n').filter(Boolean).map(s => s.replace(/^[-•]\s*/, '').trim()).filter(Boolean);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Back nav */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Link to="/empleos" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors">
            <ChevronLeft size={16} /> Volver a empleos
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job header card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
              <div className="flex items-start gap-5 mb-5">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-100 flex items-center justify-center text-blue-700 font-bold text-2xl flex-shrink-0">
                  {job.company_name?.charAt(0)?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl font-bold text-gray-900 mb-1" style={{ fontFamily: 'Outfit' }}>
                    {job.title}
                  </h1>
                  <p className="text-blue-700 font-semibold text-lg mb-3">{job.company_name}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${
                      job.modality === 'Remoto' ? 'bg-emerald-50 text-emerald-700' :
                      job.modality === 'Híbrido' ? 'bg-blue-50 text-blue-700' : 'bg-orange-50 text-orange-700'
                    }`}>
                      {job.modality}
                    </span>
                    <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700">
                      {job.contract_type}
                    </span>
                    {job.no_experience_ok && (
                      <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-green-50 text-green-700 flex items-center gap-1">
                        <Award size={11} /> Sin experiencia requerida
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Key details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="text-center">
                  <MapPin size={18} className="text-gray-400 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Ciudad</p>
                  <p className="text-sm font-semibold text-gray-800">{job.city}</p>
                </div>
                <div className="text-center">
                  <DollarSign size={18} className="text-gray-400 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Salario</p>
                  <p className="text-sm font-semibold text-gray-800">{formatSalary(job.salary_min, job.salary_max)}</p>
                </div>
                <div className="text-center">
                  <Users size={18} className="text-gray-400 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Postulantes</p>
                  <p className="text-sm font-semibold text-gray-800">{job.applicants_count || 0}</p>
                </div>
                <div className="text-center">
                  <Calendar size={18} className="text-gray-400 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Publicado</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {new Date(job.created_at).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            {job.description && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Descripción del cargo</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{job.description}</p>
              </div>
            )}

            {/* Responsibilities */}
            {job.responsibilities && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Responsabilidades</h2>
                <ul className="space-y-2.5">
                  {parseList(job.responsibilities).map((r, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements */}
            {job.requirements && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Requisitos</h2>
                <ul className="space-y-2.5">
                  {parseList(job.requirements).map((r, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Skills */}
            {job.skills && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Habilidades requeridas</h2>
                <div className="flex flex-wrap gap-2">
                  {parseList(job.skills).map((s, i) => (
                    <span key={i} className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Benefits */}
            {job.benefits && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Beneficios</h2>
                <ul className="space-y-2.5">
                  {parseList(job.benefits).map((b, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Company info */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Sobre la empresa</h2>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">
                  {job.company_name?.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{job.company_name}</p>
                  <p className="text-sm text-gray-500">{job.company_sector}</p>
                </div>
                <Link
                  to={`/empresas/${job.company_id}`}
                  className="ml-auto text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  Ver empresa <ArrowRight size={13} />
                </Link>
              </div>
              {job.company_description && (
                <p className="text-sm text-gray-600 leading-relaxed">{job.company_description}</p>
              )}
            </div>
          </div>

          {/* Right: Apply sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="text-center mb-5">
                  <p className="text-2xl font-bold text-gray-900">{formatSalary(job.salary_min, job.salary_max)}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Salario estimado</p>
                </div>

                {applied ? (
                  <div className="flex items-center gap-2 justify-center p-4 bg-emerald-50 rounded-xl text-emerald-700 font-semibold text-sm">
                    <CheckCircle size={18} /> ¡Ya te postulaste!
                  </div>
                ) : (
                  <button
                    onClick={handleApply}
                    className="w-full py-3.5 text-sm font-bold text-white rounded-xl btn-primary mb-3"
                  >
                    Postularme ahora
                  </button>
                )}

                {isStudent && !applied && (
                  <button
                    onClick={handleSave}
                    className={`w-full py-3 text-sm font-medium rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
                      saved
                        ? 'border-rose-200 text-rose-700 bg-rose-50'
                        : 'border-gray-200 text-gray-600 hover:border-rose-200 hover:text-rose-600 hover:bg-rose-50'
                    }`}
                  >
                    <Heart size={16} fill={saved ? 'currentColor' : 'none'} />
                    {saved ? 'En favoritos' : 'Guardar en favoritos'}
                  </button>
                )}

                {!isAuthenticated && (
                  <p className="text-center text-xs text-gray-400 mt-3">
                    <Link to="/login/estudiante" className="text-blue-600 hover:underline">Inicia sesión</Link> para postularte
                  </p>
                )}
              </div>

              {/* Job details */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-semibold text-gray-900 mb-4 text-sm">Detalles de la vacante</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Área</span>
                    <span className="font-medium text-gray-800">{job.area}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Modalidad</span>
                    <span className="font-medium text-gray-800">{job.modality}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Contrato</span>
                    <span className="font-medium text-gray-800">{job.contract_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Experiencia</span>
                    <span className="font-medium text-gray-800">
                      {job.experience_years === 0 ? 'Sin experiencia' : `${job.experience_years}+ años`}
                    </span>
                  </div>
                  {job.education_level && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Educación</span>
                      <span className="font-medium text-gray-800">{job.education_level}</span>
                    </div>
                  )}
                  {job.deadline && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Fecha límite</span>
                      <span className="font-medium text-red-600">
                        {new Date(job.deadline).toLocaleDateString('es-CO')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <Modal
        isOpen={applyModal}
        onClose={() => setApplyModal(false)}
        title="Postularme a esta vacante"
        size="md"
        footer={
          <>
            <button
              onClick={() => setApplyModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={confirmApply}
              disabled={applying}
              className="px-6 py-2 text-sm font-semibold text-white rounded-lg btn-primary flex items-center gap-2 disabled:opacity-70"
            >
              {applying ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
              {applying ? 'Enviando...' : 'Confirmar postulación'}
            </button>
          </>
        }
      >
        <div>
          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl mb-5">
            <div className="w-10 h-10 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold">
              {job?.company_name?.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">{job?.title}</p>
              <p className="text-xs text-blue-600">{job?.company_name}</p>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Carta de presentación <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <textarea
              rows={5}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Cuéntale a la empresa por qué eres el candidato ideal para este cargo..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 resize-none outline-none input-focus placeholder-gray-400"
            />
          </div>

          {hasResume ? (
            <div className="flex items-start gap-2 p-3 bg-emerald-50 rounded-xl text-xs text-emerald-700">
              <CheckCircle size={14} className="flex-shrink-0 mt-0.5" />
              <span>Tu hoja de vida en PDF se compartirá automáticamente con la empresa.</span>
            </div>
          ) : (
            <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-xl text-xs text-amber-700">
              <Award size={14} className="flex-shrink-0 mt-0.5" />
              <span>
                No has subido tu hoja de vida. <Link to="/perfil" className="font-semibold underline">Súbela en PDF</Link> para aumentar tus probabilidades de ser seleccionado.
              </span>
            </div>
          )}
        </div>
      </Modal>

      {/* Success Modal */}
      <Modal
        isOpen={successModal}
        onClose={() => setSuccessModal(false)}
        title="¡Postulación enviada!"
        size="sm"
        footer={
          <>
            <Link
              to="/postulaciones"
              className="px-5 py-2 text-sm font-semibold text-white rounded-lg btn-primary"
              onClick={() => setSuccessModal(false)}
            >
              Ver mis postulaciones
            </Link>
          </>
        }
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-emerald-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">¡Postulación enviada correctamente!</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            Tu postulación para <strong>{job?.title}</strong> en <strong>{job?.company_name}</strong> fue enviada. 
            Recibirás una notificación cuando la empresa revise tu perfil.
          </p>
        </div>
      </Modal>
    </div>
  );
}
