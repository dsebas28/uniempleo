const jobModel = require('../models/jobModel');

const jobService = {
  async getAll(filters) {
    return await jobModel.getAll(filters);
  },

  async getById(id) {
    const job = await jobModel.getById(id);
    if (!job) throw new Error('Oferta de empleo no encontrada');
    return job;
  },

  async getStats() {
    return await jobModel.getStats();
  }
};

module.exports = jobService;
