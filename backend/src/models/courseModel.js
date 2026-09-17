const { getDb } = require('../database/db');

const courseModel = {
  getAll({ area, level } = {}) {
    const db = getDb();
    let query = 'SELECT * FROM courses WHERE 1=1';
    const params = [];
    if (area) {
      query += ' AND area = ?';
      params.push(area);
    }
    if (level) {
      query += ' AND level = ?';
      params.push(level);
    }
    query += ' ORDER BY created_at DESC';
    return db.prepare(query).all(...params);
  },

  getById(id) {
    const db = getDb();
    return db.prepare('SELECT * FROM courses WHERE id = ?').get(id);
  },

  enroll(userId, courseId) {
    const db = getDb();
    return db.prepare('INSERT OR IGNORE INTO course_enrollments (user_id, course_id) VALUES (?, ?)').run(userId, courseId);
  },

  getEnrollments(userId) {
    const db = getDb();
    return db.prepare(`
      SELECT ce.*, c.title, c.description, c.duration_hours, c.level, c.area, c.image_url, c.instructor
      FROM course_enrollments ce
      JOIN courses c ON ce.course_id = c.id
      WHERE ce.user_id = ?
      ORDER BY ce.enrolled_at DESC
    `).all(userId);
  },

  getCoursesByArea() {
    const db = getDb();
    return db.prepare('SELECT area, COUNT(*) as count FROM courses GROUP BY area').all();
  }
};

module.exports = courseModel;
