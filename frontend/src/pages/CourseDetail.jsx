import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Clock, Star, Users, BookOpen, Play, CheckCircle, Lock, Loader2, Award } from 'lucide-react';
import { coursesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const levelColors = { 'Básico': 'text-green-600 bg-green-50', 'Intermedio': 'text-blue-600 bg-blue-50', 'Avanzado': 'text-purple-600 bg-purple-50' };

export default function CourseDetail() {
  const { id } = useParams();
  const { isAuthenticated, isStudent } = useAuth();
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    coursesAPI.getById(id).then(res => {
      setCourse(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));

    if (isAuthenticated && isStudent) {
      coursesAPI.getEnrollments().then(res => {
        const e = (res.data || []).find(e => e.course_id === parseInt(id));
        setEnrollment(e || null);
      }).catch(() => {});
    }
  }, [id, isAuthenticated, isStudent]);

  const handleEnroll = async () => {
    if (!isAuthenticated) { toast.error('Debes iniciar sesión para inscribirte'); return; }
    if (!isStudent) { toast.error('Solo estudiantes pueden inscribirse'); return; }
    setEnrolling(true);
    try {
      await coursesAPI.enroll(id);
      toast.success('¡Te inscribiste al curso!');
      setEnrollment({ course_id: parseInt(id), progress: 0 });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al inscribirse');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 size={40} className="text-blue-500 animate-spin" />
    </div>
  );

  if (!course) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <BookOpen size={48} className="text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-700">Curso no encontrado</h2>
        <Link to="/cursos" className="text-blue-600 hover:underline mt-2 block">Ver todos los cursos</Link>
      </div>
    </div>
  );

  const modules = course.modules || [
    { title: 'Introducción al curso', duration_minutes: 20, completed: true },
    { title: 'Conceptos fundamentales', duration_minutes: 35, completed: enrollment?.progress >= 25 },
    { title: 'Práctica guiada', duration_minutes: 45, completed: enrollment?.progress >= 50 },
    { title: 'Proyecto final', duration_minutes: 60, completed: enrollment?.progress >= 75 },
    { title: 'Evaluación y certificado', duration_minutes: 25, completed: enrollment?.progress >= 100 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Link to="/cursos" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600">
            <ChevronLeft size={16} /> Volver a cursos
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero */}
            <div className="bg-gradient-to-br from-blue-700 to-indigo-800 rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
              <div className="relative">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg mb-4 inline-block ${levelColors[course.level]}`}>
                  {course.level}
                </span>
                <h1 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Outfit' }}>{course.title}</h1>
                <p className="text-blue-100 text-sm leading-relaxed mb-5">{course.description}</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-1.5"><Clock size={15} className="text-blue-300" />{course.duration_hours}h de contenido</div>
                  <div className="flex items-center gap-1.5"><Star size={15} className="text-yellow-300 fill-yellow-300" />{course.rating || 4.5} calificación</div>
                  <div className="flex items-center gap-1.5"><Users size={15} className="text-blue-300" />{(course.students_count || 0).toLocaleString()} inscritos</div>
                </div>
              </div>
            </div>

            {/* Progress if enrolled */}
            {enrollment && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-gray-900">Tu progreso</h3>
                  <span className="text-sm font-bold text-blue-600">{enrollment.progress || 0}%</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="progress-bar h-full" style={{ width: `${enrollment.progress || 0}%` }} />
                </div>
                {enrollment.completed && (
                  <div className="flex items-center gap-2 mt-3 text-emerald-600 text-sm font-semibold">
                    <Award size={16} /> ¡Curso completado! Ya puedes descargar tu certificado.
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Descripción del curso</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{course.description}</p>
              {course.instructor && (
                <div className="mt-4 flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-sm">
                    {course.instructor.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Instructor</p>
                    <p className="text-sm font-semibold text-gray-800">{course.instructor}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Modules */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Contenido del curso</h2>
              <div className="space-y-2">
                {modules.map((mod, i) => (
                  <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                    enrollment ? 'border-gray-100 hover:bg-blue-50 cursor-pointer' : 'border-gray-100 cursor-not-allowed opacity-75'
                  }`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      mod.completed ? 'bg-emerald-100' : enrollment ? 'bg-blue-50' : 'bg-gray-100'
                    }`}>
                      {mod.completed ? (
                        <CheckCircle size={16} className="text-emerald-500" />
                      ) : enrollment ? (
                        <Play size={14} className="text-blue-500" />
                      ) : (
                        <Lock size={14} className="text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${mod.completed ? 'text-emerald-700' : 'text-gray-700'}`}>
                        {mod.title}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400 flex-shrink-0">
                      {mod.duration_minutes}min
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="sticky top-24 space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                {enrollment ? (
                  <>
                    <div className="text-center mb-4">
                      <div className="text-3xl font-bold text-emerald-600 mb-1">{enrollment.progress || 0}%</div>
                      <p className="text-sm text-gray-500">Completado</p>
                    </div>
                    <Link
                      to="/cursos"
                      className="block w-full text-center py-3 text-sm font-bold text-white rounded-xl btn-primary mb-3"
                    >
                      <Play size={14} className="inline mr-1" />
                      {enrollment.progress > 0 ? 'Continuar curso' : 'Comenzar curso'}
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="text-center mb-4">
                      <p className="text-3xl font-bold text-blue-600 mb-1">Gratis</p>
                      <p className="text-xs text-gray-400">Acceso completo incluido</p>
                    </div>
                    <button
                      onClick={handleEnroll}
                      disabled={enrolling}
                      className="w-full py-3 text-sm font-bold text-white rounded-xl btn-primary flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      {enrolling ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
                      {enrolling ? 'Inscribiendo...' : 'Inscribirme gratis'}
                    </button>
                  </>
                )}

                <div className="mt-5 space-y-3 text-sm">
                  {[
                    { label: 'Duración', value: `${course.duration_hours} horas` },
                    { label: 'Nivel', value: course.level },
                    { label: 'Área', value: course.area },
                    { label: 'Formato', value: 'Online · Auto-paced' },
                    { label: 'Certificado', value: 'Sí, al completar' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between">
                      <span className="text-gray-500">{label}</span>
                      <span className="font-medium text-gray-800">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
