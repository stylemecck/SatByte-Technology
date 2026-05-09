import { useMutation } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, ChevronDown, CheckCircle2, Search, Palette, Code2, Rocket, MessageSquare, ShieldCheck, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'

import { SEO } from '@/components/SEO'
import { api } from '@/lib/apiClient'
import { PRICING_PLANS, type PricingPlanId } from '@/lib/constants'
import { cn } from '@/lib/utils'

/* ── Gateway definitions ── */
type Gateway = 'stripe' | 'razorpay' | 'payu'

const GATEWAYS: { id: Gateway; label: string; logo: string }[] = [
  { id: 'stripe', label: 'Stripe', logo: '💳' },
  { id: 'razorpay', label: 'Razorpay', logo: '🔵' },
  { id: 'payu', label: 'PayU', logo: '🟠' },
]

const TRUST_METRICS = [
  { label: 'Fast Delivery', icon: Rocket },
  { label: 'SEO Optimized', icon: Search },
  { label: 'Mobile Responsive', icon: Zap },
  { label: 'Scalable Architecture', icon: ShieldCheck },
  { label: 'Full Source Ownership', icon: Code2 },
]

const PLAN_METADATA: Record<PricingPlanId, { target: string, timeline: string, support: string }> = {
  basic: { target: 'For Startups', timeline: '5-7 Days', support: 'Email Support' },
  standard: { target: 'For Growing Businesses', timeline: '10-14 Days', support: 'Priority Support' },
  premium: { target: 'For Enterprises', timeline: '18-25 Days', support: '24/7 Dedicated Support' },
}

const PROCESS_STEPS = [
  { title: 'Discovery', description: 'Deep dive into your requirements and goals.', icon: Search },
  { title: 'Design', description: 'Crafting high-fidelity UI/UX prototypes.', icon: Palette },
  { title: 'Development', description: 'Building with clean, scalable code.', icon: Code2 },
  { title: 'Launch', description: 'Optimization and production deployment.', icon: Rocket },
  { title: 'Support', description: 'Ongoing maintenance and scaling.', icon: MessageSquare },
]

const COMPARISON_FEATURES = [
  { name: 'Pages', basic: 'Up to 5', standard: 'Up to 12', premium: 'Unlimited' },
  { name: 'Responsive Design', basic: true, standard: true, premium: true },
  { name: 'SEO Optimization', basic: 'Basic', standard: 'Advanced', premium: 'Full Audit' },
  { name: 'CMS Integration', basic: false, standard: true, premium: true },
  { name: 'Analytics Setup', basic: false, standard: true, premium: true },
  { name: 'Custom Components', basic: false, standard: false, premium: true },
  { name: '3rd Party APIs', basic: false, standard: false, premium: true },
  { name: 'Revisions', basic: '1 Round', standard: '2 Rounds', premium: '3 Rounds' },
]

const FAQS = [
  { q: 'Can I upgrade my plan later?', a: 'Absolutely. You can upgrade any time and we will factor in the amount already paid for the previous plan.' },
  { q: 'Is there a money-back guarantee?', a: 'Yes — if we have not started development yet, you will receive a full refund within 7 days of payment.' },
  { q: 'What payment methods do you accept?', a: 'Stripe: All major international cards. Razorpay: Cards, UPI, Net Banking, Wallets. PayUMoney: All major Indian payment methods.' },
  { q: 'How long does delivery take?', a: 'Basic: 5–7 days. Standard: 10–14 days. Premium: 18–25 days. We will confirm exact timelines before we start.' },
  { q: 'Are revisions included?', a: 'Yes — each plan includes the listed revision rounds. Additional rounds can be purchased separately at ₹999 each.' },
  { q: 'Who owns the source code?', a: 'You do. Once the final payment is cleared, full ownership of the source code is transferred to you.' },
]

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-border/50 last:border-0">
      <button onClick={() => setOpen(v => !v)} className="flex w-full items-center justify-between py-6 text-left gap-4">
        <span className="text-base font-semibold text-foreground">{q}</span>
        <ChevronDown className={cn('h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300', open && 'rotate-180')} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="c" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
            <p className="pb-6 text-sm text-muted-foreground leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function submitPayuForm(payuBaseUrl: string, fields: Record<string, string>) {
  const form = document.createElement('form')
  form.method = 'POST'
  form.action = payuBaseUrl
  Object.entries(fields).forEach(([k, v]) => {
    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = k
    input.value = v
    form.appendChild(input)
  })
  document.body.appendChild(form)
  form.submit()
}

declare global { interface Window { Razorpay: new (opts: object) => { open: () => void } } }

export default function PricingPage() {
  const [gateways, setGateways] = useState<Record<PricingPlanId, Gateway>>({
    basic: 'stripe', standard: 'stripe', premium: 'stripe',
  })
  const [userInfo, setUserInfo] = useState<{ email: string; name: string; phone: string }>({ email: '', name: '', phone: '' })
  const [showPayuModal, setShowPayuModal] = useState<PricingPlanId | null>(null)
  const [showRzpModal, setShowRzpModal] = useState<PricingPlanId | null>(null)
  const [loadingPlan, setLoadingPlan] = useState<PricingPlanId | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isMonthly, setIsMonthly] = useState(false)

  const stripeMutation = useMutation({
    mutationFn: async (planKey: PricingPlanId) => {
      const { data } = await api.post<{ url: string }>('checkout/create-session', { planKey, isMonthly })
      return data.url
    },
    onSuccess: (url) => { if (url) window.location.href = url },
    onError: (e: { response?: { data?: { message?: string } } }) => {
      setError(e?.response?.data?.message ?? 'Stripe checkout unavailable. Add your STRIPE_SECRET_KEY.')
    },
  })

  const handlePay = (planKey: PricingPlanId) => {
    setError(null)
    const gateway = gateways[planKey]
    if (gateway === 'stripe') { stripeMutation.mutate(planKey); return }
    if (gateway === 'payu') { setShowPayuModal(planKey); return }
    if (gateway === 'razorpay') { setShowRzpModal(planKey); return }
  }

  const openRazorpay = async (planKey: PricingPlanId) => {
    setShowRzpModal(null)
    setLoadingPlan(planKey)
    try {
      const { data } = await api.post<{ orderId: string; keyId: string; amount: number }>('checkout/razorpay/create-order', { planKey })
      setLoadingPlan(null)
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: 'INR',
        name: 'SatByte Technology',
        description: `${planKey.charAt(0).toUpperCase() + planKey.slice(1)} Plan`,
        order_id: data.orderId,
        handler: async (response: any) => {
          try {
            await api.post('checkout/razorpay/verify', {
              ...response, planKey,
              email: userInfo.email,
              customerName: userInfo.name,
            })
            window.location.href = '/pricing/success'
          } catch (err: any) {
            console.error('Payment verified but record failed.', err)
          }
        },
        prefill: { name: userInfo.name, email: userInfo.email, contact: userInfo.phone },
        theme: { color: '#FF5A00' },
        modal: { ondismiss: () => setLoadingPlan(null) },
      }
      new window.Razorpay(options).open()
    } catch (e: any) {
      setLoadingPlan(null)
      console.error('Razorpay connection failed.', e)
    }
  }

  const handlePayuSubmit = async (planKey: PricingPlanId) => {
    if (!userInfo.email || !userInfo.name) return
    setLoadingPlan(planKey)
    try {
      const { data } = await api.post<{ payuBaseUrl: string; fields: Record<string, string> }>('checkout/payu/create-session', {
        planKey, email: userInfo.email, name: userInfo.name, phone: userInfo.phone,
      })
      submitPayuForm(data.payuBaseUrl, data.fields)
    } catch (e: any) {
      setLoadingPlan(null)
      console.error('PayU connection failed.', e)
      setShowPayuModal(null)
    }
  }

  const isPending = (planKey: PricingPlanId) =>
    loadingPlan === planKey || (stripeMutation.isPending && stripeMutation.variables === planKey)

  return (
    <div className="bg-background min-h-screen">
      <SEO title="Pricing" description="Premium SaaS and Web development pricing plans." path="/pricing" />

      {/* Shared Info Modal */}
      <AnimatePresence>
        {(showPayuModal || showRzpModal) && (
          <motion.div
            key="info-modal"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-2xl"
            >
              <h3 className="text-xl font-bold text-foreground mb-2">Complete Your Details</h3>
              <p className="text-muted-foreground text-sm mb-6">Enter your information to proceed to secure payment.</p>
              <div className="space-y-4">
                <input placeholder="Full Name *" value={userInfo.name} onChange={e => setUserInfo(u => ({ ...u, name: e.target.value }))}
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                <input type="email" placeholder="Email Address *" value={userInfo.email} onChange={e => setUserInfo(u => ({ ...u, email: e.target.value }))}
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                <input placeholder="Phone (optional)" value={userInfo.phone} onChange={e => setUserInfo(u => ({ ...u, phone: e.target.value }))}
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
              <div className="mt-8 flex gap-3">
                <button onClick={() => { setShowPayuModal(null); setShowRzpModal(null) }}
                  className="flex-1 rounded-lg border border-border py-3 text-sm font-semibold hover:bg-secondary transition-colors">
                  Cancel
                </button>
                <button
                  disabled={!userInfo.email || !userInfo.name}
                  onClick={() => showRzpModal ? openRazorpay(showRzpModal) : handlePayuSubmit(showPayuModal!)}
                  className="flex-1 rounded-lg bg-primary py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Continue →
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold uppercase tracking-widest text-primary mb-6">
              Transparent Pricing
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-foreground tracking-tight mb-6">
              Simple plans for <span className="text-primary">ambitious products</span>.
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Transparent, outcome-focused pricing with zero hidden fees. Choose a plan that scales with your business goals.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="px-4">
        <div className="max-w-xl mx-auto">
          {error && (
            <div className="mb-8 p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-500 text-sm text-center">
              {error}
            </div>
          )}
        </div>
      </section>

      {/* Trust Bar */}
      <section className="border-y border-border py-10 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center opacity-70">
            {TRUST_METRICS.map((metric) => (
              <div key={metric.label} className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
                <metric.icon className="h-4 w-4 text-primary" />
                <span>{metric.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Billing Toggle */}
          <div className="flex justify-center mb-16">
            <div className="p-1 rounded-xl bg-secondary border border-border inline-flex">
              <button 
                onClick={() => setIsMonthly(false)}
                className={cn("px-6 py-2 rounded-lg text-sm font-semibold transition-all", !isMonthly ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
              >
                One-Time
              </button>
              <button 
                onClick={() => { setIsMonthly(true); setGateways({ basic: 'stripe', standard: 'stripe', premium: 'stripe' }) }}
                className={cn("px-6 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2", isMonthly ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
              >
                Retainer <span className="text-[10px] bg-primary/10 text-primary px-1.5 rounded-md">Stripe Only</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {PRICING_PLANS.map((plan, i) => {
              const meta = PLAN_METADATA[plan.id]
              const isPopular = plan.recommended
              const selectedGw = gateways[plan.id]
              
              // Local price logic
              let priceStr = plan.price
              if (isMonthly) {
                const val = parseInt(plan.price.replace(/[^0-9]/g, ''))
                priceStr = `₹${Math.floor(val/2).toLocaleString()}`
              }

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={cn(
                    "relative flex flex-col p-8 rounded-2xl border transition-all duration-300",
                    isPopular 
                      ? "bg-secondary/30 border-primary scale-105 z-10 shadow-xl shadow-primary/5" 
                      : "bg-background border-border hover:border-border/80"
                  )}
                >
                  {isPopular && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest rounded-full">
                      Most Popular
                    </div>
                  )}

                  <div className="mb-8">
                    <h3 className="text-sm font-bold text-primary mb-2 uppercase tracking-widest">{plan.name}</h3>
                    <p className="text-xs text-muted-foreground mb-6">{meta.target}</p>
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="text-4xl font-extrabold tracking-tight">{priceStr}</span>
                      {isMonthly && <span className="text-sm text-muted-foreground">/mo</span>}
                    </div>
                    <p className="text-xs text-muted-foreground">{isMonthly ? 'Cancel anytime' : 'Fixed project cost'}</p>
                  </div>

                  <div className="space-y-4 mb-8 flex-grow">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Deliverables</p>
                    <ul className="space-y-3">
                      {plan.features.map(f => (
                        <li key={f} className="flex items-start gap-3 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6 border-t border-border space-y-4">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Timeline</span>
                      <span className="font-semibold">{meta.timeline}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Support</span>
                      <span className="font-semibold">{meta.support}</span>
                    </div>
                  </div>

                  <div className="mt-8 space-y-4">
                     <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-center">Pay via</p>
                     <div className="grid grid-cols-3 gap-2">
                        {GATEWAYS.map(gw => (
                          <button
                            key={gw.id}
                            disabled={isMonthly && gw.id !== 'stripe'}
                            onClick={() => setGateways(prev => ({ ...prev, [plan.id]: gw.id }))}
                            className={cn(
                              "flex flex-col items-center p-2 rounded-lg border text-[10px] font-bold transition-all",
                              selectedGw === gw.id 
                                ? "bg-primary/10 border-primary text-primary" 
                                : "bg-background border-border text-muted-foreground hover:text-foreground",
                              isMonthly && gw.id !== 'stripe' && "opacity-20 cursor-not-allowed"
                            )}
                          >
                            <span className="text-lg mb-1">{gw.logo}</span>
                            {gw.label}
                          </button>
                        ))}
                     </div>

                     <button
                      disabled={isPending(plan.id)}
                      onClick={() => handlePay(plan.id)}
                      className={cn(
                        "w-full py-4 rounded-xl text-sm font-bold transition-all active:scale-[0.98]",
                        isPopular ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90" : "bg-foreground text-background hover:bg-foreground/90"
                      )}
                     >
                      {isPending(plan.id) ? "Processing..." : "Start Project"}
                     </button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-24 px-4 bg-secondary/10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 tracking-tight">Compare Plans</h2>
            <p className="text-muted-foreground">Choose the right level of depth for your business.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-6 px-4 text-sm font-bold text-muted-foreground uppercase tracking-widest">Feature</th>
                  <th className="py-6 px-4 text-sm font-bold uppercase tracking-widest">Basic</th>
                  <th className="py-6 px-4 text-sm font-bold uppercase tracking-widest text-primary">Standard</th>
                  <th className="py-6 px-4 text-sm font-bold uppercase tracking-widest">Premium</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {COMPARISON_FEATURES.map((feature) => (
                  <tr key={feature.name} className="hover:bg-secondary/30 transition-colors">
                    <td className="py-6 px-4 text-sm font-medium">{feature.name}</td>
                    <td className="py-6 px-4 text-sm text-muted-foreground">{typeof feature.basic === 'boolean' ? (feature.basic ? <Check className="h-4 w-4 text-primary" /> : <X className="h-4 w-4" />) : feature.basic}</td>
                    <td className="py-6 px-4 text-sm font-semibold">{typeof feature.standard === 'boolean' ? (feature.standard ? <Check className="h-4 w-4 text-primary" /> : <X className="h-4 w-4" />) : feature.standard}</td>
                    <td className="py-6 px-4 text-sm text-muted-foreground">{typeof feature.premium === 'boolean' ? (feature.premium ? <Check className="h-4 w-4 text-primary" /> : <X className="h-4 w-4" />) : feature.premium}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
             <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Our Process</h2>
             <p className="text-muted-foreground">From initial idea to production-ready product.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-border -z-10" />
            {PROCESS_STEPS.map((step) => (
              <div key={step.title} className="flex flex-col items-center text-center bg-background px-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6 ring-8 ring-background">
                  <step.icon className="h-5 w-5" />
                </div>
                <h4 className="text-base font-bold mb-2">{step.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-4 bg-secondary/10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 tracking-tight">Common Questions</h2>
          </div>
          <div className="border border-border rounded-2xl bg-background overflow-hidden px-8 divide-y divide-border">
            {FAQS.map(faq => <FaqItem key={faq.q} {...faq} />)}
          </div>
        </div>
      </section>

      {/* Enterprise Section */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-[2.5rem] bg-gradient-to-br from-secondary to-background border border-border p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6">Need a custom scalable platform?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
              For complex enterprise builds, bespoke SaaS products, or long-term product engineering, we offer custom-scoped partnerships.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact" className="px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-transform active:scale-[0.98]">
                Let's Discuss Your Product
              </Link>
              <Link to="/portfolio" className="px-8 py-4 rounded-xl bg-background border border-border text-foreground font-bold hover:bg-secondary transition-colors active:scale-[0.98]">
                View Full Portfolio
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

