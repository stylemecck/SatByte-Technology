import { Router } from 'express'
import { login, register, clientLoginRequest, clientLoginVerify } from '../controllers/authController.js'

const router = Router()
router.post('/login', login)
router.post('/register', register)
router.post('/client-login', clientLoginRequest)
router.post('/client-verify', clientLoginVerify)

export default router
