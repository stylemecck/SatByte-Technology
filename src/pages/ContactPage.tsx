import emailjs from '@emailjs/browser'
import { motion } from 'framer-motion'
import { Loader2, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { SectionHeader } from '@/components/SectionHeader'
import { SEO } from '@/components/SEO'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { SITE } from '@/lib/constants'

type FormValues = {
  name: string
  email: string
  phone: string
  message: string
}

const MAP_EMBED =
  'https://maps.google.com/maps?q=Mahua%2C%20Vaishali%2C%20Bihar&z=13&ie=UTF8&iwloc=&output=embed'

/** Contact: React Hook Form + EmailJS, map embed, WhatsApp CTA, address card. */
export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle')
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues: { name: '', email: '', phone: '', message: '' } })

  const onSubmit = async (values: FormValues) => {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined

    if (!serviceId || !templateId || !publicKey) {
      setStatus('err')
      return
    }

    setStatus('sending')
    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: values.name,
          reply_to: values.email,
          phone: values.phone,
          message: values.message,
          to_email: SITE.email,
        },
        { publicKey },
      )
      setStatus('ok')
      reset()
    } catch {
      setStatus('err')
    }
  }

  return (
    <>
      <SEO
        title="Contact"
        description={`Contact ${SITE.name} — ${SITE.phone}, ${SITE.email}. Mahua, Vaishali, Bihar.`}
        path="/contact"
      />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Contact"
          title="Let’s build something great"
          subtitle="Share your requirements — we typically reply within one business day."
        />

        <div className="grid gap-10 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 lg:col-span-1"
          >
            <Card className="border-slate-200/80 dark:border-white/10">
              <CardContent className="space-y-4 p-6">
                <h3 className="font-heading text-lg font-semibold text-secondary dark:text-white">Address</h3>
                <div className="flex gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary dark:text-accent" />
                  <span>{SITE.location}</span>
                </div>
                <div className="flex gap-3 text-sm">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-primary dark:text-accent" />
                  <a href={`tel:${SITE.phoneDigits}`} className="text-slate-700 hover:text-primary dark:text-slate-200 dark:hover:text-accent">
                    {SITE.phone}
                  </a>
                </div>
                <div className="flex gap-3 text-sm">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary dark:text-accent" />
                  <a href={`mailto:${SITE.email}`} className="text-slate-700 hover:text-primary dark:text-slate-200 dark:hover:text-accent">
                    {SITE.email}
                  </a>
                </div>
              </CardContent>
            </Card>

            <Button asChild size="lg" className="w-full gap-2 bg-[#25D366] text-white hover:bg-[#20bd5a]">
              <a href={SITE.whatsappUrl} target="_blank" rel="noreferrer noopener">
                <MessageCircle className="h-5 w-5" />
                Chat on WhatsApp
              </a>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="lg:col-span-2"
          >
            <Card className="border-slate-200/80 dark:border-white/10">
              <CardContent className="p-6 sm:p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" placeholder="Your name" {...register('name', { required: 'Name is required' })} />
                      {errors.name ? <p className="text-xs text-red-600">{errors.name.message}</p> : null}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        {...register('email', { required: 'Email is required' })}
                      />
                      {errors.email ? <p className="text-xs text-red-600">{errors.email.message}</p> : null}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" placeholder="+91 …" {...register('phone', { required: 'Phone is required' })} />
                    {errors.phone ? <p className="text-xs text-red-600">{errors.phone.message}</p> : null}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us about your project…"
                      {...register('message', { required: 'Message is required' })}
                    />
                    {errors.message ? <p className="text-xs text-red-600">{errors.message.message}</p> : null}
                  </div>

                  <Button type="submit" disabled={status === 'sending'} className="min-w-[160px]">
                    {status === 'sending' ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending…
                      </>
                    ) : (
                      'Send message'
                    )}
                  </Button>

                  {status === 'ok' ? (
                    <p className="text-sm text-green-600 dark:text-green-400">Thanks — we’ll get back to you shortly.</p>
                  ) : null}
                  {status === 'err' ? (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {!import.meta.env.VITE_EMAILJS_SERVICE_ID
                        ? 'Add VITE_EMAILJS_* keys in a .env file (see .env.example), then restart the dev server.'
                        : 'Something went wrong. Please try again or email us directly.'}
                    </p>
                  ) : null}
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="mt-12 overflow-hidden rounded-3xl border border-slate-200/80 shadow-lg dark:border-white/10">
          <iframe
            title="SatByte Technologies location"
            src={MAP_EMBED}
            className="h-[360px] w-full border-0 grayscale-[20%] dark:opacity-90"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>
    </>
  )
}
