const express = require('express');
const router = express.Router();
const { authenticate, requireRole } = require('../middleware/auth');
const {
  apply,
  getMyApplications,
  getCompanyCandidates,
  updateStatus
} = require('../controllers/applicationController');

// Student application endpoints
router.post('/jobs/:jobId', authenticate, requireRole('student'), apply);
router.get('/student', authenticate, requireRole('student'), getMyApplications);

// Company candidate management endpoints
router.get('/company', authenticate, requireRole('company'), getCompanyCandidates);
router.put('/:applicationId/status', authenticate, requireRole('company'), updateStatus);

module.exports = router;
