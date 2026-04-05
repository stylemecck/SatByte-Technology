import Stripe from 'stripe'

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
