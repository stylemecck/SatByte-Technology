import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    planKey: { type: String, required: true },
    planName: { type: String, required: true },
    amountPaid: { type: Number },
    paymentGatewayReferenceId: { type: String, required: true }, // Stripe session or payment intent
    emailReferenceId: { type: String, required: true }, // The SB-XXXXXX reference
    customerName: { type: String },
    status: { type: String, default: 'paid' },
    projectStatus: { type: String, default: 'Pending Validation' },
    progress: { type: Number, default: 0 },
    assets: [
      {
        fileName: { type: String, required: true },
        fileUrl: { type: String, required: true },
        cloudinaryPublicId: { type: String, required: true },
        uploadedBy: { type: String, required: true },
        uploadedAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true },
)

export const Order = mongoose.models.Order || mongoose.model('Order', orderSchema)
