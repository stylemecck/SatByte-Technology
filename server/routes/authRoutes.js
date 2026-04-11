import { Router } from 'express'
import { login, register, clientLoginRequest, clientLoginVerify, clientSetPassword, clientPasswordLogin, getClients } from '../controllers/authController.js'
import { requireAuth, requireAdmin } from '../middleware/auth.js'

const router = Router()

// POST handlers (actual API endpoints)
router.post('/login', login)
router.post('/register', register)
router.post('/client-login', clientLoginRequest)
router.post('/client-verify', clientLoginVerify)
router.post('/client-password-login', clientPasswordLogin)
router.post('/client-set-password', requireAuth, clientSetPassword)

// GET fallbacks — return a helpful JSON message when someone opens these URLs in a browser
const postOnly = (_req, res) =>
  res.status(405).json({ message: 'This endpoint only accepts POST requests.' })

router.get('/login', postOnly)
router.get('/register', postOnly)
router.get('/client-login', postOnly)
router.get('/client-verify', postOnly)

export default router
