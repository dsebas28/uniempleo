import api from './api';

export const applicationService = {
  apply: (jobId, data) => api.post(`/applications/jobs/${jobId}`, data),
  getMyApplications: () => api.get('/applications/student'),
  getCompanyCandidates: (jobId) => api.get('/applications/company', { params: { jobId } }),
  updateCandidateStatus: (applicationId, status) => api.put(`/applications/${applicationId}/status`, { status }),
};

export default applicationService;
