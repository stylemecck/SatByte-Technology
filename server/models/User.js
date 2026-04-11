import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: false },
    role: { type: String, enum: ['admin', 'client'], default: 'client' },
    name: { type: String, trim: true },
    phone: { type: String, trim: true },
    company: { type: String, trim: true },
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
