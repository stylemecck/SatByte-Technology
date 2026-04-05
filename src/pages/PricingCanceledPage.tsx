import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

import { pageVariants } from '@/animations/pageVariants'
import { SEO } from '@/components/SEO'
import { Button } from '@/components/ui/button'

/** Shown when the customer leaves Stripe Checkout without paying. */
export default function PricingCanceledPage() {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="mx-auto max-w-lg px-4 py-24 text-center sm:px-6"
    >
      <SEO
        title="Checkout canceled"
        description="No charge was made. You can try again or contact SatByte Technologies."
        path="/pricing/canceled"
      />
      <h1 className="font-heading text-2xl font-bold text-secondary dark:text-white">Checkout canceled</h1>
      <p className="mt-3 text-slate-600 dark:text-slate-400">
        No payment was taken. You can return to pricing to try again or reach out for a custom quote.
      </p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button asChild>
          <Link to="/pricing">View pricing</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/contact">Contact us</Link>
        </Button>
      </div>
    </motion.div>
  )
}
