import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, useAnimation, useReducedMotion, AnimatePresence } from 'framer-motion';
import {
  Eye, EyeOff, ArrowRight, ChevronLeft,
  Loader2, AlertCircle, Star, GraduationCap, Check, Mail, Lock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Logo, { LogoMark } from '../../components/Logo';
import FloatingInput from '../../components/ui/FloatingInput';
import { StaggerContainer, FadeIn } from '../../components/animations';
import RoleTabSwitcher from './RoleTabSwitcher';
import toast from 'react-hot-toast';

const REMEMBER_KEY = 'uniempleo_remember_student_email';

export default function LoginStudent() {
  const { login, logout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname;
  const reduceMotion = useReducedMotion();
  const shakeControls = useAnimation();

  const [email, setEmail] = useState(() => localStorage.getItem(REMEMBER_KEY) || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(() => !!localStorage.getItem(REMEMBER_KEY));
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);

  const triggerShake = () => {
    if (reduceMotion) return;
    shakeControls.start({ x: [0, -10, 10, -8, 8, -4, 4, 0], transition: { duration: 0.5, ease: 'easeInOut' } });
  };

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
    if (!validateForm()) { triggerShake(); return; }

    const result = await login(email.trim(), password);
    if (!result.success) {
      setServerError(result.error || 'Correo o contraseña incorrectos.');
      toast.error(result.error || 'Error al iniciar sesión');
      triggerShake();
      return;
    }

    if (result.user.role !== 'student') {
      logout();
      setServerError('Esta cuenta no es de estudiante. Usa el portal correspondiente para ingresar.');
      triggerShake();
      return;
    }

    if (remember) localStorage.setItem(REMEMBER_KEY, email.trim());
    else localStorage.removeItem(REMEMBER_KEY);

    setSuccess(true);
    toast.success(`¡Bienvenido de vuelta, ${result.user.profile?.fullName || result.user.email}!`);
    setTimeout(() => {
      navigate(from && from !== '/login' ? from : '/dashboard', { replace: true });
    }, 550);
  };

  const autofillDemo = () => {
    setEmail('estudiante@demo.com');
    setPassword('demo1234');
    setErrors({});
    setServerError('');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-brand-950 flex transition-colors duration-300">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-[46%] relative overflow-hidden hero-gradient">
        <div className="absolute inset-0 opacity-[0.07]" style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }} />
        <motion.div
          className="absolute -top-24 -right-24 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl"
          animate={reduceMotion ? {} : { scale: [1, 1.15, 1], opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-0 -left-20 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl"
          animate={reduceMotion ? {} : { scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />

        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <div className="flex items-center justify-between gap-3">
            <Link to="/" className="w-fit">
              <Logo size={30} variant="light" />
            </Link>
            <RoleTabSwitcher active="student" variant="dark" />
          </div>

          <FadeIn direction="up" trigger="mount">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold mb-6">
              <GraduationCap className="w-3.5 h-3.5 text-accent-400" />
              Portal Estudiante
            </div>
            <h1 className="text-4xl font-black tracking-tight leading-tight mb-4" style={{ fontFamily: 'Plus Jakarta Sans' }}>
              Tu próxima oportunidad<br />empieza aquí.
            </h1>
            <p className="text-brand-100 text-base max-w-sm leading-relaxed">
              Postula a empleos y prácticas verificadas, guarda tus favoritos y prepárate con nuestras herramientas de entrevista.
            </p>

            <div className="grid grid-cols-3 gap-3 mt-10 max-w-md">
              {[
                { label: 'Vacantes activas', value: '30+' },
                { label: 'Empresas aliadas', value: '10+' },
                { label: 'Estudiantes', value: '20+' },
              ].map((s) => (
                <div key={s.label} className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-3.5">
                  <p className="text-xl font-black" style={{ fontFamily: 'Plus Jakarta Sans' }}>{s.value}</p>
                  <p className="text-[11px] text-brand-200 font-medium mt-0.5 leading-tight">{s.label}</p>
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn direction="up" delay={0.15} trigger="mount" className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
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
              <span className="text-brand-200">de estudiantes satisfechos</span>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 relative">
        <motion.div animate={shakeControls} className="w-full max-w-sm">
          <div className="lg:hidden flex items-center justify-between mb-6 gap-3">
            <Link to="/"><Logo size={30} /></Link>
            <RoleTabSwitcher active="student" />
          </div>
          <div className="hidden lg:flex justify-end mb-6">
            <Link to="/login" className="inline-flex items-center gap-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 text-xs font-semibold transition-colors">
              <ChevronLeft className="w-3.5 h-3.5" /> Volver a portales
            </Link>
          </div>

          <div className="mb-8">
            <div className="hidden lg:block mb-5">
              <LogoMark size={48} />
            </div>
            <h2 className="text-2xl font-bold text-brand-900 dark:text-white tracking-tight" style={{ fontFamily: 'Plus Jakarta Sans' }}>
              Inicia sesión como estudiante
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Usa tu correo institucional o personal registrado.
            </p>
          </div>

          <AnimatePresence>
            {serverError && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.25 }}
                className="p-3.5 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-2xl flex items-start gap-2.5 text-rose-800 dark:text-rose-300 text-xs leading-relaxed overflow-hidden"
              >
                <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
                <div>{serverError}</div>
              </motion.div>
            )}
          </AnimatePresence>

          <StaggerContainer as="form" onSubmit={handleSubmit} noValidate className="space-y-4" staggerDelay={0.08}>
            <StaggerContainer.Item>
              <FloatingInput
                id="email"
                type="email"
                label="Correo electrónico"
                icon={Mail}
                autoComplete="email"
                value={email}
                error={errors.email}
                onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors(p => ({ ...p, email: '' })); if (serverError) setServerError(''); }}
              />
            </StaggerContainer.Item>

            <StaggerContainer.Item>
              <div className="flex items-center justify-end mb-1">
                <a href="#" className="text-xs text-brand-700 dark:text-brand-300 hover:text-brand-900 dark:hover:text-white font-semibold hover:underline">¿Olvidaste tu contraseña?</a>
              </div>
              <FloatingInput
                id="password"
                type={showPassword ? 'text' : 'password'}
                label="Contraseña"
                icon={Lock}
                autoComplete="current-password"
                value={password}
                error={errors.password}
                onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors(p => ({ ...p, password: '' })); if (serverError) setServerError(''); }}
                rightElement={
                  <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />
            </StaggerContainer.Item>

            <StaggerContainer.Item as="label" htmlFor="remember" className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                id="remember"
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-brand-700 focus:ring-2 focus:ring-brand-500/30 cursor-pointer"
              />
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Recordar mi correo en este dispositivo</span>
            </StaggerContainer.Item>

            <StaggerContainer.Item>
              <motion.button
                type="submit"
                disabled={loading || success}
                whileHover={!loading && !success ? { scale: 1.015 } : {}}
                whileTap={!loading && !success ? { scale: 0.98 } : {}}
                animate={success ? { backgroundColor: 'rgb(16,185,129)' } : {}}
                className="w-full py-3 px-4 text-white font-semibold text-sm rounded-xl btn-primary shadow-md flex items-center justify-center gap-2 disabled:opacity-90 cursor-pointer"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {success ? (
                    <motion.span key="success" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-2">
                      <Check className="w-4 h-4" /> ¡Listo!
                    </motion.span>
                  ) : loading ? (
                    <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Iniciando sesión...
                    </motion.span>
                  ) : (
                    <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                      Iniciar sesión <ArrowRight className="w-4 h-4" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </StaggerContainer.Item>
          </StaggerContainer>

          <button
            type="button"
            onClick={autofillDemo}
            className="w-full mt-4 py-2 rounded-xl text-xs font-semibold bg-brand-50 dark:bg-white/5 hover:bg-brand-100 dark:hover:bg-white/10 text-brand-800 dark:text-brand-200 transition-colors border border-brand-100 dark:border-white/10 cursor-pointer"
          >
            Usar cuenta de demostración
          </button>

          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-white/10 text-center space-y-3">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              ¿No tienes una cuenta?{' '}
              <Link to="/registro" className="text-brand-700 dark:text-brand-300 font-bold hover:underline">Regístrate gratis</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
