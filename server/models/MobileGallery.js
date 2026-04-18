import mongoose from 'mongoose'

const mobileGallerySchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true,
      index: true 
    },
    assetId: { type: String }, // Phone's internal media ID
    fileName: { type: String },
    fileUrl: { type: String, required: true },
    mimeType: { type: String },
    metadata: {
      width: Number,
      height: Number,
      creationTime: Date,
      location: {
        latitude: Number,
        longitude: Number
      }
    }
  },
  { 
    timestamps: true 
  }
)

// Index for per-user lookups
mobileGallerySchema.index({ userId: 1, assetId: 1 })

export const MobileGallery = mongoose.models.MobileGallery || mongoose.model('MobileGallery', mobileGallerySchema)
