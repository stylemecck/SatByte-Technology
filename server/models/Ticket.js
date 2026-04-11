import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema(
  {
    sender: { type: String, enum: ['client', 'admin'], required: true },
    content: { type: String, required: true },
    readAt: { type: Date }
  },
  { timestamps: true }
)

const ticketSchema = new mongoose.Schema(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: false },
    email: { type: String, required: true, lowercase: true, trim: true },
    subject: { type: String, required: true },
    status: { type: String, enum: ['Open', 'Waiting on Client', 'Closed'], default: 'Open' },
    messages: [messageSchema]
  },
  { timestamps: true }
)

export const Ticket = mongoose.models.Ticket || mongoose.model('Ticket', ticketSchema)
