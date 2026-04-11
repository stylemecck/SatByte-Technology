import mongoose from 'mongoose'

const internshipSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: String, required: true }, // e.g., "6 Months"
    stipend: { type: String }, // e.g., "₹5,000/month"
    requirements: [{ type: String }],
    location: { type: String, default: 'Remote' },
    skills: [{ type: String }],
    status: { type: String, enum: ['Open', 'Closed'], default: 'Open' },
  },
  { timestamps: true }
)

export const Internship = mongoose.models.Internship || mongoose.model('Internship', internshipSchema)
