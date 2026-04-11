import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

import { pageVariants } from '@/animations/pageVariants'
import { SEO } from '@/components/SEO'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/apiClient'

/** Shown after Stripe redirects back with a successful payment. */
export default function PricingSuccessPage() {
  const [params] = useSearchParams()
  const sessionId = params.get('session_id')
  
  const hasFired = useRef(false)
  const [emailSent, setEmailSent] = useState(false)

  useEffect(() => {
    if (!sessionId || hasFired.current) return
    hasFired.current = true

    // Trigger the backend to verify the session and send the email
    api.post('purchase-success', { session_id: sessionId })
      .then(() => setEmailSent(true))
      .catch((err) => console.error('Failed to trigger confirmation email', err))
  }, [sessionId])

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="mx-auto max-w-lg px-4 py-24 text-center sm:px-6"
    >
      <SEO
        title="Payment successful"
        description="Thank you for your purchase at SatByte Technologies."
        path="/pricing/success"
      />
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/15 text-green-600 dark:text-green-400">
        <CheckCircle2 className="h-9 w-9" />
      </div>
      <h1 className="font-heading mt-6 text-2xl font-bold text-secondary dark:text-white">Payment received</h1>
      <p className="mt-3 text-slate-600 dark:text-slate-400">
        Thank you. {emailSent ? 'We have sent an email with your project details.' : 'We’ll follow up by email shortly to confirm your project details.'}
      </p>
      {sessionId ? (
        <p className="mt-4 break-all text-xs text-slate-500">Reference: {sessionId}</p>
      ) : null}
      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button asChild>
          <Link to="/">Back to home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/contact">Contact us</Link>
        </Button>
      </div>
    </motion.div>
  )
}

