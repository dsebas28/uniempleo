const userModel = require('../models/userModel');
const companyModel = require('../models/companyModel');
const jobModel = require('../models/jobModel');
const applicationModel = require('../models/applicationModel');
const courseModel = require('../models/courseModel');
const emailLogModel = require('../models/emailLogModel');
const { getDb } = require('../database/db');

const adminService = {
  async getDashboard() {
    // Consultas independientes: se lanzan en paralelo
    const [students, companies, allJobs, applications, hired, recentUsers, jobsByArea, jobsByCity, appsByStatus, jobsByModality] = await Promise.all([
      userModel.countByRole('student'),
      userModel.countByRole('company'),
      jobModel.getAllAdmin(),
      applicationModel.getTotalCount(),
      applicationModel.getHiredCount(),
      userModel.getRecent(10),
      jobModel.getJobsByArea(8),
      jobModel.getJobsByCity(8),
      applicationModel.countByStatus(),
      jobModel.getJobsByModality(),
    ]);
    const jobs = allJobs.length;
    const activeJobs = allJobs.filter(j => j.status === 'active').length;

    return {
      kpis: { students, companies, jobs, activeJobs, applications, hired },
      recentUsers,
      jobsByArea,
      jobsByCity,
      appsByStatus,
      jobsByModality
    };
  },

  async getUsers(params) {
    return await userModel.getAll(params);
  },

  async updateUserStatus(userId, active) {
    await userModel.setActive(userId, active);
    return { message: 'Estado del usuario actualizado exitosamente' };
  },

  async getCompanies() {
    return await companyModel.getAllAdmin();
  },

  async approveCompany(companyId, approved) {
    await companyModel.setApproved(companyId, approved);
    return { message: approved ? 'Empresa verificada exitosamente' : 'Verificación de empresa revocada' };
  },

  async getJobs() {
    return await jobModel.getAllAdmin();
  },

  async updateJobStatus(jobId, status) {
    await jobModel.updateStatus(jobId, status);
    return { message: 'Estado de la vacante actualizado' };
  },

  async getReports() {
    const db = getDb();
    const jobsByArea = await jobModel.getJobsByArea(15);
    const jobsByCity = await jobModel.getJobsByCity(10);
    const jobsByModality = await jobModel.getJobsByModality();
    const appsByStatus = await applicationModel.countByStatus();
    const coursesByArea = await courseModel.getCoursesByArea();
    const userGrowth = await db.prepare(`SELECT to_char(created_at, 'YYYY-MM') as month, role, COUNT(*) as count FROM users GROUP BY month, role ORDER BY month`).all();

    return { jobsByArea, jobsByCity, jobsByModality, appsByStatus, coursesByArea, userGrowth };
  },

  async getEmailLog() {
    return { emails: await emailLogModel.getAll(), total: await emailLogModel.countAll() };
  }
};

module.exports = adminService;
