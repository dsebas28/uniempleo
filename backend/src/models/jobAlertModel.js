const { getDb } = require('../database/db');

const jobAlertModel = {
  getByStudentId(studentId) {
    const db = getDb();
    return db.prepare('SELECT * FROM job_alerts WHERE student_id = ? ORDER BY created_at DESC').all(studentId);
  },

  create(studentId, { area, city, modality, keywords }) {
    const db = getDb();
    const result = db.prepare(`
      INSERT INTO job_alerts (student_id, area, city, modality, keywords)
      VALUES (?, ?, ?, ?, ?)
    `).run(studentId, area || null, city || null, modality || null, keywords || null);
    return result.lastInsertRowid;
  },

  setActive(id, studentId, active) {
    const db = getDb();
    return db.prepare(`UPDATE job_alerts SET active = ?, updated_at = datetime('now') WHERE id = ? AND student_id = ?`)
      .run(active ? 1 : 0, id, studentId);
  },

  remove(id, studentId) {
    const db = getDb();
    return db.prepare('DELETE FROM job_alerts WHERE id = ? AND student_id = ?').run(id, studentId);
  },

  // Alertas activas cuyos filtros (área/ciudad/modalidad, si están definidos) calzan con la vacante dada
  findMatchingActive(job) {
    const db = getDb();
    return db.prepare(`
      SELECT ja.*, s.id as student_id, s.full_name, u.id as user_id, u.email
      FROM job_alerts ja
      JOIN students s ON s.id = ja.student_id
      JOIN users u ON u.id = s.user_id
      WHERE ja.active = 1
        AND (ja.area IS NULL OR ja.area = ?)
        AND (ja.city IS NULL OR ja.city = ?)
        AND (ja.modality IS NULL OR ja.modality = ?)
    `).all(job.area, job.city, job.modality);
  }
};

module.exports = jobAlertModel;
