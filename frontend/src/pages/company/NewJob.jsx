import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Save, Info, DollarSign, MapPin, Briefcase, CheckCircle } from 'lucide-react';
import { companyAPI } from '../../services/api';
import { COLOMBIA_CITIES } from '../../data/colombia';
import toast from 'react-hot-toast';

const AREAS = ['Tecnología', 'Marketing', 'Diseño', 'Administración', 'Contabilidad', 'Recursos Humanos', 'Ingeniería', 'Salud', 'Educación', 'Legal', 'Ventas', 'Logística'];
const MODALITIES = ['Remoto', 'Híbrido', 'Presencial'];
const CONTRACT_TYPES = ['Tiempo completo', 'Medio tiempo', 'Prácticas', 'Freelance', 'Contrato de aprendizaje'];
const EDUCATION_LEVELS = ['Estudiante universitario', 'Técnico/Tecnólogo', 'Pregrado', 'Postgrado', 'Indiferente'];
const CITIES = COLOMBIA_CITIES;

const steps = ['Información básica', 'Descripción', 'Requisitos', 'Beneficios'];

const inputCls = "w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none input-focus bg-slate-50 focus:bg-white transition-colors";
const textareaCls = "w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none input-focus bg-slate-50 focus:bg-white resize-none transition-colors";

export default function NewJob() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '', area: '', modality: 'Remoto', contractType: 'Tiempo completo', city: 'Bogotá',
    salaryMin: '', salaryMax: '', experienceYears: 0, educationLevel: 'Estudiante universitario',
    noExperienceOk: true, isInternship: false,
    description: '', responsibilities: '', requirements: '', skills: '', benefits: '',
    deadline: '',
  });

  const update = (key, val) => setForm(p => ({ ...p, [key]: val }));

  const handleNext = () => {
    if (step === 0 && (!form.title || !form.area)) { toast.error('Completa el título y área'); return; }
    if (step === 1 && !form.description) { toast.error('Agrega una descripción'); return; }
    setStep(s => Math.min(s + 1, steps.length - 1));
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await companyAPI.createJob({
        title: form.title,
        area: form.area,
        modality: form.modality,
        contractType: form.contractType,
        city: form.city,
        salaryMin: form.salaryMin ? parseInt(form.salaryMin) : null,
        salaryMax: form.salaryMax ? parseInt(form.salaryMax) : null,
        experienceYears: parseInt(form.experienceYears),
        educationLevel: form.educationLevel,
        noExperienceOk: form.noExperienceOk,
        isInternship: form.isInternship,
        description: form.description,
        responsibilities: form.responsibilities,
        requirements: form.requirements,
        skills: form.skills,
        benefits: form.benefits,
        deadline: form.deadline || null,
      });
      toast.success('¡Vacante publicada exitosamente!');
      navigate('/empresa/vacantes');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al publicar vacante');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans' }}>Publicar nueva vacante</h1>
        <p className="text-slate-500 text-sm mt-1">Completa la información para atraer a los mejores candidatos.</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
              i < step ? 'bg-emerald-500 text-white' :
              i === step ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-500'
            }`}>
              {i < step ? <CheckCircle size={16} /> : i + 1}
            </div>
            <span className={`text-sm font-medium hidden sm:inline ${i === step ? 'text-brand-700' : 'text-slate-400'}`}>{s}</span>
            {i < steps.length - 1 && <div className={`flex-1 h-0.5 mx-2 ${i < step ? 'bg-emerald-300' : 'bg-slate-200'}`} />}
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-white/[0.04] rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm p-7">
        {/* Step 0: Basic info */}
        {step === 0 && (
          <div className="space-y-5">
            <h2 className="font-semibold text-slate-900 flex items-center gap-2"><Briefcase size={18} className="text-brand-500" /> Información básica</h2>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Título del cargo *</label>
              <input type="text" placeholder="Ej: Desarrollador Web Junior" value={form.title} onChange={(e) => update('title', e.target.value)} className={inputCls} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Área *</label>
                <select value={form.area} onChange={(e) => update('area', e.target.value)} className={inputCls}>
                  <option value="">Seleccionar área</option>
                  {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Ciudad *</label>
                <select value={form.city} onChange={(e) => update('city', e.target.value)} className={inputCls}>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Modalidad *</label>
                <div className="flex gap-2">
                  {MODALITIES.map(m => (
                    <button key={m} type="button" onClick={() => update('modality', m)}
                      className={`flex-1 py-2 text-xs font-semibold rounded-lg border-2 transition-all ${
                        form.modality === m ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-600 hover:border-brand-200'
                      }`}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Tipo de contrato *</label>
                <select value={form.contractType} onChange={(e) => update('contractType', e.target.value)} className={inputCls}>
                  {CONTRACT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            {/* Salary */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                <DollarSign size={14} className="inline" /> Rango salarial (COP/mes)
              </label>
              <div className="flex items-center gap-3">
                <input type="number" placeholder="Mínimo" value={form.salaryMin} onChange={(e) => update('salaryMin', e.target.value)} className={inputCls} />
                <span className="text-slate-400 font-medium">–</span>
                <input type="number" placeholder="Máximo" value={form.salaryMax} onChange={(e) => update('salaryMax', e.target.value)} className={inputCls} />
              </div>
              <p className="text-xs text-slate-400 mt-1">Deja vacío para "A convenir"</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Experiencia requerida (años)</label>
                <input type="number" min="0" max="10" value={form.experienceYears} onChange={(e) => update('experienceYears', e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Nivel educativo</label>
                <select value={form.educationLevel} onChange={(e) => update('educationLevel', e.target.value)} className={inputCls}>
                  {EDUCATION_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>

            {/* Toggles */}
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.noExperienceOk} onChange={(e) => update('noExperienceOk', e.target.checked)} className="accent-brand-600 w-4 h-4" />
                <span className="text-sm text-slate-700">Apto para personas sin experiencia</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isInternship} onChange={(e) => update('isInternship', e.target.checked)} className="accent-brand-600 w-4 h-4" />
                <span className="text-sm text-slate-700">Es práctica profesional</span>
              </label>
            </div>

            {form.deadline !== undefined && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Fecha límite de postulación (opcional)</label>
                <input type="date" value={form.deadline} onChange={(e) => update('deadline', e.target.value)} className={inputCls} />
              </div>
            )}
          </div>
        )}

        {/* Step 1: Description */}
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="font-semibold text-slate-900 flex items-center gap-2"><Info size={18} className="text-brand-500" /> Descripción del cargo</h2>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Descripción general *</label>
              <textarea rows={5} value={form.description} onChange={(e) => update('description', e.target.value)}
                placeholder="Describe en qué consiste el cargo, el contexto del equipo y el impacto del rol..."
                className={textareaCls} />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Responsabilidades</label>
              <textarea rows={4} value={form.responsibilities} onChange={(e) => update('responsibilities', e.target.value)}
                placeholder="- Desarrollar funcionalidades del producto&#10;- Participar en dailys&#10;- Documentar el código"
                className={textareaCls} />
              <p className="text-xs text-slate-400 mt-1">Separa cada responsabilidad con un salto de línea</p>
            </div>
          </div>
        )}

        {/* Step 2: Requirements */}
        {step === 2 && (
          <div className="space-y-5">
            <h2 className="font-semibold text-slate-900 flex items-center gap-2"><CheckCircle size={18} className="text-brand-500" /> Requisitos y habilidades</h2>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Requisitos</label>
              <textarea rows={4} value={form.requirements} onChange={(e) => update('requirements', e.target.value)}
                placeholder="- Estudiante de Ingeniería o carreras afines&#10;- Conocimiento básico de programación&#10;- Buena comunicación"
                className={textareaCls} />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Habilidades técnicas (tags)</label>
              <textarea rows={3} value={form.skills} onChange={(e) => update('skills', e.target.value)}
                placeholder="JavaScript&#10;React&#10;Node.js&#10;Git"
                className={textareaCls} />
              <p className="text-xs text-slate-400 mt-1">Una habilidad por línea</p>
            </div>
          </div>
        )}

        {/* Step 3: Benefits */}
        {step === 3 && (
          <div className="space-y-5">
            <h2 className="font-semibold text-slate-900">Beneficios y publicación</h2>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Beneficios</label>
              <textarea rows={4} value={form.benefits} onChange={(e) => update('benefits', e.target.value)}
                placeholder="- Trabajo remoto&#10;- Horario flexible&#10;- Día libre el cumpleaños&#10;- Certificado de prácticas"
                className={textareaCls} />
            </div>

            {/* Preview */}
            <div className="p-5 bg-brand-50 rounded-xl border border-brand-100">
              <h3 className="font-semibold text-brand-900 mb-3 text-sm">Resumen de tu vacante</h3>
              <div className="grid grid-cols-2 gap-2 text-xs text-brand-800">
                <p>🏷️ <strong>{form.title || 'Sin título'}</strong></p>
                <p>📍 {form.city} · {form.modality}</p>
                <p>💼 {form.contractType}</p>
                <p>🎓 {form.educationLevel}</p>
                {form.noExperienceOk && <p>✅ Sin experiencia requerida</p>}
                {form.isInternship && <p>🎓 Práctica profesional</p>}
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 justify-between mt-8 pt-5 border-t border-slate-100">
          <button
            disabled={step === 0}
            onClick={() => setStep(s => Math.max(0, s - 1))}
            className="px-5 py-2.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Atrás
          </button>
          {step < steps.length - 1 ? (
            <button onClick={handleNext} className="px-6 py-2.5 text-sm font-bold text-white rounded-xl btn-primary">
              Siguiente →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="px-6 py-2.5 text-sm font-bold text-white rounded-xl btn-primary flex items-center gap-2 disabled:opacity-70"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {saving ? 'Publicando...' : 'Publicar vacante'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
