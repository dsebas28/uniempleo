import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Edit3, Download, Eye, Loader2, Plus, X, Save, Camera, UploadCloud, FileText, Trash2, CheckCircle2,
  GraduationCap, Pencil, Phone, Languages as LanguagesIcon, Plane, Car, Home, Check, MapPin, Briefcase
} from 'lucide-react';
import { studentAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { COLOMBIA_DEPARTMENTS, findDepartmentByCity } from '../../data/colombia';
import Badge, { LEVEL_VARIANT, AVAILABILITY_VARIANT, MODALITY_VARIANT } from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import ProgressBar from '../../components/ui/ProgressBar';
import Card, { CardHeader } from '../../components/ui/Card';
import toast from 'react-hot-toast';

const ENGLISH_LEVELS = ['Básico', 'Elemental', 'Intermedio', 'Intermedio alto', 'Avanzado', 'Nativo'];
const AVAILABILITIES = ['Inmediata', '15 días', '1 mes', '3 meses'];
const MODALITIES = ['Remoto', 'Híbrido', 'Presencial', 'Indiferente'];
const LANGUAGE_LEVELS = ['Básico', 'Intermedio', 'Avanzado', 'Nativo'];
const GENDERS = ['Masculino', 'Femenino', 'Otro', 'Prefiero no decir'];
const MARITAL_STATUSES = ['Soltero/a', 'Casado/a', 'Unión libre', 'Divorciado/a', 'Viudo/a'];
const EDUCATION_LEVELS = ['Bachillerato', 'Técnico', 'Tecnólogo', 'Profesional Universitario', 'Especialización', 'Maestría', 'Doctorado'];

function calculateAge(birthDate) {
  if (!birthDate) return null;
  const dob = new Date(birthDate);
  if (Number.isNaN(dob.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age;
}

function Modal({ title, onClose, onSubmit, submitting, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#111827] rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-white/10">
          <h3 className="font-bold text-slate-900 dark:text-white">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-600 dark:hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={onSubmit} className="px-6 py-5 space-y-4">
          {children}
          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white rounded-xl btn-primary disabled:opacity-70"
          >
            {submitting ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {submitting ? 'Guardando...' : 'Guardar'}
          </button>
        </form>
      </div>
    </div>
  );
}

const fieldCls = "w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-500/20 bg-slate-50 dark:bg-white/5 dark:text-white focus:bg-white dark:focus:bg-white/5 transition-all";
const labelCls = "block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5";
const cardCls = "bg-white dark:bg-white/[0.04] rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm p-6";

export default function StudentProfile() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({});
  const [skillInput, setSkillInput] = useState('');
  const [savingSkills, setSavingSkills] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const photoInputRef = useRef(null);

  const [eduModal, setEduModal] = useState(null); // null | 'new' | education object
  const [eduSaving, setEduSaving] = useState(false);
  const [expModal, setExpModal] = useState(null); // null | 'new' | experience object
  const [expSaving, setExpSaving] = useState(false);
  const [langModal, setLangModal] = useState(null); // null | 'new' | language object
  const [langSaving, setLangSaving] = useState(false);

  useEffect(() => {
    studentAPI.getProfile().then(res => {
      setProfile(res.data);
      setForm({
        fullName: res.data.full_name || '',
        university: res.data.university || '',
        career: res.data.career || '',
        semester: res.data.semester || 1,
        city: res.data.city || '',
        phone: res.data.phone || '',
        headline: res.data.headline || '',
        aboutMe: res.data.about_me || '',
        englishLevel: res.data.english_level || 'Básico',
        availability: res.data.availability || 'Inmediata',
        preferredModality: res.data.preferred_modality || 'Híbrido',
        availableTravel: !!res.data.available_travel,
        availableRelocate: !!res.data.available_relocate,
        hasVehicle: !!res.data.has_vehicle,
        birthDate: res.data.birth_date || '',
        gender: res.data.gender || '',
        nationality: res.data.nationality || '',
        maritalStatus: res.data.marital_status || '',
        documentId: res.data.document_id || '',
        address: res.data.address || '',
        department: res.data.department || findDepartmentByCity(res.data.city) || '',
        country: res.data.country || 'Colombia',
        educationLevel: res.data.education_level || '',
        interests: res.data.interests || '',
      });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await studentAPI.updateProfile(form);
      setProfile(res.data.profile);
      updateUser({ fullName: res.data.profile.full_name, profileCompletion: res.data.profile.profile_completion });
      setEditing(false);
      toast.success('Perfil actualizado');
    } catch {
      toast.error('Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  // ---- Foto de perfil ----
  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Solo se permiten imágenes JPG, PNG o WEBP');
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      toast.error('La imagen no debe superar los 3MB');
      return;
    }

    setUploadingPhoto(true);
    studentAPI.uploadPhoto(file).then(res => {
      setProfile(res.data.profile);
      toast.success('Foto de perfil actualizada');
    }).catch(err => {
      toast.error(err.response?.data?.error || 'Error al subir la imagen');
    }).finally(() => setUploadingPhoto(false));
  };

  const handlePhotoDelete = () => {
    studentAPI.deletePhoto().then(res => {
      setProfile(res.data.profile);
      toast.success('Foto de perfil eliminada');
    }).catch(() => toast.error('Error al eliminar la foto'));
  };

  const handleResumeSelect = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      toast.error('Solo se permiten archivos en formato PDF');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('El archivo no debe superar los 5MB');
      return;
    }

    setUploadingResume(true);
    setUploadProgress(0);
    studentAPI.uploadResume(file, (evt) => {
      if (evt.total) setUploadProgress(Math.round((evt.loaded / evt.total) * 100));
    }).then(res => {
      setProfile(res.data.profile);
      toast.success('Hoja de vida subida exitosamente');
    }).catch(err => {
      toast.error(err.response?.data?.error || 'Error al subir el archivo');
    }).finally(() => {
      setUploadingResume(false);
      setUploadProgress(0);
    });
  };

  const handleResumeDelete = () => {
    studentAPI.deleteResume().then(res => {
      setProfile(res.data.profile);
      toast.success('Hoja de vida eliminada');
    }).catch(() => toast.error('Error al eliminar el archivo'));
  };

  // ---- Habilidades ----
  const addSkill = async (e) => {
    e.preventDefault();
    const clean = skillInput.trim();
    if (!clean) return;
    const currentNames = (profile?.skills || []).map(s => s.name);
    if (currentNames.some(n => n.toLowerCase() === clean.toLowerCase())) {
      setSkillInput('');
      return;
    }
    setSavingSkills(true);
    try {
      const res = await studentAPI.updateProfile({ skills: [...currentNames, clean] });
      setProfile(res.data.profile);
      setSkillInput('');
    } catch {
      toast.error('No se pudo agregar la habilidad');
    } finally {
      setSavingSkills(false);
    }
  };

  const removeSkill = async (name) => {
    const currentNames = (profile?.skills || []).map(s => s.name).filter(n => n !== name);
    setSavingSkills(true);
    try {
      const res = await studentAPI.updateProfile({ skills: currentNames });
      setProfile(res.data.profile);
    } catch {
      toast.error('No se pudo eliminar la habilidad');
    } finally {
      setSavingSkills(false);
    }
  };

  // ---- Educación ----
  const handleEduSubmit = async (e) => {
    e.preventDefault();
    const f = e.target;
    const data = {
      institution: f.institution.value.trim(),
      degree: f.degree.value.trim(),
      field: f.field.value.trim(),
      startYear: f.startYear.value ? Number(f.startYear.value) : null,
      endYear: f.endYear.value ? Number(f.endYear.value) : null,
      current: f.current.checked,
    };
    if (!data.institution || !data.degree) { toast.error('Institución y título son obligatorios'); return; }
    setEduSaving(true);
    try {
      const isNew = eduModal === 'new';
      const res = isNew
        ? await studentAPI.addEducation(data)
        : await studentAPI.updateEducation(eduModal.id, data);
      setProfile(res.data.profile);
      setEduModal(null);
      toast.success(isNew ? 'Educación agregada' : 'Educación actualizada');
    } catch {
      toast.error('Error al guardar la educación');
    } finally {
      setEduSaving(false);
    }
  };

  const handleEduDelete = async (id) => {
    if (!confirm('¿Eliminar esta educación de tu perfil?')) return;
    try {
      const res = await studentAPI.deleteEducation(id);
      setProfile(res.data.profile);
      toast.success('Educación eliminada');
    } catch {
      toast.error('Error al eliminar');
    }
  };

  // ---- Experiencia ----
  const handleExpSubmit = async (e) => {
    e.preventDefault();
    const f = e.target;
    const data = {
      company: f.company.value.trim(),
      position: f.position.value.trim(),
      startDate: f.startDate.value,
      endDate: f.endDate.value,
      current: f.current.checked,
      description: f.description.value.trim(),
    };
    if (!data.company || !data.position || !data.startDate) { toast.error('Empresa, cargo y fecha de inicio son obligatorios'); return; }
    setExpSaving(true);
    try {
      const isNew = expModal === 'new';
      const res = isNew
        ? await studentAPI.addExperience(data)
        : await studentAPI.updateExperience(expModal.id, data);
      setProfile(res.data.profile);
      setExpModal(null);
      toast.success(isNew ? 'Experiencia agregada' : 'Experiencia actualizada');
    } catch {
      toast.error('Error al guardar la experiencia');
    } finally {
      setExpSaving(false);
    }
  };

  const handleExpDelete = async (id) => {
    if (!confirm('¿Eliminar esta experiencia de tu perfil?')) return;
    try {
      const res = await studentAPI.deleteExperience(id);
      setProfile(res.data.profile);
      toast.success('Experiencia eliminada');
    } catch {
      toast.error('Error al eliminar');
    }
  };

  // ---- Idiomas ----
  const handleLangSubmit = async (e) => {
    e.preventDefault();
    const f = e.target;
    const data = { language: f.language.value.trim(), level: f.level.value };
    if (!data.language) { toast.error('El idioma es obligatorio'); return; }
    setLangSaving(true);
    try {
      const isNew = langModal === 'new';
      const res = isNew
        ? await studentAPI.addLanguage(data)
        : await studentAPI.updateLanguage(langModal.id, data);
      setProfile(res.data.profile);
      setLangModal(null);
      toast.success(isNew ? 'Idioma agregado' : 'Idioma actualizado');
    } catch {
      toast.error('Error al guardar el idioma');
    } finally {
      setLangSaving(false);
    }
  };

  const handleLangDelete = async (id) => {
    if (!confirm('¿Eliminar este idioma de tu perfil?')) return;
    try {
      const res = await studentAPI.deleteLanguage(id);
      setProfile(res.data.profile);
      toast.success('Idioma eliminado');
    } catch {
      toast.error('Error al eliminar');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 size={32} className="text-brand-500 animate-spin" />
    </div>
  );

  const completion = profile?.profile_completion || 0;
  const citiesForDepartment = COLOMBIA_DEPARTMENTS.find(d => d.name === form.department)?.cities || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white" style={{ fontFamily: 'Plus Jakarta Sans' }}>Mi perfil</h1>
        <div className="flex gap-2">
          <Link to="/perfil/cv" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl btn-accent">
            <Download size={15} /> Descargar CV
          </Link>
          {!editing ? (
            <button onClick={() => setEditing(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-brand-700 dark:text-brand-300 border-2 border-brand-200 dark:border-brand-500/30 rounded-xl hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-colors">
              <Edit3 size={15} /> Editar
            </button>
          ) : (
            <>
              <button onClick={() => setEditing(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/15 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                <X size={15} /> Cancelar
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-xl btn-primary disabled:opacity-70">
                {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Profile card */}
      <div className="bg-white dark:bg-white/[0.04] rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm overflow-hidden">
        {/* Cover */}
        <div className="h-28 sm:h-32 bg-gradient-to-r from-brand-600 via-brand-700 to-accent-600 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.08]" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }} />
        </div>

        {/* Avatar + name — only the avatar overlaps the cover (its own negative margin);
            the name block stays in normal flow so it's never clipped by the card's overflow-hidden. */}
        <div className="px-6 sm:px-7 pb-7">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">
            <div className="relative flex-shrink-0 -mt-12">
              <input type="file" ref={photoInputRef} accept="image/jpeg,image/png,image/webp" onChange={handlePhotoSelect} className="hidden" />
              <div className="w-24 h-24 rounded-2xl border-4 border-white dark:border-[#111827] shadow-lg overflow-hidden bg-white dark:bg-[#111827]">
                {uploadingPhoto ? (
                  <div className="w-full h-full flex items-center justify-center bg-brand-50 dark:bg-brand-500/10">
                    <Loader2 size={22} className="animate-spin text-brand-600" />
                  </div>
                ) : (
                  <Avatar name={profile?.full_name || 'Estudiante'} src={profile?.profile_photo} size="xl" className="w-full h-full rounded-none" />
                )}
              </div>
              {editing && (
                <>
                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    disabled={uploadingPhoto}
                    title="Cambiar foto"
                    className="absolute -bottom-1.5 -right-1.5 w-8 h-8 bg-brand-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-brand-700 transition-colors cursor-pointer disabled:opacity-60"
                  >
                    <Camera size={14} />
                  </button>
                  {profile?.profile_photo && (
                    <button
                      type="button"
                      onClick={handlePhotoDelete}
                      title="Quitar foto"
                      className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-rose-600 transition-colors cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Name block sits BELOW the banner, never overlapping it */}
            <div className="flex-1 min-w-0 pt-1">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white truncate">{profile?.full_name}</h2>
              {profile?.headline && <p className="text-sm text-slate-600 dark:text-slate-300 mt-0.5">{profile.headline}</p>}
              <p className="text-brand-600 dark:text-brand-300 text-sm font-medium mt-1">{profile?.career} · {profile?.university}</p>
              <p className="text-slate-400 dark:text-slate-500 text-xs mt-1 flex items-center gap-1.5">
                <MapPin size={12} /> {profile?.city}{profile?.department ? `, ${profile.department}` : ''} · {profile?.semester}° semestre
              </p>
            </div>
          </div>

          {/* Profile completion */}
          <div className="mb-6 p-4 bg-slate-50 dark:bg-white/5 rounded-xl">
            <ProgressBar value={completion} label="Perfil completado" showValue />
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
              {completion < 50 ? 'Completa tu perfil para mejorar tus oportunidades.' :
               completion < 80 ? 'Buen progreso. Agrega más información para destacar.' :
               '¡Excelente! Tu perfil es muy completo.'}
            </p>
          </div>

          {/* Form / Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {editing ? (
              <>
                <div>
                  <label className={labelCls}>Nombre completo</label>
                  <input type="text" value={form.fullName} onChange={(e) => setForm(p => ({ ...p, fullName: e.target.value }))}
                    className={fieldCls} />
                </div>
                <div>
                  <label className={labelCls}>Título profesional</label>
                  <input type="text" value={form.headline} onChange={(e) => setForm(p => ({ ...p, headline: e.target.value }))}
                    placeholder="Ej. Estudiante de Ingeniería de Sistemas"
                    className={fieldCls} />
                </div>
                <div>
                  <label className={labelCls}>Departamento</label>
                  <select
                    value={form.department}
                    onChange={(e) => {
                      const dep = e.target.value;
                      const cities = COLOMBIA_DEPARTMENTS.find(d => d.name === dep)?.cities || [];
                      setForm(p => ({ ...p, department: dep, city: cities.includes(p.city) ? p.city : (cities[0] || '') }));
                    }}
                    className={fieldCls}
                  >
                    <option value="">Seleccionar</option>
                    {COLOMBIA_DEPARTMENTS.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Ciudad</label>
                  <select
                    value={form.city}
                    onChange={(e) => setForm(p => ({ ...p, city: e.target.value }))}
                    disabled={!form.department}
                    className={`${fieldCls} disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <option value="">{form.department ? 'Seleccionar' : 'Elige un departamento primero'}</option>
                    {citiesForDepartment.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Teléfono</label>
                  <input type="tel" value={form.phone} onChange={(e) => setForm(p => ({ ...p, phone: e.target.value }))}
                    placeholder="+57 300 000 0000"
                    className={fieldCls} />
                </div>
                <div>
                  <label className={labelCls}>Nivel de inglés</label>
                  <select value={form.englishLevel} onChange={(e) => setForm(p => ({ ...p, englishLevel: e.target.value }))}
                    className={fieldCls}>
                    {ENGLISH_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Disponibilidad</label>
                  <select value={form.availability} onChange={(e) => setForm(p => ({ ...p, availability: e.target.value }))}
                    className={fieldCls}>
                    {AVAILABILITIES.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Modalidad preferida</label>
                  <select value={form.preferredModality} onChange={(e) => setForm(p => ({ ...p, preferredModality: e.target.value }))}
                    className={fieldCls}>
                    {MODALITIES.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className={labelCls}>Sobre mí</label>
                  <textarea rows={4} value={form.aboutMe} onChange={(e) => setForm(p => ({ ...p, aboutMe: e.target.value }))}
                    placeholder="Describe tus objetivos profesionales, fortalezas y lo que buscas en un empleo..."
                    className={`${fieldCls} resize-none`} />
                </div>
                <div className="md:col-span-2">
                  <label className={labelCls} style={{ marginBottom: '0.5rem' }}>Desplazamiento y movilidad</label>
                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input type="checkbox" checked={form.availableTravel} onChange={(e) => setForm(p => ({ ...p, availableTravel: e.target.checked }))}
                        className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-brand-600 focus:ring-brand-500" />
                      <span className="text-sm text-slate-600 dark:text-slate-300">Disponibilidad para viajar</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input type="checkbox" checked={form.availableRelocate} onChange={(e) => setForm(p => ({ ...p, availableRelocate: e.target.checked }))}
                        className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-brand-600 focus:ring-brand-500" />
                      <span className="text-sm text-slate-600 dark:text-slate-300">Disponibilidad para cambiar de residencia</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input type="checkbox" checked={form.hasVehicle} onChange={(e) => setForm(p => ({ ...p, hasVehicle: e.target.checked }))}
                        className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-brand-600 focus:ring-brand-500" />
                      <span className="text-sm text-slate-600 dark:text-slate-300">Tengo vehículo propio</span>
                    </label>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Inglés</p>
                  <Badge variant={LEVEL_VARIANT[profile?.english_level] || 'neutral'}>{profile?.english_level || 'No especificado'}</Badge>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Disponibilidad</p>
                  <Badge variant={AVAILABILITY_VARIANT[profile?.availability] || 'neutral'}>{profile?.availability || 'No especificado'}</Badge>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Modalidad</p>
                  <Badge variant={MODALITY_VARIANT[profile?.preferred_modality] || 'neutral'}>{profile?.preferred_modality || 'No especificado'}</Badge>
                </div>
                {profile?.phone && (
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Teléfono</p>
                    <p className="text-sm text-slate-700 dark:text-slate-200 flex items-center gap-1.5"><Phone size={13} className="text-slate-400" /> {profile.phone}</p>
                  </div>
                )}
                {profile?.about_me && (
                  <div className="md:col-span-2">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Sobre mí</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{profile.about_me}</p>
                  </div>
                )}
                <div className="md:col-span-2">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Desplazamiento y movilidad</p>
                  <div className="space-y-1.5">
                    {[
                      { icon: Plane, ok: !!profile?.available_travel, label: 'disponibilidad para viajar' },
                      { icon: Home, ok: !!profile?.available_relocate, label: 'disponibilidad para cambiar de residencia' },
                      { icon: Car, ok: !!profile?.has_vehicle, label: 'vehículo propio' },
                    ].map((item, i) => (
                      <p key={i} className={`text-sm flex items-center gap-2 ${item.ok ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400 dark:text-slate-500'}`}>
                        {item.ok ? <Check size={14} className="text-accent-500 flex-shrink-0" /> : <X size={14} className="text-slate-300 dark:text-slate-600 flex-shrink-0" />}
                        <item.icon size={13} className="flex-shrink-0" />
                        {item.ok ? `Tengo ${item.label}` : `No tengo ${item.label}`}
                      </p>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Información personal + Habilidades/Idiomas — grid de 2 columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className={cardCls}>
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Información personal</h3>
        {editing ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelCls}>Fecha de nacimiento</label>
              <input type="date" value={form.birthDate} onChange={(e) => setForm(p => ({ ...p, birthDate: e.target.value }))}
                className={fieldCls} />
            </div>
            <div>
              <label className={labelCls}>Género</label>
              <select value={form.gender} onChange={(e) => setForm(p => ({ ...p, gender: e.target.value }))}
                className={fieldCls}>
                <option value="">Seleccionar</option>
                {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Estado civil</label>
              <select value={form.maritalStatus} onChange={(e) => setForm(p => ({ ...p, maritalStatus: e.target.value }))}
                className={fieldCls}>
                <option value="">Seleccionar</option>
                {MARITAL_STATUSES.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Nacionalidad</label>
              <input type="text" value={form.nationality} onChange={(e) => setForm(p => ({ ...p, nationality: e.target.value }))}
                placeholder="Ej. Colombiana"
                className={fieldCls} />
            </div>
            <div>
              <label className={labelCls}>Documento de identidad</label>
              <input type="text" value={form.documentId} onChange={(e) => setForm(p => ({ ...p, documentId: e.target.value }))}
                placeholder="Ej. 1.234.567.890"
                className={fieldCls} />
            </div>
            <div>
              <label className={labelCls}>Nivel educativo</label>
              <select value={form.educationLevel} onChange={(e) => setForm(p => ({ ...p, educationLevel: e.target.value }))}
                className={fieldCls}>
                <option value="">Seleccionar</option>
                {EDUCATION_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Dirección</label>
              <input type="text" value={form.address} onChange={(e) => setForm(p => ({ ...p, address: e.target.value }))}
                placeholder="Ej. Calle 10 #15-20"
                className={fieldCls} />
            </div>
            <div>
              <label className={labelCls}>País</label>
              <input type="text" value={form.country} onChange={(e) => setForm(p => ({ ...p, country: e.target.value }))}
                className={fieldCls} />
            </div>
            <div>
              <label className={labelCls}>Intereses</label>
              <input type="text" value={form.interests} onChange={(e) => setForm(p => ({ ...p, interests: e.target.value }))}
                placeholder="Ej. Tecnología, lectura"
                className={fieldCls} />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              ['Fecha de nacimiento', profile?.birth_date ? `${new Date(profile.birth_date).toLocaleDateString('es-CO')} (${calculateAge(profile.birth_date)} años)` : null],
              ['Género', profile?.gender],
              ['Estado civil', profile?.marital_status],
              ['Nacionalidad', profile?.nationality],
              ['Documento de identidad', profile?.document_id],
              ['Nivel educativo', profile?.education_level],
              ['Dirección', profile?.address],
              ['País', profile?.country],
              ['Intereses', profile?.interests],
            ].filter(([, value]) => value).map(([label, value]) => (
              <div key={label}>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">{label}</p>
                <p className="text-sm text-slate-700 dark:text-slate-200">{value}</p>
              </div>
            ))}
            {[profile?.birth_date, profile?.gender, profile?.marital_status, profile?.nationality, profile?.document_id, profile?.education_level, profile?.address, profile?.interests].every(v => !v) && (
              <p className="text-sm text-slate-400 sm:col-span-2">Aún no has agregado tu información personal.</p>
            )}
          </div>
        )}
      </div>

      {/* Skills */}
      <div className={cardCls}>
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Habilidades</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {(profile?.skills || []).map(skill => (
            <span key={skill.id || skill.name} className="flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 bg-brand-50 dark:bg-brand-500/15 text-brand-700 dark:text-brand-200 text-xs font-medium rounded-lg border border-brand-100 dark:border-brand-500/20">
              {skill.name}
              <button
                type="button"
                onClick={() => removeSkill(skill.name)}
                disabled={savingSkills}
                aria-label={`Eliminar habilidad ${skill.name}`}
                className="p-0.5 rounded hover:bg-brand-100 dark:hover:bg-brand-500/20 text-brand-400 hover:text-brand-700 dark:hover:text-white transition-colors cursor-pointer disabled:opacity-50"
              >
                <X size={12} />
              </button>
            </span>
          ))}
          {(profile?.skills || []).length === 0 && (
            <p className="text-sm text-slate-400">No has agregado habilidades aún.</p>
          )}
        </div>
        <form onSubmit={addSkill} className="flex gap-2">
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            placeholder="Ej. Excel, Photoshop, Python..."
            className={`flex-1 ${fieldCls}`}
          />
          <button
            type="submit"
            disabled={savingSkills || !skillInput.trim()}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-brand-800 dark:text-brand-200 bg-brand-50 dark:bg-brand-500/15 hover:bg-brand-100 dark:hover:bg-brand-500/25 rounded-lg transition-colors disabled:opacity-50 cursor-pointer flex-shrink-0"
          >
            {savingSkills ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Agregar
          </button>
        </form>
      </div>
      </div>

      {/* Idiomas + Educación — grid de 2 columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className={cardCls}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <LanguagesIcon size={16} className="text-slate-400" /> Idiomas
          </h3>
          <button onClick={() => setLangModal('new')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-brand-800 dark:text-brand-200 bg-brand-50 dark:bg-brand-500/15 hover:bg-brand-100 dark:hover:bg-brand-500/25 rounded-lg transition-colors cursor-pointer">
            <Plus size={14} /> Agregar
          </button>
        </div>
        {(profile?.languages || []).length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {profile.languages.map((lang) => (
              <div key={lang.id} className="group flex items-center gap-2 pl-3 pr-1.5 py-1.5 bg-slate-50 dark:bg-white/5 rounded-lg border border-slate-100 dark:border-white/10">
                <span className="text-sm text-slate-800 dark:text-slate-100 font-medium">{lang.language}</span>
                <span className="text-xs text-slate-400">· {lang.level}</span>
                <div className="hidden group-hover:flex items-center gap-0.5 ml-1">
                  <button onClick={() => setLangModal(lang)} aria-label="Editar" className="p-1 rounded-md text-slate-400 hover:bg-white dark:hover:bg-white/10 hover:text-brand-700 dark:hover:text-brand-300 transition-colors cursor-pointer">
                    <Pencil size={12} />
                  </button>
                  <button onClick={() => handleLangDelete(lang.id)} aria-label="Eliminar" className="p-1 rounded-md text-slate-400 hover:bg-white dark:hover:bg-white/10 hover:text-rose-600 transition-colors cursor-pointer">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400">No has agregado idiomas aún.</p>
        )}
      </div>

      {/* Education */}
      <div className={cardCls}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-900 dark:text-white">Educación</h3>
          <button onClick={() => setEduModal('new')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-brand-800 dark:text-brand-200 bg-brand-50 dark:bg-brand-500/15 hover:bg-brand-100 dark:hover:bg-brand-500/25 rounded-lg transition-colors cursor-pointer">
            <Plus size={14} /> Agregar
          </button>
        </div>
        {(profile?.educations || []).length > 0 ? (
          <div className="space-y-3">
            {profile.educations.map((edu) => (
              <div key={edu.id} className="group flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/5">
                <div className="w-9 h-9 rounded-xl bg-brand-100 dark:bg-brand-500/15 flex items-center justify-center flex-shrink-0">
                  <GraduationCap size={16} className="text-brand-600 dark:text-brand-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 dark:text-white text-sm">{edu.degree}{edu.field ? ` en ${edu.field}` : ''}</p>
                  <p className="text-xs text-brand-600 dark:text-brand-300">{edu.institution}</p>
                  {(edu.start_year || edu.end_year) && (
                    <p className="text-xs text-slate-400">{edu.start_year} — {edu.current ? 'Presente' : edu.end_year}</p>
                  )}
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button onClick={() => setEduModal(edu)} aria-label="Editar" className="p-1.5 rounded-lg text-slate-400 hover:bg-white dark:hover:bg-white/10 hover:text-brand-700 dark:hover:text-brand-300 transition-colors cursor-pointer">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => handleEduDelete(edu.id)} aria-label="Eliminar" className="p-1.5 rounded-lg text-slate-400 hover:bg-white dark:hover:bg-white/10 hover:text-rose-600 transition-colors cursor-pointer">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400">No has agregado información educativa.</p>
        )}
      </div>
      </div>

      {/* Experience */}
      <div className={cardCls}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2"><Briefcase size={16} className="text-slate-400" /> Experiencia laboral</h3>
          <button onClick={() => setExpModal('new')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-brand-800 dark:text-brand-200 bg-brand-50 dark:bg-brand-500/15 hover:bg-brand-100 dark:hover:bg-brand-500/25 rounded-lg transition-colors cursor-pointer">
            <Plus size={14} /> Agregar
          </button>
        </div>
        {(profile?.experiences || []).length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {profile.experiences.map((exp) => (
              <div key={exp.id} className="group flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/5">
                <div className="w-9 h-9 rounded-xl bg-accent-100 dark:bg-accent-500/15 flex items-center justify-center flex-shrink-0 text-accent-700 dark:text-accent-300 font-bold text-sm">
                  {exp.company?.charAt(0)?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 dark:text-white text-sm">{exp.position}</p>
                  <p className="text-xs text-accent-700 dark:text-accent-300">{exp.company}</p>
                  <p className="text-xs text-slate-400">{exp.start_date} — {exp.current ? 'Presente' : exp.end_date}</p>
                  {exp.description && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{exp.description}</p>}
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button onClick={() => setExpModal(exp)} aria-label="Editar" className="p-1.5 rounded-lg text-slate-400 hover:bg-white dark:hover:bg-white/10 hover:text-brand-700 dark:hover:text-brand-300 transition-colors cursor-pointer">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => handleExpDelete(exp.id)} aria-label="Eliminar" className="p-1.5 rounded-lg text-slate-400 hover:bg-white dark:hover:bg-white/10 hover:text-rose-600 transition-colors cursor-pointer">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400">No has agregado experiencia laboral. ¡No te preocupes, muchas vacantes son para personas sin experiencia!</p>
        )}
      </div>

      {/* Hoja de vida en PDF */}
      <div className="bg-gradient-to-r from-brand-600 to-accent-600 rounded-2xl p-6">
        <input
          type="file"
          ref={fileInputRef}
          accept="application/pdf,.pdf"
          onChange={handleResumeSelect}
          className="hidden"
        />

        {profile?.cv_pdf ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-white min-w-0">
              <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                <FileText size={20} />
              </div>
              <div className="min-w-0">
                <p className="font-semibold flex items-center gap-1.5">
                  Hoja de vida adjunta <CheckCircle2 size={15} className="text-emerald-300" />
                </p>
                <p className="text-sm text-brand-100 truncate">{profile.cv_original_name || 'curriculum.pdf'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <a
                href={profile.cv_pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 bg-white text-brand-700 font-semibold text-sm rounded-xl hover:bg-brand-50 transition-colors"
              >
                <Eye size={16} /> Ver PDF
              </a>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingResume}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/10 border border-white/30 text-white font-semibold text-sm rounded-xl hover:bg-white/20 transition-colors disabled:opacity-60"
              >
                {uploadingResume ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
                Reemplazar
              </button>
              <button
                onClick={handleResumeDelete}
                disabled={uploadingResume}
                title="Eliminar hoja de vida"
                className="flex items-center justify-center w-10 h-10 bg-white/10 border border-white/30 text-white rounded-xl hover:bg-red-500/30 transition-colors disabled:opacity-60"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-white">
              <h3 className="font-semibold mb-1">Sube tu hoja de vida en PDF</h3>
              <p className="text-sm text-brand-100">
                Adjúntala para que las empresas la revisen al postularte. Formato PDF, máximo 5MB.
              </p>
              {uploadingResume && (
                <div className="mt-2 h-1.5 w-48 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white transition-all" style={{ width: `${uploadProgress}%` }} />
                </div>
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingResume}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-brand-700 font-semibold text-sm rounded-xl hover:bg-brand-50 transition-colors flex-shrink-0 disabled:opacity-70"
            >
              {uploadingResume ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
              {uploadingResume ? `Subiendo... ${uploadProgress}%` : 'Subir CV (PDF)'}
            </button>
          </div>
        )}
      </div>

      {/* Education modal */}
      {eduModal && (
        <Modal
          title={eduModal === 'new' ? 'Agregar educación' : 'Editar educación'}
          onClose={() => setEduModal(null)}
          onSubmit={handleEduSubmit}
          submitting={eduSaving}
        >
          <div>
            <label className={labelCls}>Institución *</label>
            <input name="institution" defaultValue={eduModal === 'new' ? '' : eduModal.institution} className={fieldCls} placeholder="Ej. Universidad Nacional de Colombia" required />
          </div>
          <div>
            <label className={labelCls}>Título / Programa *</label>
            <input name="degree" defaultValue={eduModal === 'new' ? '' : eduModal.degree} className={fieldCls} placeholder="Ej. Ingeniería de Sistemas" required />
          </div>
          <div>
            <label className={labelCls}>Área de énfasis (opcional)</label>
            <input name="field" defaultValue={eduModal === 'new' ? '' : (eduModal.field || '')} className={fieldCls} placeholder="Ej. Desarrollo de software" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Año de inicio</label>
              <input name="startYear" type="number" min="1980" max="2100" defaultValue={eduModal === 'new' ? '' : (eduModal.start_year || '')} className={fieldCls} placeholder="2021" />
            </div>
            <div>
              <label className={labelCls}>Año de fin</label>
              <input name="endYear" type="number" min="1980" max="2100" defaultValue={eduModal === 'new' ? '' : (eduModal.end_year || '')} className={fieldCls} placeholder="2025" />
            </div>
          </div>
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input name="current" type="checkbox" defaultChecked={eduModal !== 'new' && !!eduModal.current} className="w-4 h-4 rounded border-slate-300 text-brand-700 focus:ring-brand-500" />
            <span className="text-sm text-slate-600">Actualmente estudiando aquí</span>
          </label>
        </Modal>
      )}

      {/* Experience modal */}
      {expModal && (
        <Modal
          title={expModal === 'new' ? 'Agregar experiencia' : 'Editar experiencia'}
          onClose={() => setExpModal(null)}
          onSubmit={handleExpSubmit}
          submitting={expSaving}
        >
          <div>
            <label className={labelCls}>Empresa *</label>
            <input name="company" defaultValue={expModal === 'new' ? '' : expModal.company} className={fieldCls} placeholder="Ej. TechCo SAS" required />
          </div>
          <div>
            <label className={labelCls}>Cargo *</label>
            <input name="position" defaultValue={expModal === 'new' ? '' : expModal.position} className={fieldCls} placeholder="Ej. Practicante de Desarrollo" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Fecha de inicio *</label>
              <input name="startDate" type="month" defaultValue={expModal === 'new' ? '' : (expModal.start_date || '')} className={fieldCls} required />
            </div>
            <div>
              <label className={labelCls}>Fecha de fin</label>
              <input name="endDate" type="month" defaultValue={expModal === 'new' ? '' : (expModal.end_date || '')} className={fieldCls} />
            </div>
          </div>
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input name="current" type="checkbox" defaultChecked={expModal !== 'new' && !!expModal.current} className="w-4 h-4 rounded border-slate-300 text-brand-700 focus:ring-brand-500" />
            <span className="text-sm text-slate-600">Trabajo actual</span>
          </label>
          <div>
            <label className={labelCls}>Descripción (opcional)</label>
            <textarea name="description" rows={3} defaultValue={expModal === 'new' ? '' : (expModal.description || '')} className={`${fieldCls} resize-none`} placeholder="Principales responsabilidades y logros..." />
          </div>
        </Modal>
      )}

      {/* Language modal */}
      {langModal && (
        <Modal
          title={langModal === 'new' ? 'Agregar idioma' : 'Editar idioma'}
          onClose={() => setLangModal(null)}
          onSubmit={handleLangSubmit}
          submitting={langSaving}
        >
          <div>
            <label className={labelCls}>Idioma *</label>
            <input name="language" defaultValue={langModal === 'new' ? '' : langModal.language} className={fieldCls} placeholder="Ej. Inglés" required />
          </div>
          <div>
            <label className={labelCls}>Nivel *</label>
            <select name="level" defaultValue={langModal === 'new' ? 'Intermedio' : langModal.level} className={fieldCls}>
              {LANGUAGE_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </Modal>
      )}
    </div>
  );
}
