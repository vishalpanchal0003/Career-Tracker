const mongoose = require('mongoose');
const jobSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  company: { type: String, required: true },
  role: { type: String, required: true },
  location: String,
  link: String,
  dateApplied: { type: Date, default: Date.now },
  status: {
    type: String,
    default: "Applied",
    enum: ['Wishlist', 'Applied', 'Screening', 'Interview', 'Offer', 'Rejected', 'Ghosted']
  },
  salary: String,
  notes: String,
  resumeVersion: String
}, { timestamps: true }); 

const Job = mongoose.models.Job || mongoose.model('Job', jobSchema);
module.exports = Job;
