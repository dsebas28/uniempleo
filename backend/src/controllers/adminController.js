const adminService = require('../services/adminService');

async function getDashboard(req, res) {
  try {
    const data = await adminService.getDashboard();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getUsers(req, res) {
  try {
    const { role, page, limit } = req.query;
    const result = await adminService.getUsers({ role, page, limit });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateUser(req, res) {
  try {
    const { active } = req.body;
    const result = await adminService.updateUserStatus(req.params.id, active);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function getAdminCompanies(req, res) {
  try {
    const companies = await adminService.getCompanies();
    res.json(companies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function approveCompany(req, res) {
  try {
    const { approved } = req.body;
    const result = await adminService.approveCompany(req.params.id, approved);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function getAdminJobs(req, res) {
  try {
    const jobs = await adminService.getJobs();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateJobStatus(req, res) {
  try {
    const { status } = req.body;
    const result = await adminService.updateJobStatus(req.params.id, status);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function getReports(req, res) {
  try {
    const reports = await adminService.getReports();
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getEmailLog(req, res) {
  try {
    const data = await adminService.getEmailLog();
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
