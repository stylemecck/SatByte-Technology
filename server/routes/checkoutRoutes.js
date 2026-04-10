import { Router } from 'express'

import { createCheckoutSession } from '../controllers/checkoutController.js'
import { requireAuth } from '../middleware/auth.js'
import { getOrders } from '../controllers/checkoutController.js'

const router = Router()

router.post('/create-session', createCheckoutSession)
router.get('/orders', requireAuth, getOrders)

export default router
