import emailjs from '@emailjs/browser'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Loader2, Mail, MapPin, ArrowRight, ShieldCheck, Zap, MessageSquare, Search, Lightbulb, Code2, Rocket, Clock, Lock } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { SEO } from '@/components/SEO'
import { SITE } from '@/lib/constants'

type FormValues = {
  name: string
  email: string
  company: string
  service: string
  budget: string
  timeline: string
  message: string
}

const BUDGET_OPTIONS = [
  '₹50k - ₹1L',
  '₹1L - ₹3L',
  '₹3L - ₹10L',
  '₹10L+',
  'Not decided'
]

const TIMELINE_OPTIONS = [
  'Less than 1 month',
  '1-3 months',
  '3-6 months',
  '6+ months'
]

const SERVICES = [
  'Web Development',
  'SaaS Platform',
  'Mobile App',
  'UI/UX Design',
  'SEO / Marketing',
  'Enterprise Solution'
]

const FAQ_ITEMS = [
  { q: 'How long does a typical project take?', a: 'Most web projects take 4-8 weeks, while complex SaaS platforms can take 3-6 months depending on the scope.' },
  { q: 'Do you offer maintenance after launch?', a: 'Yes, we offer ongoing maintenance and support packages to ensure your product stays updated and secure.' },
  { q: 'How do you handle project payments?', a: 'We typically work with a milestone-based payment structure: deposit, design approval, development, and final launch.' },
  { q: 'Can you work with my existing tech team?', a: 'Absolutely. We often integrate with existing teams to provide specialized expertise or extra engineering capacity.' }
]

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle')
  const {
    register,
    handleSubmit,
    reset,
  } = useForm<FormValues>({ 
    defaultValues: { 
      name: '', email: '', company: '', service: '', budget: '', timeline: '', message: '' 
    } 
  })

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
          company: values.company,
          service: values.service,
          budget: values.budget,
          timeline: values.timeline,
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
    <div className="bg-background min-h-screen">
      <SEO 
        title="Contact Us" 
        description="Start your project with SatByte. Premium software studio for startups and enterprises." 
        path="/contact" 
      />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-6 block">Inquiry</span>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1] mb-8">
                Let's build something <span className="text-primary">exceptional</span> together.
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mb-10">
                From technical strategy to full-scale product engineering, we help startups and businesses build scalable digital products that drive impact.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                 <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-secondary/20">
                   <Clock className="h-5 w-5 text-primary" />
                   <div>
                     <p className="text-xs font-bold text-foreground">Response Time</p>
                     <p className="text-xs text-muted-foreground">Average: &lt; 12 hours</p>
                   </div>
                 </div>
                 <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-secondary/20">
                   <Lock className="h-5 w-5 text-primary" />
                   <div>
                     <p className="text-xs font-bold text-foreground">Confidentiality</p>
                     <p className="text-xs text-muted-foreground">NDAs upon request</p>
                   </div>
                 </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              className="bg-secondary/10 border border-border rounded-3xl p-8 md:p-12"
            >
               <AnimatePresence mode="wait">
                {status === 'ok' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-6" />
                    <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                    <p className="text-muted-foreground mb-8">Thank you for your inquiry. We'll be in touch soon.</p>
                    <button onClick={() => setStatus('idle')} className="text-sm font-bold text-primary hover:underline">
                      Send another inquiry
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Name</label>
                        <input 
                          {...register('name', { required: true })}
                          placeholder="Your Name"
                          className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary outline-none transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email</label>
                        <input 
                          {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
                          type="email"
                          placeholder="your@email.com"
                          className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Company / Project Name</label>
                      <input 
                        {...register('company')}
                        placeholder="Company Name"
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary outline-none transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Service</label>
                        <select 
                          {...register('service', { required: true })}
                          className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary outline-none transition-colors appearance-none"
                        >
                          <option value="">Select...</option>
                          {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Budget</label>
                        <select 
                          {...register('budget', { required: true })}
                          className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary outline-none transition-colors appearance-none"
                        >
                          <option value="">Select...</option>
                          {BUDGET_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Timeline</label>
                        <select 
                          {...register('timeline', { required: true })}
                          className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary outline-none transition-colors appearance-none"
                        >
                          <option value="">Select...</option>
                          {TIMELINE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Project Description</label>
                      <textarea 
                        {...register('message', { required: true })}
                        placeholder="Tell us about your project goals..."
                        rows={4}
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary outline-none transition-colors resize-none"
                      />
                    </div>

                    <button 
                      type="submit"
                      disabled={status === 'sending'}
                      className="w-full h-14 rounded-xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      {status === 'sending' ? <Loader2 className="animate-spin h-5 w-5" /> : 'Start Your Project'}
                    </button>
                  </form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Contact & Trust Section */}
      <section className="py-24 px-4 bg-secondary/10 border-y border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
             <div>
                <h3 className="text-2xl font-bold mb-8">Why work with SatByte?</h3>
                <div className="grid gap-6">
                   {[
                     { icon: Zap, title: 'Modern Engineering', desc: 'We build with the latest React & Node.js ecosystems for longevity.' },
                     { icon: ShieldCheck, title: 'Scalable Architecture', desc: 'Your product will handle 10 or 10,000 users without breaking.' },
                     { icon: MessageSquare, title: 'Fast Communication', desc: 'Direct access to lead engineers, not just project managers.' }
                   ].map(item => (
                     <div key={item.title} className="flex gap-4">
                        <div className="h-10 w-10 shrink-0 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                           <item.icon className="h-5 w-5" />
                        </div>
                        <div>
                           <h4 className="font-bold text-sm">{item.title}</h4>
                           <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
             <div>
                <h3 className="text-2xl font-bold mb-8">Quick Contacts</h3>
                <div className="grid gap-4">
                   <a href={`mailto:${SITE.email}`} className="flex items-center gap-4 p-4 rounded-xl border border-border bg-background hover:border-primary/50 transition-colors">
                      <Mail className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">{SITE.email}</span>
                   </a>
                   <a href="https://linkedin.com" target="_blank" className="flex items-center gap-4 p-4 rounded-xl border border-border bg-background hover:border-primary/50 transition-colors">
                      <MapPin className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">Bihar, India</span>
                   </a>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Process Preview */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">The Road to Launch</h2>
            <p className="text-muted-foreground">What happens after you reach out?</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
             {[
               { icon: Search, title: 'Discovery', desc: 'Qualifying needs and setting goals.' },
               { icon: Lightbulb, title: 'Planning', desc: 'Architecture & UX wireframing.' },
               { icon: Code2, title: 'Development', desc: 'Clean, agile sprint cycles.' },
               { icon: Rocket, title: 'Launch', desc: 'Optimization and global deployment.' }
             ].map((step, i) => (
               <div key={step.title} className="relative p-6 rounded-2xl border border-border bg-secondary/5 text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto mb-6">
                    <step.icon className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold mb-2 text-sm">{i + 1}. {step.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-4 bg-secondary/5 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Project FAQs</h2>
          </div>
          <div className="space-y-6">
             {FAQ_ITEMS.map(faq => (
               <div key={faq.q} className="p-6 rounded-2xl border border-border bg-background">
                  <h4 className="font-bold mb-2 text-sm">{faq.q}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-4 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
           <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-8">Ready to turn your idea into a scalable product?</h2>
           <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
             <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="w-full sm:w-auto px-10 py-4 rounded-xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
               Start Your Inquiry
             </button>
             <a href="https://calendly.com/satyamkashyapoffical/30min" target="_blank" className="w-full sm:w-auto px-10 py-4 rounded-xl bg-background border border-border font-bold hover:bg-secondary transition-all flex items-center justify-center gap-2">
               Schedule a Call <ArrowRight className="h-5 w-5" />
             </a>
           </div>
        </div>
      </section>
    </div>
  )
}

