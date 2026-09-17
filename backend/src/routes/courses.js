const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { getCourses, getCourseById, enrollCourse, getEnrollments } = require('../controllers/coursesController');

router.get('/', getCourses);
router.get('/my-enrollments', authenticate, getEnrollments);
router.get('/:id', getCourseById);
router.post('/:courseId/enroll', authenticate, enrollCourse);

module.exports = router;
