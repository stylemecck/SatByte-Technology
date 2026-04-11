import mongoose from 'mongoose'

const enrollmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    certification: { type: mongoose.Schema.Types.ObjectId, ref: 'Certification', required: true },
    status: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    paymentId: { type: String }, // Stripe / Razorpay path
    certificateUrl: { type: String }, // Downloadable PDF
  },
  { timestamps: true }
)

export const Enrollment = mongoose.models.Enrollment || mongoose.model('Enrollment', enrollmentSchema)
