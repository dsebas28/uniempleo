import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Users, Search, Filter, Eye, Download, Mail, Phone,
  GraduationCap, Calendar, CheckCircle2, XCircle, Clock,
  ChevronRight, ExternalLink, Loader2, Briefcase, Award,
  Sparkles, FileText, AlertCircle, Percent, MessageSquare, Send,
  Plane, Home, Car, Languages as LanguagesIcon
} from 'lucide-react';
import { companyAPI } from '../../services/api';
import EmptyState from '../../components/EmptyState';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = [
  { value: 'all', label: 'Todos los estados' },
  { value: 'sent', label: 'Postulado', color: 'bg-brand-50 text-brand-700 border-brand-200' },
  { value: 'reviewing', label: 'En Revisión', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { value: 'preselected', label: 'Preseleccionado', color: 'bg-brand-50 text-brand-700 border-brand-200' },
  { value: 'interview', label: 'Entrevista', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { value: 'selected', label: 'Seleccionado', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { value: 'rejected', label: 'No seleccionado', color: 'bg-rose-50 text-rose-700 border-rose-200' },
];

export default function Candidates() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedJobFromUrl = searchParams.get('jobId') || '';

  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [selectedJob, setSelectedJob] = useState(selectedJobFromUrl);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [pendingStatus, setPendingStatus] = useState('');
  const [messageDraft, setMessageDraft] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    loadJobsAndCandidates();
  }, [selectedJob]);

  useEffect(() => {
    setPendingStatus(selectedCandidate?.status || '');
    setMessageDraft('');
  }, [selectedCandidate?.id]);

  const loadJobsAndCandidates = async () => {
    try {
      setLoading(true);
      const [jobsRes, candidatesRes] = await Promise.all([
        companyAPI.getJobs(),
        companyAPI.getCandidates(selectedJob || undefined)
      ]);
      setJobs(Array.isArray(jobsRes.data) ? jobsRes.data : jobsRes.data?.data || []);
      setCandidates(Array.isArray(candidatesRes.data) ? candidatesRes.data : candidatesRes.data?.data || []);
    } catch (err) {
      console.error('Error al cargar candidatos:', err);
      toast.error('No se pudieron cargar los postulantes');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appId, newStatus, note = '') => {
    try {
      setIsUpdatingStatus(true);
      await companyAPI.updateCandidateStatus(appId, newStatus, note);
      toast.success('Estado del candidato actualizado y notificado');

      setCandidates(prev => prev.map(c => c.id === appId ? { ...c, status: newStatus } : c));
      if (selectedCandidate && selectedCandidate.id === appId) {
        setSelectedCandidate(prev => ({ ...prev, status: newStatus }));
      }
      setMessageDraft('');
    } catch (err) {
      console.error(err);
      toast.error('Error al actualizar el estado');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleSendMessage = async () => {
    if (!messageDraft.trim() || !selectedCandidate) return;
    try {
      setSendingMessage(true);
      await companyAPI.sendCandidateMessage(selectedCandidate.id, messageDraft.trim());
      toast.success('Mensaje enviado al candidato');
      setMessageDraft('');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Error al enviar el mensaje');
    } finally {
      setSendingMessage(false);
    }
  };

  const filteredCandidates = candidates.filter(cand => {
    const matchesStatus = statusFilter === 'all' || cand.status === statusFilter;
    const studentName = (cand.full_name || '').toLowerCase();
    const career = (cand.career || '').toLowerCase();
    const university = (cand.university || '').toLowerCase();
    const query = searchQuery.toLowerCase();

    const matchesSearch = !query || 
      studentName.includes(query) || 
      career.includes(query) || 
      university.includes(query);

    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'sent':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200"><Clock className="w-3 h-3" /> Postulado</span>;
      case 'reviewing':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200"><Eye className="w-3 h-3" /> En Revisión</span>;
      case 'preselected':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200"><Sparkles className="w-3 h-3" /> Preseleccionado</span>;
      case 'interview':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200"><Calendar className="w-3 h-3" /> Entrevista</span>;
      case 'selected':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"><CheckCircle2 className="w-3 h-3" /> Seleccionado</span>;
      case 'rejected':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200"><XCircle className="w-3 h-3" /> No Seleccionado</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Users className="w-7 h-7 text-brand-600" />
            Gestión de Candidatos y Postulantes
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Revisa el talento universitario postulado, analiza su afinidad y gestiona las etapas del proceso.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/empresa/vacantes/nueva"
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-xl shadow-sm transition-all"
          >
            <Briefcase className="w-4 h-4" />
            Publicar Nueva Vacante
          </Link>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="flex-1 flex flex-col sm:flex-row gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, carrera o universidad..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
          </div>

          {/* Job Filter */}
          <div className="sm:w-64">
            <select
              value={selectedJob}
              onChange={(e) => {
                setSelectedJob(e.target.value);
                setSearchParams(e.target.value ? { jobId: e.target.value } : {});
              }}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-medium text-slate-700"
            >
              <option value="">Todas las vacantes activas ({jobs.length})</option>
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {STATUS_OPTIONS.map((st) => (
            <button
              key={st.value}
              onClick={() => setStatusFilter(st.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === st.value
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Candidates Table or Empty State */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 text-brand-600 animate-spin mb-3" />
          <p className="text-sm text-slate-500 font-medium">Cargando postulaciones y perfiles de candidatos...</p>
        </div>
      ) : filteredCandidates.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No se encontraron postulantes"
          description="Aún no hay candidatos con los filtros seleccionados o para esta vacante."
          actionText={selectedJob ? "Ver todas las vacantes" : undefined}
          onAction={selectedJob ? () => setSelectedJob('') : undefined}
        />
      ) : (
        <div className="bg-white dark:bg-white/[0.04] rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Estudiante</th>
                  <th className="py-3.5 px-4">Vacante</th>
                  <th className="py-3.5 px-4">Universidad & Carrera</th>
                  <th className="py-3.5 px-4 text-center">Match</th>
                  <th className="py-3.5 px-4">Estado</th>
                  <th className="py-3.5 px-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredCandidates.map((c) => {
                  const initials = c.full_name
                    ? c.full_name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
                    : 'EU';

                  return (
                    <tr key={c.id} className="hover:bg-slate-50/70 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-500 to-brand-700 text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs flex-shrink-0">
                            {initials}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                              {c.full_name}
                              {c.profile_completion && (
                                <span className="text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded">
                                  {c.profile_completion}% perfil
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3 text-slate-400" />
                              {c.email || 'correo@universidad.edu'}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="font-medium text-slate-800 line-clamp-1">
                          {c.job_title || 'Vacante'}
                        </div>
                        <div className="text-xs text-slate-400">
                          {c.applied_at ? new Date(c.applied_at).toLocaleDateString('es-CO') : ''}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="text-slate-700 font-medium text-xs flex items-center gap-1">
                          <GraduationCap className="w-3.5 h-3.5 text-brand-500 flex-shrink-0" />
                          <span className="line-clamp-1">{c.career || 'Carrera universitaria'}</span>
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                          {c.university || 'Universidad'}
                        </div>
                      </td>

                      <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200">
                          <Percent className="w-3 h-3 mr-0.5" />
                          {c.matchPercentage || 85}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        {getStatusBadge(c.status)}
                      </td>

                      <td className="py-4 px-6 text-right">
                        {c.cv_pdf && (
                          <a
                            href={c.cv_pdf}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            title="Descargar hoja de vida en PDF"
                            className="inline-flex items-center gap-1 px-3 py-1.5 mr-1.5 rounded-lg text-xs font-medium bg-brand-50 text-brand-700 hover:bg-brand-100 transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" />
                            CV
                          </a>
                        )}
                        <button
                          onClick={() => setSelectedCandidate(c)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 hover:bg-brand-50 hover:text-brand-600 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Ver Perfil
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Candidate Detail Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-500 to-brand-700 text-white flex items-center justify-center font-bold text-lg overflow-hidden flex-shrink-0">
                  {selectedCandidate.profile_photo ? (
                    <img src={selectedCandidate.profile_photo} alt={selectedCandidate.full_name} className="w-full h-full object-cover" />
                  ) : (
                    selectedCandidate.full_name?.[0] || 'U'
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {selectedCandidate.full_name}
                  </h3>
                  {selectedCandidate.headline && (
                    <p className="text-xs text-slate-600">{selectedCandidate.headline}</p>
                  )}
                  <p className="text-xs text-slate-500">
                    Postulado a: <span className="font-semibold text-slate-700">{selectedCandidate.job_title}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {selectedCandidate.cv_pdf ? (
                  <a
                    href={selectedCandidate.cv_pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-brand-600 text-white hover:bg-brand-700 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Descargar CV
                  </a>
                ) : (
                  <span className="text-[11px] text-slate-400 italic">Sin hoja de vida adjunta</span>
                )}
                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Status Selector Bar */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Estado actual de la postulación</div>
                    <div className="mt-1">{getStatusBadge(selectedCandidate.status)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      disabled={isUpdatingStatus}
                      value={pendingStatus}
                      onChange={(e) => setPendingStatus(e.target.value)}
                      className="text-xs font-semibold px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    >
                      <option value="sent">Marcar como Postulado (Enviado)</option>
                      <option value="reviewing">Marcar En Revisión</option>
                      <option value="preselected">Preseleccionar Candidato</option>
                      <option value="interview">Convocar a Entrevista</option>
                      <option value="selected">Seleccionar / Contratar</option>
                      <option value="rejected">Rechazar Candidatura</option>
                    </select>
                    <button
                      onClick={() => handleStatusChange(selectedCandidate.id, pendingStatus, messageDraft)}
                      disabled={isUpdatingStatus || pendingStatus === selectedCandidate.status}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-brand-600 text-white hover:bg-brand-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {isUpdatingStatus ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                      Actualizar estado
                    </button>
                  </div>
                </div>

                {/* Message to candidate */}
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                    <MessageSquare className="w-3.5 h-3.5" /> Comunicarte con el candidato
                  </label>
                  <textarea
                    rows={2}
                    value={messageDraft}
                    onChange={(e) => setMessageDraft(e.target.value)}
                    placeholder="Ej. Te esperamos el lunes 14 a las 3pm por videollamada, revisa tu correo para el enlace..."
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 resize-none"
                  />
                  <div className="flex items-center justify-between mt-1.5">
                    <p className="text-[11px] text-slate-400">
                      Si cambias el estado con un mensaje escrito, se incluye en la notificación. También puedes enviarlo solo, sin cambiar el estado.
                    </p>
                    <button
                      onClick={handleSendMessage}
                      disabled={sendingMessage || !messageDraft.trim()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 ml-3"
                    >
                      {sendingMessage ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                      Enviar mensaje
                    </button>
                  </div>
                </div>
              </div>

              {/* Academic & General Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                  <div className="text-xs text-slate-400 font-medium">Universidad</div>
                  <div className="text-sm font-semibold text-slate-800 mt-1">
                    {selectedCandidate.university || 'No especificada'}
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                  <div className="text-xs text-slate-400 font-medium">Carrera / Área de Estudio</div>
                  <div className="text-sm font-semibold text-slate-800 mt-1">
                    {selectedCandidate.career || 'No especificada'}
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                  <div className="text-xs text-slate-400 font-medium">Nivel de Inglés</div>
                  <div className="text-sm font-semibold text-slate-800 mt-1">
                    {selectedCandidate.english_level || 'Intermedio (B1/B2)'}
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                  <div className="text-xs text-slate-400 font-medium">Ciudad de Residencia</div>
                  <div className="text-sm font-semibold text-slate-800 mt-1">
                    {selectedCandidate.student_city || 'Colombia'}
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Información de Contacto</h4>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {selectedCandidate.email || 'correo@universidad.edu'}
                  </div>
                  {selectedCandidate.phone && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {selectedCandidate.phone}
                    </div>
                  )}
                  <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Fecha de Postulación: {selectedCandidate.applied_at ? new Date(selectedCandidate.applied_at).toLocaleDateString('es-CO') : 'Reciente'}
                  </div>
                </div>
              </div>

              {/* Personal info */}
              {(() => {
                const personalFields = [
                  ['Fecha de nacimiento', selectedCandidate.birth_date ? new Date(selectedCandidate.birth_date).toLocaleDateString('es-CO') : null],
                  ['Género', selectedCandidate.gender],
                  ['Estado civil', selectedCandidate.marital_status],
                  ['Nacionalidad', selectedCandidate.nationality],
                  ['Documento de identidad', selectedCandidate.document_id],
                  ['Dirección', selectedCandidate.address],
                  ['Departamento', selectedCandidate.department],
                  ['País', selectedCandidate.country],
                  ['Intereses', selectedCandidate.interests],
                ].filter(([, v]) => v);
                if (personalFields.length === 0) return null;
                return (
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Información personal</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {personalFields.map(([label, value]) => (
                        <div key={label} className="p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                          <div className="text-xs text-slate-400 font-medium">{label}</div>
                          <div className="text-sm font-semibold text-slate-800 mt-0.5">{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* About */}
              {selectedCandidate.about_me && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Sobre el candidato</h4>
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 border border-slate-200 rounded-xl p-3">
                    {selectedCandidate.about_me}
                  </p>
                </div>
              )}

              {/* Mobility */}
              {(selectedCandidate.available_travel || selectedCandidate.available_relocate || selectedCandidate.has_vehicle) ? (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Desplazamiento y movilidad</h4>
                  <div className="flex flex-wrap gap-2">
                    {!!selectedCandidate.available_travel && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg text-xs font-medium">
                        <Plane className="w-3.5 h-3.5" /> Disponible para viajar
                      </span>
                    )}
                    {!!selectedCandidate.available_relocate && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg text-xs font-medium">
                        <Home className="w-3.5 h-3.5" /> Disponible para reubicarse
                      </span>
                    )}
                    {!!selectedCandidate.has_vehicle && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg text-xs font-medium">
                        <Car className="w-3.5 h-3.5" /> Vehículo propio
                      </span>
                    )}
                  </div>
                </div>
              ) : null}

              {/* Education */}
              {selectedCandidate.educations && selectedCandidate.educations.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Educación</h4>
                  <div className="space-y-2">
                    {selectedCandidate.educations.map((edu) => (
                      <div key={edu.id} className="flex items-start gap-2.5 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                        <GraduationCap className="w-4 h-4 text-brand-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-slate-800">{edu.degree}{edu.field ? ` en ${edu.field}` : ''}</p>
                          <p className="text-xs text-slate-500">{edu.institution}</p>
                          {(edu.start_year || edu.end_year) && (
                            <p className="text-[11px] text-slate-400">{edu.start_year} — {edu.current ? 'Presente' : edu.end_year}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience */}
              {selectedCandidate.experiences && selectedCandidate.experiences.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Experiencia laboral</h4>
                  <div className="space-y-2">
                    {selectedCandidate.experiences.map((exp) => (
                      <div key={exp.id} className="flex items-start gap-2.5 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                        <Briefcase className="w-4 h-4 text-brand-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-slate-800">{exp.position}</p>
                          <p className="text-xs text-slate-500">{exp.company}</p>
                          <p className="text-[11px] text-slate-400">{exp.start_date} — {exp.current ? 'Presente' : exp.end_date}</p>
                          {exp.description && <p className="text-xs text-slate-500 mt-1">{exp.description}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Languages */}
              {selectedCandidate.languages && selectedCandidate.languages.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <LanguagesIcon className="w-3.5 h-3.5" /> Idiomas
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCandidate.languages.map((lang) => (
                      <span key={lang.id} className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700">
                        <span className="font-medium">{lang.language}</span> · {lang.level}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              {selectedCandidate.skills && selectedCandidate.skills.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Competencias y Habilidades</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCandidate.skills.map((sk, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-brand-50 text-brand-700 border border-brand-100 rounded-lg text-xs font-medium">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Cover Letter / Presentation */}
              {selectedCandidate.cover_letter && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Carta de Motivación / Presentación</h4>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs leading-relaxed text-slate-700">
                    {selectedCandidate.cover_letter}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3 rounded-b-3xl">
              <button
                onClick={() => setSelectedCandidate(null)}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-100 transition-colors"
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
