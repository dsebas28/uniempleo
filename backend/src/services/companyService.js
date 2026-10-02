const companyModel = require('../models/companyModel');
const jobModel = require('../models/jobModel');
const applicationModel = require('../models/applicationModel');
const jobAlertService = require('./jobAlertService');

const companyService = {
  async getProfile(userId) {
    const company = await companyModel.findByUserId(userId);
    if (!company) throw new Error('Empresa no encontrada');
    return company;
  },

  async updateProfile(userId, data) {
    const company = await companyModel.findByUserId(userId);
    if (!company) throw new Error('Empresa no encontrada');
    await companyModel.update(userId, data);
    return await companyModel.findByUserId(userId);
  },

  async getDashboard(userId) {
    const company = await companyModel.findByUserId(userId);
    if (!company) throw new Error('Empresa no encontrada');

    const [kpis, candidates, appsByStatus] = await Promise.all([
      companyModel.getDashboardKPIs(company.id),
      applicationModel.findByCompanyId(company.id),
      companyModel.countApplicationsByStatus(company.id),
    ]);
    const recentApps = candidates.slice(0, 5);

    return {
      company,
      // totalApps es el nombre que lee el panel de la empresa (pages/company/Dashboard.jsx)
      kpis: { ...kpis, totalApps: kpis.totalApplications },
      appsByStatus,
      recentApps,
      recentApplications: recentApps.map(app => ({ ...app, student_name: app.full_name }))
    };
  },

  async getCompanyJobs(userId) {
    const company = await companyModel.findByUserId(userId);
    if (!company) throw new Error('Empresa no encontrada');
    return await jobModel.getByCompanyId(company.id);
  },

  async createJob(userId, jobData) {
    const company = await companyModel.findByUserId(userId);
    if (!company) throw new Error('Empresa no encontrada');

    if (!jobData.title || !jobData.description || !jobData.city || !jobData.modality || !jobData.contractType || !jobData.area) {
      throw new Error('Faltan campos obligatorios para publicar la vacante');
    }

    const jobId = await jobModel.create(company.id, jobData);
    await jobAlertService.notifyMatchingStudents(jobId);
    return { id: jobId, message: 'Vacante publicada exitosamente' };
  },

  async updateJob(userId, jobId, jobData) {
    const company = await companyModel.findByUserId(userId);
    if (!company) throw new Error('Empresa no encontrada');

    const existing = await jobModel.getById(jobId);
    if (!existing || existing.company_id !== company.id) {
      throw new Error('Vacante no encontrada o no autorizada');
    }

    await jobModel.update(jobId, company.id, jobData);
    return { message: 'Vacante actualizada correctamente' };
  },

  async deleteJob(userId, jobId) {
    const company = await companyModel.findByUserId(userId);
    if (!company) throw new Error('Empresa no encontrada');

    await jobModel.delete(jobId, company.id);
    return { message: 'Vacante eliminada correctamente' };
  },

  async getAllApproved() {
    return await companyModel.getAllApproved();
  },

  async getById(companyId) {
    const company = await companyModel.findById(companyId);
    if (!company) throw new Error('Empresa no encontrada');
    const jobs = (await jobModel.getByCompanyId(company.id)).filter(j => j.status === 'active');
    return { ...company, jobs };
  }
};

module.exports = companyService;
