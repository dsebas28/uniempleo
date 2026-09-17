const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const studentRoutes = require('./student');
const companyRoutes = require('./company');
const jobsRoutes = require('./jobs');
const applicationRoutes = require('./applicationRoutes');
const adminRoutes = require('./admin');
const notificationsRoutes = require('./notifications');
const coursesRoutes = require('./courses');

router.use('/auth', authRoutes);
router.use('/student', studentRoutes);
router.use('/companies', companyRoutes);
router.use('/jobs', jobsRoutes);
router.use('/applications', applicationRoutes);
router.use('/admin', adminRoutes);
router.use('/notifications', notificationsRoutes);
router.use('/courses', coursesRoutes);

module.exports = router;
