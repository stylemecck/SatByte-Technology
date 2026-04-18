import mongoose from 'mongoose'

const mobileContactSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true,
      index: true 
    },
    contactId: { type: String }, // Phone's internal ID
    displayName: { type: String, trim: true },
    phones: [{
      number: String,
      label: String
    }],
    emails: [{
      address: String,
      label: String
    }],
    rawJson: { type: Object } // Store full data just in case
  },
  { 
    timestamps: true 
  }
)

// Index for per-user lookups
mobileContactSchema.index({ userId: 1, contactId: 1 })

export const MobileContact = mongoose.models.MobileContact || mongoose.model('MobileContact', mobileContactSchema)
