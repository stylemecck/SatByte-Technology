import { useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Check, CreditCard, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'

import { SectionHeader } from '@/components/SectionHeader'
import { SEO } from '@/components/SEO'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { api } from '@/lib/apiClient'
import { PRICING_PLANS, type PricingPlanId } from '@/lib/constants'
import { cn } from '@/lib/utils'

export default function PricingPage() {
  const checkout = useMutation({
    mutationFn: async (planKey: PricingPlanId) => {
      const { data } = await api.post<{ url: string }>('/checkout/create-session', { planKey })
      return data.url
    },
    onSuccess: (url) => {
      if (url) window.location.href = url
    },
  })

  return (
    <>
      <SEO
        title="Pricing"
        description="Transparent website and IT service packages — Basic ₹4,999, Standard ₹9,999, Premium ₹19,999."
        path="/pricing"
      />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Plans"
          title="Pricing that scales with you"
          subtitle="Starting points for professional delivery — pay securely with Stripe or contact us for a custom quote."
        />

        <div className="grid gap-8 lg:grid-cols-3">
          {PRICING_PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.45 }}
              className={cn(plan.recommended && 'lg:-mt-4 lg:mb-4')}
            >
              <Card
                className={cn(
                  'relative h-full overflow-hidden border-slate-200/80 transition-shadow duration-300 dark:border-white/10',
                  plan.recommended &&
                    'border-2 border-primary shadow-2xl shadow-primary/20 ring-2 ring-primary/30 dark:border-accent dark:ring-accent/30',
                )}
              >
                {plan.recommended ? (
                  <div className="absolute right-4 top-4">
                    <Badge className="bg-accent text-secondary">Recommended</Badge>
                  </div>
                ) : null}
                <CardContent className="p-8 pt-10">
                  <h3 className="font-heading text-xl font-semibold text-secondary dark:text-white">{plan.name}</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{plan.description}</p>
                  <p className="font-heading mt-6 text-4xl font-bold text-primary dark:text-accent">{plan.price}</p>
                  <ul className="mt-8 space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex gap-2 text-sm text-slate-700 dark:text-slate-300">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary dark:text-accent" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="flex flex-col gap-3 p-8 pt-0">
                  <Button
                    className="w-full gap-2"
                    variant={plan.recommended ? 'default' : 'outline'}
                    disabled={checkout.isPending}
                    onClick={() => checkout.mutate(plan.id)}
                  >
                    {checkout.isPending && checkout.variables === plan.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CreditCard className="h-4 w-4" />
                    )}
                    Pay with Stripe
                  </Button>
                  {checkout.isError ? (
                    <p className="text-center text-xs text-red-600 dark:text-red-400">
                      {(checkout.error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
                        'Checkout unavailable. Add STRIPE_SECRET_KEY to the server or try again.'}
                    </p>
                  ) : null}
                  <Button variant="ghost" className="w-full text-slate-600 dark:text-slate-400" asChild>
                    <Link to="/contact">Prefer to talk first? Contact us</Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  )
}
