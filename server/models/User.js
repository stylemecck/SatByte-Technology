import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['admin', 'client'], default: 'client' },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  },
)

userSchema.virtual('hasPassword').get(function() {
  return !!this.passwordHash
})

export const User = mongoose.models.User || mongoose.model('User', userSchema)
