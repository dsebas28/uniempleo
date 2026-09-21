import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import {
  Search, MapPin, ArrowRight, Users, Building2, Briefcase, TrendingUp,
  CheckCircle, Star, ChevronRight, Zap, Award, Globe,
  GraduationCap, Target, Code2, Megaphone, Palette, Calculator,
  Wrench, Stethoscope, UserPlus, Send, MessageSquare,
  Laptop, CheckCircle2
} from 'lucide-react';
import { jobsAPI } from '../services/api';
import JobCard from '../components/JobCard';
import { COLOMBIA_CITIES } from '../data/colombia';
import {
  fadeUp, fadeIn, stagger, scaleIn, slideLeft, slideRight, VP_ONCE as VP,
  AnimatedCounter, MagneticButton, RotatingWord, TiltCard,
} from '../components/animations';

/* ─── Hero Mockup ─────────────────────────────────────────────────── */
function HeroMockup() {
  const reduceMotion = useReducedMotion();
  return (
    <div className="relative w-full max-w-md mx-auto lg:mx-0 select-none" aria-hidden="true">
      <div className="absolute -inset-10 bg-accent-400/20 rounded-full blur-3xl" />

      <motion.div
        className="relative bg-white rounded-3xl shadow-2xl shadow-brand-950/40 p-5"
        initial={{ rotate: -3, opacity: 0, y: 30 }}
        animate={{ rotate: -3, opacity: 1, y: 0 }}
        whileHover={{ rotate: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          animate={reduceMotion ? {} : { y: [0, -8, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center text-brand-700 font-bold">T</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-400 font-medium">TechCo SAS</p>
              <p className="text-sm font-bold text-slate-900 truncate">Desarrollador Frontend Jr.</p>
            </div>
            <Laptop size={18} className="text-slate-300 flex-shrink-0" />
          </div>
          <div className="flex flex-wrap gap-1.5 mb-4">
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-accent-50 text-accent-700">Remoto</span>
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600">Tiempo completo</span>
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-brand-50 text-brand-700">Sin experiencia</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-1.5">
            <motion.div
              className="h-full progress-bar"
              initial={{ width: 0 }}
              animate={{ width: '70%' }}
              transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mb-4">Match con tu perfil: 70%</p>
          <div className="py-2.5 text-center text-sm font-bold text-white rounded-xl btn-accent">Postularme</div>
        </motion.div>
      </motion.div>

      {/* Chip: contratado */}
      <motion.div
        className="absolute -top-5 -right-4 sm:-right-8 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-2 rotate-[4deg]"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.9, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="w-8 h-8 rounded-full bg-accent-100 flex items-center justify-center flex-shrink-0">
          <CheckCircle2 size={16} className="text-accent-600" />
        </div>
        <div className="pr-1">
          <p className="text-xs font-bold text-slate-900 leading-tight">¡Contratado!</p>
          <p className="text-[10px] text-slate-400">Hace 2 días</p>
        </div>
      </motion.div>

      {/* Chip: comunidad */}
      <motion.div
        className="absolute -bottom-6 -left-4 sm:-left-8 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-2.5 rotate-[-2deg]"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex -space-x-2 flex-shrink-0">
          {['bg-brand-400', 'bg-accent-400', 'bg-amber-400'].map((c, i) => (
            <div key={i} className={`w-7 h-7 rounded-full ${c} border-2 border-white`} />
          ))}
        </div>
        <div>
          <p className="text-xs font-bold text-slate-900 leading-tight">+20 estudiantes</p>
          <p className="text-[10px] text-slate-400">activos esta semana</p>
        </div>
      </motion.div>

      {/* Chip: vacantes */}
      <motion.div
        className="hidden sm:flex absolute top-1/3 -right-10 bg-white rounded-2xl shadow-xl p-2.5 items-center gap-1.5 rotate-[3deg]"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <TrendingUp size={15} className="text-accent-500" />
        <span className="text-xs font-bold text-slate-900">+30 vacantes</span>
      </motion.div>
    </div>
  );
}

/* ─── Stat block (usa AnimatedCounter, ver components/animations) ──── */
function StatBlock({ icon: Icon, value, label, suffix = '' }) {
  return (
    <div className="flex items-center gap-3 px-2">
      <div className="w-11 h-11 rounded-xl bg-brand-50 dark:bg-white/10 flex items-center justify-center flex-shrink-0">
        <Icon size={20} className="text-brand-700 dark:text-brand-300" aria-hidden="true" />
      </div>
      <div className="text-left">
        <AnimatedCounter
          value={value}
          suffix={suffix}
          className="font-display block text-2xl font-extrabold text-brand-900 dark:text-white leading-none"
        />
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">{label}</p>
      </div>
    </div>
  );
}

/* ─── Static data ─────────────────────────────────────────────────── */
const HERO_MODALITIES = ['Remoto', 'Híbrido', 'Presencial'];

const categories = [
  { label: 'Tecnología',       icon: Code2,       keyword: 'Tecnología' },
  { label: 'Marketing',        icon: Megaphone,   keyword: 'Marketing' },
  { label: 'Diseño',           icon: Palette,     keyword: 'Diseño' },
  { label: 'Administración',   icon: Briefcase,   keyword: 'Administración' },
  { label: 'Contabilidad',     icon: Calculator,  keyword: 'Contabilidad' },
  { label: 'Recursos Humanos', icon: Users,       keyword: 'Recursos Humanos' },
  { label: 'Ingeniería',       icon: Wrench,      keyword: 'Ingeniería' },
  { label: 'Salud',            icon: Stethoscope, keyword: 'Salud' },
];

const steps = [
  { icon: UserPlus,      title: 'Crea tu perfil',       desc: 'Regístrate gratis con tus datos académicos, sin necesidad de experiencia previa.' },
  { icon: Search,        title: 'Explora vacantes',     desc: 'Filtra por ciudad, modalidad y área. Todas pensadas para estudiantes y recién egresados.' },
  { icon: Send,          title: 'Postúlate',            desc: 'Envía tu postulación en segundos y adjunta tu hoja de vida en un clic.' },
  { icon: MessageSquare, title: 'Conecta con empresas', desc: 'Las empresas revisan tu perfil y te contactan directamente por la plataforma.' },
];

const benefitsStudent = [
  { icon: Award,         title: 'Sin experiencia requerida', desc: 'Vacantes diseñadas para estudiantes y recién graduados.' },
  { icon: GraduationCap, title: 'Prácticas profesionales',   desc: 'Convenios con universidades para prácticas académicas.' },
  { icon: Globe,         title: 'Empleos remotos',           desc: 'Trabaja desde casa para empresas de todo el país.' },
  { icon: Zap,           title: 'Desarrollo profesional',    desc: 'Cursos y talleres para potenciar tu perfil.' },
];

const benefitsCompany = [
  { icon: Target,      title: 'Talento joven calificado', desc: 'Accede a perfiles de estudiantes universitarios de todo el país.' },
  { icon: Briefcase,   title: 'Publica vacantes fácil',   desc: 'Formulario sencillo y aprobación rápida de tus vacantes.' },
  { icon: Users,       title: 'Gestiona candidatos',      desc: 'Panel exclusivo para revisar postulaciones y programar entrevistas.' },
  { icon: CheckCircle, title: 'Perfiles verificados',     desc: 'Estudiantes con información académica verificada.' },
];

const testimonials = [
  {
    name: 'Valentina Ospina', role: 'Practicante en TechColombia',
    career: 'Ingeniería de Sistemas — UNAL', avatar: 'V',
    quote: 'Conseguí mi primera práctica en solo 2 semanas. El proceso fue muy sencillo y las empresas son de calidad.',
  },
  {
    name: 'Santiago Morales', role: 'Analista de Datos Jr.',
    career: 'Estadística — Universidad de los Andes', avatar: 'S',
    quote: 'Me di cuenta del valor real de mi perfil sin experiencia. Los cursos de Academy fueron clave para conseguir el trabajo.',
  },
  {
    name: 'Daniela Rodríguez', role: 'Diseñadora UX/UI Junior',
    career: 'Diseño Gráfico — UDEM', avatar: 'D',
    quote: 'Hay empresas que realmente buscan personas sin experiencia. No me rechazaron por ser estudiante, todo lo contrario.',
  },
];

/* ─── Page ────────────────────────────────────────────────────────── */
export default function Home() {
  const [stats, setStats] = useState({ students: 20, companies: 10, jobs: 30, hired: 5 });
  const [keyword, setKeyword] = useState('');
  const [city, setCity] = useState('');
  const [modality, setModality] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  // Parallax del hero: las dos capas decorativas se desplazan a distinta
  // velocidad que el scroll (fondo más lento, ligera sensación de profundidad).
  const heroRef = useRef(null);
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const parallaxSlow = useTransform(heroProgress, [0, 1], [0, reduceMotion ? 0 : 80]);
  const parallaxFast = useTransform(heroProgress, [0, 1], [0, reduceMotion ? 0 : 160]);

  useEffect(() => {
    jobsAPI.getStats().then(res => setStats(res.data)).catch(() => {});
    jobsAPI.getAll({ limit: 6, page: 1 })
      .then(res => setFeaturedJobs(res.data?.jobs || []))
      .catch(() => {})
      .finally(() => setJobsLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.set('keyword', keyword);
    if (city) params.set('city', city);
    if (modality) params.set('modality', modality);
    navigate(`/empleos${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <motion.div
      className="overflow-x-hidden bg-white dark:bg-brand-950 transition-colors duration-300"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >

      {/* ══ HERO ══════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="hero-gradient relative overflow-hidden pt-24 pb-28 md:pt-28 md:pb-36 lg:pb-28">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-10 left-1/4 w-72 h-72 bg-brand-500/20 rounded-full blur-3xl"
            style={{ y: parallaxSlow }}
            animate={reduceMotion ? {} : { scale: [1, 1.15, 1], opacity: [0.2, 0.35, 0.2] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-10 right-1/4 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl"
            style={{ y: parallaxFast }}
            animate={reduceMotion ? {} : { scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />
          <div className="absolute inset-0 opacity-[0.05]" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }} />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center mb-10 lg:mb-14">

            {/* Copy — staggered entrance */}
            <motion.div
              className="text-center lg:text-left"
              variants={stagger(0.1)}
              initial="hidden"
              animate="show"
            >
              <motion.div variants={fadeUp}>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-brand-100 text-xs font-semibold mb-6 backdrop-blur-md">
                  <Zap size={13} className="text-accent-400" aria-hidden="true" />
                  <span>Hecho para estudiantes y recién egresados sin experiencia</span>
                </div>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="text-3xl sm:text-4xl md:text-[2.75rem] font-extrabold text-white leading-[1.15] mb-4 tracking-tight"
                style={{ fontFamily: 'Plus Jakarta Sans' }}
              >
                Tu primera{' '}
                <RotatingWord
                  words={['oportunidad', 'práctica', 'experiencia']}
                  className="text-accent-400"
                />{' '}
                profesional{' '}
                <span className="text-accent-400">comienza aquí</span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="text-base text-brand-100/80 leading-relaxed max-w-xl mx-auto lg:mx-0"
              >
                Conectamos tu talento universitario con empresas que valoran el potencial de aprendizaje. Sin experiencia requerida, sin barreras.
              </motion.p>
            </motion.div>

            <div className="hidden lg:block">
              <HeroMockup />
            </div>
          </div>

          {/* Search bar */}
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <form onSubmit={handleSearch}>
              <div className="flex flex-col sm:flex-row bg-white rounded-3xl sm:rounded-full shadow-2xl shadow-brand-950/30 p-2.5 gap-1.5 sm:gap-0">
                <div className="flex-1 flex items-center gap-3 px-6 py-4 sm:border-r border-slate-100 rounded-full min-w-0">
                  <Search className="w-5 h-5 text-slate-400 flex-shrink-0" aria-hidden="true" />
                  <div className="w-full min-w-0 text-left">
                    <label htmlFor="hero-keyword" className="block text-xs font-bold text-slate-400 uppercase tracking-wide whitespace-nowrap">Cargo o palabra clave</label>
                    <input
                      id="hero-keyword"
                      type="text"
                      placeholder="Ej. Desarrollador, Marketing..."
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      className="w-full text-slate-800 placeholder-slate-400 text-base border-0 focus:ring-0 outline-none bg-transparent p-0"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3 px-6 py-4 sm:border-r border-slate-100 sm:w-56">
                  <MapPin className="w-5 h-5 text-slate-400 flex-shrink-0" aria-hidden="true" />
                  <div className="w-full min-w-0 text-left">
                    <label htmlFor="hero-city" className="block text-xs font-bold text-slate-400 uppercase tracking-wide">Ciudad</label>
                    <select
                      id="hero-city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full text-slate-800 text-base border-0 focus:ring-0 outline-none bg-transparent p-0 appearance-none"
                    >
                      <option value="">Cualquiera</option>
                      {COLOMBIA_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-3 px-6 py-4 sm:w-48">
                  <Laptop className="w-5 h-5 text-slate-400 flex-shrink-0" aria-hidden="true" />
                  <div className="w-full min-w-0 text-left">
                    <label htmlFor="hero-modality" className="block text-xs font-bold text-slate-400 uppercase tracking-wide">Modalidad</label>
                    <select
                      id="hero-modality"
                      value={modality}
                      onChange={(e) => setModality(e.target.value)}
                      className="w-full text-slate-800 text-base border-0 focus:ring-0 outline-none bg-transparent p-0 appearance-none"
                    >
                      <option value="">Cualquiera</option>
                      {HERO_MODALITIES.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                </div>
                <MagneticButton
                  type="submit"
                  className="group px-9 py-4 text-base font-bold rounded-full btn-accent flex-shrink-0 cursor-pointer"
                >
                  Buscar <Search className="w-5 h-5" aria-hidden="true" />
                </MagneticButton>
              </div>
            </form>

            {/* Quick tags */}
            <motion.div
              className="flex flex-wrap gap-2 justify-center mt-5"
              variants={stagger(0.05)}
              initial="hidden"
              animate="show"
            >
              {['Sin experiencia', 'Prácticas', 'Remoto', 'Tecnología', 'Marketing'].map(tag => (
                <motion.button
                  key={tag}
                  variants={fadeIn}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => navigate(`/empleos?keyword=${encodeURIComponent(tag)}`)}
                  className="px-3 py-1 rounded-full text-xs font-medium text-white/90 bg-white/10 border border-white/15 hover:bg-white/20 transition-colors cursor-pointer"
                >
                  {tag}
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══ STATS ═════════════════════════════════════════════════════ */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-12">
        <motion.div
          className="bg-white dark:bg-white/[0.06] dark:backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-100 dark:border-white/10 py-6 px-6 sm:px-10 grid grid-cols-2 sm:grid-cols-4 gap-y-6 gap-x-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VP}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <StatBlock icon={GraduationCap} value={stats.students  || 20} label="Estudiantes registrados" suffix="+" />
          <StatBlock icon={Building2}     value={stats.companies || 10} label="Empresas activas"        suffix="+" />
          <StatBlock icon={Briefcase}     value={stats.jobs      || 30} label="Vacantes disponibles"    suffix="+" />
          <StatBlock icon={TrendingUp}    value={stats.hired     || 5}  label="Estudiantes contratados" suffix="+" />
        </motion.div>
      </div>

      {/* ══ CATEGORIES ════════════════════════════════════════════════ */}
      <section className="pt-16 pb-16 sm:pt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="flex items-end justify-between mb-8"
            initial="hidden" whileInView="show" viewport={VP} variants={fadeUp}
          >
            <div>
              <span className="text-xs font-bold text-accent-600 dark:text-accent-400 uppercase tracking-wider">Explora</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-brand-900 dark:text-white mt-1" style={{ fontFamily: 'Plus Jakarta Sans' }}>
                Busca por categoría
              </h2>
            </div>
            <Link to="/empleos" className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-brand-700 dark:text-brand-300 hover:text-brand-900 dark:hover:text-white transition-colors">
              Ver todas <ChevronRight size={16} aria-hidden="true" />
            </Link>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 sm:grid-cols-4 gap-4"
            variants={stagger(0.06)}
            initial="hidden"
            whileInView="show"
            viewport={VP}
          >
            {categories.map((cat) => (
              <motion.button
                key={cat.label}
                variants={scaleIn}
                whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(79,70,229,0.12)' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(`/empleos?keyword=${encodeURIComponent(cat.keyword)}`)}
                className="flex flex-col items-start gap-3 p-5 rounded-2xl border border-slate-200 dark:border-white/10 hover:border-brand-300 dark:hover:border-brand-400/50 bg-white dark:bg-white/5 transition-colors duration-200 text-left group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-white/10 group-hover:bg-brand-700 flex items-center justify-center transition-colors duration-200">
                  <cat.icon size={19} className="text-brand-700 dark:text-brand-300 group-hover:text-white transition-colors duration-200" aria-hidden="true" />
                </div>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{cat.label}</span>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ FEATURED JOBS ═════════════════════════════════════════════ */}
      {(jobsLoading || featuredJobs.length > 0) && (
        <section className="pb-20 bg-slate-50 dark:bg-white/[0.03] pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="flex items-end justify-between mb-8"
              initial="hidden" whileInView="show" viewport={VP} variants={fadeUp}
            >
              <div>
                <span className="text-xs font-bold text-accent-600 dark:text-accent-400 uppercase tracking-wider">Oportunidades</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-brand-900 dark:text-white mt-1" style={{ fontFamily: 'Plus Jakarta Sans' }}>
                  Vacantes destacadas
                </h2>
              </div>
              <Link to="/empleos" className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-brand-700 dark:text-brand-300 hover:text-brand-900 dark:hover:text-white transition-colors">
                Ver todas <ChevronRight size={16} aria-hidden="true" />
              </Link>
            </motion.div>

            {jobsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3].map(i => (
                  <motion.div
                    key={i}
                    className="h-56 rounded-2xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.15 }}
                  />
                ))}
              </div>
            ) : (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                variants={stagger(0.08)}
                initial="hidden"
                whileInView="show"
                viewport={VP}
              >
                {featuredJobs.map((job) => (
                  <motion.div key={job.id} variants={fadeUp}>
                    <TiltCard className="[transform-style:preserve-3d]">
                      <JobCard job={job} />
                    </TiltCard>
                  </motion.div>
                ))}
              </motion.div>
            )}

            <div className="text-center mt-10 sm:hidden">
              <Link to="/empleos" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 dark:text-brand-300">
                Ver todas las vacantes <ChevronRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ══ HOW IT WORKS ══════════════════════════════════════════════ */}
      <section className="py-20 bg-white dark:bg-brand-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial="hidden" whileInView="show" viewport={VP} variants={fadeUp}
          >
            <span className="text-xs font-bold text-accent-600 dark:text-accent-400 uppercase tracking-wider">Proceso simple</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-brand-900 dark:text-white mt-2 mb-4" style={{ fontFamily: 'Plus Jakarta Sans' }}>
              ¿Cómo funciona UniEmpleo?
            </h2>
            <p className="text-base text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              En 4 pasos simples conectamos a los mejores talentos universitarios con empresas que los valoran.
            </p>
          </motion.div>

          <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6">
            {/* Base line */}
            <div className="hidden md:block absolute top-7 left-[12.5%] right-[12.5%] h-px bg-slate-200 dark:bg-white/10" />
            {/* Animated gradient line */}
            <motion.div
              className="hidden md:block absolute top-7 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-brand-400 to-accent-400 origin-left"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={VP}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            />

            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                className="relative flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VP}
                transition={{ duration: 0.55, delay: 0.1 + idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.div
                  className="w-14 h-14 rounded-2xl bg-brand-700 dark:bg-brand-600 flex items-center justify-center shadow-md shadow-brand-900/10 mb-5 relative z-10"
                  whileHover={{ scale: 1.1, rotate: -4 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                >
                  <step.icon size={22} className="text-white" aria-hidden="true" />
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-accent-500 text-brand-950 text-[11px] font-bold flex items-center justify-center border-2 border-white dark:border-brand-950">
                    {idx + 1}
                  </span>
                </motion.div>
                <h3 className="text-base font-bold text-brand-900 dark:text-white mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ BENEFITS ══════════════════════════════════════════════════ */}
      <section className="py-20 bg-slate-50 dark:bg-white/[0.03]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-14"
            initial="hidden" whileInView="show" viewport={VP} variants={fadeUp}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-brand-900 dark:text-white" style={{ fontFamily: 'Plus Jakarta Sans' }}>
              Una plataforma, dos caminos
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Students */}
            <motion.div
              className="bg-white dark:bg-white/5 rounded-3xl border border-slate-200 dark:border-white/10 p-8 shadow-sm"
              initial="hidden" whileInView="show" viewport={VP} variants={slideLeft}
              whileHover={{ boxShadow: '0 16px 40px rgba(79,70,229,0.1)' }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-500/15 text-brand-700 dark:text-brand-200 text-xs font-semibold mb-5">
                <GraduationCap size={14} aria-hidden="true" /> Para estudiantes
              </div>
              <h3 className="text-2xl font-bold text-brand-900 dark:text-white mb-7" style={{ fontFamily: 'Plus Jakarta Sans' }}>
                Todo lo que necesitas para tu primer empleo
              </h3>
              <motion.div className="space-y-5 mb-8" variants={stagger(0.07)} initial="hidden" whileInView="show" viewport={VP}>
                {benefitsStudent.map((b, i) => (
                  <motion.div key={i} variants={fadeUp} className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-500/15 flex items-center justify-center flex-shrink-0">
                      <b.icon size={20} className="text-brand-700 dark:text-brand-300" aria-hidden="true" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-0.5">{b.title}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{b.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
              <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.97 }}>
                <Link to="/login/estudiante" className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-xl btn-primary">
                  Crear perfil gratis <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </motion.div>
            </motion.div>

            {/* Companies */}
            <motion.div
              className="bg-gradient-to-br from-slate-900 via-[#241a3d] to-brand-950 rounded-3xl p-8 shadow-sm relative overflow-hidden"
              initial="hidden" whileInView="show" viewport={VP} variants={slideRight}
              whileHover={{ boxShadow: '0 16px 40px rgba(30,27,75,0.4)' }}
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-violet-500/15 rounded-full blur-3xl" />
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-violet-300 text-xs font-semibold mb-5 relative">
                <Building2 size={14} aria-hidden="true" /> Para empresas
              </div>
              <h3 className="text-2xl font-bold text-white mb-7 relative" style={{ fontFamily: 'Plus Jakarta Sans' }}>
                Encuentra el talento que tu empresa necesita
              </h3>
              <motion.div className="space-y-5 mb-8 relative" variants={stagger(0.07)} initial="hidden" whileInView="show" viewport={VP}>
                {benefitsCompany.map((b, i) => (
                  <motion.div key={i} variants={fadeUp} className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                      <b.icon size={20} className="text-violet-300" aria-hidden="true" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-0.5">{b.title}</h4>
                      <p className="text-sm text-slate-300 leading-relaxed">{b.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
              <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.97 }}>
                <Link to="/login/empresa" className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold rounded-xl btn-accent relative">
                  Registrar empresa <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══════════════════════════════════════════════ */}
      <section className="py-20 bg-white dark:bg-brand-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-14"
            initial="hidden" whileInView="show" viewport={VP} variants={fadeUp}
          >
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-300 uppercase tracking-wider bg-amber-50 dark:bg-amber-500/10 px-3 py-1.5 rounded-full">
              Contenido de demostración
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-brand-900 dark:text-white mt-4 mb-3" style={{ fontFamily: 'Plus Jakarta Sans' }}>
              Lo que dicen nuestros usuarios
            </h2>
            <p className="text-slate-500 dark:text-slate-400">Testimonios ficticios creados para fines de demostración</p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={stagger(0.1)}
            initial="hidden"
            whileInView="show"
            viewport={VP}
          >
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                variants={scaleIn}
                whileHover={{ y: -6, boxShadow: '0 16px 40px rgba(15,23,42,0.1)' }}
                className="bg-white dark:bg-white/5 rounded-2xl p-7 border border-slate-200 dark:border-white/10 shadow-sm"
              >
                <div className="flex items-center gap-1 mb-4" aria-label="Calificación: 5 estrellas">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} size={14} className="text-accent-400 fill-accent-400" aria-hidden="true" />
                  ))}
                </div>
                <blockquote className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-6">
                  "{t.quote}"
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-brand-700 flex items-center justify-center text-white font-bold flex-shrink-0" aria-hidden="true">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white text-sm">{t.name}</p>
                    <p className="text-xs text-brand-700 dark:text-brand-300 font-medium">{t.role}</p>
                    <p className="text-xs text-slate-400">{t.career}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ CTA FINAL ═════════════════════════════════════════════════ */}
      <section className="hero-gradient py-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-0 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl"
            animate={reduceMotion ? {} : { scale: [1, 1.3, 1] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl"
            animate={reduceMotion ? {} : { scale: [1, 1.2, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />
        </div>

        <motion.div
          className="max-w-3xl mx-auto px-4 text-center relative z-10"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={VP}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-5" style={{ fontFamily: 'Plus Jakarta Sans' }}>
            ¿Listo para dar el primer paso?
          </h2>
          <p className="text-brand-100/80 text-lg mb-10">
            Únete a estudiantes que ya están construyendo su futuro profesional, sin experiencia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <MagneticButton
              as={Link}
              to="/login/estudiante"
              className="group inline-flex items-center gap-2 px-8 py-4 text-base font-bold rounded-xl btn-accent shadow-xl"
            >
              <GraduationCap size={20} aria-hidden="true" /> Crear cuenta gratis
            </MagneticButton>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link to="/empleos" className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white border-2 border-white/25 rounded-xl hover:bg-white/10 transition-all duration-200">
                Ver vacantes <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

    </motion.div>
  );
}
