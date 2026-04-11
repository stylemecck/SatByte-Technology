import mongoose from 'mongoose'

const applicationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
    internship: { type: mongoose.Schema.Types.ObjectId, ref: 'Internship' },
    type: { type: String, enum: ['Job', 'Internship'], required: true },
    resumeUrl: { type: String, required: true },
    coverLetter: { type: String },
    college: { type: String }, // For internship applicants
    course: { type: String },  // For internship applicants
    skills: { type: String },
    status: { type: String, enum: ['Pending', 'Reviewed', 'Rejected', 'Hired'], default: 'Pending' },
  },
  { timestamps: true }
)

export const Application = mongoose.models.Application || mongoose.model('Application', applicationSchema)
