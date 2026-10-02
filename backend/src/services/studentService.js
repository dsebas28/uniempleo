const fs = require('fs');
const path = require('path');
const studentModel = require('../models/studentModel');
const jobModel = require('../models/jobModel');
const applicationModel = require('../models/applicationModel');
const jobAlertService = require('./jobAlertService');

// Calcula qué tan completo está el perfil para orientar al estudiante
function calculateCompletion(s) {
  const fields = [s.full_name, s.university, s.career, s.city, s.about_me, s.english_level, s.cv_pdf, s.headline, s.profile_photo];
  const filled = fields.filter(Boolean).length;
  const skillsBonus = (s.skills && s.skills.length > 0) ? 1 : 0;
  const educationBonus = (s.educations && s.educations.length > 0) ? 1 : 0;
  const experienceBonus = (s.experiences && s.experiences.length > 0) ? 1 : 0;
  const languagesBonus = (s.languages && s.languages.length > 0) ? 1 : 0;
  const bonuses = skillsBonus + educationBonus + experienceBonus + languagesBonus;
  return Math.min(100, Math.round(((filled + bonuses) / (fields.length + 4)) * 100));
}

// Resuelve el student.id interno a partir del userId autenticado, o lanza si no existe
async function requireStudent(userId) {
  const student = await studentModel.findByUserId(userId);
  if (!student) throw new Error('Perfil de estudiante no encontrado');
  return student;
}

const studentService = {
  async getProfile(userId) {
    const student = await studentModel.findByUserId(userId);
    if (!student) throw new Error('Perfil de estudiante no encontrado');
    return student;
  },

  async updateProfile(userId, profileData) {
    const student = await requireStudent(userId);

    // El frontend usa `aboutMe`; el modelo/DB usa `about` -> about_me. Se normaliza aquí.
    const updates = { ...profileData };
    if (updates.aboutMe !== undefined) {
      updates.about = updates.aboutMe;
      delete updates.aboutMe;
    }

    // Vista previa (snake_case) del estudiante con los cambios aplicados, solo para calcular el % de completitud
    const preview = { ...student };
    for (const [key, column] of Object.entries(studentModel.UPDATE_COLUMNS)) {
      if (updates[key] !== undefined) preview[column] = updates[key];
    }
    updates.profileCompletion = calculateCompletion(preview);

    await studentModel.update(userId, updates);

    if (profileData.skills && Array.isArray(profileData.skills)) {
      await studentModel.setSkills(student.id, profileData.skills);
    }

    return await studentModel.findByUserId(userId);
  },

  // Sube (o reemplaza) el CV en PDF del estudiante
  async uploadResume(userId, file) {
    const student = await studentModel.findByUserId(userId);
    if (!student) throw new Error('Perfil de estudiante no encontrado');

    // Borra el archivo anterior si existía, para no dejar basura en disco
    if (student.cv_pdf) {
      const oldPath = path.join(__dirname, '..', '..', student.cv_pdf.replace(/^\/uploads\//, 'uploads/'));
      fs.unlink(oldPath, () => {});
    }

    const cvPdf = `/uploads/resumes/${file.filename}`;
    await studentModel.updateResume(userId, { cvPdf, cvOriginalName: file.originalname });
    await studentService.refreshCompletion(userId);

    return await studentModel.findByUserId(userId);
  },

  // Elimina el CV subido
  async deleteResume(userId) {
    const student = await studentModel.findByUserId(userId);
    if (!student) throw new Error('Perfil de estudiante no encontrado');
    if (student.cv_pdf) {
      const oldPath = path.join(__dirname, '..', '..', student.cv_pdf.replace(/^\/uploads\//, 'uploads/'));
      fs.unlink(oldPath, () => {});
    }
    await studentModel.clearResume(userId);
    return await studentModel.findByUserId(userId);
  },

  async getDashboard(userId) {
    const student = await studentModel.findByUserId(userId);
    if (!student) throw new Error('Perfil de estudiante no encontrado');

    const [stats, applications, { jobs: recommendedJobs }, appsByMonth, appsByStatus] = await Promise.all([
      studentModel.getStudentStats(student.id),
      applicationModel.findByStudentId(student.id),
      jobModel.getAll({ limit: 4 }),
      applicationModel.countByMonthForStudent(student.id),
      applicationModel.countByStatusForStudent(student.id),
    ]);

    const statsData = {
      totalApplications: stats.applicationsCount,
      interviews: stats.interviewsCount,
      savedJobs: stats.savedCount,
      profileCompletion: student.profile_completion || 70
    };

    return {
      student,
      stats: statsData,
      // Formato que lee el panel del estudiante (pages/student/Dashboard.jsx)
      kpis: { ...statsData, totalApps: stats.applicationsCount },
      appsByMonth,
      appsByStatus,
      recommended: recommendedJobs,
      recentApplications: applications.slice(0, 5),
      recommendedJobs
    };
  },

  async getSavedJobs(userId) {
    const student = await studentModel.findByUserId(userId);
    if (!student) throw new Error('Perfil de estudiante no encontrado');
    return await studentModel.getSavedJobs(student.id);
  },

  async saveJob(userId, jobId) {
    const student = await studentModel.findByUserId(userId);
    if (!student) throw new Error('Perfil de estudiante no encontrado');
    await studentModel.saveJob(student.id, jobId);
    return { message: 'Oferta guardada en favoritos' };
  },

  async unsaveJob(userId, jobId) {
    const student = await studentModel.findByUserId(userId);
    if (!student) throw new Error('Perfil de estudiante no encontrado');
    await studentModel.unsaveJob(student.id, jobId);
    return { message: 'Oferta eliminada de favoritos' };
  },

  // ---- Alertas de empleo ----
  async getJobAlerts(userId) {
    const student = await requireStudent(userId);
    return await jobAlertService.getMyAlerts(student.id);
  },

  async createJobAlert(userId, data) {
    const student = await requireStudent(userId);
    return await jobAlertService.createAlert(student.id, data);
  },

  async toggleJobAlert(userId, alertId, active) {
    const student = await requireStudent(userId);
    return await jobAlertService.toggleAlert(student.id, alertId, active);
  },

  async deleteJobAlert(userId, alertId) {
    const student = await requireStudent(userId);
    return await jobAlertService.deleteAlert(student.id, alertId);
  },

  // Recalcula y guarda el % de perfil completado tras cambios en educación/experiencia/idiomas/foto
  async refreshCompletion(userId) {
    const updated = await studentModel.findByUserId(userId);
    await studentModel.update(userId, { profileCompletion: calculateCompletion(updated) });
  },

  // ---- Foto de perfil ----
  async uploadPhoto(userId, file) {
    const student = await requireStudent(userId);
    if (student.profile_photo) {
      const oldPath = path.join(__dirname, '..', '..', student.profile_photo.replace(/^\/uploads\//, 'uploads/'));
      fs.unlink(oldPath, () => {});
    }
    const photoPath = `/uploads/photos/${file.filename}`;
    await studentModel.updatePhoto(userId, photoPath);
    await studentService.refreshCompletion(userId);
    return await studentModel.findByUserId(userId);
  },

  async deletePhoto(userId) {
    const student = await requireStudent(userId);
    if (student.profile_photo) {
      const oldPath = path.join(__dirname, '..', '..', student.profile_photo.replace(/^\/uploads\//, 'uploads/'));
      fs.unlink(oldPath, () => {});
    }
    await studentModel.clearPhoto(userId);
    await studentService.refreshCompletion(userId);
    return await studentModel.findByUserId(userId);
  },

  // ---- Idiomas ----
  async addLanguage(userId, data) {
    const student = await requireStudent(userId);
    await studentModel.addLanguage(student.id, data);
    await studentService.refreshCompletion(userId);
    return await studentModel.findByUserId(userId);
  },

  async updateLanguage(userId, languageId, data) {
    const student = await requireStudent(userId);
    await studentModel.updateLanguage(languageId, student.id, data);
    return await studentModel.findByUserId(userId);
  },

  async deleteLanguage(userId, languageId) {
    const student = await requireStudent(userId);
    await studentModel.deleteLanguage(languageId, student.id);
    await studentService.refreshCompletion(userId);
    return await studentModel.findByUserId(userId);
  },

  // ---- Educación ----
  async addEducation(userId, data) {
    const student = await requireStudent(userId);
    await studentModel.addEducation(student.id, data);
    await studentService.refreshCompletion(userId);
    return await studentModel.findByUserId(userId);
  },

  async updateEducation(userId, educationId, data) {
    const student = await requireStudent(userId);
    await studentModel.updateEducation(educationId, student.id, data);
    return await studentModel.findByUserId(userId);
  },

  async deleteEducation(userId, educationId) {
    const student = await requireStudent(userId);
    await studentModel.deleteEducation(educationId, student.id);
    await studentService.refreshCompletion(userId);
    return await studentModel.findByUserId(userId);
  },

  // ---- Experiencia laboral ----
  async addExperience(userId, data) {
    const student = await requireStudent(userId);
    await studentModel.addExperience(student.id, data);
    await studentService.refreshCompletion(userId);
    return await studentModel.findByUserId(userId);
  },

  async updateExperience(userId, experienceId, data) {
    const student = await requireStudent(userId);
    await studentModel.updateExperience(experienceId, student.id, data);
    return await studentModel.findByUserId(userId);
  },

  async deleteExperience(userId, experienceId) {
    const student = await requireStudent(userId);
    await studentModel.deleteExperience(experienceId, student.id);
    await studentService.refreshCompletion(userId);
    return await studentModel.findByUserId(userId);
  }
};

module.exports = studentService;
