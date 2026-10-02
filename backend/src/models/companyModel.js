const { getDb } = require('../database/db');

const companyModel = {
  async findByUserId(userId) {
    const db = getDb();
    return db.prepare(`
      SELECT c.*, u.email
      FROM companies c
      JOIN users u ON c.user_id = u.id
      WHERE c.user_id = ?
    `).get(userId);
  },

  async findById(id) {
    const db = getDb();
    return db.prepare(`
      SELECT c.*, u.email
      FROM companies c
      JOIN users u ON c.user_id = u.id
      WHERE c.id = ?
    `).get(id);
  },

  async create(userId, { name, nit, phone, city, sector, description, mission } = {}) {
    const db = getDb();
    const result = await db.prepare(`
      INSERT INTO companies (user_id, name, nit, phone, city, sector, description, mission, approved)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, TRUE)
      RETURNING id
    `).run(userId, name, nit || '', phone || '', city || '', sector || '', description || '', mission || '');
    return result.lastInsertRowid;
  },

  async update(userId, { name, phone, city, sector, description, mission, website, linkedin, instagram, logo }) {
    const db = getDb();
    return db.prepare(`
      UPDATE companies
      SET name = ?, phone = ?, city = ?, sector = ?, description = ?,
          mission = ?, website = ?, linkedin = ?, instagram = ?, logo = ?, updated_at = LOCALTIMESTAMP(0)
      WHERE user_id = ?
    `).run(name, phone, city, sector, description, mission, website, linkedin, instagram, logo, userId);
  },

  async getAllApproved() {
    const db = getDb();
    return db.prepare(`
      SELECT c.id, c.name, c.city, c.sector, c.description, c.logo, c.approved, c.website,
             COUNT(j.id) as job_count
      FROM companies c
      LEFT JOIN jobs j ON j.company_id = c.id AND j.status = 'active'
      WHERE c.approved
      GROUP BY c.id
      ORDER BY c.name ASC
    `).all();
  },

  async getAllAdmin() {
    const db = getDb();
    return db.prepare(`
      SELECT c.*, u.email
      FROM companies c
      JOIN users u ON c.user_id = u.id
      ORDER BY c.created_at DESC
    `).all();
  },

  async setApproved(id, approved) {
    const db = getDb();
    return db.prepare('UPDATE companies SET approved = ?, updated_at = LOCALTIMESTAMP(0) WHERE id = ?').run(!!approved, id);
  },

  // Los cuatro indicadores del panel de la empresa en una sola consulta (FILTER cuenta cada caso por separado)
  async getDashboardKPIs(companyId) {
    const db = getDb();
    return db.prepare(`
      SELECT (SELECT COUNT(*) FROM jobs WHERE company_id = ? AND status = 'active')  AS "activeJobs",
             COUNT(a.id)                                                            AS "totalApplications",
             COUNT(a.id) FILTER (WHERE a.status = 'interview')                      AS interviews,
             COUNT(a.id) FILTER (WHERE a.status = 'reviewing')                      AS reviewing,
             COUNT(a.id) FILTER (WHERE a.status = 'selected')                       AS selected,
             COUNT(DISTINCT a.student_id)                                           AS candidates
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      WHERE j.company_id = ?
    `).get(companyId, companyId);
  },

  async countApplicationsByStatus(companyId) {
    const db = getDb();
    return db.prepare(`
      SELECT a.status, COUNT(*) AS count
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      WHERE j.company_id = ?
      GROUP BY a.status
    `).all(companyId);
  }
};

module.exports = companyModel;
