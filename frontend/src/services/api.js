import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

// Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ===========================
// AUTH
// ===========================
export const authAPI = {
  loginFn: (data) => api.post('/auth/login', data),
  registerStudent: (data) => api.post('/auth/register/student', data),
  registerCompany: (data) => api.post('/auth/register/company', data),
  getMe: () => api.get('/auth/me'),
};

// ===========================
// JOBS (PUBLIC)
// ===========================
export const jobsAPI = {
  getAll: (params) => api.get('/jobs', { params }),
  getById: (id) => api.get(`/jobs/${id}`),
  getStats: () => api.get('/jobs/stats'),
};

// ===========================
// STUDENT
// ===========================
export const studentAPI = {
  getProfile: () => api.get('/student/profile'),
  updateProfile: (data) => api.put('/student/profile', data),
  getDashboard: () => api.get('/student/dashboard'),
  getApplications: () => api.get('/student/applications'),
  apply: (jobId, data) => api.post(`/student/jobs/${jobId}/apply`, data),
  getSavedJobs: () => api.get('/student/saved-jobs'),
  saveJob: (jobId) => api.post(`/student/saved-jobs/${jobId}`),
  unsaveJob: (jobId) => api.delete(`/student/saved-jobs/${jobId}`),
  uploadResume: (file, onUploadProgress) => {
    const formData = new FormData();
    formData.append('resume', file);
    return api.post('/student/resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
    });
  },
  deleteResume: () => api.delete('/student/resume'),
  addEducation: (data) => api.post('/student/educations', data),
  updateEducation: (id, data) => api.put(`/student/educations/${id}`, data),
  deleteEducation: (id) => api.delete(`/student/educations/${id}`),
  addExperience: (data) => api.post('/student/experiences', data),
  updateExperience: (id, data) => api.put(`/student/experiences/${id}`, data),
  deleteExperience: (id) => api.delete(`/student/experiences/${id}`),
  addLanguage: (data) => api.post('/student/languages', data),
  updateLanguage: (id, data) => api.put(`/student/languages/${id}`, data),
  deleteLanguage: (id) => api.delete(`/student/languages/${id}`),
  uploadPhoto: (file, onUploadProgress) => {
    const formData = new FormData();
    formData.append('photo', file);
    return api.post('/student/photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
    });
  },
  deletePhoto: () => api.delete('/student/photo'),
};

// ===========================
// COMPANIES
// ===========================
export const companiesAPI = {
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
  updateCandidateStatus: (appId, status, message) => api.put(`/companies/me/candidates/${appId}/status`, { status, message }),
  sendCandidateMessage: (appId, message) => api.post(`/companies/me/candidates/${appId}/message`, { message }),
};
export const companyAPI = companiesAPI;

// ===========================
// ADMIN
// ===========================
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  getCompanies: () => api.get('/admin/companies'),
  approveCompany: (id, data) => api.put(`/admin/companies/${id}`, data),
  getJobs: () => api.get('/admin/jobs'),
  updateJob: (id, data) => api.put(`/admin/jobs/${id}`, data),
  getReports: () => api.get('/admin/reports'),
};

// ===========================
// NOTIFICATIONS
// ===========================
export const notificationsAPI = {
  getAll: () => api.get('/notifications'),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
};

// ===========================
// COURSES
// ===========================
export const coursesAPI = {
  getAll: (params) => api.get('/courses', { params }),
  getById: (id) => api.get(`/courses/${id}`),
  enroll: (courseId) => api.post(`/courses/${courseId}/enroll`),
  getEnrollments: () => api.get('/courses/my-enrollments'),
};

export default api;
