import emailjs from '@emailjs/browser'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Loader2, Mail, MapPin, MessageCircle, Phone, Send, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { SEO } from '@/components/SEO'
import { SITE } from '@/lib/constants'
import { cn } from '@/lib/utils'

type FormValues = {
  name: string
  email: string
  phone: string
  message: string
}

const MAP_EMBED =
  'https://maps.google.com/maps?q=Mahua%2C%20Vaishali%2C%20Bihar&z=13&ie=UTF8&iwloc=&output=embed'

const contactTiles = [
  {
    icon: MapPin,
    label: 'Our Location',
    value: SITE.location,
    href: 'https://maps.google.com/?q=Mahua,Vaishali,Bihar',
    color: 'from-brand-blue/10 to-brand-blue/5',
    border: 'border-brand-blue/30',
    iconBg: 'bg-brand-blue/10 text-brand-blue',
    glow: 'hover:shadow-brand-blue/20',
  },
  {
    icon: Phone,
    label: 'Call Us',
    value: SITE.phone,
    href: `tel:${SITE.phoneDigits}`,
    color: 'from-brand-emerald/10 to-brand-emerald/5',
    border: 'border-brand-emerald/30',
    iconBg: 'bg-brand-emerald/10 text-brand-emerald',
    glow: 'hover:shadow-brand-emerald/20',
  },
  {
    icon: Mail,
    label: 'Email Us',
    value: SITE.email,
    href: `mailto:${SITE.email}`,
    color: 'from-brand-violet/10 to-brand-violet/5',
    border: 'border-brand-violet/30',
    iconBg: 'bg-brand-violet/10 text-brand-violet',
    glow: 'hover:shadow-brand-violet/20',
  },
]

/** Floating label input component */
function FloatingInput({
  id,
  label,
  type = 'text',
  placeholder,
  error,
  registration,
  multiline,
}: {
  id: string
  label: string
  type?: string
  placeholder?: string
  error?: string
  registration: object
  multiline?: boolean
}) {
  const [focused, setFocused] = useState(false)

    const baseClass =
      'w-full bg-transparent border-0 border-b-2 border-border focus:outline-none focus:border-primary text-foreground placeholder-transparent transition-all duration-300 py-3 text-base resize-none'

    return (
    <div className="relative mb-8">
      {multiline ? (
        <textarea
          id={id}
          placeholder={placeholder || label}
          rows={4}
          className={cn(baseClass, 'pt-6')}
          onFocus={() => setFocused(true)}
          onBlur={(e) => setFocused(e.target.value.length > 0)}
          {...registration}
        />
      ) : (
        <input
          id={id}
          type={type}
          placeholder={placeholder || label}
          className={cn(baseClass, 'pt-6 h-14')}
          onFocus={() => setFocused(true)}
          onBlur={(e) => setFocused(e.target.value.length > 0)}
          {...registration}
        />
      )}
      <label
        htmlFor={id}
        className={cn(
          'absolute left-0 text-muted-foreground transition-all duration-300 pointer-events-none',
          focused ? 'top-0 text-xs font-semibold text-primary' : 'top-4 text-base',
        )}
      >
        {label}
      </label>
      {/* Animated bottom line */}
      <span
        className={cn(
          'absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-primary to-accent transition-all duration-500',
          focused ? 'w-full' : 'w-0',
        )}
      />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  )
}

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
        title="Contact Us"
        description={`Contact ${SITE.name} — ${SITE.phone}, ${SITE.email}. Mahua, Vaishali, Bihar.`}
        path="/contact"
        schema={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://satbyte.in/"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Contact",
              "item": "https://satbyte.in/contact"
            }
          ]
        }}
      />

      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden bg-background pt-28 pb-24">
        {/* Ambient orbs */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Headline */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-bold text-primary mb-6">
                <Send className="h-3.5 w-3.5" />
                Let's Connect
              </span>
              <h1 className="font-heading text-5xl sm:text-6xl font-extrabold text-foreground leading-[1.1] tracking-tight">
                Let's build{' '}
                <span className="bg-gradient-to-r from-accent via-foreground/90 to-primary bg-clip-text text-transparent">
                  something great
                </span>{' '}
                together
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-md">
                Share your vision with us — we reply within one business day and are always ready to explore innovative ideas with ambitious teams.
              </p>

              {/* WhatsApp Pulse CTA */}
              <div className="mt-10 flex items-center gap-4">
                <div className="relative">
                  <span className="absolute inset-0 rounded-full bg-[#25D366]/40 animate-ping" />
                  <a
                    href={SITE.whatsappUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="relative inline-flex items-center gap-3 rounded-full bg-[#25D366] px-6 py-3.5 text-[15px] font-bold text-white shadow-lg shadow-[#25D366]/30 hover:bg-[#20bd5a] hover:shadow-[#25D366]/50 transition-all duration-300 hover:-translate-y-1"
                  >
                    <MessageCircle className="h-5 w-5" />
                    Chat on WhatsApp
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Right: 3 Contact Tiles */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="grid gap-4"
            >
              {contactTiles.map((tile, i) => {
                const Icon = tile.icon
                return (
                  <motion.a
                    key={tile.label}
                    href={tile.href}
                    target={tile.href.startsWith('http') ? '_blank' : undefined}
                    rel="noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                    whileHover={{ x: 6 }}
                    className={cn(
                      'group flex items-center gap-5 rounded-2xl border bg-gradient-to-br p-5 backdrop-blur-sm transition-all duration-300 hover:shadow-xl',
                      tile.color,
                      tile.border,
                      tile.glow,
                    )}
                  >
                    <div className={cn('flex h-14 w-14 shrink-0 items-center justify-center rounded-xl', tile.iconBg)}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{tile.label}</p>
                      <p className="mt-0.5 text-[15px] font-semibold text-foreground truncate">{tile.value}</p>
                    </div>
                    <ArrowRight className="ml-auto h-5 w-5 text-muted-foreground opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1 shrink-0" />
                  </motion.a>
                )
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Contact Form ── */}
      <section className="bg-muted py-24 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left: Sticky context */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:sticky lg:top-32"
            >
              <h2 className="font-heading text-4xl font-extrabold text-foreground leading-tight">
                Tell us about your project
              </h2>
              <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
                Fill in a few details and our engineering team will reach out with a clear proposal and no-obligation consultation.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  'Free 30-minute consultation call',
                  'Clear, itemised project proposal',
                  'No long-term contracts required',
                  'Response within one business day',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-muted-foreground">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Right: Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="rounded-[2rem] border border-border bg-card p-8 sm:p-12 backdrop-blur-xl shadow-xl"
            >
              <AnimatePresence mode="wait">
                {status === 'ok' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-16 text-center gap-4"
                  >
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/20 shadow-lg shadow-primary/20">
                      <CheckCircle2 className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="font-heading text-2xl font-bold text-foreground">Message Sent!</h3>
                    <p className="text-muted-foreground max-w-xs">
                      Thank you for reaching out. We'll get back to you within one business day.
                    </p>
                    <button
                      onClick={() => setStatus('idle')}
                      className="mt-4 text-sm font-medium text-primary underline"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit(onSubmit)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="grid sm:grid-cols-2 gap-x-8">
                      <FloatingInput
                        id="name"
                        label="Your Name"
                        error={errors.name?.message}
                        registration={register('name', { required: 'Name is required' })}
                      />
                      <FloatingInput
                        id="email"
                        label="Email Address"
                        type="email"
                        error={errors.email?.message}
                        registration={register('email', { required: 'Email is required' })}
                      />
                    </div>
                    <FloatingInput
                      id="phone"
                      label="Phone Number"
                      placeholder="+91 …"
                      error={errors.phone?.message}
                      registration={register('phone', { required: 'Phone is required' })}
                    />
                    <FloatingInput
                      id="message"
                      label="Tell us about your project…"
                      error={errors.message?.message}
                      registration={register('message', { required: 'Message is required' })}
                      multiline
                    />

                    {status === 'err' && (
                      <p className="mb-4 text-sm text-red-400">
                        {!import.meta.env.VITE_EMAILJS_SERVICE_ID
                          ? 'Add VITE_EMAILJS_* keys in a .env file, then restart the dev server.'
                          : 'Something went wrong. Please try again or email us directly.'}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      className="group relative inline-flex h-14 w-full items-center justify-center gap-3 rounded-full bg-primary text-primary-foreground font-bold text-base overflow-hidden shadow-xl shadow-primary/20 transition-all duration-300 hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {status === 'sending' ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Sending…
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
                          Send Message
                          <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                        </>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Calendly Booking ── */}
      <section className="bg-background py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-bold text-primary mb-4">
              Book a Call
            </span>
            <h2 className="font-heading text-4xl font-extrabold text-foreground">Schedule a Discovery Call</h2>
            <p className="mt-4 text-muted-foreground text-lg">Pick a time that works for you — no commitment required.</p>
          </div>
          <div className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-lg backdrop-blur-sm">
            <iframe
              src="https://calendly.com/satyamkashyapoffical/30min?hide_event_type_details=1&hide_gdpr_banner=1"
              width="100%"
              height="700"
              className="border-0"
              title="Schedule a call on Calendly"
            />
          </div>
        </div>
      </section>

      {/* ── Google Map ── */}
      <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-border shadow-lg">
          <iframe
            title="SatByte Technologies location"
            src={MAP_EMBED}
            className="h-[400px] w-full border-0 grayscale-[30%] opacity-90"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>
    </>
  )
}
