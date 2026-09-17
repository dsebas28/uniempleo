import api from './api';

export const jobService = {
  getAll: (params) => api.get('/jobs', { params }),
  getById: (id) => api.get(`/jobs/${id}`),
  getStats: () => api.get('/jobs/stats'),
};

export default jobService;
