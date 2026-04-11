import jwt from 'jsonwebtoken'

/**
 * Require a valid Bearer JWT (issued on login).
 */
export function requireAuth(req, res, next) {
  const header = req.headers.authorization
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' })
  }
  try {
    const secret = process.env.JWT_SECRET
    if (!secret) {
      return res.status(500).json({ message: 'Server JWT misconfiguration' })
    }
    const payload = jwt.verify(token, secret)
    req.user = { id: payload.sub, email: payload.email, role: payload.role }
    next()
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}

/**
 * Require the authenticated user to be an admin.
 * Must be used AFTER requireAuth.
 */
export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Admin access required' })
  }
  next()
}
