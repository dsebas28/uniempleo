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
function requireStudent(userId) {
  const student = studentModel.findByUserId(userId);
  if (!student) throw new Error('Perfil de estudiante no encontrado');
  return student;
}

const studentService = {
  getProfile(userId) {
    const student = studentModel.findByUserId(userId);
    if (!student) throw new Error('Perfil de estudiante no encontrado');
    return student;
  },

  updateProfile(userId, profileData) {
    const student = requireStudent(userId);

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

    studentModel.update(userId, updates);

    if (profileData.skills && Array.isArray(profileData.skills)) {
      studentModel.setSkills(student.id, profileData.skills);
    }

    return studentModel.findByUserId(userId);
  },

  // Sube (o reemplaza) el CV en PDF del estudiante
  uploadResume(userId, file) {
    const student = studentModel.findByUserId(userId);
    if (!student) throw new Error('Perfil de estudiante no encontrado');

    // Borra el archivo anterior si existía, para no dejar basura en disco
    if (student.cv_pdf) {
      const oldPath = path.join(__dirname, '..', '..', student.cv_pdf.replace(/^\/uploads\//, 'uploads/'));
      fs.unlink(oldPath, () => {});
    }

    const cvPdf = `/uploads/resumes/${file.filename}`;
    studentModel.updateResume(userId, { cvPdf, cvOriginalName: file.originalname });
    studentService.refreshCompletion(userId);

    return studentModel.findByUserId(userId);
  },

  // Elimina el CV subido
  deleteResume(userId) {
    const student = studentModel.findByUserId(userId);
    if (!student) throw new Error('Perfil de estudiante no encontrado');
    if (student.cv_pdf) {
      const oldPath = path.join(__dirname, '..', '..', student.cv_pdf.replace(/^\/uploads\//, 'uploads/'));
      fs.unlink(oldPath, () => {});
    }
    studentModel.clearResume(userId);
    return studentModel.findByUserId(userId);
  },

  getDashboard(userId) {
    const student = studentModel.findByUserId(userId);
    if (!student) throw new Error('Perfil de estudiante no encontrado');

    const stats = studentModel.getStudentStats(student.id);
    const applications = applicationModel.findByStudentId(student.id);
    const { jobs: recommendedJobs } = jobModel.getAll({ limit: 4 });

    return {
      student,
      stats: {
        totalApplications: stats.applicationsCount,
        interviews: stats.interviewsCount,
        savedJobs: stats.savedCount,
        profileCompletion: student.profile_completion || 70
      },
      recentApplications: applications.slice(0, 5),
      recommendedJobs
    };
  },

  getSavedJobs(userId) {
    const student = studentModel.findByUserId(userId);
    if (!student) throw new Error('Perfil de estudiante no encontrado');
    return studentModel.getSavedJobs(student.id);
  },

  saveJob(userId, jobId) {
    const student = studentModel.findByUserId(userId);
    if (!student) throw new Error('Perfil de estudiante no encontrado');
    studentModel.saveJob(student.id, jobId);
    return { message: 'Oferta guardada en favoritos' };
  },

  unsaveJob(userId, jobId) {
    const student = studentModel.findByUserId(userId);
    if (!student) throw new Error('Perfil de estudiante no encontrado');
    studentModel.unsaveJob(student.id, jobId);
    return { message: 'Oferta eliminada de favoritos' };
  },

  // ---- Alertas de empleo ----
  getJobAlerts(userId) {
    const student = requireStudent(userId);
    return jobAlertService.getMyAlerts(student.id);
  },

  createJobAlert(userId, data) {
    const student = requireStudent(userId);
    return jobAlertService.createAlert(student.id, data);
  },

  toggleJobAlert(userId, alertId, active) {
    const student = requireStudent(userId);
    return jobAlertService.toggleAlert(student.id, alertId, active);
  },

  deleteJobAlert(userId, alertId) {
    const student = requireStudent(userId);
    return jobAlertService.deleteAlert(student.id, alertId);
  },

  // Recalcula y guarda el % de perfil completado tras cambios en educación/experiencia/idiomas/foto
  refreshCompletion(userId) {
    const updated = studentModel.findByUserId(userId);
    studentModel.update(userId, { profileCompletion: calculateCompletion(updated) });
  },

  // ---- Foto de perfil ----
  uploadPhoto(userId, file) {
    const student = requireStudent(userId);
    if (student.profile_photo) {
      const oldPath = path.join(__dirname, '..', '..', student.profile_photo.replace(/^\/uploads\//, 'uploads/'));
      fs.unlink(oldPath, () => {});
    }
    const photoPath = `/uploads/photos/${file.filename}`;
    studentModel.updatePhoto(userId, photoPath);
    studentService.refreshCompletion(userId);
    return studentModel.findByUserId(userId);
  },

  deletePhoto(userId) {
    const student = requireStudent(userId);
    if (student.profile_photo) {
      const oldPath = path.join(__dirname, '..', '..', student.profile_photo.replace(/^\/uploads\//, 'uploads/'));
      fs.unlink(oldPath, () => {});
    }
    studentModel.clearPhoto(userId);
    studentService.refreshCompletion(userId);
    return studentModel.findByUserId(userId);
  },

  // ---- Idiomas ----
  addLanguage(userId, data) {
    const student = requireStudent(userId);
    studentModel.addLanguage(student.id, data);
    studentService.refreshCompletion(userId);
    return studentModel.findByUserId(userId);
  },

  updateLanguage(userId, languageId, data) {
    const student = requireStudent(userId);
    studentModel.updateLanguage(languageId, student.id, data);
    return studentModel.findByUserId(userId);
  },

  deleteLanguage(userId, languageId) {
    const student = requireStudent(userId);
    studentModel.deleteLanguage(languageId, student.id);
    studentService.refreshCompletion(userId);
    return studentModel.findByUserId(userId);
  },

  // ---- Educación ----
  addEducation(userId, data) {
    const student = requireStudent(userId);
    studentModel.addEducation(student.id, data);
    studentService.refreshCompletion(userId);
    return studentModel.findByUserId(userId);
  },

  updateEducation(userId, educationId, data) {
    const student = requireStudent(userId);
    studentModel.updateEducation(educationId, student.id, data);
    return studentModel.findByUserId(userId);
  },

  deleteEducation(userId, educationId) {
    const student = requireStudent(userId);
    studentModel.deleteEducation(educationId, student.id);
    studentService.refreshCompletion(userId);
    return studentModel.findByUserId(userId);
  },

  // ---- Experiencia laboral ----
  addExperience(userId, data) {
    const student = requireStudent(userId);
    studentModel.addExperience(student.id, data);
    studentService.refreshCompletion(userId);
    return studentModel.findByUserId(userId);
  },

  updateExperience(userId, experienceId, data) {
    const student = requireStudent(userId);
    studentModel.updateExperience(experienceId, student.id, data);
    return studentModel.findByUserId(userId);
  },

  deleteExperience(userId, experienceId) {
    const student = requireStudent(userId);
    studentModel.deleteExperience(experienceId, student.id);
    studentService.refreshCompletion(userId);
    return studentModel.findByUserId(userId);
  }
};

module.exports = studentService;
