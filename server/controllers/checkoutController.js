import Stripe from 'stripe'
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

    const { planKey } = req.body
    if (!planKey || !PLAN_AMOUNTS_INR[planKey]) {
      return res.status(400).json({ message: 'Invalid plan. Use basic, standard, or premium.' })
    }

    const stripe = new Stripe(secret)
    const clientUrl = (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, '')

    const priceId =
      planKey === 'basic'
        ? process.env.STRIPE_PRICE_BASIC
        : planKey === 'standard'
          ? process.env.STRIPE_PRICE_STANDARD
          : process.env.STRIPE_PRICE_PREMIUM

    let line_items
    if (priceId) {
      line_items = [{ price: priceId, quantity: 1 }]
    } else {
      const meta = PLAN_LABELS[planKey]
      line_items = [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: meta.name,
              description: meta.description,
            },
            unit_amount: PLAN_AMOUNTS_INR[planKey],
          },
          quantity: 1,
        },
      ]
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      success_url: `${clientUrl}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientUrl}/pricing/canceled`,
      metadata: {
        planKey,
        source: 'satbyte_pricing_page',
      },
      customer_creation: 'always',
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
      await sendPurchaseConfirmation(email, planData.name, referenceNumber, gatewayReference);
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

/**
 * Get all orders.
 * Protected by admin auth middleware.
 */
export async function getOrders(req, res) {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('[get-orders]', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
}
