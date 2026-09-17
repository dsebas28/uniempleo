import api from './api';

export const companyService = {
  getAll: () => api.get('/companies'),
  getById: (id) => api.get(`/companies/${id}`),
  getProfile: () => api.get('/companies/me/profile'),
  updateProfile: (data) => api.put('/companies/me/profile', data),
  getDashboard: () => api.get('/companies/me/dashboard'),
  getJobs: () => api.get('/companies/me/jobs'),
  createJob: (data) => api.post('/companies/me/jobs', data),
  updateJob: (id, data) => api.put(`/companies/me/jobs/${id}`, data),
  deleteJob: (id) => api.delete(`/companies/me/jobs/${id}`),
  getCandidates: (jobId) => api.get('/companies/me/candidates', { params: { jobId } }),
  updateCandidateStatus: (appId, status) => api.put(`/companies/me/candidates/${appId}/status`, { status }),
};

export default companyService;
