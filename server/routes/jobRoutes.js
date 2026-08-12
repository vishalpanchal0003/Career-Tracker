const express = require('express');
const { getJobs, createJob, updateJob, deleteJob, getStats } = require('../controllers/jobController.js');
const JWTHelper = require("../middleware/jwtHelper.js");
const JobRouter = express.Router();

JobRouter.get('/stats', JWTHelper, getStats);
JobRouter.post('/createjob', JWTHelper, createJob)
JobRouter.get('/alljobs', JWTHelper, getJobs)
JobRouter.patch('/updatejob/:id', JWTHelper, updateJob)
JobRouter.delete('/deletejob/:id', JWTHelper, deleteJob);

module.exports = JobRouter;
