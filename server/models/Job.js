import mongoose from 'mongoose'

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    requirements: [{ type: String }],
    responsibilities: [{ type: String }],
    location: { type: String, default: 'Remote' },
    experience: { type: String }, // e.g., "1-3 years"
    salary: { type: String },
    category: { type: String, enum: ['Engineering', 'Design', 'Marketing', 'Sales', 'Other'], default: 'Engineering' },
    type: { type: String, enum: ['Full-time', 'Part-time', 'Contract'], default: 'Full-time' },
    status: { type: String, enum: ['Open', 'Closed'], default: 'Open' },
  },
  { timestamps: true }
)

export const Job = mongoose.models.Job || mongoose.model('Job', jobSchema)
