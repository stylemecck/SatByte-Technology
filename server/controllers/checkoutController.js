import Stripe from 'stripe'
import Razorpay from 'razorpay'
import crypto from 'crypto'
import { sendPurchaseConfirmation } from '../config/mailTransporter.js'
import { Order } from '../models/Order.js'

/** INR amounts in paise (smallest currency unit) — must match marketing prices. */
const PLAN_AMOUNTS_INR = {
  basic: 499_900,
  standard: 999_900,
  premium: 1_999_900,
}

const PLAN_LABELS = {
  basic: { name: 'SatByte — Basic Plan', description: 'Website essentials package (₹4,999)' },
  standard: { name: 'SatByte — Standard Plan', description: 'Growth website package (₹9,999)' },
  premium: { name: 'SatByte — Premium Plan', description: 'Full-featured package (₹19,999)' },
}

/**
 * Create a Stripe Checkout Session (one-time payment).
 * Prefer Stripe Price IDs from the Dashboard (STRIPE_PRICE_BASIC, etc.); otherwise uses `price_data` in INR.
 */
export async function createCheckoutSession(req, res) {
  try {
    const secret = process.env.STRIPE_SECRET_KEY
    if (!secret) {
      return res.status(503).json({
        message: 'Stripe is not configured. Set STRIPE_SECRET_KEY on the server.',
      })
    }

    const { planKey, isMonthly } = req.body
    if (!planKey || !PLAN_AMOUNTS_INR[planKey]) {
      return res.status(400).json({ message: 'Invalid plan. Use basic, standard, or premium.' })
    }

    const stripe = new Stripe(secret)
    // Take only the first origin — CLIENT_URL may be comma-separated for CORS
    const clientUrl = (process.env.CLIENT_URL || 'http://localhost:5173').split(',')[0].trim().replace(/\/$/, '')

    const priceId =
      planKey === 'basic'
        ? process.env.STRIPE_PRICE_BASIC
        : planKey === 'standard'
          ? process.env.STRIPE_PRICE_STANDARD
          : process.env.STRIPE_PRICE_PREMIUM

    let line_items
    if (priceId && !isMonthly) {
      line_items = [{ price: priceId, quantity: 1 }]
    } else {
      const meta = PLAN_LABELS[planKey]
      const priceData = {
        currency: 'inr',
        product_data: {
          name: isMonthly ? `${meta.name} (Monthly Retainer)` : meta.name,
          description: meta.description,
        },
        unit_amount: isMonthly ? Math.floor(PLAN_AMOUNTS_INR[planKey] / 2) : PLAN_AMOUNTS_INR[planKey],
      }
      
      if (isMonthly) {
        priceData.recurring = { interval: 'month' }
      }

      line_items = [
        {
          price_data: priceData,
          quantity: 1,
        },
      ]
    }

    const session = await stripe.checkout.sessions.create({
      mode: isMonthly ? 'subscription' : 'payment',
      line_items,
      success_url: `${clientUrl}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientUrl}/pricing/canceled`,
      metadata: {
        planKey,
        isMonthly: isMonthly ? 'true' : 'false',
        source: 'satbyte_pricing_page',
      },
      customer_creation: isMonthly ? undefined : 'always', // customer_creation cannot be passed when mode=subscription 
      billing_address_collection: 'required',
    })

    if (!session.url) {
      return res.status(500).json({ message: 'Stripe did not return a checkout URL' })
    }

    res.json({ url: session.url, sessionId: session.id })
  } catch (e) {
    console.error('[checkout]', e)
    res.status(500).json({ message: e.message || 'Could not start checkout' })
  }
}

/**
 * Handle successful purchase and send confirmation email.
 * Called after a successful transaction from the success page.
 */
export async function handlePurchaseSuccess(req, res) {
  try {
    const { session_id } = req.body;

    if (!session_id) {
      return res.status(400).json({ message: 'Session ID is required' });
    }

    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) {
      return res.status(503).json({ message: 'Stripe is not configured' });
    }

    const stripe = new Stripe(secret);
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== 'paid') {
      return res.status(400).json({ message: 'Payment not completed' });
    }

    // Stripe stores the customer's email in customer_details once paid
    const email = session.customer_details?.email || session.customer_email;
    const customerName = session.customer_details?.name;
    const planKey = session.metadata?.planKey;
    const gatewayReference = session.payment_intent || session.id;

    if (!email || !planKey) {
      return res.status(400).json({ message: 'Missing email or plan in session' });
    }

    const planData = PLAN_LABELS[planKey] || { name: planKey };
    
    // Generate a reference number from the Stripe session ID (last 6 characters)
    const referenceNumber = `SB-${session_id.slice(-6).toUpperCase()}`;

    // Check if order is already processed to prevent duplicate emails and DB entries
    const existingOrder = await Order.findOne({ paymentGatewayReferenceId: gatewayReference });
    
    if (!existingOrder) {
      // Save order to Database
      await Order.create({
        email,
        customerName,
        planKey,
        planName: planData.name,
        amountPaid: session.amount_total,
        paymentGatewayReferenceId: gatewayReference,
        emailReferenceId: referenceNumber,
        status: 'paid'
      });

      // Send the confirmation email
      await sendPurchaseConfirmation(email, planData.name, referenceNumber, gatewayReference, session.amount_total);
    }

    res.status(200).json({ 
      message: 'Purchase successful, order saved and confirmation email sent.',
      referenceNumber,
      gatewayReference,
      email,
      planName: planData.name
    });
  } catch (error) {
    console.error('[purchase-success]', error);
    res.status(500).json({ message: 'Failed to process purchase success' });
  }
}

export async function getOrders(req, res) {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('[get-orders]', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
}

export async function getMyOrders(req, res) {
  try {
    const email = req.user?.email;
    if (!email) return res.status(401).json({ message: 'Unauthenticated' });

    const orders = await Order.find({ email: email.toLowerCase().trim() }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('[get-my-orders]', error);
    res.status(500).json({ message: 'Failed to fetch your orders' });
  }
}

export async function updateOrderStatus(req, res) {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const { id } = req.params;
    const { projectStatus, progress } = req.body;
    
    const updated = await Order.findByIdAndUpdate(
      id,
      { projectStatus, progress },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Order not found' });
    
    res.json(updated);
  } catch (error) {
    console.error('[update-order-status]', error);
    res.status(500).json({ message: 'Failed to update order status' });
  }
}

import { uploadAnyFileBuffer, deleteAnyFile } from '../config/cloudinary.js';

export async function uploadOrderAsset(req, res) {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Clients can only upload to their own orders, Admins can upload to all
    if (req.user?.role !== 'admin' && order.email !== req.user?.email) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    if (!req.file?.buffer) {
      return res.status(400).json({ message: 'File is required' });
    }

    const { secure_url, public_id } = await uploadAnyFileBuffer(
      req.file.buffer,
      'order_assets',
      req.file.originalname
    );

    order.assets.push({
      fileName: req.file.originalname || 'unknown_file',
      fileUrl: secure_url,
      cloudinaryPublicId: public_id,
      uploadedBy: req.user?.email || 'Unknown',
    });

    await order.save();
    res.json(order);
  } catch (error) {
    console.error('[upload-order-asset]', error);
    res.status(500).json({ message: 'Failed to upload asset' });
  }
}

export async function removeOrderAsset(req, res) {
  try {
    const { id, assetId } = req.params;
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Clients can only remove their own orders, Admins can remove from all
    if (req.user?.role !== 'admin' && order.email !== req.user?.email) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const asset = order.assets.id(assetId);
    if (!asset) return res.status(404).json({ message: 'Asset not found' });

    await deleteAnyFile(asset.cloudinaryPublicId, asset.fileUrl.match(/\.(jpeg|jpg|gif|png)$/) != null);
    
    // Remote asset from array
    asset.deleteOne();
    await order.save();

    res.json(order);
  } catch (error) {
    console.error('[remove-order-asset]', error);
    res.status(500).json({ message: 'Failed to remove asset' });
  }
}

/* ─────────────────────────────────────────
   RAZORPAY
───────────────────────────────────────── */

/** Plan amounts in paise (Razorpay uses smallest unit) */
const PLAN_AMOUNTS_PAISE = {
  basic: 499900,
  standard: 999900,
  premium: 1999900,
}

/**
 * Create a Razorpay order and return order_id + key_id to the frontend.
 * The frontend then opens the Razorpay checkout popup.
 */
export async function createRazorpayOrder(req, res) {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET
    if (!keyId || !keySecret) {
      return res.status(503).json({ message: 'Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.' })
    }

    const { planKey } = req.body
    if (!planKey || !PLAN_AMOUNTS_PAISE[planKey]) {
      return res.status(400).json({ message: 'Invalid plan. Use basic, standard, or premium.' })
    }

    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret })
    const order = await razorpay.orders.create({
      amount: PLAN_AMOUNTS_PAISE[planKey],
      currency: 'INR',
      receipt: `satbyte_${planKey}_${Date.now()}`,
      notes: { planKey, source: 'satbyte_pricing_page' },
    })

    res.json({ orderId: order.id, keyId, amount: order.amount, planKey })
  } catch (e) {
    console.error('[razorpay/create-order] Full error:', JSON.stringify(e, null, 2))
    const razorErr = e?.error?.description || e?.message || 'Could not create Razorpay order'
    res.status(500).json({ message: razorErr, debug: e?.error || null })
  }
}

/**
 * Verify Razorpay payment signature, save order, send email.
 */
export async function verifyRazorpayPayment(req, res) {
  try {
    const keySecret = process.env.RAZORPAY_KEY_SECRET
    if (!keySecret) return res.status(503).json({ message: 'Razorpay not configured' })

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planKey, email, customerName } = req.body

    // Verify HMAC signature
    const hmac = crypto.createHmac('sha256', keySecret)
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`)
    const generatedSignature = hmac.digest('hex')

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Payment signature verification failed' })
    }

    const planData = PLAN_LABELS[planKey] || { name: planKey }
    const referenceNumber = `SB-RZP-${razorpay_payment_id.slice(-6).toUpperCase()}`

    const existingOrder = await Order.findOne({ paymentGatewayReferenceId: razorpay_payment_id })
    if (!existingOrder) {
      await Order.create({
        email,
        customerName,
        planKey,
        planName: planData.name,
        amountPaid: PLAN_AMOUNTS_PAISE[planKey],
        paymentGatewayReferenceId: razorpay_payment_id,
        emailReferenceId: referenceNumber,
        status: 'paid',
      })
      await sendPurchaseConfirmation(email, planData.name, referenceNumber, razorpay_payment_id, PLAN_AMOUNTS_PAISE[planKey])
    }

    res.json({ message: 'Payment verified successfully', referenceNumber })
  } catch (e) {
    console.error('[razorpay/verify]', e)
    res.status(500).json({ message: e.message || 'Verification failed' })
  }
}

/* ─────────────────────────────────────────
   PAYUMONEY
───────────────────────────────────────── */

const PLAN_AMOUNTS_RUPEES = { basic: 4999, standard: 9999, premium: 19999 }

/**
 * Generate a signed PayU session and return form fields.
 * The frontend auto-submits these as a POST form to PayU's payment URL.
 */
export async function createPayuSession(req, res) {
  try {
    const merchantKey = process.env.PAYU_MERCHANT_KEY
    const merchantSalt = process.env.PAYU_MERCHANT_SALT
    const payuBaseUrl = process.env.PAYU_BASE_URL || 'https://test.payu.in/_payment'

    if (!merchantKey || !merchantSalt) {
      return res.status(503).json({ message: 'PayUMoney is not configured. Set PAYU_MERCHANT_KEY and PAYU_MERCHANT_SALT.' })
    }

    const { planKey, email, name, phone } = req.body
    if (!planKey || !PLAN_AMOUNTS_RUPEES[planKey]) {
      return res.status(400).json({ message: 'Invalid plan.' })
    }

    const txnid = `SB-PAY-${Date.now()}`
    const amount = PLAN_AMOUNTS_RUPEES[planKey].toString()
    const productInfo = PLAN_LABELS[planKey]?.name || planKey
    // Take only the first origin — CLIENT_URL may be comma-separated for CORS
    const clientUrl = (process.env.CLIENT_URL || 'http://localhost:5173').split(',')[0].trim().replace(/\/$/, '')
    const successUrl = `${clientUrl}/pricing/success`
    const failureUrl = `${clientUrl}/pricing/canceled`

    // PayU hash: key|txnid|amount|productinfo|firstname|email|||||||||||salt
    const hashString = `${merchantKey}|${txnid}|${amount}|${productInfo}|${name}|${email}|||||||||||${merchantSalt}`
    const hash = crypto.createHash('sha512').update(hashString).digest('hex')

    res.json({
      payuBaseUrl,
      fields: { key: merchantKey, txnid, amount, productinfo: productInfo, firstname: name, email, phone: phone || '', surl: successUrl, furl: failureUrl, hash, service_provider: 'payu_paisa' },
    })
  } catch (e) {
    console.error('[payu/create-session]', e)
    res.status(500).json({ message: e.message || 'Could not create PayU session' })
  }
}
