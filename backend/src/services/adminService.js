const userModel = require('../models/userModel');
const companyModel = require('../models/companyModel');
const jobModel = require('../models/jobModel');
const applicationModel = require('../models/applicationModel');
const courseModel = require('../models/courseModel');
const emailLogModel = require('../models/emailLogModel');
const { getDb } = require('../database/db');

const adminService = {
  getDashboard() {
    const students = userModel.countByRole('student');
    const companies = userModel.countByRole('company');
    const jobs = jobModel.getAllAdmin().length;
    const activeJobs = jobModel.getAllAdmin().filter(j => j.status === 'active').length;
    const applications = applicationModel.getTotalCount();
    const hired = applicationModel.getHiredCount();

    const recentUsers = userModel.getRecent(10);
    const jobsByArea = jobModel.getJobsByArea(8);
    const jobsByCity = jobModel.getJobsByCity(8);
    const appsByStatus = applicationModel.countByStatus();
    const jobsByModality = jobModel.getJobsByModality();

    return {
      kpis: { students, companies, jobs, activeJobs, applications, hired },
      recentUsers,
      jobsByArea,
      jobsByCity,
      appsByStatus,
      jobsByModality
    };
  },

  getUsers(params) {
    return userModel.getAll(params);
  },

  updateUserStatus(userId, active) {
    userModel.setActive(userId, active);
    return { message: 'Estado del usuario actualizado exitosamente' };
  },

  getCompanies() {
    return companyModel.getAllAdmin();
  },

  approveCompany(companyId, approved) {
    companyModel.setApproved(companyId, approved);
    return { message: approved ? 'Empresa verificada exitosamente' : 'Verificación de empresa revocada' };
  },

  getJobs() {
    return jobModel.getAllAdmin();
  },

  updateJobStatus(jobId, status) {
    jobModel.updateStatus(jobId, status);
    return { message: 'Estado de la vacante actualizado' };
  },

  getReports() {
    const db = getDb();
    const jobsByArea = jobModel.getJobsByArea(15);
    const jobsByCity = jobModel.getJobsByCity(10);
    const jobsByModality = jobModel.getJobsByModality();
    const appsByStatus = applicationModel.countByStatus();
    const coursesByArea = courseModel.getCoursesByArea();
    const userGrowth = db.prepare(`SELECT strftime('%Y-%m', created_at) as month, role, COUNT(*) as count FROM users GROUP BY month, role ORDER BY month`).all();

    return { jobsByArea, jobsByCity, jobsByModality, appsByStatus, coursesByArea, userGrowth };
  },

  getEmailLog() {
    return { emails: emailLogModel.getAll(), total: emailLogModel.countAll() };
  }
};

module.exports = adminService;
