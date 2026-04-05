import { motion } from 'framer-motion'
import { Phone } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { SITE } from '@/lib/constants'

/** Bottom CTA strip driving users to contact / quote. */
export function ContactBanner() {
  return (
    <section className="px-4 pb-24 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        whileHover={{ scale: 1.015, transition: { duration: 0.35, ease: 'easeOut' } }}
        className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-r from-primary via-primary to-accent p-[1px] shadow-2xl shadow-primary/20 transition-shadow duration-300 hover:shadow-[0_20px_60px_-15px_rgba(37,99,235,0.45)]"
      >
        <div className="flex flex-col items-center gap-6 rounded-[calc(1.5rem-1px)] bg-secondary px-8 py-12 text-center md:flex-row md:justify-between md:text-left">
          <div>
            <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">
              Ready to start your next project?
            </h2>
            <p className="mt-2 max-w-xl text-slate-300">
              Tell us your goals — we’ll respond with a clear plan, timeline, and investment outline.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild size="lg" variant="accent" className="min-w-[160px]">
              <Link to="/contact">Contact us</Link>
            </Button>
            <a
              href={`tel:${SITE.phoneDigits}`}
              className="inline-flex items-center justify-center gap-2 text-sm font-medium text-accent transition-[gap,opacity] duration-200 hover:gap-3 hover:underline"
            >
              <Phone className="h-4 w-4" />
              {SITE.phone}
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
