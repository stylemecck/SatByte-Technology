import mongoose from 'mongoose'

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    /** Required to delete the asset from Cloudinary when the project is removed. */
    cloudinaryPublicId: { type: String, required: true },
    technologies: [{ type: String, trim: true }],
    category: {
      type: String,
      enum: ['Web', 'E-commerce', 'Software', 'Other'],
      default: 'Web',
    },
  },
  { timestamps: true },
)

export const Project = mongoose.models.Project || mongoose.model('Project', projectSchema)
