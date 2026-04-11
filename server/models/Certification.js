import mongoose from 'mongoose'

const certificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: String, required: true }, // e.g., "3 Months"
    features: [{ type: String }],
    syllabus: [{ type: String }],
    imageUrl: { type: String },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  },
  { timestamps: true }
)

export const Certification = mongoose.models.Certification || mongoose.model('Certification', certificationSchema)
