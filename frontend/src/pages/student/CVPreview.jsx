import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Printer, ChevronLeft, Mail, Phone, MapPin, Link2, Loader2 } from 'lucide-react';
import { studentAPI } from '../../services/api';
import Logo from '../../components/Logo';

function formatMonth(value) {
  if (!value) return '';
  const [y, m] = value.split('-');
  if (!m) return value;
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  return `${months[parseInt(m, 10) - 1] || m} ${y}`;
}

export default function CVPreview() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentAPI.getProfile().then(res => setProfile(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <Loader2 className="w-8 h-8 text-brand-700 animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 text-slate-500 text-sm">
        No se pudo cargar tu perfil.
      </div>
    );
  }

  const contactLinks = [
    profile.email && { icon: Mail, label: profile.email },
    profile.phone && { icon: Phone, label: profile.phone },
    profile.city && { icon: MapPin, label: profile.city },
    profile.linkedin && { icon: Link2, label: profile.linkedin },
    profile.github && { icon: Link2, label: profile.github },
    profile.portfolio && { icon: Link2, label: profile.portfolio },
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-slate-200 py-8 print:bg-white print:py-0">
      <style>{`
        @media print {
          @page { size: letter; margin: 1.4cm; }
          body { background: white; }
        }
      `}</style>

      {/* Toolbar — hidden when printing */}
      <div className="max-w-[850px] mx-auto mb-5 px-4 flex items-center justify-between print:hidden">
        <Link to="/perfil" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-brand-800 transition-colors">
          <ChevronLeft size={16} /> Volver al perfil
        </Link>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl btn-accent shadow-md"
        >
          <Printer size={16} /> Imprimir / Guardar como PDF
        </button>
      </div>

      {/* Resume sheet */}
      <div className="max-w-[850px] mx-auto bg-white shadow-xl print:shadow-none rounded-2xl print:rounded-none overflow-hidden">
        {/* Header */}
        <div className="hero-gradient px-10 py-8 text-white flex items-start justify-between gap-6">
          <div className="flex items-start gap-5">
            {profile.profile_photo && (
              <img
                src={profile.profile_photo}
                alt={profile.full_name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-white/30 flex-shrink-0"
              />
            )}
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight" style={{ fontFamily: 'Outfit' }}>
                {profile.full_name}
              </h1>
              {profile.headline && <p className="text-accent-300 text-sm font-semibold mt-0.5">{profile.headline}</p>}
              <p className="text-blue-100 text-base mt-1">
                {profile.career}{profile.university ? ` · ${profile.university}` : ''}
              </p>
              {profile.about_me && (
                <p className="text-blue-100/80 text-sm mt-3 max-w-xl leading-relaxed">{profile.about_me}</p>
              )}
            </div>
          </div>
          <Logo size={34} variant="light" />
        </div>

        {/* Contact strip */}
        {contactLinks.length > 0 && (
          <div className="flex flex-wrap gap-x-6 gap-y-2 px-10 py-4 bg-brand-50 border-b border-brand-100">
            {contactLinks.map((c, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs font-medium text-brand-800">
                <c.icon size={13} className="text-brand-500 flex-shrink-0" />
                {c.label}
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-3 gap-8 px-10 py-8">
          {/* Main column */}
          <div className="col-span-2 space-y-7">
            {/* Experience */}
            <section>
              <h2 className="text-xs font-bold text-brand-800 uppercase tracking-widest mb-3 pb-1.5 border-b-2 border-accent-400 w-fit">
                Experiencia laboral
              </h2>
              {(profile.experiences || []).length > 0 ? (
                <div className="space-y-4">
                  {profile.experiences.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex items-baseline justify-between gap-3">
                        <p className="font-bold text-slate-900 text-sm">{exp.position}</p>
                        <p className="text-[11px] text-slate-400 font-medium whitespace-nowrap">
                          {formatMonth(exp.start_date)} — {exp.current ? 'Presente' : formatMonth(exp.end_date)}
                        </p>
                      </div>
                      <p className="text-xs font-semibold text-brand-700">{exp.company}</p>
                      {exp.description && <p className="text-xs text-slate-500 mt-1 leading-relaxed">{exp.description}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">Sin experiencia laboral registrada — perfil abierto a primera oportunidad.</p>
              )}
            </section>

            {/* Education */}
            <section>
              <h2 className="text-xs font-bold text-brand-800 uppercase tracking-widest mb-3 pb-1.5 border-b-2 border-accent-400 w-fit">
                Educación
              </h2>
              {(profile.educations || []).length > 0 ? (
                <div className="space-y-4">
                  {profile.educations.map((edu) => (
                    <div key={edu.id}>
                      <div className="flex items-baseline justify-between gap-3">
                        <p className="font-bold text-slate-900 text-sm">{edu.degree}{edu.field ? ` en ${edu.field}` : ''}</p>
                        {(edu.start_year || edu.end_year) && (
                          <p className="text-[11px] text-slate-400 font-medium whitespace-nowrap">
                            {edu.start_year} — {edu.current ? 'Presente' : edu.end_year}
                          </p>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-brand-700">{edu.institution}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">
                  {profile.career} · {profile.university} {profile.semester ? `(${profile.semester}° semestre)` : ''}
                </p>
              )}
            </section>
          </div>

          {/* Side column */}
          <div className="space-y-7">
            <section>
              <h2 className="text-xs font-bold text-brand-800 uppercase tracking-widest mb-3 pb-1.5 border-b-2 border-accent-400 w-fit">
                Perfil
              </h2>
              <dl className="space-y-2.5 text-xs">
                <div>
                  <dt className="text-slate-400 font-medium">Nivel de inglés</dt>
                  <dd className="text-slate-800 font-semibold">{profile.english_level || 'No especificado'}</dd>
                </div>
                <div>
                  <dt className="text-slate-400 font-medium">Disponibilidad</dt>
                  <dd className="text-slate-800 font-semibold">{profile.availability || 'No especificado'}</dd>
                </div>
                <div>
                  <dt className="text-slate-400 font-medium">Modalidad preferida</dt>
                  <dd className="text-slate-800 font-semibold">{profile.preferred_modality || 'No especificado'}</dd>
                </div>
                {(profile.available_travel || profile.available_relocate || profile.has_vehicle) ? (
                  <div>
                    <dt className="text-slate-400 font-medium">Movilidad</dt>
                    <dd className="text-slate-800 font-semibold space-y-0.5 mt-0.5">
                      {!!profile.available_travel && <p>Disponible para viajar</p>}
                      {!!profile.available_relocate && <p>Disponible para reubicarse</p>}
                      {!!profile.has_vehicle && <p>Vehículo propio</p>}
                    </dd>
                  </div>
                ) : null}
              </dl>
            </section>

            {(profile.languages || []).length > 0 && (
              <section>
                <h2 className="text-xs font-bold text-brand-800 uppercase tracking-widest mb-3 pb-1.5 border-b-2 border-accent-400 w-fit">
                  Idiomas
                </h2>
                <dl className="space-y-1.5 text-xs">
                  {profile.languages.map((lang) => (
                    <div key={lang.id} className="flex items-baseline justify-between">
                      <dt className="text-slate-800 font-semibold">{lang.language}</dt>
                      <dd className="text-slate-400">{lang.level}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}

            <section>
              <h2 className="text-xs font-bold text-brand-800 uppercase tracking-widest mb-3 pb-1.5 border-b-2 border-accent-400 w-fit">
                Habilidades
              </h2>
              {(profile.skills || []).length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {profile.skills.map((s) => (
                    <span key={s.id || s.name || s} className="px-2 py-1 bg-brand-50 text-brand-800 text-[11px] font-semibold rounded-md">
                      {s.name || s}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">Sin habilidades registradas.</p>
              )}
            </section>
          </div>
        </div>
      </div>

      <p className="max-w-[850px] mx-auto px-4 mt-4 text-center text-[11px] text-slate-400 print:hidden">
        Generado automáticamente desde tu perfil de UniEmpleo. Actualiza tu perfil para mantener tu CV al día.
      </p>
    </div>
  );
}
