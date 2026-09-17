const adminService = require('../services/adminService');

function getDashboard(req, res) {
  try {
    const data = adminService.getDashboard();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

function getUsers(req, res) {
  try {
    const { role, page, limit } = req.query;
    const result = adminService.getUsers({ role, page, limit });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

function updateUser(req, res) {
  try {
    const { active } = req.body;
    const result = adminService.updateUserStatus(req.params.id, active);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

function getAdminCompanies(req, res) {
  try {
    const companies = adminService.getCompanies();
    res.json(companies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

function approveCompany(req, res) {
  try {
    const { approved } = req.body;
    const result = adminService.approveCompany(req.params.id, approved);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

function getAdminJobs(req, res) {
  try {
    const jobs = adminService.getJobs();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

function updateJobStatus(req, res) {
  try {
    const { status } = req.body;
    const result = adminService.updateJobStatus(req.params.id, status);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

function getReports(req, res) {
  try {
    const reports = adminService.getReports();
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

function getEmailLog(req, res) {
  try {
    const data = adminService.getEmailLog();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getDashboard,
  getUsers,
  updateUser,
  getAdminCompanies,
  approveCompany,
  getAdminJobs,
  updateJobStatus,
  getReports,
  getEmailLog
};
