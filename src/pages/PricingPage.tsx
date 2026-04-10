import { useMutation } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, CreditCard, Loader2, ArrowRight, ShieldCheck, RefreshCcw, Headphones, Zap, ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'

import { SEO } from '@/components/SEO'
import { api } from '@/lib/apiClient'
import { PRICING_PLANS, type PricingPlanId } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { fadeUpItem, staggerContainer } from '@/animations/pageVariants'

/* ── Per-plan visual identities ── */
const PLAN_STYLES = {
  basic: {
    badge: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    icon: 'text-blue-400',
    button: 'border border-white/15 bg-white/5 text-white hover:bg-white/10',
    glow: '',
    border: 'border-white/10',
  },
  standard: {
    badge: 'bg-primary/20 text-primary dark:text-accent border-primary/30',
    icon: 'text-primary dark:text-accent',
    button: 'bg-gradient-to-r from-primary to-accent text-white shadow-xl shadow-primary/30 hover:shadow-primary/50',
    glow: 'shadow-[0_0_50px_rgba(37,99,235,0.2)]',
    border: 'border-primary/40 dark:border-accent/40',
  },
  premium: {
    badge: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
    icon: 'text-violet-400',
    button: 'border border-white/15 bg-white/5 text-white hover:bg-white/10',
    glow: '',
    border: 'border-white/10',
  },
}

/* ── FAQs ── */
const FAQS = [
  { q: 'Can I upgrade my plan later?', a: 'Absolutely. You can upgrade any time and we will factor in the amount already paid for the previous plan.' },
  { q: 'Is there a money-back guarantee?', a: 'Yes — if we have not started development yet, you will receive a full refund within 7 days of payment.' },
  { q: 'What payment methods do you accept?', a: 'All major cards, UPI, and net banking via Stripe. We also accept bank transfers for enterprise clients.' },
  { q: 'How long does delivery take?', a: 'Basic: 5–7 days. Standard: 10–14 days. Premium: 18–25 days. We will confirm exact timelines before we start.' },
  { q: 'Are revisions included?', a: 'Yes — each plan includes the listed revision rounds. Additional rounds can be purchased separately at ₹999 each.' },
]

/* ── Trust Badges ── */
const TRUST = [
  { icon: ShieldCheck, label: '7-Day Money Back' },
  { icon: RefreshCcw, label: 'Free Revisions' },
  { icon: Headphones, label: 'Post-launch Support' },
  { icon: Zap, label: 'On-Time Delivery' },
]

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-white/10 last:border-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between py-5 text-left gap-4"
      >
        <span className="font-heading text-[17px] font-semibold text-white">{q}</span>
        <ChevronDown className={cn('h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300', open && 'rotate-180')} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-slate-400 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function PricingPage() {
  const checkout = useMutation({
    mutationFn: async (planKey: PricingPlanId) => {
      const { data } = await api.post<{ url: string }>('/checkout/create-session', { planKey })
      return data.url
    },
    onSuccess: (url) => { if (url) window.location.href = url },
  })

  return (
    <>
      <SEO
        title="Pricing"
        description="Transparent website and IT service packages — Basic ₹4,999, Standard ₹9,999, Premium ₹19,999."
        path="/pricing"
      />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-[#050B14] pt-28 pb-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div variants={staggerContainer} initial="initial" animate="animate">
            <motion.span
              variants={fadeUpItem}
              className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-bold text-primary dark:text-accent mb-6"
            >
              <Zap className="h-3.5 w-3.5" /> Transparent Pricing
            </motion.span>
            <motion.h1
              variants={fadeUpItem}
              className="font-heading text-5xl sm:text-6xl font-extrabold text-white leading-[1.1] tracking-tight"
            >
              Simple pricing,{' '}
              <span className="bg-gradient-to-r from-accent via-white to-primary bg-clip-text text-transparent">
                zero surprises
              </span>
            </motion.h1>
            <motion.p
              variants={fadeUpItem}
              className="mt-6 text-lg text-slate-400 max-w-xl mx-auto leading-relaxed"
            >
              Starting points for professional delivery — pay securely via Stripe or contact us for a fully custom quote that fits your exact requirements.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── Trust Badges ── */}
      <section className="bg-[#080E1A] py-8 border-y border-white/5">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {TRUST.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center justify-center gap-3 text-slate-400">
                <Icon className="h-5 w-5 shrink-0 text-primary dark:text-accent" />
                <span className="text-sm font-semibold">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing Cards ── */}
      <section className="bg-[#050B14] py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3 lg:items-start">
            {PRICING_PLANS.map((plan, i) => {
              const styles = PLAN_STYLES[plan.id]
              const isRecommended = plan.recommended

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className={cn(isRecommended && 'lg:-mt-6')}
                >
                  {/* Most Popular Floating Label */}
                  {isRecommended && (
                    <div className="flex justify-center mb-3">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-accent px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-white shadow-lg shadow-primary/30">
                        ★ Most Popular
                      </span>
                    </div>
                  )}

                  <div
                    className={cn(
                      'relative flex flex-col rounded-[2rem] border bg-white/5 backdrop-blur-sm overflow-hidden transition-all duration-500 hover:-translate-y-2',
                      styles.border,
                      styles.glow,
                      isRecommended ? 'hover:shadow-[0_0_70px_rgba(37,99,235,0.25)]' : 'hover:shadow-2xl hover:border-white/20',
                    )}
                  >
                    {/* Recommended gradient top border */}
                    {isRecommended && (
                      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary via-accent to-primary" />
                    )}

                    {/* Card Header */}
                    <div className="p-8 pb-0">
                      <span className={cn('inline-block rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider', styles.badge)}>
                        {plan.name}
                      </span>
                      <p className="mt-4 text-slate-400 text-sm leading-relaxed">{plan.description}</p>

                      {/* Price */}
                      <div className="mt-6 flex items-end gap-1">
                        <span className={cn('font-heading text-5xl font-extrabold tracking-tight', styles.icon)}>
                          {plan.price}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-500 uppercase tracking-wider">One-time · No recurring fees</p>
                    </div>

                    {/* Divider */}
                    <div className="mx-8 mt-8 h-px bg-white/5" />

                    {/* Features */}
                    <div className="p-8 flex-1">
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">What's included</p>
                      <ul className="space-y-3.5">
                        {plan.features.map((f) => (
                          <li key={f} className="flex items-center gap-3 text-[15px] text-slate-300">
                            <Check className={cn('h-4 w-4 shrink-0', styles.icon)} />
                            {f}
                          </li>
                        ))}
                        {/* Show "not included" grayed items for lower tiers */}
                        {plan.id === 'basic' && (
                          <>
                            <li className="flex items-center gap-3 text-[15px] text-slate-600 line-through">
                              <X className="h-4 w-4 shrink-0 text-slate-700" />
                              CMS / easy updates
                            </li>
                            <li className="flex items-center gap-3 text-[15px] text-slate-600 line-through">
                              <X className="h-4 w-4 shrink-0 text-slate-700" />
                              Advanced animations
                            </li>
                          </>
                        )}
                        {plan.id === 'standard' && (
                          <li className="flex items-center gap-3 text-[15px] text-slate-600 line-through">
                            <X className="h-4 w-4 shrink-0 text-slate-700" />
                            Third-party integrations
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* CTA */}
                    <div className="p-8 pt-0 flex flex-col gap-3">
                      <button
                        disabled={checkout.isPending}
                        onClick={() => checkout.mutate(plan.id)}
                        className={cn(
                          'group relative flex h-13 w-full items-center justify-center gap-3 rounded-full font-bold text-[15px] transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed py-3.5',
                          styles.button,
                        )}
                      >
                        {checkout.isPending && checkout.variables === plan.id ? (
                          <><Loader2 className="h-4 w-4 animate-spin" /> Processing…</>
                        ) : (
                          <>
                            <CreditCard className="h-4 w-4" />
                            Pay with Stripe
                            <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                          </>
                        )}
                      </button>

                      {checkout.isError && checkout.variables === plan.id && (
                        <p className="text-center text-xs text-red-400">
                          {(checkout.error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
                            'Checkout unavailable. Add STRIPE_SECRET_KEY or try again.'}
                        </p>
                      )}

                      <Link
                        to="/contact"
                        className="text-center text-sm text-slate-500 hover:text-slate-300 transition-colors py-1"
                      >
                        Prefer to talk first? <span className="underline underline-offset-2">Contact us</span>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Custom Quote Strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-12 rounded-[2rem] border border-white/10 bg-white/5 p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 backdrop-blur-sm"
          >
            <div>
              <h3 className="font-heading text-2xl font-bold text-white">Need a custom quote?</h3>
              <p className="mt-2 text-slate-400">E-commerce stores, portals, SaaS apps, and enterprise builds are scoped individually.</p>
            </div>
            <Link
              to="/contact"
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3.5 text-[15px] font-bold text-white hover:bg-white/10 transition-all hover:-translate-y-1 whitespace-nowrap"
            >
              Request Custom Quote <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section className="bg-[#080E1A] py-24 border-t border-white/5">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-bold text-primary dark:text-accent mb-4">
              FAQ
            </span>
            <h2 className="font-heading text-4xl font-extrabold text-white">Common questions</h2>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-sm px-8 divide-y divide-white/10">
            {FAQS.map((faq) => (
              <FaqItem key={faq.q} {...faq} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="bg-[#050B14] py-24 border-t border-white/5">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading text-4xl sm:text-5xl font-extrabold text-white">Still undecided?</h2>
            <p className="mt-4 text-slate-400 text-lg max-w-lg mx-auto">
              Book a free 30-minute discovery call — we'll recommend the right plan for your project, no obligation.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-full bg-gradient-to-r from-primary to-accent text-white font-bold text-base shadow-xl shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 hover:-translate-y-1"
              >
                Book Free Consultation <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-full border border-white/15 bg-white/5 text-white font-bold text-base hover:bg-white/10 transition-all duration-300 hover:-translate-y-1"
              >
                Browse All Services
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
