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
    const userId = req.user.sub
    
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
  try {
    const { session_id } = req.body
    const secret = process.env.STRIPE_SECRET_KEY
    const stripe = new Stripe(secret)
    
    const session = await stripe.checkout.sessions.retrieve(session_id)
    if (session.payment_status !== 'paid') {
      return res.status(400).json({ message: 'Payment not verified' })
    }

    const { certificationId, userId } = session.metadata
    
    // Check if already enrolled to prevent duplicates
    const existing = await Enrollment.findOne({ 
      user: userId, 
      certification: certificationId,
      paymentId: session.id 
    })

    if (!existing) {
      await Enrollment.create({
        user: userId,
        certification: certificationId,
        status: 'Completed',
        amount: session.amount_total / 100,
        paymentId: session.id
      })
    }

    res.json({ message: 'Enrollment successful' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Failed to verify enrollment' })
  }
}

/** Authenticated: Get user's enrollments */
export async function getMyEnrollments(req, res) {
  try {
    const enrollments = await Enrollment.find({ user: req.user.sub })
      .populate('certification')
      .sort({ createdAt: -1 })
    res.json(enrollments)
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch enrollments' })
  }
}
