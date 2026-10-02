const companyService = require('../services/companyService');
const applicationService = require('../services/applicationService');

async function getCompanyProfile(req, res) {
  try {
    const profile = await companyService.getProfile(req.user.id);
    res.json(profile);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

async function updateCompanyProfile(req, res) {
  try {
    const updated = await companyService.updateProfile(req.user.id, req.body);
    res.json({ message: 'Perfil actualizado correctamente', profile: updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function getDashboard(req, res) {
  try {
    const dashboard = await companyService.getDashboard(req.user.id);
    res.json(dashboard);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

async function getCompanyJobs(req, res) {
  try {
    const jobs = await companyService.getCompanyJobs(req.user.id);
    res.json(jobs);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function createJob(req, res) {
  try {
    const result = await companyService.createJob(req.user.id, req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function updateJob(req, res) {
  try {
    const result = await companyService.updateJob(req.user.id, req.params.id, req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function deleteJob(req, res) {
  try {
    const result = await companyService.deleteJob(req.user.id, req.params.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function getCandidates(req, res) {
  try {
    const candidates = await applicationService.getCompanyCandidates(req.user.id, req.query.jobId);
    res.json(candidates);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function updateCandidateStatus(req, res) {
  try {
    const { status, message } = req.body;
    const result = await applicationService.updateCandidateStatus(req.user.id, req.params.applicationId, status, message);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function sendCandidateMessage(req, res) {
  try {
    const { message } = req.body;
    const result = await applicationService.sendMessageToCandidate(req.user.id, req.params.applicationId, message);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function getAllCompanies(req, res) {
  try {
    const companies = await companyService.getAllApproved();
    res.json(companies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getCompanyById(req, res) {
  try {
    const company = await companyService.getById(req.params.id);
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
