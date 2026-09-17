import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, BookOpen, Clock, Star, Users, Filter } from 'lucide-react';
import { coursesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import CourseCard from '../components/CourseCard';
import { CourseCardSkeleton } from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';

const AREAS = ['Todos', 'Tecnología', 'Datos', 'Idiomas', 'Habilidades blandas', 'Herramientas', 'Empleabilidad'];
const LEVELS = ['Todos', 'Básico', 'Intermedio', 'Avanzado'];

export default function Courses() {
  const { isAuthenticated, isStudent } = useAuth();
  const [courses, setCourses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [area, setArea] = useState('Todos');
  const [level, setLevel] = useState('Todos');

  useEffect(() => {
    coursesAPI.getAll().then(res => {
      setCourses(res.data || []);
      setFiltered(res.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));

    if (isAuthenticated && isStudent) {
      coursesAPI.getEnrollments().then(res => setEnrollments(res.data || [])).catch(() => {});
    }
  }, [isAuthenticated, isStudent]);

  useEffect(() => {
    let result = courses;
    if (search) result = result.filter(c => c.title.toLowerCase().includes(search.toLowerCase()) || c.description?.toLowerCase().includes(search.toLowerCase()));
    if (area !== 'Todos') result = result.filter(c => c.area === area);
    if (level !== 'Todos') result = result.filter(c => c.level === level);
    setFiltered(result);
  }, [search, area, level, courses]);

  const getEnrollment = (courseId) => enrollments.find(e => e.course_id === courseId);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="hero-gradient text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-sm text-blue-100 mb-5 backdrop-blur-sm">
            <BookOpen size={15} /> UniEmpleo Academy
          </div>
          <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Outfit' }}>
            Desarrolla tus habilidades profesionales
          </h1>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">
            Cursos diseñados para potenciar tu perfil y aumentar tus probabilidades de conseguir empleo.
          </p>

          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar curso..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl text-gray-800 text-sm outline-none shadow-lg"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8 max-w-xl mx-auto text-center">
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <p className="text-2xl font-bold text-blue-600">{courses.length}+</p>
            <p className="text-xs text-gray-500 mt-0.5">Cursos disponibles</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <p className="text-2xl font-bold text-emerald-600">100%</p>
            <p className="text-xs text-gray-500 mt-0.5">Gratuitos</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <p className="text-2xl font-bold text-purple-600">
              {courses.reduce((acc, c) => acc + (c.duration_hours || 0), 0)}h
            </p>
            <p className="text-xs text-gray-500 mt-0.5">De contenido</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {/* Area tabs */}
          <div className="flex gap-1.5 flex-wrap">
            {AREAS.map(a => (
              <button
                key={a}
                onClick={() => setArea(a)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  area === a ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-blue-50 hover:text-blue-700'
                }`}
              >
                {a}
              </button>
            ))}
          </div>
          <div className="ml-auto">
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-700 bg-white outline-none input-focus"
            >
              {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>

        {/* Count */}
        {!loading && (
          <p className="text-sm text-gray-500 mb-5">
            <span className="font-semibold text-gray-900">{filtered.length}</span> curso{filtered.length !== 1 ? 's' : ''} disponible{filtered.length !== 1 ? 's' : ''}
          </p>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => <CourseCardSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState type="courses" title="No se encontraron cursos" description="Prueba con otros filtros o términos de búsqueda." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(course => {
              const enrollment = getEnrollment(course.id);
              return (
                <CourseCard
                  key={course.id}
                  course={course}
                  enrolled={!!enrollment}
                  progress={enrollment?.progress || 0}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
