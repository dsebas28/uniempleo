import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Building2, Eye, EyeOff, Loader2, CheckCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const UNIVERSITIES = ['Universidad Nacional de Colombia', 'Universidad de los Andes', 'Universidad de Antioquia', 'Universidad EAFIT', 'Universidad del Valle', 'Universidad Javeriana', 'Universidad de la Sabana', 'Universidad Externado', 'Universidad ICESI', 'Otra universidad'];
const CAREERS = ['Ingeniería de Sistemas', 'Ingeniería Industrial', 'Administración de Empresas', 'Contaduría Pública', 'Diseño Gráfico', 'Psicología', 'Derecho', 'Comunicación Social', 'Economía', 'Ingeniería Civil', 'Medicina', 'Marketing', 'Otra carrera'];
const SECTORS = ['Tecnología', 'Salud', 'Educación', 'Finanzas y Banca', 'Manufactura', 'Retail y Comercio', 'Consultoría', 'Medios y Comunicación', 'Construcción', 'Transporte', 'Otro'];
const CITIES = ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Bucaramanga', 'Pereira', 'Manizales', 'Santa Marta', 'Otra ciudad'];

function PasswordStrength({ password }) {
  if (!password) return null;
  const strength = password.length < 6 ? 1 : password.length < 8 ? 2 : /[A-Z]/.test(password) && /[0-9]/.test(password) ? 4 : 3;
  const labels = ['', 'Muy débil', 'Débil', 'Buena', 'Fuerte'];
  const colors = ['', 'bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-emerald-500'];
  return (
    <div className="mt-1.5">
      <div className="flex gap-1 mb-1">
        {[1,2,3,4].map(i => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= strength ? colors[strength] : 'bg-gray-200'}`} />
        ))}
      </div>
      <p className={`text-xs font-medium ${strength >= 3 ? 'text-emerald-600' : 'text-orange-500'}`}>{labels[strength]}</p>
    </div>
  );
}

export default function Register() {
  const { registerStudent, registerCompany, loading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('student');
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});

  const [studentForm, setStudentForm] = useState({
    fullName: '', email: '', password: '', university: '', career: '', semester: '1', city: ''
  });

  const [companyForm, setCompanyForm] = useState({
    companyName: '', nit: '', email: '', phone: '', city: '', sector: '', password: ''
  });

  const validateStudent = () => {
    const errs = {};
    if (!studentForm.fullName.trim()) errs.fullName = 'Nombre requerido';
    if (!studentForm.email || !/\S+@\S+\.\S+/.test(studentForm.email)) errs.email = 'Correo inválido';
    if (studentForm.password.length < 6) errs.password = 'Mínimo 6 caracteres';
    if (!studentForm.university) errs.university = 'Selecciona tu universidad';
    if (!studentForm.career) errs.career = 'Selecciona tu carrera';
    if (!studentForm.city) errs.city = 'Ciudad requerida';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateCompany = () => {
    const errs = {};
    if (!companyForm.companyName.trim()) errs.companyName = 'Nombre de empresa requerido';
    if (!companyForm.nit.trim()) errs.nit = 'NIT requerido';
    if (!companyForm.email || !/\S+@\S+\.\S+/.test(companyForm.email)) errs.email = 'Correo inválido';
    if (companyForm.password.length < 6) errs.password = 'Mínimo 6 caracteres';
    if (!companyForm.city) errs.city = 'Ciudad requerida';
    if (!companyForm.sector) errs.sector = 'Sector requerido';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    if (!validateStudent()) return;
    const result = await registerStudent(studentForm);
    if (result.success) {
      toast.success('¡Cuenta creada! Bienvenido a UniEmpleo');
      navigate('/dashboard');
    } else {
      toast.error(result.error || 'Error al registrarse');
    }
  };

  const handleCompanySubmit = async (e) => {
    e.preventDefault();
    if (!validateCompany()) return;
    const result = await registerCompany(companyForm);
    if (result.success) {
      toast.success('¡Empresa registrada exitosamente!');
      navigate('/empresa/dashboard');
    } else {
      toast.error(result.error || 'Error al registrarse');
    }
  };

  const inputCls = (field, isIconRight = false) => `w-full ${isIconRight ? 'pr-11 pl-4' : 'px-4'} py-2.5 rounded-xl border text-sm outline-none transition-all duration-200 ${
    errors[field]
      ? 'border-red-300 bg-red-50/50 text-red-900 focus:border-red-500 focus:ring-2 focus:ring-red-100'
      : 'border-slate-200 bg-slate-50/50 hover:border-slate-300 text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
  }`;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 relative bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/30">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-36 -right-36 w-80 h-80 bg-blue-100/50 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-36 -left-36 w-80 h-80 bg-indigo-100/40 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-lg mx-auto relative z-10">
        {/* Header Branding */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
              <GraduationCap size={22} className="text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'Outfit' }}>
              <span className="text-blue-700">Uni</span><span className="text-slate-900">Empleo</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit' }}>
            Crear una cuenta nueva
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Plataforma universitaria de empleabilidad y prácticas
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-slate-200/70 p-1.5 rounded-2xl mb-6 gap-1.5 border border-slate-200/60 shadow-inner">
          <button
            type="button"
            onClick={() => { setTab('student'); setErrors({}); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              tab === 'student'
                ? 'bg-white text-blue-700 shadow-sm border border-slate-200/50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
            }`}
          >
            <GraduationCap size={17} className={tab === 'student' ? 'text-blue-600' : 'text-slate-400'} />
            <span>Soy Estudiante</span>
          </button>
          <button
            type="button"
            onClick={() => { setTab('company'); setErrors({}); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              tab === 'company'
                ? 'bg-white text-emerald-700 shadow-sm border border-slate-200/50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
            }`}
          >
            <Building2 size={17} className={tab === 'company' ? 'text-emerald-600' : 'text-slate-400'} />
            <span>Soy Empresa</span>
          </button>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-6 sm:p-8">
          {/* Student form */}
          {tab === 'student' && (
            <form onSubmit={handleStudentSubmit} noValidate>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    id="s-fullname"
                    placeholder="Ej. Sofía Rodríguez Martínez"
                    value={studentForm.fullName}
                    onChange={(e) => setStudentForm(p => ({ ...p, fullName: e.target.value }))}
                    className={inputCls('fullName')}
                  />
                  {errors.fullName && <p className="text-xs text-red-500 mt-1 font-medium">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Correo universitario o personal *
                  </label>
                  <input
                    type="email"
                    id="s-email"
                    placeholder="sofia@universidad.edu.co"
                    value={studentForm.email}
                    onChange={(e) => setStudentForm(p => ({ ...p, email: e.target.value }))}
                    className={inputCls('email')}
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-1 font-medium">{errors.email}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Universidad *
                    </label>
                    <select
                      id="s-university"
                      value={studentForm.university}
                      onChange={(e) => setStudentForm(p => ({ ...p, university: e.target.value }))}
                      className={inputCls('university')}
                    >
                      <option value="">Seleccionar institución</option>
                      {UNIVERSITIES.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                    {errors.university && <p className="text-xs text-red-500 mt-1 font-medium">{errors.university}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Semestre actual
                    </label>
                    <select
                      id="s-semester"
                      value={studentForm.semester}
                      onChange={(e) => setStudentForm(p => ({ ...p, semester: e.target.value }))}
                      className={inputCls('semester')}
                    >
                      {Array.from({length: 10}, (_, i) => i+1).map(s => (
                        <option key={s} value={s}>{s}° semestre</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Carrera o programa *
                    </label>
                    <select
                      id="s-career"
                      value={studentForm.career}
                      onChange={(e) => setStudentForm(p => ({ ...p, career: e.target.value }))}
                      className={inputCls('career')}
                    >
                      <option value="">Seleccionar carrera</option>
                      {CAREERS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {errors.career && <p className="text-xs text-red-500 mt-1 font-medium">{errors.career}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Ciudad *
                    </label>
                    <select
                      id="s-city"
                      value={studentForm.city}
                      onChange={(e) => setStudentForm(p => ({ ...p, city: e.target.value }))}
                      className={inputCls('city')}
                    >
                      <option value="">Seleccionar ciudad</option>
                      {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {errors.city && <p className="text-xs text-red-500 mt-1 font-medium">{errors.city}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Contraseña *
                  </label>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      id="s-pass"
                      placeholder="Mínimo 6 caracteres"
                      value={studentForm.password}
                      onChange={(e) => setStudentForm(p => ({ ...p, password: e.target.value }))}
                      className={inputCls('password', true)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                      aria-label={showPass ? 'Ocultar contraseña' : 'Ver contraseña'}
                    >
                      {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                  <PasswordStrength password={studentForm.password} />
                  {errors.password && <p className="text-xs text-red-500 mt-1 font-medium">{errors.password}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 text-sm font-bold text-white rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/25 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 mt-4 disabled:opacity-60"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
                  {loading ? 'Creando cuenta...' : 'Crear cuenta de estudiante'}
                </button>
              </div>
            </form>
          )}

          {/* Company form */}
          {tab === 'company' && (
            <form onSubmit={handleCompanySubmit} noValidate>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Nombre o Razón Social *
                  </label>
                  <input
                    type="text"
                    id="c-name"
                    placeholder="Ej. Innovatech Soluciones S.A.S."
                    value={companyForm.companyName}
                    onChange={(e) => setCompanyForm(p => ({ ...p, companyName: e.target.value }))}
                    className={inputCls('companyName')}
                  />
                  {errors.companyName && <p className="text-xs text-red-500 mt-1 font-medium">{errors.companyName}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      NIT / Identificación *
                    </label>
                    <input
                      type="text"
                      id="c-nit"
                      placeholder="900.123.456-7"
                      value={companyForm.nit}
                      onChange={(e) => setCompanyForm(p => ({ ...p, nit: e.target.value }))}
                      className={inputCls('nit')}
                    />
                    {errors.nit && <p className="text-xs text-red-500 mt-1 font-medium">{errors.nit}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Teléfono de contacto
                    </label>
                    <input
                      type="tel"
                      id="c-phone"
                      placeholder="601 234 5678"
                      value={companyForm.phone}
                      onChange={(e) => setCompanyForm(p => ({ ...p, phone: e.target.value }))}
                      className={inputCls('phone')}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Correo corporativo / RRHH *
                  </label>
                  <input
                    type="email"
                    id="c-email"
                    placeholder="talento@empresa.com"
                    value={companyForm.email}
                    onChange={(e) => setCompanyForm(p => ({ ...p, email: e.target.value }))}
                    className={inputCls('email')}
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-1 font-medium">{errors.email}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Ciudad principal *
                    </label>
                    <select
                      id="c-city"
                      value={companyForm.city}
                      onChange={(e) => setCompanyForm(p => ({ ...p, city: e.target.value }))}
                      className={inputCls('city')}
                    >
                      <option value="">Seleccionar ciudad</option>
                      {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {errors.city && <p className="text-xs text-red-500 mt-1 font-medium">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Sector productivo *
                    </label>
                    <select
                      id="c-sector"
                      value={companyForm.sector}
                      onChange={(e) => setCompanyForm(p => ({ ...p, sector: e.target.value }))}
                      className={inputCls('sector')}
                    >
                      <option value="">Seleccionar sector</option>
                      {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {errors.sector && <p className="text-xs text-red-500 mt-1 font-medium">{errors.sector}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Contraseña *
                  </label>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      id="c-pass"
                      placeholder="Mínimo 6 caracteres"
                      value={companyForm.password}
                      onChange={(e) => setCompanyForm(p => ({ ...p, password: e.target.value }))}
                      className={inputCls('password', true)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                      aria-label={showPass ? 'Ocultar contraseña' : 'Ver contraseña'}
                    >
                      {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                  <PasswordStrength password={companyForm.password} />
                  {errors.password && <p className="text-xs text-red-500 mt-1 font-medium">{errors.password}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 text-sm font-bold text-white rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 shadow-lg shadow-emerald-500/25 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 mt-4 disabled:opacity-60"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <Building2 size={18} />}
                  {loading ? 'Registrando empresa...' : 'Registrar mi empresa'}
                </button>
              </div>
            </form>
          )}

          {/* Footer note */}
          <div className="pt-6 mt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              ¿Ya tienes una cuenta registrada?{' '}
              <Link to={tab === 'company' ? '/login/empresa' : '/login/estudiante'} className="text-blue-600 font-semibold hover:text-blue-700 hover:underline">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
