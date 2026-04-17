import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'

import { LazyImage } from '@/components/LazyImage'
import { SEO } from '@/components/SEO'
import { Skeleton } from '@/components/ui/skeleton'
import { fadeUpItem, staggerContainer } from '@/animations/pageVariants'
import { useServicesQuery } from '@/hooks/useCmsQueries'
import { ALL_SERVICES } from '@/lib/constants'
import { getServiceIcon } from '@/lib/icons'
import { cn } from '@/lib/utils'

/* Color palette cycling for cards */
const PALETTES = [
  { glow: 'group-hover:shadow-brand-blue/25', icon: 'bg-brand-blue/10 text-brand-blue', bar: 'from-brand-blue to-brand-blue/60', border: 'hover:border-brand-blue/40' },
  { glow: 'group-hover:shadow-brand-violet/25', icon: 'bg-brand-violet/10 text-brand-violet', bar: 'from-brand-violet to-brand-violet/60', border: 'hover:border-brand-violet/40' },
  { glow: 'group-hover:shadow-brand-amber/25', icon: 'bg-brand-amber/10 text-brand-amber', bar: 'from-brand-amber to-brand-amber/60', border: 'hover:border-brand-amber/40' },
  { glow: 'group-hover:shadow-brand-emerald/25', icon: 'bg-brand-emerald/10 text-brand-emerald', bar: 'from-brand-emerald to-brand-emerald/60', border: 'hover:border-brand-emerald/40' },
  { glow: 'group-hover:shadow-brand-pink/25', icon: 'bg-brand-pink/10 text-brand-pink', bar: 'from-brand-pink to-brand-pink/60', border: 'hover:border-brand-pink/40' },
  { glow: 'group-hover:shadow-brand-cyan/25', icon: 'bg-brand-cyan/10 text-brand-cyan', bar: 'from-brand-cyan to-brand-cyan/60', border: 'hover:border-brand-cyan/40' },
]

const PROMISES = [
  'Transparent pricing — no hidden costs',
  'On-time delivery, every project',
  'Dedicated support after launch',
  'Clean, maintainable code',
]

export default function ServicesPage() {
  const { data, isPending, isError } = useServicesQuery()
  const useApi = Boolean(data && data.length > 0)

  return (
    <>
      <SEO
        title="Our Services"
        description="Comprehensive IT solutions: web development, custom software, SEO optimization, and digital transformation for businesses."
        path="/services"
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
              "name": "Services",
              "item": "https://satbyte.in/services"
            }
          ]
        }}
      />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-background pt-28 pb-24">
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-primary/10 rounded-full blur-[150px] pointer-events-none translate-x-1/2 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/8 rounded-full blur-[130px] pointer-events-none -translate-x-1/3 translate-y-1/3" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEuNSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIvPjwvc3ZnPg==')] opacity-50" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              <motion.span
                variants={fadeUpItem}
                className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-bold text-primary dark:text-accent mb-6"
              >
                <Zap className="h-3.5 w-3.5" /> Our Capabilities
              </motion.span>

              <motion.h1
                variants={fadeUpItem}
                className="font-heading text-5xl sm:text-6xl font-extrabold text-foreground leading-[1.1] tracking-tight"
              >
                Everything your{' '}
                <span className="bg-gradient-to-r from-accent via-foreground/90 to-primary bg-clip-text text-transparent">
                  digital stack
                </span>{' '}
                needs
              </motion.h1>

              <motion.p
                variants={fadeUpItem}
                className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-md"
              >
                From your first landing page to a full enterprise system — we cover the complete spectrum of modern digital engineering.
              </motion.p>

              <motion.ul variants={fadeUpItem} className="mt-8 space-y-3">
                {PROMISES.map((p) => (
                  <li key={p} className="flex items-center gap-3 text-muted-foreground">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                    {p}
                  </li>
                ))}
              </motion.ul>
            </motion.div>

            {/* Right — CTA Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-[2rem] border border-border bg-card backdrop-blur-xl p-10 shadow-lg"
            >
              <p className="text-xs font-bold uppercase tracking-widest text-primary">Need something custom?</p>
              <h2 className="font-heading text-3xl font-extrabold text-foreground mt-2 leading-tight">
                Not sure which service fits your project?
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Send us a message and we'll recommend the right approach, technology stack, and pricing for your specific goals — completely free.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full bg-primary text-primary-foreground font-bold text-[15px] shadow-lg shadow-primary/20 transition-all hover:-translate-y-1"
                >
                  Get Free Consultation <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/pricing"
                  className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full border border-border bg-transparent text-foreground font-bold text-[15px] hover:bg-muted transition-all hover:-translate-y-1"
                >
                  View Pricing
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Services Grid ── */}
      <section className="bg-muted py-24 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-bold text-primary mb-4">
              Full Service Menu
            </span>
            <h2 className="font-heading text-4xl font-extrabold text-foreground">Browse All Services</h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
              Detailed offerings with clear outcomes — tap any service to start a conversation.
            </p>
          </div>

          {isError && (
            <p className="mb-8 text-center text-sm text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-full py-2 px-4 inline-block mx-auto">
              API unavailable — showing default service list.
            </p>
          )}

          {isPending ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-[1.5rem] bg-white/5" />
              ))}
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: '-60px' }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {useApi && data
                ? data.map((s, i) => {
                    const p = PALETTES[i % PALETTES.length]
                    return (
                      <motion.div
                        key={s._id}
                        variants={fadeUpItem}
                        custom={i}
                        className={cn(
                          'group relative flex flex-col rounded-[1.5rem] border border-border bg-card p-8 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:border-border/80',
                          p.glow
                        )}
                      >
                        {/* Top accent bar */}
                        <div className={cn('absolute top-0 left-8 h-[2px] w-0 rounded-full bg-gradient-to-r transition-all duration-500 group-hover:w-16', p.bar)} />

                        <div className={cn('mb-6 flex h-14 w-14 items-center justify-center rounded-2xl overflow-hidden transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3', p.icon)}>
                          <LazyImage
                            src={s.iconUrl}
                            alt={s.title}
                            aspectClassName="h-10 w-10"
                            className="object-contain"
                            optimizeWidth={128}
                            responsive={false}
                          />
                        </div>
                        <h3 className="font-heading text-xl font-bold text-foreground mb-3">{s.title}</h3>
                        <p className="text-muted-foreground leading-relaxed flex-1">{s.description}</p>
                        <Link
                          to="/contact"
                          className="inline-flex items-center gap-2 mt-6 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors group/link"
                        >
                          Get started
                          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                        </Link>
                      </motion.div>
                    )
                  })
                : ALL_SERVICES.map((s, i) => {
                    const Icon = getServiceIcon(s.icon)
                    const p = PALETTES[i % PALETTES.length]
                    return (
                      <motion.div
                        key={s.title}
                        variants={fadeUpItem}
                        custom={i}
                        className={cn(
                          'group relative flex flex-col rounded-[1.5rem] border border-border bg-card p-8 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:border-border/80',
                          p.glow
                        )}
                      >
                        {/* Top accent bar reveals on hover */}
                        <div className={cn('absolute top-0 left-8 h-[2px] w-0 rounded-full bg-gradient-to-r transition-all duration-500 group-hover:w-16', p.bar)} />

                        <motion.div
                          whileHover={{ rotate: [0, -8, 8, 0] }}
                          transition={{ duration: 0.4 }}
                          className={cn('mb-6 flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-500 group-hover:scale-110', p.icon)}
                        >
                          <Icon className="h-7 w-7" />
                        </motion.div>
                        <h3 className="font-heading text-xl font-bold text-foreground mb-3">{s.title}</h3>
                        <p className="text-muted-foreground leading-relaxed flex-1">{s.description}</p>
                        <Link
                          to="/contact"
                          className="inline-flex items-center gap-2 mt-6 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors group/link"
                        >
                          Get started
                          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                        </Link>
                      </motion.div>
                    )
                  })}
            </motion.div>
          )}
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="bg-background py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-4xl sm:text-5xl font-extrabold text-foreground">
              Ready to get started?
            </h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-lg mx-auto">
              Let's discuss your requirements and find the perfect service plan for your business goals.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-full bg-primary text-primary-foreground font-bold text-base shadow-xl shadow-primary/20 transition-all duration-300 hover:-translate-y-1"
              >
                Start a Project <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-full border border-border bg-transparent text-foreground font-bold text-base hover:bg-muted transition-all duration-300 hover:-translate-y-1"
              >
                See Pricing Plans
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
