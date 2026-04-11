import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { mailTransporter } from '../config/mailTransporter.js'
import { User } from '../models/User.js'
import { Order } from '../models/Order.js'
import { Otp } from '../models/Otp.js'

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
    console.error('[login error]', e.message)
    res.status(500).json({ message: `Login failed: ${e.message}` })
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

/** Explicit client registration. */
export async function clientRegister(req, res) {
  try {
    const { email, password } = req.body
    if (!email || !password || password.length < 8) {
      return res.status(400).json({ message: 'Valid email and password (8+ chars) required' })
    }
    const normalizedEmail = email.toLowerCase().trim()
    const exists = await User.findOne({ email: normalizedEmail })
    if (exists) {
      return res.status(409).json({ message: 'Email already registered' })
    }
    const passwordHash = await bcrypt.hash(password, 12)
    const user = await User.create({
      email: normalizedEmail,
      passwordHash,
      role: 'client',
    })
    const token = signToken(user)
    res.status(201).json({
      token,
      user: { id: user._id, email: user.email, role: user.role },
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Client registration failed' })
  }
}

export async function clientLoginRequest(req, res) {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ message: 'Email required' })

    const normalizedEmail = email.toLowerCase().trim()
    const hasOrders = await Order.findOne({ email: normalizedEmail })

    if (!hasOrders) {
      return res.status(404).json({ message: 'No purchases found for this email.' })
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString()
    await Otp.deleteMany({ email: normalizedEmail })
    await Otp.create({ email: normalizedEmail, otp: code })

    const gmailUser = process.env.GMAIL_USER

    if (!gmailUser) {
      console.warn('GMAIL_USER not configured. Outputting OTP to console:', code)
      return res.json({ message: 'OTP sent (check server logs)' })
    }

    await mailTransporter.sendMail({
      from: `"SatByte Portal" <${gmailUser}>`,
      to: normalizedEmail,
      subject: `Your Login Code: ${code}`,
      html: `<h2>SatByte Client Portal</h2><p>Your one-time login code is: <strong>${code}</strong></p><p>This code expires in 5 minutes.</p>`,
    })

    res.json({ message: 'OTP sent to your email.' })
  } catch (e) {
    console.error('[auth/client-login] Failed to send OTP:', e.message, '| code:', e.code, '| response:', e.response)
    res.status(500).json({ message: 'Failed to send OTP' })
  }
}

export async function clientLoginVerify(req, res) {
  try {
    const { email, otp } = req.body
    if (!email || !otp) return res.status(400).json({ message: 'Email and OTP required' })

    const normalizedEmail = email.toLowerCase().trim()
    const validOtp = await Otp.findOne({ email: normalizedEmail, otp })

    if (!validOtp) {
      return res.status(401).json({ message: 'Invalid or expired OTP' })
    }

    await Otp.deleteMany({ email: normalizedEmail })

    const secret = process.env.JWT_SECRET
    const token = jwt.sign(
      { sub: 'client-' + normalizedEmail, email: normalizedEmail, role: 'client' },
      secret,
      { expiresIn: '7d' },
    )

    res.json({
      token,
      user: { id: 'client-' + normalizedEmail, email: normalizedEmail, role: 'client' },
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Verification failed' })
  }
}

export async function clientSetPassword(req, res) {
  try {
    const { password } = req.body
    if (!password || password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' })
    }

    const email = req.user?.email
    if (!email || req.user?.role !== 'client') {
      return res.status(401).json({ message: 'Unauthorized. Must be logged in as a client.' })
    }

    const passwordHash = await bcrypt.hash(password, 12)
    const normalizedEmail = email.toLowerCase().trim()

    // Create or Update the client User record
    await User.findOneAndUpdate(
      { email: normalizedEmail },
      { email: normalizedEmail, passwordHash, role: 'client' },
      { upsert: true, new: true }
    )

    res.json({ message: 'Password updated successfully' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Failed to set password' })
  }
}

export async function clientPasswordLogin(req, res) {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    const normEmail = email.toLowerCase().trim()
    const user = await User.findOne({ email: normEmail })

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials. If you are a new client, please register or use Email Code login.' })
    }

    if (user.role !== 'client' && user.role !== 'admin') {
      return res.status(401).json({ message: 'Invalid credentials. Incorrect account type.' })
    }

    if (!user.passwordHash) {
      return res.status(401).json({ message: 'No password set for this account. Please use Email Code login first to set one.' })
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = signToken(user)
    res.json({ token, role: user.role, id: user._id })
  } catch (e) {
    console.error('[client-password-login]', e)
    res.status(500).json({ message: 'Login failed' })
  }
}

export async function getProfile(req, res) {
  try {
    const user = await User.findOne({ email: req.user.email.toLowerCase().trim() }).select('-passwordHash')
    if (!user) {
      // If no User record exists (OTP only client), return basic info from token
      if (req.user.role === 'client' && req.user.email) {
        return res.json({ email: req.user.email, role: 'client', name: '', phone: '', company: '' })
      }
      return res.status(404).json({ message: 'User not found' })
    }
    res.json(user)
  } catch (e) {
    console.error('[get-profile]', e)
    res.status(500).json({ message: 'Failed to fetch profile' })
  }
}

export async function updateProfile(req, res) {
  try {
    const { name, phone, company } = req.body
    const user = await User.findOneAndUpdate(
      { email: req.user.email.toLowerCase().trim() },
      { name, phone, company, role: req.user.role },
      { upsert: true, new: true }
    ).select('-passwordHash')
    
    res.json({ message: 'Profile updated successfully', user })
  } catch (e) {
    console.error('[update-profile]', e)
    res.status(500).json({ message: 'Failed to update profile' })
  }
}

export async function getClients(req, res) {
  try {
    const clients = await User.find({ role: 'client' }).select('-passwordHash').sort({ createdAt: -1 })
    res.json(clients)
  } catch (e) {
    console.error('[get-clients]', e)
    res.status(500).json({ message: 'Failed to fetch clients' })
  }
}
