const express = require('express');
const router = express.Router();
const { authenticate, requireRole } = require('../middleware/auth');
const { uploadResume: uploadResumeMiddleware, uploadPhoto: uploadPhotoMiddleware } = require('../middleware/upload');
const {
  getStudentProfile, updateStudentProfile, getDashboard, getApplications, apply, getSavedJobs, saveJob, unsaveJob, uploadResume, deleteResume,
  addEducation, updateEducation, deleteEducation, addExperience, updateExperience, deleteExperience,
  uploadPhoto, deletePhoto, addLanguage, updateLanguage, deleteLanguage,
  getJobAlerts, createJobAlert, toggleJobAlert, deleteJobAlert
} = require('../controllers/studentController');

router.use(authenticate, requireRole('student'));
router.get('/profile', getStudentProfile);
router.put('/profile', updateStudentProfile);
router.get('/dashboard', getDashboard);
router.get('/applications', getApplications);
router.post('/jobs/:jobId/apply', apply);
router.get('/saved-jobs', getSavedJobs);
router.post('/saved-jobs/:jobId', saveJob);
router.delete('/saved-jobs/:jobId', unsaveJob);

// Alertas de empleo
router.get('/job-alerts', getJobAlerts);
router.post('/job-alerts', createJobAlert);
router.put('/job-alerts/:id', toggleJobAlert);
router.delete('/job-alerts/:id', deleteJobAlert);

// Educación
router.post('/educations', addEducation);
router.put('/educations/:id', updateEducation);
router.delete('/educations/:id', deleteEducation);

// Experiencia laboral
router.post('/experiences', addExperience);
router.put('/experiences/:id', updateExperience);
router.delete('/experiences/:id', deleteExperience);

// Idiomas
router.post('/languages', addLanguage);
router.put('/languages/:id', updateLanguage);
router.delete('/languages/:id', deleteLanguage);

// Hoja de vida (CV) en PDF
router.post('/resume', (req, res, next) => {
  uploadResumeMiddleware.single('resume')(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message || 'Error al subir el archivo' });
    next();
  });
}, uploadResume);
router.delete('/resume', deleteResume);

// Foto de perfil
router.post('/photo', (req, res, next) => {
  uploadPhotoMiddleware.single('photo')(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message || 'Error al subir la imagen' });
    next();
  });
}, uploadPhoto);
router.delete('/photo', deletePhoto);

module.exports = router;
