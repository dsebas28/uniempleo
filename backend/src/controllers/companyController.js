const companyService = require('../services/companyService');
const applicationService = require('../services/applicationService');

function getCompanyProfile(req, res) {
  try {
    const profile = companyService.getProfile(req.user.id);
    res.json(profile);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

function updateCompanyProfile(req, res) {
  try {
    const updated = companyService.updateProfile(req.user.id, req.body);
    res.json({ message: 'Perfil actualizado correctamente', profile: updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

function getDashboard(req, res) {
  try {
    const dashboard = companyService.getDashboard(req.user.id);
    res.json(dashboard);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

function getCompanyJobs(req, res) {
  try {
    const jobs = companyService.getCompanyJobs(req.user.id);
    res.json(jobs);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

function createJob(req, res) {
  try {
    const result = companyService.createJob(req.user.id, req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

function updateJob(req, res) {
  try {
    const result = companyService.updateJob(req.user.id, req.params.id, req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

function deleteJob(req, res) {
  try {
    const result = companyService.deleteJob(req.user.id, req.params.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

function getCandidates(req, res) {
  try {
    const candidates = applicationService.getCompanyCandidates(req.user.id, req.query.jobId);
    res.json(candidates);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

function updateCandidateStatus(req, res) {
  try {
    const { status, message } = req.body;
    const result = applicationService.updateCandidateStatus(req.user.id, req.params.applicationId, status, message);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

function sendCandidateMessage(req, res) {
  try {
    const { message } = req.body;
    const result = applicationService.sendMessageToCandidate(req.user.id, req.params.applicationId, message);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

function getAllCompanies(req, res) {
  try {
    const companies = companyService.getAllApproved();
    res.json(companies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

function getCompanyById(req, res) {
  try {
    const company = companyService.getById(req.params.id);
    res.json(company);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

module.exports = {
  getCompanyProfile,
  updateCompanyProfile,
  getDashboard,
  getCompanyJobs,
  createJob,
  updateJob,
  deleteJob,
  getCandidates,
  updateCandidateStatus,
  sendCandidateMessage,
  getAllCompanies,
  getCompanyById
};
