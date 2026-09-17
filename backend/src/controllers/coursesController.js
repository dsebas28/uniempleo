const { getDb } = require('../database/db');

function getCourses(req, res) {
  const db = getDb();
  const { area, level } = req.query;
  let query = 'SELECT * FROM courses WHERE active = 1';
  const params = [];
  if (area) { query += ' AND area = ?'; params.push(area); }
  if (level) { query += ' AND level = ?'; params.push(level); }
  query += ' ORDER BY students_count DESC';
  const courses = db.prepare(query).all(...params);
  res.json(courses);
}

function getCourseById(req, res) {
  const db = getDb();
  const course = db.prepare('SELECT * FROM courses WHERE id = ?').get(req.params.id);
  if (!course) return res.status(404).json({ error: 'Curso no encontrado' });
  const modules = db.prepare('SELECT * FROM course_modules WHERE course_id = ? ORDER BY order_index').all(course.id);
  res.json({ ...course, modules });
}

function enrollCourse(req, res) {
  const db = getDb();
  const student = db.prepare('SELECT * FROM students WHERE user_id = ?').get(req.user.id);
  if (!student) return res.status(404).json({ error: 'Perfil no encontrado' });
  const { courseId } = req.params;
  const course = db.prepare('SELECT * FROM courses WHERE id = ?').get(courseId);
  if (!course) return res.status(404).json({ error: 'Curso no encontrado' });
  try {
    db.prepare('INSERT OR IGNORE INTO enrollments (student_id, course_id, progress) VALUES (?, ?, 0)').run(student.id, courseId);
    db.prepare('UPDATE courses SET students_count = students_count + 1 WHERE id = ?').run(courseId);
    res.json({ message: 'Inscripción exitosa' });
  } catch { res.status(500).json({ error: 'Error al inscribirse' }); }
}

function getEnrollments(req, res) {
  const db = getDb();
  const student = db.prepare('SELECT * FROM students WHERE user_id = ?').get(req.user.id);
  if (!student) return res.status(404).json({ error: 'Perfil no encontrado' });
  const enrollments = db.prepare(`
    SELECT e.*, c.title, c.description, c.duration_hours, c.level, c.area, c.instructor, c.image_url
    FROM enrollments e JOIN courses c ON e.course_id = c.id
    WHERE e.student_id = ? ORDER BY e.enrolled_at DESC
  `).all(student.id);
  res.json(enrollments);
}

module.exports = { getCourses, getCourseById, enrollCourse, getEnrollments };
