const ApiError = require('../helper/apiError');
const mongoose = require("mongoose")
const ApiResponse = require('../helper/apiResponse');

const Job = require('../models/Job.js');

const getJobs = async (req, res, next) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const jobs = await Job.find({
      userId: userId,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        jobs,
        "Jobs retrieved successfully"
      )
    );
  } catch (error) {
    return next(error);
  }
};

const createJob = async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not logged in",
      });
    }

    const {
      company,
      role,
      location,
      link,
      dateApplied,
      status,
      salary,
      notes,
      resumeVersion,
    } = req.body;

    if (!company || !role || !location || !dateApplied) {
      return res.status(400).json({
        success: false,
        message: "Company, role, location and date are required",
      });
    }

    const job = await Job.create({
      userId: userId,
      company,
      role,
      location,
      link,
      dateApplied,
      status,
      salary,
      notes,
      resumeVersion,
    });

    return res.status(201).json({
      success: true,
      message: "Job created successfully!",
      data: job,
    });
  } catch (error) {
    console.log("Create job error:", error);

    return res.status(500).json({
      success: false,
      message: "failed to creating job",
      error: error.message,
    });
  }
};

const updateJob = async (req, res) => {
  try {
    const { company, role, location, link, dateApplied, status, salary, notes, resumeVersion } = req.body;
    if (!company || !role || !location || !dateApplied) {
      return res.status(400).json(new ApiError(400, "all fields are required"))
    }
    const jobId = req.params.id;
    const Updatedjob = await Job.findByIdAndUpdate(jobId, {
      company,
      role,
      location,
      link,
      dateApplied,
      status,
      salary,
      notes,
      resumeVersion
    }, { new: true });
    if (!Updatedjob) {
      return res.status(400).json(new ApiError(400, "job not updated"))
    }
    res.status(200).json(new ApiResponse("job updated successfully!", Updatedjob, 200));

  } catch (error) {
    console.log(error)
  }
};

const deleteJob = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json(new ApiError(400, "user not logged in"))
    }
    const deletedJob = await Job.findByIdAndDelete(req.params.id);
    if (!deletedJob) {
      return res.status(400).json(new ApiError(400, "job not deleted"))
    }
    res.status(200).json(new ApiResponse("job deleted successfully!", deletedJob, 200));
  } catch (error) {
    return res.status(500).json(new ApiError(500, "internal server error"))
  }

};

const getStats = async (req, res) => {
  try {
    const userId = req.user.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const stats = await Job.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $group: {
          _id: null,

          total: {
            $sum: 1,
          },

          applied: {
            $sum: {
              $cond: [
                { $eq: ["$status", "Applied"] },
                1,
                0,
              ],
            },
          },

          rejected: {
            $sum: {
              $cond: [
                { $eq: ["$status", "Rejected"] },
                1,
                0,
              ],
            },
          },

          interviewing: {
            $sum: {
              $cond: [
                { $eq: ["$status", "Interviewing"] },
                1,
                0,
              ],
            },
          },

          offers: {
            $sum: {
              $cond: [
                { $eq: ["$status", "Offer"] },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          total: 1,
          applied: 1,
          rejected: 1,
          interviewing: 1,
          offers: 1,
        },
      },
    ]);

    const jobStats = stats[0] || {
      total: 0,
      applied: 0,
      rejected: 0,
      interviewing: 0,
      offers: 0,
    };

    return res.status(200).json({
      success: true,
      message: "Job stats fetched successfully",
      data: jobStats,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch job stats",
      error: error.message,
    });
  }
};


module.exports = {
  getJobs,
  createJob,
  updateJob,
  deleteJob,
  getStats
};    
