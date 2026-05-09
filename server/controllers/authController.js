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

/** 
 * Step 1: Request Registration OTP. 
 * Doesn't check for orders, just verifies email availability and sends code.
 */
export async function clientRegisterRequest(req, res) {
  try {
    const { email, name } = req.body
    if (!email || !name) {
      return res.status(400).json({ message: 'Name and email are required' })
    }

    const normalizedEmail = email.toLowerCase().trim()
    const exists = await User.findOne({ email: normalizedEmail })
    
    if (exists) {
      return res.status(409).json({ message: 'This email is already registered. Please login instead.' })
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString()
    await Otp.deleteMany({ email: normalizedEmail })
    await Otp.create({ email: normalizedEmail, otp: code })

    const gmailUser = process.env.GMAIL_USER || 'info@satbyte.in'

    try {
      await mailTransporter.sendMail({
        from: `"SatByte Registration" <${gmailUser}>`,
        to: normalizedEmail,
        subject: `Your Registration Code: ${code}`,
        html: `<h2>Welcome to SatByte</h2><p>Hello ${name},</p><p>Your verification code to complete registration is: <strong>${code}</strong></p><p>This code expires in 5 minutes.</p>`,
      })
      res.json({ message: 'Verification code sent to your email.' })
    } catch (mailError) {
      console.error('[client-register-request] Mail Delivery Failed. OTP:', code, '| Error:', mailError.message)
      // Fallback for local development if mail fails
      if (process.env.NODE_ENV !== 'production' || !process.env.GMAIL_USER) {
        return res.json({ 
          message: 'Verification code generated (Check server console/logs for code)', 
          dev_note: 'Mail delivery failed. See server logs for the OTP code to proceed.' 
        })
      }
      throw mailError // Re-throw to be caught by outer catch for production 500
    }
  } catch (e) {
    console.error('[client-register-request] Failed:', e.message)
    res.status(500).json({ message: 'Failed to send verification code' })
  }
}

/** 
 * Step 2: Verify Registration OTP and Create Account.
 */
export async function clientRegisterVerify(req, res) {
  try {
    const { email, name, otp, password } = req.body
    if (!email || !name || !otp || !password || password.length < 8) {
      return res.status(400).json({ message: 'All fields (name, email, otp, password 8+) are required' })
    }

    const normalizedEmail = email.toLowerCase().trim()
    const validOtp = await Otp.findOne({ email: normalizedEmail, otp })

    if (!validOtp) {
      return res.status(401).json({ message: 'Invalid or expired verification code' })
    }

    // Double check existence just in case of race condition
    const exists = await User.findOne({ email: normalizedEmail })
    if (exists) {
      return res.status(409).json({ message: 'Email already registered' })
    }

    await Otp.deleteMany({ email: normalizedEmail })

    const passwordHash = await bcrypt.hash(password, 12)
    const user = await User.create({
      email: normalizedEmail,
      name: name.trim(),
      passwordHash,
      role: 'client',
    })

    const token = signToken(user)
    res.status(201).json({
      token,
      user: { id: user._id, email: user.email, role: user.role, name: user.name },
    })
  } catch (e) {
    console.error('[client-register-verify] Failed:', e.message)
    res.status(500).json({ message: 'Account creation failed' })
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

    const gmailUser = process.env.GMAIL_USER || 'info@satbyte.in'
    
    try {
      await mailTransporter.sendMail({
        from: `"SatByte Portal" <${gmailUser}>`,
        to: normalizedEmail,
        subject: `Your Login Code: ${code}`,
        html: `<h2>SatByte Client Portal</h2><p>Your one-time login code is: <strong>${code}</strong></p><p>This code expires in 5 minutes.</p>`,
      })
      res.json({ message: 'OTP sent to your email.' })
    } catch (mailError) {
      console.error('[auth/client-login] Mail Delivery Failed. OTP:', code, '| Error:', mailError.message)
      if (process.env.NODE_ENV !== 'production' || !process.env.GMAIL_USER) {
        return res.json({ 
          message: 'OTP generated (Check server console/logs for code)',
          dev_note: 'Mail delivery failed. See server logs for the OTP code to proceed.'
        })
      }
      throw mailError
    }
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
    // 1. Fetch all unique emails from the Order collection with their earliest creation date
    const orders = await Order.aggregate([
      { $sort: { createdAt: 1 } },
      { $group: { 
          _id: "$email", 
          email: { $first: "$email" },
          customerName: { $first: "$customerName" },
          createdAt: { $first: "$createdAt" }
      }}
    ])

    // 2. Fetch all registered users with role 'client'
    const users = await User.find({ role: 'client' }).select('-passwordHash').lean()

    // 3. Create a map to merge them, prioritizing User record details
    const clientsMap = new Map()

    // Start with Order data (potential shadow clients)
    orders.forEach(o => {
      clientsMap.set(o.email, {
        email: o.email,
        name: o.customerName || '',
        createdAt: o.createdAt,
        role: 'client',
        hasPassword: false
      })
    })

    // Overlay with registered User data
    users.forEach(u => {
      const existing = clientsMap.get(u.email)
      clientsMap.set(u.email, {
        ...existing,
        ...u,
        hasPassword: !!u.passwordHash || (existing?.hasPassword ?? false)
      })
    })

    const combined = Array.from(clientsMap.values()).sort((a,b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return dateB - dateA
    })

    res.json(combined)
  } catch (e) {
    console.error('[get-clients]', e)
    res.status(500).json({ message: 'Failed to fetch clients' })
  }
}
