const { getDb, transaction } = require('../database/db');

const courseModel = {
  async getAll({ area, level } = {}) {
    const db = getDb();
    let query = 'SELECT * FROM courses WHERE active';
    const params = [];
    if (area) {
      query += ' AND area = ?';
      params.push(area);
    }
    if (level) {
      query += ' AND level = ?';
      params.push(level);
    }
    query += ' ORDER BY students_count DESC';
    return db.prepare(query).all(...params);
  },

  async getById(id) {
    const db = getDb();
    return db.prepare('SELECT * FROM courses WHERE id = ?').get(id);
  },

  async getModules(courseId) {
    const db = getDb();
    return db.prepare('SELECT * FROM course_modules WHERE course_id = ? ORDER BY order_index').all(courseId);
  },

  // Inscribe al estudiante y suma 1 al contador del curso solo si la inscripción es nueva
  async enroll(studentId, courseId) {
    return transaction(async (tx) => {
      const inserted = await tx.prepare(`
        INSERT INTO enrollments (student_id, course_id, progress) VALUES (?, ?, 0)
        ON CONFLICT (student_id, course_id) DO NOTHING
      `).run(studentId, courseId);
      if (inserted.changes > 0) {
        await tx.prepare('UPDATE courses SET students_count = students_count + 1 WHERE id = ?').run(courseId);
      }
      return inserted.changes > 0;
    });
  },

  async getEnrollments(studentId) {
    const db = getDb();
    return db.prepare(`
      SELECT e.*, c.title, c.description, c.duration_hours, c.level, c.area, c.instructor, c.image_url
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      WHERE e.student_id = ?
      ORDER BY e.enrolled_at DESC
    `).all(studentId);
  },

  async getCoursesByArea() {
    const db = getDb();
    return db.prepare('SELECT area, COUNT(*) as count FROM courses GROUP BY area').all();
  }
};

module.exports = courseModel;
