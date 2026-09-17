import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Building2, Mail, Lock, Eye, EyeOff, ArrowRight, ChevronLeft,
  Loader2, AlertCircle, TrendingUp, Users, Clock, BadgeCheck, ShieldCheck, GraduationCap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/Logo';
import toast from 'react-hot-toast';

const REMEMBER_KEY = 'uniempleo_remember_company_email';

export default function LoginCompany() {
  const { login, logout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname;

  const [email, setEmail] = useState(() => localStorage.getItem(REMEMBER_KEY) || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(() => !!localStorage.getItem(REMEMBER_KEY));
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const validateForm = () => {
    const newErrors = {};
    const cleanEmail = email.trim();
    if (!cleanEmail) newErrors.email = 'Ingresa el correo corporativo';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) newErrors.email = 'Correo inválido';
    if (!password) newErrors.password = 'Ingresa tu contraseña';
    else if (password.length < 6) newErrors.password = 'Mínimo 6 caracteres';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validateForm()) return;

    const result = await login(email.trim(), password);
    if (!result.success) {
      setServerError(result.error || 'Correo o contraseña incorrectos.');
      toast.error(result.error || 'Error al iniciar sesión');
      return;
    }

    if (result.user.role !== 'company') {
      logout();
      setServerError('Esta cuenta no es de empresa. Usa el portal correspondiente para ingresar.');
      return;
    }

    if (remember) localStorage.setItem(REMEMBER_KEY, email.trim());
    else localStorage.removeItem(REMEMBER_KEY);

    toast.success(`¡Bienvenido, ${result.user.profile?.name || result.user.profile?.companyName || result.user.email}!`);
    navigate(from && from !== '/login' ? from : '/empresa/dashboard', { replace: true });
  };

  const autofillDemo = () => {
    setEmail('empresa@demo.com');
    setPassword('demo1234');
    setErrors({});
    setServerError('');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-brand-950 flex flex-col lg:flex-row-reverse transition-colors duration-300">
      {/* Right brand panel — graphite + esmeralda, corporate */}
      <div className="hidden lg:flex lg:w-[46%] relative overflow-hidden bg-gradient-to-br from-slate-800 via-[#052e22] to-slate-950">
        <div className="absolute inset-0 opacity-[0.06]" style={{
          backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }} />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-accent-500/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -right-20 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <div className="flex items-center justify-between">
            <Link to="/" className="w-fit">
              <Logo size={30} variant="light" />
            </Link>
            <Link to="/login" className="inline-flex items-center gap-2 text-slate-300 hover:text-white text-sm font-semibold transition-colors w-fit">
              <ChevronLeft className="w-4 h-4" /> Volver a portales
            </Link>
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold mb-6">
              <Building2 className="w-3.5 h-3.5 text-accent-300" />
              Portal Empresa
            </div>
            <h1 className="text-4xl font-black tracking-tight leading-tight mb-4" style={{ fontFamily: 'Plus Jakarta Sans' }}>
              Contrata el mejor<br />talento universitario.
            </h1>
            <p className="text-slate-300 text-base max-w-sm leading-relaxed">
              Publica vacantes, gestiona candidatos y construye tu marca empleadora frente a miles de estudiantes activos.
            </p>

            <div className="space-y-3 mt-10 max-w-md">
              {[
                { icon: Users, label: 'Estudiantes activos buscando oportunidades' },
                { icon: TrendingUp, label: 'Vacantes publicadas cada mes' },
                { icon: Clock, label: 'Contratación promedio en 12 días' },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-3.5">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                    <s.icon className="w-4 h-4 text-accent-300" />
                  </div>
                  <p className="text-xs font-medium text-slate-200 leading-snug">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
            <BadgeCheck className="w-5 h-5 text-accent-300 flex-shrink-0" />
            <p className="text-xs text-slate-300 leading-relaxed">
              Empresas verificadas por nuestro equipo antes de publicar vacantes.
            </p>
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 relative">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center justify-between mb-6">
            <Link to="/"><Logo size={30} /></Link>
            <Link to="/login" className="inline-flex items-center gap-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 text-sm font-semibold transition-colors">
              <ChevronLeft className="w-4 h-4" /> Portales
            </Link>
          </div>

          <div className="mb-8">
            <div className="hidden lg:flex w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-700 to-accent-800 text-white items-center justify-center shadow-lg mb-5">
              <Building2 className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-brand-900 dark:text-white tracking-tight" style={{ fontFamily: 'Plus Jakarta Sans' }}>
              Inicia sesión como empresa
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Ingresa con el correo corporativo o de RRHH registrado.
            </p>
          </div>

          {serverError && (
            <div className="mb-5 p-3.5 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-2xl flex items-start gap-2.5 text-rose-800 dark:text-rose-300 text-xs leading-relaxed">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
              <div>{serverError}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Correo corporativo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="talento@empresa.com"
                  value={email}
                  style={{ paddingLeft: '2.75rem' }}
                  onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors(p => ({ ...p, email: '' })); if (serverError) setServerError(''); }}
                  className={`w-full py-2.5 pr-4 text-sm rounded-xl border transition-all ${
                    errors.email ? 'border-rose-400 bg-rose-50/40 focus:ring-4 focus:ring-rose-500/10' : 'border-slate-300 hover:border-slate-400 focus:border-accent-600 focus:ring-4 focus:ring-accent-500/10'
                  }`}
                />
              </div>
              {errors.email && <p className="text-xs text-rose-600 dark:text-rose-400 mt-1.5 font-medium">{errors.email}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Contraseña</label>
                <a href="#" className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-semibold hover:underline">¿Olvidaste tu contraseña?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  style={{ paddingLeft: '2.75rem', paddingRight: '2.75rem' }}
                  onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors(p => ({ ...p, password: '' })); if (serverError) setServerError(''); }}
                  className={`w-full py-2.5 text-sm rounded-xl border transition-all ${
                    errors.password ? 'border-rose-400 bg-rose-50/40 focus:ring-4 focus:ring-rose-500/10' : 'border-slate-300 hover:border-slate-400 focus:border-accent-600 focus:ring-4 focus:ring-accent-500/10'
                  }`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-rose-600 dark:text-rose-400 mt-1.5 font-medium">{errors.password}</p>}
            </div>

            <label htmlFor="remember" className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                id="remember"
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-accent-600 focus:ring-2 focus:ring-accent-500/30 cursor-pointer"
              />
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Recordar mi correo en este dispositivo</span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 text-sm font-bold rounded-xl btn-accent shadow-md flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Iniciando sesión...</> : <>Iniciar sesión <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <button
            type="button"
            onClick={autofillDemo}
            className="w-full mt-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition-colors border border-slate-200 dark:border-white/10 cursor-pointer"
          >
            Usar cuenta de demostración
          </button>

          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-white/10 text-center space-y-3">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              ¿Tu empresa aún no tiene cuenta?{' '}
              <Link to="/registro" className="text-slate-800 dark:text-white font-bold hover:underline">Regístrala gratis</Link>
            </p>
            <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 dark:text-slate-500">
              <Link to="/login/estudiante" className="inline-flex items-center gap-1 hover:text-brand-700 dark:hover:text-brand-300 font-medium transition-colors">
                <GraduationCap className="w-3 h-3" /> Soy estudiante
              </Link>
              <Link to="/login/admin" className="inline-flex items-center gap-1 hover:text-slate-700 dark:hover:text-slate-300 font-medium transition-colors">
                <ShieldCheck className="w-3 h-3" /> Soy administrador
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
