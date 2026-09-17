const { getDb } = require('../database/db');

const companyModel = {
  findByUserId(userId) {
    const db = getDb();
    return db.prepare(`
      SELECT c.*, u.email 
      FROM companies c 
      JOIN users u ON c.user_id = u.id 
      WHERE c.user_id = ?
    `).get(userId);
  },

  findById(id) {
    const db = getDb();
    return db.prepare(`
      SELECT c.*, u.email 
      FROM companies c 
      JOIN users u ON c.user_id = u.id 
      WHERE c.id = ?
    `).get(id);
  },

  create(userId, { name, nit, phone, city, sector, description, mission } = {}) {
    const db = getDb();
    const result = db.prepare(`
      INSERT INTO companies (user_id, name, nit, phone, city, sector, description, mission, approved)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
    `).run(userId, name, nit || '', phone || '', city || '', sector || '', description || '', mission || '');
    return result.lastInsertRowid;
  },

  update(userId, { name, phone, city, sector, description, mission, website, linkedin, instagram, logo }) {
    const db = getDb();
    return db.prepare(`
      UPDATE companies 
      SET name = ?, phone = ?, city = ?, sector = ?, description = ?, 
          mission = ?, website = ?, linkedin = ?, instagram = ?, logo = ?, updated_at = datetime('now')
      WHERE user_id = ?
    `).run(name, phone, city, sector, description, mission, website, linkedin, instagram, logo, userId);
  },

  getAllApproved() {
    const db = getDb();
    return db.prepare(`
      SELECT c.id, c.name, c.city, c.sector, c.description, c.logo, c.approved, c.website,
             COUNT(j.id) as job_count
      FROM companies c
      LEFT JOIN jobs j ON j.company_id = c.id AND j.status = 'active'
      WHERE c.approved = 1
      GROUP BY c.id
      ORDER BY c.name ASC
    `).all();
  },

  getAllAdmin() {
    const db = getDb();
    return db.prepare(`
      SELECT c.*, u.email 
      FROM companies c 
      JOIN users u ON c.user_id = u.id 
      ORDER BY c.created_at DESC
    `).all();
  },

  setApproved(id, approved) {
    const db = getDb();
    return db.prepare('UPDATE companies SET approved = ? WHERE id = ?').run(approved ? 1 : 0, id);
  },

  getDashboardKPIs(companyId) {
    const db = getDb();
    const activeJobs = db.prepare(`SELECT COUNT(*) as c FROM jobs WHERE company_id = ? AND status = 'active'`).get(companyId).c;
    const totalApplications = db.prepare(`SELECT COUNT(*) as c FROM applications a JOIN jobs j ON a.job_id = j.id WHERE j.company_id = ?`).get(companyId).c;
    const interviews = db.prepare(`SELECT COUNT(*) as c FROM applications a JOIN jobs j ON a.job_id = j.id WHERE j.company_id = ? AND a.status = 'interview'`).get(companyId).c;
    const candidates = db.prepare(`SELECT COUNT(DISTINCT a.student_id) as c FROM applications a JOIN jobs j ON a.job_id = j.id WHERE j.company_id = ?`).get(companyId).c;
    return { activeJobs, totalApplications, interviews, candidates };
  }
};

module.exports = companyModel;
