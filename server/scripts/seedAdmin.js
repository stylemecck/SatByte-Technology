/**
 * Create first admin user. Usage:
 *   ALLOW_REGISTER is not needed — this script runs directly.
 *   node scripts/seedAdmin.js
 *
 * Requires MONGODB_URI, JWT_SECRET in .env (or env vars).
 */
import 'dotenv/config'
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'

import { User } from '../models/User.js'

const email = process.env.SEED_ADMIN_EMAIL || 'admin@satbyte.in'
const password = process.env.SEED_ADMIN_PASSWORD || '1234'

async function main() {
  if (!password || password.length < 8) {
    console.error('Set SEED_ADMIN_PASSWORD (8+ chars) in server/.env')
    process.exit(1)
  }
  await mongoose.connect(process.env.MONGODB_URI)
  const existing = await User.findOne({ email: email.toLowerCase() })
  if (existing) {
    console.log('Admin already exists:', email)
    await mongoose.disconnect()
    return
  }
  const passwordHash = await bcrypt.hash(password, 12)
  await User.create({ email: email.toLowerCase(), passwordHash, role: 'admin' })
  console.log('Admin created:', email)
  await mongoose.disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
