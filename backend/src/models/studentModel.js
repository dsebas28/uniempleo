const { getDb, transaction } = require('../database/db');

const studentModel = {
  async findByUserId(userId) {
    const db = getDb();
    const student = await db.prepare(`
      SELECT s.*, u.email
      FROM students s
      JOIN users u ON s.user_id = u.id
      WHERE s.user_id = ?
    `).get(userId);

    if (!student) return null;
    return studentModel.withDetails(student);
  },

  async findById(id) {
    const db = getDb();
    const student = await db.prepare(`
      SELECT s.*, u.email
      FROM students s
      JOIN users u ON s.user_id = u.id
      WHERE s.id = ?
    `).get(id);

    if (!student) return null;
    return studentModel.withDetails(student);
  },

  // Agrega al perfil sus habilidades, educación, experiencia e idiomas (cuatro consultas en paralelo)
  async withDetails(student) {
    const db = getDb();
    const [skills, educations, experiences, languages] = await Promise.all([
      db.prepare(`
        SELECT sk.id, sk.name
        FROM student_skills ss
        JOIN skills sk ON ss.skill_id = sk.id
        WHERE ss.student_id = ?
      `).all(student.id),
      studentModel.getEducations(student.id),
      studentModel.getExperiences(student.id),
      studentModel.getLanguages(student.id),
    ]);
    return { ...student, skills, educations, experiences, languages };
  },

  // ---- Educación ----
  async getEducations(studentId) {
    const db = getDb();
    return db.prepare(`
      SELECT * FROM educations WHERE student_id = ? ORDER BY end_year IS NULL DESC, end_year DESC, start_year DESC
    `).all(studentId);
  },

  async addEducation(studentId, { institution, degree, field, startYear, endYear, current }) {
    const db = getDb();
    const result = await db.prepare(`
      INSERT INTO educations (student_id, institution, degree, field, start_year, end_year, current)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      RETURNING id
    `).run(studentId, institution, degree, field || null, startYear || null, current ? null : (endYear || null), !!current);
    return result.lastInsertRowid;
  },

  async updateEducation(id, studentId, { institution, degree, field, startYear, endYear, current }) {
    const db = getDb();
    return db.prepare(`
      UPDATE educations SET institution = ?, degree = ?, field = ?, start_year = ?, end_year = ?, current = ?
      WHERE id = ? AND student_id = ?
    `).run(institution, degree, field || null, startYear || null, current ? null : (endYear || null), !!current, id, studentId);
  },

  async deleteEducation(id, studentId) {
    const db = getDb();
    return db.prepare('DELETE FROM educations WHERE id = ? AND student_id = ?').run(id, studentId);
  },

  // ---- Experiencia laboral ----
  async getExperiences(studentId) {
    const db = getDb();
    return db.prepare(`
      SELECT * FROM experiences WHERE student_id = ? ORDER BY current DESC, start_date DESC
    `).all(studentId);
  },

  async addExperience(studentId, { company, position, startDate, endDate, current, description }) {
    const db = getDb();
    const result = await db.prepare(`
      INSERT INTO experiences (student_id, company, position, start_date, end_date, current, description)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      RETURNING id
    `).run(studentId, company, position, startDate, current ? null : (endDate || null), !!current, description || null);
    return result.lastInsertRowid;
  },

  async updateExperience(id, studentId, { company, position, startDate, endDate, current, description }) {
    const db = getDb();
    return db.prepare(`
      UPDATE experiences SET company = ?, position = ?, start_date = ?, end_date = ?, current = ?, description = ?
      WHERE id = ? AND student_id = ?
    `).run(company, position, startDate, current ? null : (endDate || null), !!current, description || null, id, studentId);
  },

  async deleteExperience(id, studentId) {
    const db = getDb();
    return db.prepare('DELETE FROM experiences WHERE id = ? AND student_id = ?').run(id, studentId);
  },

  // ---- Idiomas ----
  async getLanguages(studentId) {
    const db = getDb();
    return db.prepare('SELECT * FROM student_languages WHERE student_id = ? ORDER BY id').all(studentId);
  },

  async addLanguage(studentId, { language, level }) {
    const db = getDb();
    const result = await db.prepare(`
      INSERT INTO student_languages (student_id, language, level) VALUES (?, ?, ?)
      ON CONFLICT (student_id, language) DO UPDATE SET level = excluded.level
      RETURNING id
    `).run(studentId, language, level);
    return result.lastInsertRowid;
  },

  async updateLanguage(id, studentId, { language, level }) {
    const db = getDb();
    return db.prepare(`
      UPDATE student_languages SET language = ?, level = ? WHERE id = ? AND student_id = ?
    `).run(language, level, id, studentId);
  },

  async deleteLanguage(id, studentId) {
    const db = getDb();
    return db.prepare('DELETE FROM student_languages WHERE id = ? AND student_id = ?').run(id, studentId);
  },

  async create(userId, { fullName, university, career, semester, city, phone, englishLevel, about } = {}) {
    const db = getDb();
    const result = await db.prepare(`
      INSERT INTO students (user_id, full_name, university, career, semester, city, phone, english_level, about_me)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      RETURNING id
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
  DATE_FIELDS: new Set(['birthDate']),

  // Actualiza solo las columnas presentes en `data` (claves no incluidas quedan intactas)
  async update(userId, data) {
    const db = getDb();
    const sets = [];
    const values = [];
    for (const [key, column] of Object.entries(studentModel.UPDATE_COLUMNS)) {
      if (data[key] === undefined) continue;
      sets.push(`${column} = ?`);
      if (studentModel.BOOLEAN_FIELDS.has(key)) values.push(!!data[key]);
      else if (studentModel.DATE_FIELDS.has(key)) values.push(data[key] || null); // un campo de fecha vacío se guarda como NULL
      else values.push(data[key] ?? null);
    }
    if (sets.length === 0) return;
    sets.push('updated_at = LOCALTIMESTAMP(0)');
    values.push(userId);
    return db.prepare(`UPDATE students SET ${sets.join(', ')} WHERE user_id = ?`).run(...values);
  },

  // Guarda la ruta de la foto de perfil subida por el estudiante
  async updatePhoto(userId, photoPath) {
    const db = getDb();
    return db.prepare(`
      UPDATE students SET profile_photo = ?, updated_at = LOCALTIMESTAMP(0) WHERE user_id = ?
    `).run(photoPath, userId);
  },

  async clearPhoto(userId) {
    const db = getDb();
    return db.prepare(`
      UPDATE students SET profile_photo = NULL, updated_at = LOCALTIMESTAMP(0) WHERE user_id = ?
    `).run(userId);
  },

  // Guarda la ruta del CV en PDF subido por el estudiante, sin tocar el resto del perfil
  async updateResume(userId, { cvPdf, cvOriginalName }) {
    const db = getDb();
    return db.prepare(`
      UPDATE students
      SET cv_pdf = ?, cv_original_name = ?, updated_at = LOCALTIMESTAMP(0)
      WHERE user_id = ?
    `).run(cvPdf, cvOriginalName, userId);
  },

  // Elimina la referencia al CV (usado al reemplazar o borrar el archivo)
  async clearResume(userId) {
    const db = getDb();
    return db.prepare(`
      UPDATE students
      SET cv_pdf = NULL, cv_original_name = NULL, updated_at = LOCALTIMESTAMP(0)
      WHERE user_id = ?
    `).run(userId);
  },

  // Reemplaza todas las habilidades del estudiante en una transacción: si algo falla, conserva las anteriores
  async setSkills(studentId, skillsArray = []) {
    return transaction(async (tx) => {
      await tx.prepare('DELETE FROM student_skills WHERE student_id = ?').run(studentId);
      for (const skill of skillsArray) {
        if (!skill || !skill.trim()) continue;
        const clean = skill.trim();
        await tx.prepare('INSERT INTO skills (name) VALUES (?) ON CONFLICT (name) DO NOTHING').run(clean);
        const skillRow = await tx.prepare('SELECT id FROM skills WHERE name = ?').get(clean);
        if (skillRow) {
          await tx.prepare(`
            INSERT INTO student_skills (student_id, skill_id) VALUES (?, ?)
            ON CONFLICT (student_id, skill_id) DO NOTHING
          `).run(studentId, skillRow.id);
        }
      }
    });
  },

  async getSavedJobs(studentId) {
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

  async saveJob(studentId, jobId) {
    const db = getDb();
    return db.prepare(`
      INSERT INTO saved_jobs (student_id, job_id) VALUES (?, ?)
      ON CONFLICT (student_id, job_id) DO NOTHING
    `).run(studentId, jobId);
  },

  async unsaveJob(studentId, jobId) {
    const db = getDb();
    return db.prepare('DELETE FROM saved_jobs WHERE student_id = ? AND job_id = ?').run(studentId, jobId);
  },

  async getStudentStats(studentId) {
    const db = getDb();
    return db.prepare(`
      SELECT COUNT(*)                                     AS "applicationsCount",
             COUNT(*) FILTER (WHERE status = 'interview') AS "interviewsCount",
             (SELECT COUNT(*) FROM saved_jobs WHERE student_id = ?) AS "savedCount"
      FROM applications
      WHERE student_id = ?
    `).get(studentId, studentId);
  }
};

module.exports = studentModel;
