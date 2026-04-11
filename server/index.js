import 'dotenv/config'
import cors from 'cors'
import express from 'express'

import { connectDb } from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import blogRoutes from './routes/blogRoutes.js'
import checkoutRoutes from './routes/checkoutRoutes.js'
import contactRoutes from './routes/contactRoutes.js'
import projectRoutes from './routes/projectRoutes.js'
import serviceRoutes from './routes/serviceRoutes.js'
import ticketRoutes from './routes/ticketRoutes.js'
import { handlePurchaseSuccess } from './controllers/checkoutController.js'

const app = express()
const PORT = Number(process.env.PORT || 5000)

const clientOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

app.use(
  cors({
    origin: clientOrigins,
    credentials: true,
  }),
)
app.use(express.json({ limit: '2mb' }))
app.use(express.urlencoded({ extended: true }))

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'SatByte API' })
})

app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/blogs', blogRoutes)
app.use('/api/services', serviceRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/checkout', checkoutRoutes)
app.use('/api/tickets', ticketRoutes)

// Sample route for purchase success confirmation
app.post('/api/purchase-success', handlePurchaseSuccess)

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ message: err.message || 'Server error' })
})

await connectDb()
app.listen(PORT, () => {
  console.log(`[api] http://localhost:${PORT}`)
})
