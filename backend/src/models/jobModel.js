const { getDb } = require('../database/db');

const jobModel = {
  getAll({ keyword, city, modality, area, isInternship, noExperience, minSalary, maxSalary, page = 1, limit = 12 } = {}) {
    const db = getDb();
    let query = `
      SELECT j.*, c.name as company_name, c.logo as company_logo, c.sector as company_sector
      FROM jobs j
      JOIN companies c ON j.company_id = c.id
      WHERE j.status = 'active'
    `;
    const params = [];

    if (keyword) {
      query += ` AND (j.title LIKE ? OR j.description LIKE ? OR j.skills LIKE ? OR c.name LIKE ?)`;
      const kw = `%${keyword}%`;
      params.push(kw, kw, kw, kw);
    }
    if (city) {
      query += ` AND j.city = ?`;
      params.push(city);
    }
    if (modality) {
      query += ` AND j.modality = ?`;
      params.push(modality);
    }
    if (area) {
      query += ` AND j.area = ?`;
      params.push(area);
    }
    if (isInternship !== undefined && isInternship !== '') {
      query += ` AND j.is_internship = ?`;
      params.push(isInternship === 'true' || isInternship === true || isInternship === '1' ? 1 : 0);
    }
    if (noExperience !== undefined && noExperience !== '') {
      query += ` AND j.no_experience_ok = ?`;
      params.push(noExperience === 'true' || noExperience === true || noExperience === '1' ? 1 : 0);
    }
    if (minSalary) {
      query += ` AND (j.salary_max >= ? OR j.salary_max IS NULL)`;
      params.push(Number(minSalary));
    }

    const countQuery = query.replace('SELECT j.*, c.name as company_name, c.logo as company_logo, c.sector as company_sector', 'SELECT COUNT(*) as count');
    const total = db.prepare(countQuery).get(...params).count;

    query += ` ORDER BY j.created_at DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

    const jobs = db.prepare(query).all(...params);
    return { jobs, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) };
  },

  getById(id) {
    const db = getDb();
    return db.prepare(`
      SELECT j.*, c.name as company_name, c.logo as company_logo, c.sector as company_sector,
             c.city as company_city, c.description as company_description, c.website as company_website
      FROM jobs j
      JOIN companies c ON j.company_id = c.id
      WHERE j.id = ?
    `).get(id);
  },

  getByCompanyId(companyId) {
    const db = getDb();
    return db.prepare(`
      SELECT j.*, 
             (SELECT COUNT(*) FROM applications a WHERE a.job_id = j.id) as application_count
      FROM jobs j 
      WHERE j.company_id = ? 
      ORDER BY j.created_at DESC
    `).all(companyId);
  },

  getAllAdmin() {
    const db = getDb();
    return db.prepare(`
      SELECT j.*, c.name as company_name 
      FROM jobs j 
      JOIN companies c ON j.company_id = c.id 
      ORDER BY j.created_at DESC
    `).all();
  },

  create(companyId, jobData) {
    const db = getDb();
    const {
      title, description, responsibilities, requirements, skills, benefits,
      salaryMin, salaryMax, city, modality, contractType, experienceYears,
      educationLevel, area, isInternship, noExperienceOk, deadline
    } = jobData;

    const result = db.prepare(`
      INSERT INTO jobs (
        company_id, title, description, responsibilities, requirements, skills,
        benefits, salary_min, salary_max, city, modality, contract_type,
        experience_years, education_level, area, is_internship, no_experience_ok, deadline
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      companyId, title, description, responsibilities || '', requirements || '', skills || '',
      benefits || '', salaryMin || null, salaryMax || null, city, modality, contractType,
      experienceYears || 0, educationLevel || '', area, isInternship ? 1 : 0,
      noExperienceOk ? 1 : 0, deadline || null
    );

    return result.lastInsertRowid;
  },

  update(jobId, companyId, jobData) {
    const db = getDb();
    const {
      title, description, responsibilities, requirements, skills, benefits,
      salaryMin, salaryMax, city, modality, contractType, experienceYears,
      area, isInternship, noExperienceOk, deadline, status
    } = jobData;

    return db.prepare(`
      UPDATE jobs 
      SET title = ?, description = ?, responsibilities = ?, requirements = ?, skills = ?,
          benefits = ?, salary_min = ?, salary_max = ?, city = ?, modality = ?,
          contract_type = ?, experience_years = ?, area = ?, is_internship = ?,
          no_experience_ok = ?, deadline = ?, status = COALESCE(?, status), updated_at = datetime('now')
      WHERE id = ? AND company_id = ?
    `).run(
      title, description, responsibilities, requirements, skills, benefits,
      salaryMin, salaryMax, city, modality, contractType, experienceYears,
      area, isInternship ? 1 : 0, noExperienceOk ? 1 : 0, deadline, status,
      jobId, companyId
    );
  },

  updateStatus(jobId, status) {
    const db = getDb();
    return db.prepare(`UPDATE jobs SET status = ?, updated_at = datetime('now') WHERE id = ?`).run(status, jobId);
  },

  incrementApplicants(jobId) {
    const db = getDb();
    return db.prepare(`UPDATE jobs SET applicants_count = applicants_count + 1 WHERE id = ?`).run(jobId);
  },

  delete(jobId, companyId) {
    const db = getDb();
    return db.prepare('DELETE FROM jobs WHERE id = ? AND company_id = ?').run(jobId, companyId);
  },

  getStats() {
    const db = getDb();
    const students = db.prepare(`SELECT COUNT(*) as c FROM users WHERE role = 'student'`).get().c;
    const companies = db.prepare(`SELECT COUNT(*) as c FROM companies WHERE approved = 1`).get().c;
    const jobs = db.prepare(`SELECT COUNT(*) as c FROM jobs WHERE status = 'active'`).get().c;
    const hired = db.prepare(`SELECT COUNT(*) as c FROM applications WHERE status = 'selected'`).get().c;
    return { students, companies, jobs, hired };
  },

  getJobsByArea(limit = 8) {
    const db = getDb();
    return db.prepare(`SELECT area, COUNT(*) as count FROM jobs GROUP BY area ORDER BY count DESC LIMIT ?`).all(limit);
  },

  getJobsByCity(limit = 10) {
    const db = getDb();
    return db.prepare(`SELECT city, COUNT(*) as count FROM jobs GROUP BY city ORDER BY count DESC LIMIT ?`).all(limit);
  },

  getJobsByModality() {
    const db = getDb();
    return db.prepare(`SELECT modality, COUNT(*) as count FROM jobs GROUP BY modality`).all();
  }
};

module.exports = jobModel;
