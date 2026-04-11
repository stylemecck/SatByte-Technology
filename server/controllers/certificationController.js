import Stripe from 'stripe'
import { Certification } from '../models/Certification.js'
import { Enrollment } from '../models/Enrollment.js'

/** Public: List all certifications */
export async function getAllCertifications(req, res) {
  try {
    const certs = await Certification.find({ status: 'Active' }).sort({ createdAt: -1 })
    res.json(certs)
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch certifications' })
  }
}

/** Public: Get single certification */
export async function getCertificationById(req, res) {
  try {
    const cert = await Certification.findById(req.params.id)
    if (!cert) return res.status(404).json({ message: 'Certification not found' })
    res.json(cert)
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch certification details' })
  }
}

/** Admin: Create new certification */
export async function createCertification(req, res) {
  try {
    const cert = await Certification.create(req.body)
    res.status(201).json(cert)
  } catch (e) {
    res.status(500).json({ message: 'Failed to create certification' })
  }
}

/** Authenticated: Create Stripe Checkout Session for enrollment */
export async function createEnrollmentSession(req, res) {
  try {
    const { certificationId } = req.body
    const userId = req.user.id
    
    const cert = await Certification.findById(certificationId)
    if (!cert) return res.status(404).json({ message: 'Certification not found' })

    const secret = process.env.STRIPE_SECRET_KEY
    if (!secret) return res.status(503).json({ message: 'Stripe not configured' })

    const stripe = new Stripe(secret)
    const clientUrl = (process.env.CLIENT_URL || 'http://localhost:5173').split(',')[0].trim().replace(/\/$/, '')
    
    // Dynamic origin: use the request's origin to ensure we redirect back to the correct portal
    const origin = req.get('origin')?.replace(/\/$/, '') || clientUrl

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: `SatByte Certification: ${cert.title}`,
              description: cert.description,
            },
            unit_amount: cert.price * 100, // INR in paise
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/dashboard?enroll_success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/certifications/${cert._id}`,
      metadata: {
        certificationId: cert._id.toString(),
        userId,
        type: 'certification_enrollment'
      },
    })

    res.json({ url: session.url })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Could not initiate enrollment' })
  }
}

/** Verify enrollment after payment (usually called from frontend success page or webhook) */
export async function verifyEnrollment(req, res) {
  const { session_id } = req.body
  console.log('[verify-enrollment] Starting verification for session:', session_id)

  try {
    const secret = process.env.STRIPE_SECRET_KEY
    if (!secret) {
      console.error('[verify-enrollment] STRIPE_SECRET_KEY is missing from environment')
      return res.status(503).json({ message: 'Stripe not configured on server' })
    }

    const stripe = new Stripe(secret)
    
    let session
    try {
      session = await stripe.checkout.sessions.retrieve(session_id)
    } catch (stripeErr) {
      console.error('[verify-enrollment] Stripe session retrieval failed:', stripeErr.message)
      return res.status(400).json({ message: 'Invalid session ID or Stripe error' })
    }

    if (session.payment_status !== 'paid') {
      console.warn('[verify-enrollment] Payment status not paid:', session.payment_status)
      return res.status(400).json({ message: 'Payment not verified' })
    }

    const metadata = session.metadata
    if (!metadata || !metadata.certificationId || !metadata.userId) {
      console.error('[verify-enrollment] Missing metadata in session:', metadata)
      return res.status(500).json({ message: 'Internal error: Session metadata is incomplete' })
    }

    const { certificationId, userId } = metadata
    
    // Check if already enrolled to prevent duplicates
    const existing = await Enrollment.findOne({ 
      user: userId, 
      certification: certificationId,
      paymentId: session.id 
    })

    if (!existing) {
      console.log('[verify-enrollment] Creating new enrollment for user:', userId, 'cert:', certificationId)
      await Enrollment.create({
        user: userId,
        certification: certificationId,
        status: 'Completed',
        amount: (session.amount_total || 0) / 100,
        paymentId: session.id
      })
    } else {
      console.log('[verify-enrollment] Enrollment already exists for session:', session.id)
    }

    res.json({ message: 'Enrollment successful' })
  } catch (e) {
    console.error('[verify-enrollment] Unexpected Error:', e)
    res.status(500).json({ message: `Verification failed: ${e.message}` })
  }
}


/** Authenticated: Get user's enrollments */
export async function getMyEnrollments(req, res) {
  try {
    const enrollments = await Enrollment.find({ user: req.user.id })
      .populate('certification')
      .sort({ createdAt: -1 })
    res.json(enrollments)
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch enrollments' })
  }
}
