const express = require('express');
const router = express.Router();
const { getJobs, getJobById, getStats } = require('../controllers/jobsController');

router.get('/stats', getStats);
router.get('/', getJobs);
router.get('/:id', getJobById);

module.exports = router;
