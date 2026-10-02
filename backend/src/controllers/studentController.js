const studentService = require('../services/studentService');
const applicationService = require('../services/applicationService');

async function getStudentProfile(req, res) {
  try {
    const profile = await studentService.getProfile(req.user.id);
    res.json(profile);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

async function updateStudentProfile(req, res) {
  try {
    const updated = await studentService.updateProfile(req.user.id, req.body);
    res.json({ message: 'Perfil actualizado exitosamente', profile: updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function getDashboard(req, res) {
  try {
    const dashboardData = await studentService.getDashboard(req.user.id);
    res.json(dashboardData);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

async function getApplications(req, res) {
  try {
    const applications = await applicationService.getStudentApplications(req.user.id);
    res.json(applications);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function apply(req, res) {
  try {
    const { jobId } = req.params;
    const { coverLetter } = req.body;
    const result = await applicationService.applyToJob(req.user.id, jobId, { coverLetter });
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function getSavedJobs(req, res) {
  try {
    const saved = await studentService.getSavedJobs(req.user.id);
    res.json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function saveJob(req, res) {
  try {
    const result = await studentService.saveJob(req.user.id, req.params.jobId);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function unsaveJob(req, res) {
  try {
    const result = await studentService.unsaveJob(req.user.id, req.params.jobId);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function getJobAlerts(req, res) {
  try {
    const alerts = await studentService.getJobAlerts(req.user.id);
    res.json(alerts);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function createJobAlert(req, res) {
  try {
    const result = await studentService.createJobAlert(req.user.id, req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function toggleJobAlert(req, res) {
  try {
    const result = await studentService.toggleJobAlert(req.user.id, req.params.id, req.body.active);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function deleteJobAlert(req, res) {
  try {
    const result = await studentService.deleteJobAlert(req.user.id, req.params.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function uploadResume(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se recibió ningún archivo. Adjunta tu hoja de vida en PDF.' });
    }
    const profile = await studentService.uploadResume(req.user.id, req.file);
    res.json({ message: 'Hoja de vida subida exitosamente', profile });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function deleteResume(req, res) {
  try {
    const profile = await studentService.deleteResume(req.user.id);
    res.json({ message: 'Hoja de vida eliminada', profile });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function addEducation(req, res) {
  try {
    const profile = await studentService.addEducation(req.user.id, req.body);
    res.status(201).json({ message: 'Educación agregada', profile });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function updateEducation(req, res) {
  try {
    const profile = await studentService.updateEducation(req.user.id, req.params.id, req.body);
    res.json({ message: 'Educación actualizada', profile });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function deleteEducation(req, res) {
  try {
    const profile = await studentService.deleteEducation(req.user.id, req.params.id);
    res.json({ message: 'Educación eliminada', profile });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function addExperience(req, res) {
  try {
    const profile = await studentService.addExperience(req.user.id, req.body);
    res.status(201).json({ message: 'Experiencia agregada', profile });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function updateExperience(req, res) {
  try {
    const profile = await studentService.updateExperience(req.user.id, req.params.id, req.body);
    res.json({ message: 'Experiencia actualizada', profile });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function deleteExperience(req, res) {
  try {
    const profile = await studentService.deleteExperience(req.user.id, req.params.id);
    res.json({ message: 'Experiencia eliminada', profile });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function uploadPhoto(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se recibió ninguna imagen.' });
    }
    const profile = await studentService.uploadPhoto(req.user.id, req.file);
    res.json({ message: 'Foto de perfil actualizada', profile });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function deletePhoto(req, res) {
  try {
    const profile = await studentService.deletePhoto(req.user.id);
    res.json({ message: 'Foto de perfil eliminada', profile });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function addLanguage(req, res) {
  try {
    const profile = await studentService.addLanguage(req.user.id, req.body);
    res.status(201).json({ message: 'Idioma agregado', profile });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function updateLanguage(req, res) {
  try {
    const profile = await studentService.updateLanguage(req.user.id, req.params.id, req.body);
    res.json({ message: 'Idioma actualizado', profile });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function deleteLanguage(req, res) {
  try {
    const profile = await studentService.deleteLanguage(req.user.id, req.params.id);
    res.json({ message: 'Idioma eliminado', profile });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports = {
  getStudentProfile,
  updateStudentProfile,
  getDashboard,
  getApplications,
  apply,
  getSavedJobs,
  saveJob,
  unsaveJob,
  getJobAlerts,
  createJobAlert,
  toggleJobAlert,
  deleteJobAlert,
  uploadResume,
  deleteResume,
  addEducation,
  updateEducation,
  deleteEducation,
  addExperience,
  updateExperience,
  deleteExperience,
  uploadPhoto,
  deletePhoto,
  addLanguage,
  updateLanguage,
  deleteLanguage
};
