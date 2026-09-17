const express = require('express');
const router = express.Router();
const { authenticate, requireRole } = require('../middleware/auth');
const { getDashboard, getUsers, updateUser, getAdminCompanies, approveCompany, getAdminJobs, updateJobStatus, getReports } = require('../controllers/adminController');

router.use(authenticate, requireRole('admin'));
router.get('/dashboard', getDashboard);
router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.get('/companies', getAdminCompanies);
router.put('/companies/:id', approveCompany);
router.get('/jobs', getAdminJobs);
router.put('/jobs/:id', updateJobStatus);
router.get('/reports', getReports);

module.exports = router;
