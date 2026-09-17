import { Link } from 'react-router-dom';
import { Clock, BarChart2, Star, Users, BookOpen, Play } from 'lucide-react';

const levelColors = {
  'Básico': 'bg-green-50 text-green-700',
  'Intermedio': 'bg-blue-50 text-blue-700',
  'Avanzado': 'bg-purple-50 text-purple-700',
};

export default function CourseCard({ course, enrolled = false, progress = 0 }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm card-hover overflow-hidden group">
      {/* Image */}
      <div className="relative h-40 bg-gradient-to-br from-blue-600 to-indigo-700 overflow-hidden">
        {course.image_url ? (
          <img src={course.image_url} alt={course.title} className="w-full h-full object-cover opacity-80" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen size={48} className="text-white/40" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${levelColors[course.level] || 'bg-gray-100 text-gray-600'}`}>
            {course.level}
          </span>
        </div>
        {enrolled && (
          <div className="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
            Inscrito
          </div>
        )}
      </div>

      <div className="p-5">
        <p className="text-xs font-medium text-blue-600 mb-1">{course.area}</p>
        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors leading-tight">
          {course.title}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">
          {course.description}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Clock size={13} className="text-gray-400" />
            <span>{course.duration_hours}h</span>
          </div>
          <div className="flex items-center gap-1">
            <Star size={13} className="text-yellow-400 fill-yellow-400" />
            <span className="font-medium text-gray-700">{course.rating || 4.5}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={13} className="text-gray-400" />
            <span>{(course.students_count || 0).toLocaleString()}</span>
          </div>
        </div>

        {/* Progress bar (if enrolled) */}
        {enrolled && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1.5">
              <span>Progreso</span>
              <span className="font-semibold text-blue-600">{progress}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="progress-bar h-full" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        <Link
          to={`/cursos/${course.id}`}
          className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-semibold text-white rounded-xl btn-primary"
        >
          <Play size={14} />
          {enrolled ? (progress > 0 ? 'Continuar' : 'Comenzar') : 'Ver curso'}
        </Link>
      </div>
    </div>
  );
}
