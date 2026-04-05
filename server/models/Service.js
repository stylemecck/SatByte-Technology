import mongoose from 'mongoose'

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    iconUrl: { type: String, required: true },
    cloudinaryPublicId: { type: String, required: true },
    /** Optional Lucide icon key for fallback display on the client */
    iconKey: { type: String, default: 'Globe' },
  },
  { timestamps: true },
)

export const Service = mongoose.models.Service || mongoose.model('Service', serviceSchema)
