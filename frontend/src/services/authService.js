import api from './api';

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  registerStudent: (data) => api.post('/auth/register/student', data),
  registerCompany: (data) => api.post('/auth/register/company', data),
  getMe: () => api.get('/auth/me'),
};

export default authService;
