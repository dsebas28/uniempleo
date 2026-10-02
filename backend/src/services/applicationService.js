const applicationModel = require('../models/applicationModel');
const studentModel = require('../models/studentModel');
const companyModel = require('../models/companyModel');
const jobModel = require('../models/jobModel');
const notificationModel = require('../models/notificationModel');

const applicationService = {
  async applyToJob(userId, jobId, { coverLetter } = {}) {
    const student = await studentModel.findByUserId(userId);
    if (!student) {
      throw new Error('Debes completar tu perfil de estudiante antes de postularte');
    }

    const job = await jobModel.getById(jobId);
    if (!job || job.status !== 'active') {
      throw new Error('La oferta laboral no se encuentra activa');
    }

    if (await applicationModel.hasApplied(jobId, student.id)) {
      throw new Error('Ya te has postulado a esta vacante anteriormente');
    }

    const appId = await applicationModel.create(jobId, student.id, coverLetter);
    await jobModel.incrementApplicants(jobId);

    // Notify company
    const company = await companyModel.findById(job.company_id);
    if (company) {
      await notificationModel.create(
        company.user_id,
        'Nueva postulación recibida',
        `${student.full_name} se ha postulado a tu vacante "${job.title}"`,
        'info',
        `/empresa/candidatos?jobId=${job.id}`
      );
    }

    return { id: appId, message: '¡Postulación enviada exitosamente!' };
  },

  async getStudentApplications(userId) {
    const student = await studentModel.findByUserId(userId);
    if (!student) throw new Error('Perfil de estudiante no encontrado');
    return await applicationModel.findByStudentId(student.id);
  },

  async getCompanyCandidates(userId, jobId = null) {
    const company = await companyModel.findByUserId(userId);
    if (!company) throw new Error('Empresa no encontrada');
    return await applicationModel.findByCompanyId(company.id, jobId);
  },

  async updateCandidateStatus(userId, applicationId, status, customMessage = '') {
    const company = await companyModel.findByUserId(userId);
    if (!company) throw new Error('Empresa no encontrada');

    const app = await applicationModel.findByIdAndCompany(applicationId, company.id);
    if (!app) throw new Error('Postulación no encontrada o no autorizada');

    const validStatuses = ['sent', 'reviewing', 'preselected', 'interview', 'selected', 'rejected'];
    if (!validStatuses.includes(status)) {
      throw new Error('Estado de postulación inválido');
    }

    await applicationModel.updateStatus(applicationId, status);

    // Dispatch status notification to student
    const student = await studentModel.findById(app.student_id);
    if (student) {
      const statusMessages = {
        reviewing: `${company.name} ha comenzado a revisar tu postulación para "${app.job_title}"`,
        preselected: `¡Felicitaciones! Has sido preseleccionado para la vacante "${app.job_title}" en ${company.name}`,
        interview: `¡Genial! ${company.name} te ha convocado a entrevista para "${app.job_title}"`,
        selected: `¡Has sido seleccionado para la vacante "${app.job_title}" en ${company.name}! Pronto te contactarán.`,
        rejected: `Tu postulación para "${app.job_title}" en ${company.name} no fue seleccionada en esta ocasión.`,
      };

      if (statusMessages[status]) {
        const notifType = (status === 'selected' || status === 'preselected' || status === 'interview') ? 'success' : 'info';
        const clean = (customMessage || '').trim();
        const fullMessage = clean ? `${statusMessages[status]} ${clean}` : statusMessages[status];
        await notificationModel.create(
          student.user_id,
          'Actualización de tu postulación',
          fullMessage,
          notifType,
          '/postulaciones'
        );
      }
    }

    return { message: 'Estado del candidato actualizado correctamente' };
  },

  // Mensaje libre de la empresa hacia un candidato puntual (no cambia el estado)
  async sendMessageToCandidate(userId, applicationId, message) {
    const company = await companyModel.findByUserId(userId);
    if (!company) throw new Error('Empresa no encontrada');

    const clean = (message || '').trim();
    if (!clean) throw new Error('El mensaje no puede estar vacío');

    const app = await applicationModel.findByIdAndCompany(applicationId, company.id);
    if (!app) throw new Error('Postulación no encontrada o no autorizada');

    const student = await studentModel.findById(app.student_id);
    if (!student) throw new Error('Estudiante no encontrado');

    await notificationModel.create(
      student.user_id,
      `Mensaje de ${company.name}`,
      `Sobre tu postulación a "${app.job_title}": ${clean}`,
      'info',
      '/postulaciones'
    );

    return { message: 'Mensaje enviado al candidato' };
  }
};

module.exports = applicationService;
