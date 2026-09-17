import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Mail, Lock, Eye, EyeOff, ArrowRight, ChevronLeft,
  Loader2, AlertCircle, Star, Building2, ShieldCheck, GraduationCap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Logo, { LogoMark } from '../../components/Logo';
import toast from 'react-hot-toast';

export default function LoginStudent() {
  const { login, logout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const validateForm = () => {
    const newErrors = {};
    const cleanEmail = email.trim();
    if (!cleanEmail) newErrors.email = 'Ingresa tu correo electrónico';
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

    if (result.user.role !== 'student') {
      logout();
      setServerError('Esta cuenta no es de estudiante. Usa el portal correspondiente para ingresar.');
      return;
    }

    toast.success(`¡Bienvenido de vuelta, ${result.user.profile?.fullName || result.user.email}!`);
    navigate(from && from !== '/login' ? from : '/dashboard', { replace: true });
  };

  const autofillDemo = () => {
    setEmail('estudiante@demo.com');
    setPassword('demo1234');
    setErrors({});
    setServerError('');
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-[46%] relative overflow-hidden hero-gradient">
        <div className="absolute inset-0 opacity-[0.07]" style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }} />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -left-20 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <div className="flex items-center justify-between">
            <Link to="/" className="w-fit">
              <Logo size={30} variant="light" />
            </Link>
            <Link to="/login" className="inline-flex items-center gap-2 text-blue-200 hover:text-white text-sm font-semibold transition-colors w-fit">
              <ChevronLeft className="w-4 h-4" /> Volver a portales
            </Link>
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold mb-6">
              <GraduationCap className="w-3.5 h-3.5 text-accent-400" />
              Portal Estudiante
            </div>
            <h1 className="text-4xl font-black tracking-tight leading-tight mb-4" style={{ fontFamily: 'Outfit' }}>
              Tu próxima oportunidad<br />empieza aquí.
            </h1>
            <p className="text-blue-100 text-base max-w-sm leading-relaxed">
              Postula a empleos y prácticas verificadas, guarda tus favoritos y prepárate con nuestras herramientas de entrevista.
            </p>

            <div className="grid grid-cols-3 gap-3 mt-10 max-w-md">
              {[
                { label: 'Vacantes activas', value: '30+' },
                { label: 'Empresas aliadas', value: '10+' },
                { label: 'Estudiantes', value: '20+' },
              ].map((s) => (
                <div key={s.label} className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-3.5">
                  <p className="text-xl font-black" style={{ fontFamily: 'Outfit' }}>{s.value}</p>
                  <p className="text-[11px] text-blue-200 font-medium mt-0.5 leading-tight">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
            <div className="flex -space-x-2">
              {['bg-accent-400', 'bg-rose-400', 'bg-emerald-400'].map((c, i) => (
                <div key={i} className={`w-8 h-8 rounded-full ${c} border-2 border-brand-900 flex items-center justify-center text-[10px] font-bold text-brand-900`}>
                  {['A', 'M', 'S'][i]}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1 text-xs">
              <Star className="w-3.5 h-3.5 fill-accent-300 text-accent-300" />
              <span className="font-semibold">4.9/5</span>
              <span className="text-blue-200">de estudiantes satisfechos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 relative">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center justify-between mb-6">
            <Link to="/"><Logo size={30} /></Link>
            <Link to="/login" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-600 text-sm font-semibold transition-colors">
              <ChevronLeft className="w-4 h-4" /> Portales
            </Link>
          </div>

          <div className="mb-8">
            <div className="hidden lg:block mb-5">
              <LogoMark size={48} />
            </div>
            <h2 className="text-2xl font-bold text-brand-900 tracking-tight" style={{ fontFamily: 'Outfit' }}>
              Inicia sesión como estudiante
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Usa tu correo institucional o personal registrado.
            </p>
          </div>

          {serverError && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-rose-800 text-xs leading-relaxed">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <div>{serverError}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Correo electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="sofia@universidad.edu.co"
                  value={email}
                  style={{ paddingLeft: '2.75rem' }}
                  onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors(p => ({ ...p, email: '' })); if (serverError) setServerError(''); }}
                  className={`w-full py-2.5 pr-4 text-sm rounded-xl border bg-white transition-all ${
                    errors.email ? 'border-rose-400 bg-rose-50/40 focus:ring-4 focus:ring-rose-500/10' : 'border-slate-300 hover:border-slate-400 focus:border-brand-700 focus:ring-4 focus:ring-brand-500/10'
                  }`}
                />
              </div>
              {errors.email && <p className="text-xs text-rose-600 mt-1.5 font-medium">{errors.email}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="text-xs font-bold text-slate-700 uppercase tracking-wider">Contraseña</label>
                <a href="#" className="text-xs text-brand-700 hover:text-brand-900 font-semibold hover:underline">¿Olvidaste tu contraseña?</a>
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
                  className={`w-full py-2.5 text-sm rounded-xl border bg-white transition-all ${
                    errors.password ? 'border-rose-400 bg-rose-50/40 focus:ring-4 focus:ring-rose-500/10' : 'border-slate-300 hover:border-slate-400 focus:border-brand-700 focus:ring-4 focus:ring-brand-500/10'
                  }`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-rose-600 mt-1.5 font-medium">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 text-white font-semibold text-sm rounded-xl btn-primary shadow-md flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Iniciando sesión...</> : <>Iniciar sesión <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <button
            type="button"
            onClick={autofillDemo}
            className="w-full mt-4 py-2 rounded-xl text-xs font-semibold bg-brand-50 hover:bg-brand-100 text-brand-800 transition-colors border border-brand-100 cursor-pointer"
          >
            Usar cuenta de demostración
          </button>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center space-y-3">
            <p className="text-xs text-slate-500">
              ¿No tienes una cuenta?{' '}
              <Link to="/registro" className="text-brand-700 font-bold hover:underline">Regístrate gratis</Link>
            </p>
            <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400">
              <Link to="/login/empresa" className="inline-flex items-center gap-1 hover:text-slate-700 font-medium transition-colors">
                <Building2 className="w-3 h-3" /> Soy empresa
              </Link>
              <Link to="/login/admin" className="inline-flex items-center gap-1 hover:text-slate-700 font-medium transition-colors">
                <ShieldCheck className="w-3 h-3" /> Soy administrador
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
