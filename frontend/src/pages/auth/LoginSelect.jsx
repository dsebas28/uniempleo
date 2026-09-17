import { Link } from 'react-router-dom';
import {
  GraduationCap, Building2, ShieldCheck, ArrowRight,
  Search, Users, Sparkles
} from 'lucide-react';
import Logo from '../../components/Logo';

const PORTALS = [
  {
    to: '/login/estudiante',
    icon: GraduationCap,
    label: 'Estudiante',
    tagline: 'Encuentra tu primer empleo o práctica',
    points: ['Postula en segundos', 'Guarda tus vacantes favoritas', 'Prepárate para entrevistas'],
    iconBg: 'bg-brand-700',
    ring: 'hover:border-brand-300 dark:hover:border-brand-500 hover:shadow-brand-900/10',
    chip: 'bg-brand-50 dark:bg-brand-500/15 text-brand-800 dark:text-brand-200',
    icon2: Search,
  },
  {
    to: '/login/empresa',
    icon: Building2,
    label: 'Empresa',
    tagline: 'Encuentra el mejor talento universitario',
    points: ['Publica vacantes ilimitadas', 'Gestiona candidatos', 'Marca empleadora visible'],
    iconBg: 'bg-gradient-to-br from-slate-700 to-brand-900',
    ring: 'hover:border-violet-300 dark:hover:border-violet-500/60 hover:shadow-slate-900/10',
    chip: 'bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-slate-200',
    icon2: Users,
  },
];

export default function LoginSelect() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-brand-950 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden transition-colors duration-300">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-accent-500/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-4xl relative z-10">
        {/* Branding */}
        <div className="text-center mb-10">
          <Link to="/" className="flex items-center justify-center mb-6 group">
            <Logo size={44} className="group-hover:opacity-90 transition-opacity" />
          </Link>
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 shadow-sm text-xs font-semibold text-slate-500 dark:text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-accent-500" />
              Bienvenido de vuelta
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-brand-900 dark:text-white tracking-tight" style={{ fontFamily: 'Plus Jakarta Sans' }}>
            ¿Cómo quieres ingresar?
          </h1>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto">
            Elige tu portal para continuar con tu cuenta institucional o empresarial.
          </p>
        </div>

        {/* Portal cards */}
        <div className="grid sm:grid-cols-2 gap-5">
          {PORTALS.map((p) => (
            <Link
              key={p.to}
              to={p.to}
              className={`group relative bg-white dark:bg-white/5 rounded-3xl border border-slate-200 dark:border-white/10 p-7 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${p.ring}`}
            >
              <div className={`w-14 h-14 rounded-2xl ${p.iconBg} text-white flex items-center justify-center shadow-md mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <p.icon className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold text-brand-900 dark:text-white mb-1" style={{ fontFamily: 'Plus Jakarta Sans' }}>
                Soy {p.label}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">{p.tagline}</p>
              <ul className="space-y-2 mb-6">
                {p.points.map((pt) => (
                  <li key={pt} className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-500" />
                    {pt}
                  </li>
                ))}
              </ul>
              <div className={`inline-flex items-center gap-1.5 text-sm font-bold ${p.chip} px-4 py-2 rounded-xl group-hover:gap-2.5 transition-all`}>
                Ingresar como {p.label.toLowerCase()}
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>

        {/* Admin — subdued, restricted access */}
        <div className="mt-6 flex justify-center">
          <Link
            to="/login/admin"
            className="group inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-brand-900/5 dark:bg-white/5 hover:bg-brand-950 dark:hover:bg-white/15 border border-slate-200 dark:border-white/10 hover:border-brand-950 dark:hover:border-white/20 transition-all duration-300"
          >
            <ShieldCheck className="w-4 h-4 text-slate-500 dark:text-slate-300 group-hover:text-white transition-colors" />
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 group-hover:text-white transition-colors">
              Acceso de administrador
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
          </Link>
        </div>

        {/* Register link */}
        <div className="mt-10 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            ¿No tienes una cuenta aún?{' '}
            <Link to="/registro" className="text-brand-700 dark:text-brand-300 font-bold hover:text-brand-900 dark:hover:text-white hover:underline">
              Regístrate gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
