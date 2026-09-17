const jobService = require('../services/jobService');

function getJobs(req, res) {
  try {
    const { keyword, city, modality, area, isInternship, noExperience, minSalary, maxSalary, page, limit } = req.query;
    const result = jobService.getAll({
      keyword, city, modality, area, isInternship, noExperience, minSalary, maxSalary, page, limit
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

function getJobById(req, res) {
  try {
    const job = jobService.getById(req.params.id);
    res.json(job);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

function getStats(req, res) {
  try {
    const stats = jobService.getStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getJobs, getJobById, getStats };
