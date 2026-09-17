import api from './api';

export const studentService = {
  getProfile: () => api.get('/student/profile'),
  updateProfile: (data) => api.put('/student/profile', data),
  getDashboard: () => api.get('/student/dashboard'),
  getApplications: () => api.get('/student/applications'),
  apply: (jobId, data) => api.post(`/student/jobs/${jobId}/apply`, data),
  getSavedJobs: () => api.get('/student/saved-jobs'),
  saveJob: (jobId) => api.post(`/student/saved-jobs/${jobId}`),
  unsaveJob: (jobId) => api.delete(`/student/saved-jobs/${jobId}`),
};

export default studentService;
