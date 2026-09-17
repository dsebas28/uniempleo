import api from './api';

export const adminService = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  getCompanies: () => api.get('/admin/companies'),
  approveCompany: (id, data) => api.put(`/admin/companies/${id}`, data),
  getJobs: () => api.get('/admin/jobs'),
  updateJob: (id, data) => api.put(`/admin/jobs/${id}`, data),
  getReports: () => api.get('/admin/reports'),
};

export default adminService;
