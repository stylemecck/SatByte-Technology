import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'

function signToken(user) {
  const secret = process.env.JWT_SECRET
  return jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    },
    secret,
    { expiresIn: '7d' },
  )
}

export async function login(req, res) {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' })
    }
    const user = await User.findOne({ email: email.toLowerCase().trim() })
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }
    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }
    const token = signToken(user)
    res.json({
      token,
      user: { id: user._id, email: user.email, role: user.role },
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Login failed' })
  }
}

/** Registration allowed only when ALLOW_REGISTER=true (bootstrap admin). */
export async function register(req, res) {
  try {
    if (process.env.ALLOW_REGISTER !== 'true') {
      return res.status(403).json({ message: 'Registration is disabled' })
    }
    const { email, password } = req.body
    if (!email || !password || password.length < 8) {
      return res.status(400).json({ message: 'Valid email and password (8+ chars) required' })
    }
    const exists = await User.findOne({ email: email.toLowerCase().trim() })
    if (exists) {
      return res.status(409).json({ message: 'Email already registered' })
    }
    const passwordHash = await bcrypt.hash(password, 12)
    const user = await User.create({
      email: email.toLowerCase().trim(),
      passwordHash,
      role: 'admin',
    })
    const token = signToken(user)
    res.status(201).json({
      token,
      user: { id: user._id, email: user.email, role: user.role },
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Registration failed' })
  }
}
