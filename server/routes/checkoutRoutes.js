import { Router } from 'express'

import { createCheckoutSession } from '../controllers/checkoutController.js'
import { requireAuth } from '../middleware/auth.js'
import { getOrders, getMyOrders, updateOrderStatus } from '../controllers/checkoutController.js'

const router = Router()

router.post('/create-session', createCheckoutSession)
router.get('/orders', requireAuth, getOrders)
router.get('/my-orders', requireAuth, getMyOrders)
router.put('/orders/:id/status', requireAuth, updateOrderStatus)

export default router
