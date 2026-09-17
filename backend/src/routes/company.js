const express = require('express');
const router = express.Router();
const { authenticate, requireRole } = require('../middleware/auth');
const { getCompanyProfile, updateCompanyProfile, getDashboard, getCompanyJobs, createJob, updateJob, deleteJob, getCandidates, updateCandidateStatus, sendCandidateMessage, getAllCompanies, getCompanyById } = require('../controllers/companyController');

// Protected company routes (defined first so /me is not captured by /:id)
router.get('/me/profile', authenticate, requireRole('company'), getCompanyProfile);
router.put('/me/profile', authenticate, requireRole('company'), updateCompanyProfile);
router.get('/me/dashboard', authenticate, requireRole('company'), getDashboard);
router.get('/me/jobs', authenticate, requireRole('company'), getCompanyJobs);
router.post('/me/jobs', authenticate, requireRole('company'), createJob);
router.put('/me/jobs/:id', authenticate, requireRole('company'), updateJob);
router.delete('/me/jobs/:id', authenticate, requireRole('company'), deleteJob);
router.get('/me/candidates', authenticate, requireRole('company'), getCandidates);
router.put('/me/candidates/:applicationId/status', authenticate, requireRole('company'), updateCandidateStatus);
router.post('/me/candidates/:applicationId/message', authenticate, requireRole('company'), sendCandidateMessage);

// Public routes
router.get('/', getAllCompanies);
router.get('/:id', getCompanyById);

module.exports = router;
