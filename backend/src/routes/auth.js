const express = require('express');
const router = express.Router();
const { registerStudent, registerCompany, login, getProfile } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

router.post('/register/student', registerStudent);
router.post('/register/company', registerCompany);
router.post('/login', login);
router.get('/me', authenticate, getProfile);

module.exports = router;
