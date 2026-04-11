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
  uploadOrderAsset,
  removeOrderAsset
} from '../controllers/checkoutController.js'
import { requireAuth, requireAdmin } from '../middleware/auth.js'
import { uploadSingleFile } from '../middleware/upload.js'

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
router.get('/orders', requireAuth, requireAdmin, getOrders)
router.get('/my-orders', requireAuth, getMyOrders)
router.put('/orders/:id/status', requireAuth, requireAdmin, updateOrderStatus)

// Project Files (protected)
router.post('/orders/:id/assets', requireAuth, (req, res, next) => {
  uploadSingleFile(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message || 'File upload failed' })
    next()
  })
}, uploadOrderAsset)
router.delete('/orders/:id/assets/:assetId', requireAuth, removeOrderAsset)

export default router
