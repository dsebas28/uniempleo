const jobModel = require('../models/jobModel');

const jobService = {
  getAll(filters) {
    return jobModel.getAll(filters);
  },

  getById(id) {
    const job = jobModel.getById(id);
    if (!job) throw new Error('Oferta de empleo no encontrada');
    return job;
  },

  getStats() {
    return jobModel.getStats();
  }
};

module.exports = jobService;
