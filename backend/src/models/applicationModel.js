const { getDb } = require('../database/db');
const studentModel = require('./studentModel');

const applicationModel = {
  async create(jobId, studentId, coverLetter = '') {
    const db = getDb();
    const result = await db.prepare(`
      INSERT INTO applications (job_id, student_id, cover_letter, status)
      VALUES (?, ?, ?, 'sent')
      RETURNING id
    `).run(jobId, studentId, coverLetter);
    return result.lastInsertRowid;
  },

  async hasApplied(jobId, studentId) {
    const db = getDb();
    const existing = await db.prepare('SELECT id FROM applications WHERE job_id = ? AND student_id = ?').get(jobId, studentId);
    return !!existing;
  },

  async findByStudentId(studentId) {
    const db = getDb();
    return db.prepare(`
      SELECT a.*, j.title as job_title, j.city, j.modality, j.contract_type, j.is_internship,
             c.name as company_name, c.logo as company_logo, c.sector as company_sector
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      JOIN companies c ON j.company_id = c.id
      WHERE a.student_id = ?
      ORDER BY a.applied_at DESC
    `).all(studentId);
  },

  async findByCompanyId(companyId, jobId = null) {
    const db = getDb();
    let query = `
      SELECT a.*, s.full_name, s.career, s.university, s.city as student_city, s.english_level, s.profile_completion,
             s.cv_pdf, s.cv_original_name, s.headline, s.profile_photo, s.phone, s.about_me,
             s.available_travel, s.available_relocate, s.has_vehicle,
             s.linkedin, s.github, s.portfolio, s.availability, s.preferred_modality,
             s.birth_date, s.gender, s.nationality, s.marital_status, s.document_id,
             s.address, s.department, s.country, s.education_level, s.interests,
             j.title as job_title, u.email
      FROM applications a
      JOIN students s ON a.student_id = s.id
      JOIN jobs j ON a.job_id = j.id
      JOIN users u ON s.user_id = u.id
      WHERE j.company_id = ?
    `;
    const params = [companyId];
    if (jobId) {
      query += ' AND a.job_id = ?';
      params.push(jobId);
    }
    query += ' ORDER BY a.applied_at DESC';

    const candidates = await db.prepare(query).all(...params);

    return Promise.all(candidates.map(async (c) => {
      const [skills, educations, experiences, languages] = await Promise.all([
        db.prepare(`
          SELECT sk.name FROM student_skills ss
          JOIN skills sk ON ss.skill_id = sk.id
          WHERE ss.student_id = ?
        `).all(c.student_id),
        studentModel.getEducations(c.student_id),
        studentModel.getExperiences(c.student_id),
        studentModel.getLanguages(c.student_id),
      ]);
      const matchPct = 65 + Math.floor(Math.random() * 35);
      return {
        ...c,
        skills: skills.map(s => s.name),
        educations,
        experiences,
        languages,
        matchPercentage: matchPct,
      };
    }));
  },

  async findByIdAndCompany(applicationId, companyId) {
    const db = getDb();
    return db.prepare(`
      SELECT a.*, j.title as job_title, c.name as company_name
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      JOIN companies c ON j.company_id = c.id
      WHERE a.id = ? AND j.company_id = ?
    `).get(applicationId, companyId);
  },

  async updateStatus(applicationId, status) {
    const db = getDb();
    return db.prepare(`UPDATE applications SET status = ?, updated_at = LOCALTIMESTAMP(0) WHERE id = ?`).run(status, applicationId);
  },

  // Postulaciones del estudiante agrupadas por mes ('YYYY-MM') y por estado, para las gráficas de su panel
  async countByMonthForStudent(studentId) {
    const db = getDb();
    return db.prepare(`
      SELECT to_char(applied_at, 'YYYY-MM') AS month, COUNT(*) AS count
      FROM applications
      WHERE student_id = ?
      GROUP BY month
      ORDER BY month
    `).all(studentId);
  },

  async countByStatusForStudent(studentId) {
    const db = getDb();
    return db.prepare(`SELECT status, COUNT(*) AS count FROM applications WHERE student_id = ? GROUP BY status`).all(studentId);
  },

  async countByStatus() {
    const db = getDb();
    return db.prepare(`SELECT status, COUNT(*) as count FROM applications GROUP BY status`).all();
  },

  async getTotalCount() {
    const db = getDb();
    return (await db.prepare(`SELECT COUNT(*) as c FROM applications`).get()).c;
  },

  async getHiredCount() {
    const db = getDb();
    return (await db.prepare(`SELECT COUNT(*) as c FROM applications WHERE status = 'selected'`).get()).c;
  }
};

module.exports = applicationModel;
