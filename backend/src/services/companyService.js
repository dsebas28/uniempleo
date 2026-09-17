const companyModel = require('../models/companyModel');
const jobModel = require('../models/jobModel');
const applicationModel = require('../models/applicationModel');
const jobAlertService = require('./jobAlertService');

const companyService = {
  getProfile(userId) {
    const company = companyModel.findByUserId(userId);
    if (!company) throw new Error('Empresa no encontrada');
    return company;
  },

  updateProfile(userId, data) {
    const company = companyModel.findByUserId(userId);
    if (!company) throw new Error('Empresa no encontrada');
    companyModel.update(userId, data);
    return companyModel.findByUserId(userId);
  },

  getDashboard(userId) {
    const company = companyModel.findByUserId(userId);
    if (!company) throw new Error('Empresa no encontrada');

    const kpis = companyModel.getDashboardKPIs(company.id);
    const candidates = applicationModel.findByCompanyId(company.id);

    return {
      company,
      kpis,
      recentApps: candidates.slice(0, 5)
    };
  },

  getCompanyJobs(userId) {
    const company = companyModel.findByUserId(userId);
    if (!company) throw new Error('Empresa no encontrada');
    return jobModel.getByCompanyId(company.id);
  },

  createJob(userId, jobData) {
    const company = companyModel.findByUserId(userId);
    if (!company) throw new Error('Empresa no encontrada');

    if (!jobData.title || !jobData.description || !jobData.city || !jobData.modality || !jobData.contractType || !jobData.area) {
      throw new Error('Faltan campos obligatorios para publicar la vacante');
    }

    const jobId = jobModel.create(company.id, jobData);
    jobAlertService.notifyMatchingStudents(jobId);
    return { id: jobId, message: 'Vacante publicada exitosamente' };
  },

  updateJob(userId, jobId, jobData) {
    const company = companyModel.findByUserId(userId);
    if (!company) throw new Error('Empresa no encontrada');

    const existing = jobModel.getById(jobId);
    if (!existing || existing.company_id !== company.id) {
      throw new Error('Vacante no encontrada o no autorizada');
    }

    jobModel.update(jobId, company.id, jobData);
    return { message: 'Vacante actualizada correctamente' };
  },

  deleteJob(userId, jobId) {
    const company = companyModel.findByUserId(userId);
    if (!company) throw new Error('Empresa no encontrada');

    jobModel.delete(jobId, company.id);
    return { message: 'Vacante eliminada correctamente' };
  },

  getAllApproved() {
    return companyModel.getAllApproved();
  },

  getById(companyId) {
    const company = companyModel.findById(companyId);
    if (!company) throw new Error('Empresa no encontrada');
    const jobs = jobModel.getByCompanyId(company.id).filter(j => j.status === 'active');
    return { ...company, jobs };
  }
};

module.exports = companyService;
