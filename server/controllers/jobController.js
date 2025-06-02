const { Job } = require('../models');

const createJob = async (req, res) => {
  try {
    const newJob = await Job.create({ ...req.body, user_id: req.user.id });
    res.status(201).json(newJob);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create job', error: err.message });
  }
};

const getJobs = async (req, res) => {
  try {
    const jobs = await Job.findAll({ where: { user_id: req.user.id } });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch jobs', error: err.message });
  }
};

const updateJob = async (req, res) => {
  try {
    const job = await Job.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!job) return res.status(404).json({ message: 'Job not found' });

    await job.update(req.body);
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update job', error: err.message });
  }
};

const deleteJob = async (req, res) => {
  try {
    const job = await Job.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!job) return res.status(404).json({ message: 'Job not found' });

    await job.destroy();
    res.json({ message: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete job', error: err.message });
  }
};

module.exports = { createJob, getJobs, updateJob, deleteJob };
