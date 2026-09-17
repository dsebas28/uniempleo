const { getDb } = require('../database/db');

const studentModel = {
  findByUserId(userId) {
    const db = getDb();
    const student = db.prepare(`
      SELECT s.*, u.email 
      FROM students s 
      JOIN users u ON s.user_id = u.id 
      WHERE s.user_id = ?
    `).get(userId);

    if (!student) return null;

    const skills = db.prepare(`
      SELECT sk.id, sk.name
      FROM student_skills ss
      JOIN skills sk ON ss.skill_id = sk.id
      WHERE ss.student_id = ?
    `).all(student.id);

    return {
      ...student,
      skills,
      educations: studentModel.getEducations(student.id),
      experiences: studentModel.getExperiences(student.id),
      languages: studentModel.getLanguages(student.id),
    };
  },

  findById(id) {
    const db = getDb();
    const student = db.prepare(`
      SELECT s.*, u.email
      FROM students s
      JOIN users u ON s.user_id = u.id
      WHERE s.id = ?
    `).get(id);

    if (!student) return null;

    const skills = db.prepare(`
      SELECT sk.id, sk.name
      FROM student_skills ss
      JOIN skills sk ON ss.skill_id = sk.id
      WHERE ss.student_id = ?
    `).all(student.id);

    return {
      ...student,
      skills,
      educations: studentModel.getEducations(student.id),
      experiences: studentModel.getExperiences(student.id),
      languages: studentModel.getLanguages(student.id),
    };
  },

  // ---- Educación ----
  getEducations(studentId) {
    const db = getDb();
    return db.prepare(`
      SELECT * FROM educations WHERE student_id = ? ORDER BY end_year IS NULL DESC, end_year DESC, start_year DESC
    `).all(studentId);
  },

  addEducation(studentId, { institution, degree, field, startYear, endYear, current }) {
    const db = getDb();
    const result = db.prepare(`
      INSERT INTO educations (student_id, institution, degree, field, start_year, end_year, current)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(studentId, institution, degree, field || null, startYear || null, current ? null : (endYear || null), current ? 1 : 0);
    return result.lastInsertRowid;
  },

  updateEducation(id, studentId, { institution, degree, field, startYear, endYear, current }) {
    const db = getDb();
    return db.prepare(`
      UPDATE educations SET institution = ?, degree = ?, field = ?, start_year = ?, end_year = ?, current = ?
      WHERE id = ? AND student_id = ?
    `).run(institution, degree, field || null, startYear || null, current ? null : (endYear || null), current ? 1 : 0, id, studentId);
  },

  deleteEducation(id, studentId) {
    const db = getDb();
    return db.prepare('DELETE FROM educations WHERE id = ? AND student_id = ?').run(id, studentId);
  },

  // ---- Experiencia laboral ----
  getExperiences(studentId) {
    const db = getDb();
    return db.prepare(`
      SELECT * FROM experiences WHERE student_id = ? ORDER BY current DESC, start_date DESC
    `).all(studentId);
  },

  addExperience(studentId, { company, position, startDate, endDate, current, description }) {
    const db = getDb();
    const result = db.prepare(`
      INSERT INTO experiences (student_id, company, position, start_date, end_date, current, description)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(studentId, company, position, startDate, current ? null : (endDate || null), current ? 1 : 0, description || null);
    return result.lastInsertRowid;
  },

  updateExperience(id, studentId, { company, position, startDate, endDate, current, description }) {
    const db = getDb();
    return db.prepare(`
      UPDATE experiences SET company = ?, position = ?, start_date = ?, end_date = ?, current = ?, description = ?
      WHERE id = ? AND student_id = ?
    `).run(company, position, startDate, current ? null : (endDate || null), current ? 1 : 0, description || null, id, studentId);
  },

  deleteExperience(id, studentId) {
    const db = getDb();
    return db.prepare('DELETE FROM experiences WHERE id = ? AND student_id = ?').run(id, studentId);
  },

  // ---- Idiomas ----
  getLanguages(studentId) {
    const db = getDb();
    return db.prepare('SELECT * FROM student_languages WHERE student_id = ? ORDER BY id').all(studentId);
  },

  addLanguage(studentId, { language, level }) {
    const db = getDb();
    const result = db.prepare(`
      INSERT INTO student_languages (student_id, language, level) VALUES (?, ?, ?)
      ON CONFLICT(student_id, language) DO UPDATE SET level = excluded.level
    `).run(studentId, language, level);
    return result.lastInsertRowid;
  },

  updateLanguage(id, studentId, { language, level }) {
    const db = getDb();
    return db.prepare(`
      UPDATE student_languages SET language = ?, level = ? WHERE id = ? AND student_id = ?
    `).run(language, level, id, studentId);
  },

  deleteLanguage(id, studentId) {
    const db = getDb();
    return db.prepare('DELETE FROM student_languages WHERE id = ? AND student_id = ?').run(id, studentId);
  },

  create(userId, { fullName, university, career, semester, city, phone, englishLevel, about } = {}) {
    const db = getDb();
    const result = db.prepare(`
      INSERT INTO students (user_id, full_name, university, career, semester, city, phone, english_level, about)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(userId, fullName, university || '', career || '', semester || 1, city || '', phone || '', englishLevel || 'Intermedio', about || '');
    return result.lastInsertRowid;
  },

  // Columnas editables del perfil: clave camelCase (como llega del frontend/servicio) -> columna real
  UPDATE_COLUMNS: {
    fullName: 'full_name', university: 'university', career: 'career', semester: 'semester', city: 'city',
    phone: 'phone', englishLevel: 'english_level', about: 'about_me', availability: 'availability',
    preferredModality: 'preferred_modality', linkedin: 'linkedin', github: 'github', portfolio: 'portfolio',
    headline: 'headline', availableTravel: 'available_travel', availableRelocate: 'available_relocate',
    hasVehicle: 'has_vehicle', birthDate: 'birth_date', gender: 'gender', nationality: 'nationality',
    maritalStatus: 'marital_status', documentId: 'document_id', address: 'address', department: 'department',
    country: 'country', educationLevel: 'education_level', interests: 'interests',
    profileCompletion: 'profile_completion',
  },
  BOOLEAN_FIELDS: new Set(['availableTravel', 'availableRelocate', 'hasVehicle']),

  // Actualiza solo las columnas presentes en `data` (claves no incluidas quedan intactas)
  update(userId, data) {
    const db = getDb();
    const sets = [];
    const values = [];
    for (const [key, column] of Object.entries(studentModel.UPDATE_COLUMNS)) {
      if (data[key] === undefined) continue;
      sets.push(`${column} = ?`);
      values.push(studentModel.BOOLEAN_FIELDS.has(key) ? (data[key] ? 1 : 0) : (data[key] ?? null));
    }
    if (sets.length === 0) return;
    sets.push(`updated_at = datetime('now')`);
    values.push(userId);
    return db.prepare(`UPDATE students SET ${sets.join(', ')} WHERE user_id = ?`).run(...values);
  },

  // Guarda la ruta de la foto de perfil subida por el estudiante
  updatePhoto(userId, photoPath) {
    const db = getDb();
    return db.prepare(`
      UPDATE students SET profile_photo = ?, updated_at = datetime('now') WHERE user_id = ?
    `).run(photoPath, userId);
  },

  clearPhoto(userId) {
    const db = getDb();
    return db.prepare(`
      UPDATE students SET profile_photo = NULL, updated_at = datetime('now') WHERE user_id = ?
    `).run(userId);
  },

  // Guarda la ruta del CV en PDF subido por el estudiante, sin tocar el resto del perfil
  updateResume(userId, { cvPdf, cvOriginalName }) {
    const db = getDb();
    return db.prepare(`
      UPDATE students
      SET cv_pdf = ?, cv_original_name = ?, updated_at = datetime('now')
      WHERE user_id = ?
    `).run(cvPdf, cvOriginalName, userId);
  },

  // Elimina la referencia al CV (usado al reemplazar o borrar el archivo)
  clearResume(userId) {
    const db = getDb();
    return db.prepare(`
      UPDATE students
      SET cv_pdf = NULL, cv_original_name = NULL, updated_at = datetime('now')
      WHERE user_id = ?
    `).run(userId);
  },

  setSkills(studentId, skillsArray = []) {
    const db = getDb();
    db.prepare('DELETE FROM student_skills WHERE student_id = ?').run(studentId);
    const insertSkill = db.prepare('INSERT OR IGNORE INTO skills (name) VALUES (?)');
    const getSkill = db.prepare('SELECT id FROM skills WHERE name = ?');
    const linkSkill = db.prepare('INSERT OR IGNORE INTO student_skills (student_id, skill_id) VALUES (?, ?)');

    for (const skill of skillsArray) {
      if (!skill || !skill.trim()) continue;
      const clean = skill.trim();
      insertSkill.run(clean);
      const skillRow = getSkill.get(clean);
      if (skillRow) linkSkill.run(studentId, skillRow.id);
    }
  },

  getSavedJobs(studentId) {
    const db = getDb();
    return db.prepare(`
      SELECT j.*, c.name as company_name, c.logo as company_logo, sj.saved_at
      FROM saved_jobs sj
      JOIN jobs j ON sj.job_id = j.id
      JOIN companies c ON j.company_id = c.id
      WHERE sj.student_id = ?
      ORDER BY sj.saved_at DESC
    `).all(studentId);
  },

  saveJob(studentId, jobId) {
    const db = getDb();
    return db.prepare('INSERT OR IGNORE INTO saved_jobs (student_id, job_id) VALUES (?, ?)').run(studentId, jobId);
  },

  unsaveJob(studentId, jobId) {
    const db = getDb();
    return db.prepare('DELETE FROM saved_jobs WHERE student_id = ? AND job_id = ?').run(studentId, jobId);
  },

  getStudentStats(studentId) {
    const db = getDb();
    const applicationsCount = db.prepare('SELECT COUNT(*) as count FROM applications WHERE student_id = ?').get(studentId).count;
    const interviewsCount = db.prepare("SELECT COUNT(*) as count FROM applications WHERE student_id = ? AND status = 'interview'").get(studentId).count;
    const savedCount = db.prepare('SELECT COUNT(*) as count FROM saved_jobs WHERE student_id = ?').get(studentId).count;
    return { applicationsCount, interviewsCount, savedCount };
  }
};

module.exports = studentModel;
