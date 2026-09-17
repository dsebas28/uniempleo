const studentService = require('../services/studentService');
const applicationService = require('../services/applicationService');

function getStudentProfile(req, res) {
  try {
    const profile = studentService.getProfile(req.user.id);
    res.json(profile);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

function updateStudentProfile(req, res) {
  try {
    const updated = studentService.updateProfile(req.user.id, req.body);
    res.json({ message: 'Perfil actualizado exitosamente', profile: updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

function getDashboard(req, res) {
  try {
    const dashboardData = studentService.getDashboard(req.user.id);
    res.json(dashboardData);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

function getApplications(req, res) {
  try {
    const applications = applicationService.getStudentApplications(req.user.id);
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

function getSavedJobs(req, res) {
  try {
    const saved = studentService.getSavedJobs(req.user.id);
    res.json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

function saveJob(req, res) {
  try {
    const result = studentService.saveJob(req.user.id, req.params.jobId);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

function unsaveJob(req, res) {
  try {
    const result = studentService.unsaveJob(req.user.id, req.params.jobId);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

function getJobAlerts(req, res) {
  try {
    const alerts = studentService.getJobAlerts(req.user.id);
    res.json(alerts);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

function createJobAlert(req, res) {
  try {
    const result = studentService.createJobAlert(req.user.id, req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

function toggleJobAlert(req, res) {
  try {
    const result = studentService.toggleJobAlert(req.user.id, req.params.id, req.body.active);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

function deleteJobAlert(req, res) {
  try {
    const result = studentService.deleteJobAlert(req.user.id, req.params.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

function uploadResume(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se recibió ningún archivo. Adjunta tu hoja de vida en PDF.' });
    }
    const profile = studentService.uploadResume(req.user.id, req.file);
    res.json({ message: 'Hoja de vida subida exitosamente', profile });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

function deleteResume(req, res) {
  try {
    const profile = studentService.deleteResume(req.user.id);
    res.json({ message: 'Hoja de vida eliminada', profile });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

function addEducation(req, res) {
  try {
    const profile = studentService.addEducation(req.user.id, req.body);
    res.status(201).json({ message: 'Educación agregada', profile });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

function updateEducation(req, res) {
  try {
    const profile = studentService.updateEducation(req.user.id, req.params.id, req.body);
    res.json({ message: 'Educación actualizada', profile });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

function deleteEducation(req, res) {
  try {
    const profile = studentService.deleteEducation(req.user.id, req.params.id);
    res.json({ message: 'Educación eliminada', profile });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

function addExperience(req, res) {
  try {
    const profile = studentService.addExperience(req.user.id, req.body);
    res.status(201).json({ message: 'Experiencia agregada', profile });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

function updateExperience(req, res) {
  try {
    const profile = studentService.updateExperience(req.user.id, req.params.id, req.body);
    res.json({ message: 'Experiencia actualizada', profile });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

function deleteExperience(req, res) {
  try {
    const profile = studentService.deleteExperience(req.user.id, req.params.id);
    res.json({ message: 'Experiencia eliminada', profile });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

function uploadPhoto(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se recibió ninguna imagen.' });
    }
    const profile = studentService.uploadPhoto(req.user.id, req.file);
    res.json({ message: 'Foto de perfil actualizada', profile });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

function deletePhoto(req, res) {
  try {
    const profile = studentService.deletePhoto(req.user.id);
    res.json({ message: 'Foto de perfil eliminada', profile });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

function addLanguage(req, res) {
  try {
    const profile = studentService.addLanguage(req.user.id, req.body);
    res.status(201).json({ message: 'Idioma agregado', profile });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

function updateLanguage(req, res) {
  try {
    const profile = studentService.updateLanguage(req.user.id, req.params.id, req.body);
    res.json({ message: 'Idioma actualizado', profile });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

function deleteLanguage(req, res) {
  try {
    const profile = studentService.deleteLanguage(req.user.id, req.params.id);
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
