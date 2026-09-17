const applicationService = require('../services/applicationService');

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

function getMyApplications(req, res) {
  try {
    const applications = applicationService.getStudentApplications(req.user.id);
    res.json(applications);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

function getCompanyCandidates(req, res) {
  try {
    const candidates = applicationService.getCompanyCandidates(req.user.id, req.query.jobId);
    res.json(candidates);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

function updateStatus(req, res) {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;
    const result = applicationService.updateCandidateStatus(req.user.id, applicationId, status);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports = {
  apply,
  getMyApplications,
  getCompanyCandidates,
  updateStatus
};
