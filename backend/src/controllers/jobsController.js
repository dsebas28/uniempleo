const jobService = require('../services/jobService');

async function getJobs(req, res) {
  try {
    const { keyword, city, modality, area, isInternship, noExperience, minSalary, maxSalary, page, limit } = req.query;
    const result = await jobService.getAll({
      keyword, city, modality, area, isInternship, noExperience, minSalary, maxSalary, page, limit
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getJobById(req, res) {
  try {
    const job = await jobService.getById(req.params.id);
    res.json(job);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

async function getStats(req, res) {
  try {
    const stats = await jobService.getStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getJobs, getJobById, getStats };
