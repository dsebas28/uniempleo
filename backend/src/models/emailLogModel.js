const { getDb } = require('../database/db');

const emailLogModel = {
  async create({ studentId, jobId, alertId, toEmail, subject, body }) {
    const db = getDb();
    const result = await db.prepare(`
      INSERT INTO email_log (student_id, job_id, alert_id, to_email, subject, body)
      VALUES (?, ?, ?, ?, ?, ?)
      RETURNING id
    `).run(studentId, jobId || null, alertId || null, toEmail, subject, body);
    return result.lastInsertRowid;
  },

  async getAll(limit = 200) {
    const db = getDb();
    return db.prepare(`
      SELECT el.*, j.title as job_title, s.full_name as student_name
      FROM email_log el
      LEFT JOIN jobs j ON j.id = el.job_id
      LEFT JOIN students s ON s.id = el.student_id
      ORDER BY el.sent_at DESC
      LIMIT ?
    `).all(limit);
  },

  async countAll() {
    const db = getDb();
    return (await db.prepare('SELECT COUNT(*) as c FROM email_log').get()).c;
  }
};

module.exports = emailLogModel;
