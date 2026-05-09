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
    /** Required to delete the asset from Cloudinary when the certification is removed. */
    cloudinaryPublicId: { type: String },
    status: { type: String, enum: ['Active', 'Draft'], default: 'Active' },
  },
  { timestamps: true }
)

export const Certification = mongoose.models.Certification || mongoose.model('Certification', certificationSchema)
