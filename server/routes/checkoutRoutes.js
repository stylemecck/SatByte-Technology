import { Router } from 'express'

import { createCheckoutSession } from '../controllers/checkoutController.js'

const router = Router()

router.post('/create-session', createCheckoutSession)

export default router
