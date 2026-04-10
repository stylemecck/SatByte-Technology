import { Router } from 'express'

import {
  createCheckoutSession,
  handlePurchaseSuccess,
  getOrders,
  getMyOrders,
  updateOrderStatus,
  createRazorpayOrder,
  verifyRazorpayPayment,
  createPayuSession,
} from '../controllers/checkoutController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// Stripe
router.post('/create-session', createCheckoutSession)
router.post('/purchase-success', handlePurchaseSuccess)

// Razorpay
router.post('/razorpay/create-order', createRazorpayOrder)
router.post('/razorpay/verify', verifyRazorpayPayment)

// PayUMoney
router.post('/payu/create-session', createPayuSession)

// Order management (protected)
router.get('/orders', requireAuth, getOrders)
router.get('/my-orders', requireAuth, getMyOrders)
router.put('/orders/:id/status', requireAuth, updateOrderStatus)

export default router
