import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShieldCheck, Mail, KeyRound, Eye, EyeOff, ArrowRight, ChevronLeft,
  Loader2, AlertCircle, GraduationCap, LockKeyhole
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/Logo';
import toast from 'react-hot-toast';

const REMEMBER_KEY = 'uniempleo_remember_admin_email';

export default function LoginAdmin() {
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
    if (!cleanEmail) newErrors.email = 'Ingresa tu correo';
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
      setServerError(result.error || 'Credenciales incorrectas.');
      toast.error(result.error || 'Error al iniciar sesión');
      return;
    }

    if (result.user.role !== 'admin') {
      logout();
      setServerError('Esta cuenta no tiene permisos de administrador.');
      return;
    }

    if (remember) localStorage.setItem(REMEMBER_KEY, email.trim());
    else localStorage.removeItem(REMEMBER_KEY);

    toast.success('Acceso concedido al panel de control');
    navigate(from && from !== '/login' ? from : '/admin', { replace: true });
  };

  const autofillDemo = () => {
    setEmail('admin@uniempleo.com');
    setPassword('admin1234');
    setErrors({});
    setServerError('');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Grid + glow background */}
      <div className="absolute inset-0 opacity-[0.06]" style={{
        backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-600/10 rounded-full blur-3xl" />
      <div className="absolute top-0 right-0 w-72 h-72 bg-accent-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-slate-600/10 rounded-full blur-3xl" />

      <div className="w-full max-w-sm relative z-10">
        <div className="flex items-center justify-between mb-6">
          <Link to="/"><Logo size={28} variant="light" /></Link>
          <Link to="/login" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-300 text-xs font-semibold transition-colors">
            <ChevronLeft className="w-3.5 h-3.5" /> Volver a portales
          </Link>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-7 sm:p-8 shadow-2xl shadow-black/40">
          {/* Header */}
          <div className="text-center mb-7">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-900 text-white flex items-center justify-center shadow-lg shadow-brand-900/40 mx-auto mb-4 ring-4 ring-brand-500/10">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight" style={{ fontFamily: 'Plus Jakarta Sans' }}>
              Panel de Control
            </h1>
            <p className="text-xs text-slate-400 mt-1.5 flex items-center justify-center gap-1.5">
              <LockKeyhole className="w-3 h-3" /> Acceso restringido a personal autorizado
            </p>
          </div>

          {serverError && (
            <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-start gap-2.5 text-rose-300 text-xs leading-relaxed">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <div>{serverError}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Correo administrativo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="admin@uniempleo.com"
                  value={email}
                  style={{ paddingLeft: '2.75rem' }}
                  onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors(p => ({ ...p, email: '' })); if (serverError) setServerError(''); }}
                  className={`w-full py-2.5 pr-4 text-sm rounded-xl border bg-slate-800/60 text-white placeholder:text-slate-500 transition-all ${
                    errors.email ? 'border-rose-500/50 focus:ring-4 focus:ring-rose-500/10' : 'border-slate-700 hover:border-slate-600 focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10'
                  }`}
                />
              </div>
              {errors.email && <p className="text-xs text-rose-400 mt-1.5 font-medium">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  style={{ paddingLeft: '2.75rem', paddingRight: '2.75rem' }}
                  onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors(p => ({ ...p, password: '' })); if (serverError) setServerError(''); }}
                  className={`w-full py-2.5 text-sm rounded-xl border bg-slate-800/60 text-white placeholder:text-slate-500 transition-all ${
                    errors.password ? 'border-rose-500/50 focus:ring-4 focus:ring-rose-500/10' : 'border-slate-700 hover:border-slate-600 focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10'
                  }`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 cursor-pointer">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-rose-400 mt-1.5 font-medium">{errors.password}</p>}
            </div>

            <label htmlFor="remember" className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                id="remember"
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 rounded border-slate-600 bg-slate-800/60 text-brand-500 focus:ring-2 focus:ring-brand-500/30 cursor-pointer"
              />
              <span className="text-xs font-medium text-slate-400">Recordar mi correo en este dispositivo</span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-brand-600 to-brand-900 hover:from-brand-500 hover:to-brand-800 active:scale-[0.99] text-white font-semibold text-sm rounded-xl shadow-lg shadow-brand-950/50 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Verificando...</> : <>Acceder al panel <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <button
            type="button"
            onClick={autofillDemo}
            className="w-full mt-4 py-2 rounded-xl text-xs font-semibold bg-slate-800/60 hover:bg-slate-800 text-slate-300 transition-colors border border-slate-700 cursor-pointer"
          >
            Usar cuenta de demostración
          </button>

          <div className="mt-6 pt-5 border-t border-slate-800 text-center">
            <p className="text-[11px] text-slate-500">
              Esta sesión queda registrada por motivos de seguridad.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mt-5 text-[11px] text-slate-500">
          <Link to="/login/estudiante" className="inline-flex items-center gap-1 hover:text-slate-300 font-medium transition-colors">
            <GraduationCap className="w-3 h-3" /> Portal estudiante
          </Link>
          <Link to="/login/empresa" className="inline-flex items-center gap-1 hover:text-slate-300 font-medium transition-colors">
            Portal empresa
          </Link>
        </div>
      </div>
    </div>
  );
}
