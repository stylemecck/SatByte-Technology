import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, MapPin, Rocket, Users, Star, Calendar } from 'lucide-react'

/* Brand icon SVGs (removed from lucide-react) */
const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

import { fadeUpItem, staggerContainer } from '@/animations/pageVariants'
import { SEO } from '@/components/SEO'
import { SITE } from '@/lib/constants'
import { cn } from '@/lib/utils'

/* ── Animated Counter ── */
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    let start = 0
    const duration = 1800
    const step = Math.ceil(to / (duration / 16))
    const timer = setInterval(() => {
      start += step
      if (start >= to) { setCount(to); clearInterval(timer) }
      else setCount(start)
    }, 16)
    return () => clearInterval(timer)
  }, [inView, to])

  return <span ref={ref}>{count}{suffix}</span>
}

/* ── Data ── */
const stats = [
  { icon: Rocket, label: 'Projects Delivered', value: 120, suffix: '+', color: 'text-blue-400' },
  { icon: Calendar, label: 'Years Active', value: 3, suffix: '+', color: 'text-amber-400' },
  { icon: Users, label: 'Happy Clients', value: 45, suffix: '+', color: 'text-emerald-400' },
  { icon: Star, label: 'Client Retention', value: 98, suffix: '%', color: 'text-violet-400' },
]

const milestones = [
  {
    year: '2024',
    title: 'Foundations',
    text: 'Started delivering high-quality websites and IT support for local businesses in Bihar.',
    color: 'border-blue-500/40 bg-blue-500/5',
    badge: 'bg-blue-500/20 text-blue-400',
  },
  {
    year: '2025',
    title: 'Product Builds',
    text: 'Expanded into custom dashboards, billing tools, school portals, and e-commerce systems.',
    color: 'border-amber-500/40 bg-amber-500/5',
    badge: 'bg-amber-500/20 text-amber-400',
  },
  {
    year: '2025',
    title: 'Full-Stack Engineering',
    text: 'Delivered end-to-end applications with REST APIs, JWT auth, and cloud deployment pipelines.',
    color: 'border-emerald-500/40 bg-emerald-500/5',
    badge: 'bg-emerald-500/20 text-emerald-400',
  },
  {
    year: '2026',
    title: 'SatByte Today',
    text: 'Now the premium IT partner for agencies, schools, and enterprises across Bihar and India.',
    color: 'border-violet-500/40 bg-violet-500/5',
    badge: 'bg-violet-500/20 text-violet-400',
  },
] as const

const values = [
  { title: 'Company Mission', text: 'Deliver dependable, modern digital products that help organizations grow — with transparent pricing and measurable outcomes.' },
  { title: 'Our Vision', text: 'Become the most trusted technology partner for SMBs and institutions in Eastern India, known for quality engineering and human support.' },
  { title: 'How We Work', text: 'We align technical choices with your business goals, communicate clearly at every step, and treat every project as if it were our own.' },
]

export default function AboutPage() {
  return (
    <>
      <SEO
        title="About Us"
        description={`Learn about ${SITE.name}, our mission, vision, and founder ${SITE.owner} in ${SITE.location}.`}
        path="/about"
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
              "name": "About",
              "item": "https://satbyte.in/about"
            }
          ]
        }}
      />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-[#050B14] pt-28 pb-28 flex items-center">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/15 rounded-full blur-[140px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] pointer-events-none translate-x-1/2 translate-y-1/2" />
        {/* Dot Grid */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEuNSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIvPjwvc3ZnPg==')] opacity-60" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="flex flex-col items-center"
          >
            <motion.span
              variants={fadeUpItem}
              className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-bold text-primary dark:text-accent mb-6"
            >
              <MapPin className="h-3.5 w-3.5" /> Bihar · India
            </motion.span>

            <motion.h1
              variants={fadeUpItem}
              className="font-heading text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight max-w-4xl"
            >
              We turn{' '}
              <span className="bg-gradient-to-r from-accent via-white to-primary bg-clip-text text-transparent">
                ideas into
              </span>{' '}
              digital reality
            </motion.h1>

            <motion.p
              variants={fadeUpItem}
              className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl leading-relaxed"
            >
              {SITE.name} combines deep technical expertise with human-first communication — so your digital presence works as hard as you do.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── Animated Stats Bar ── */}
      <section className="bg-[#080E1A] py-16 border-y border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map((s) => {
              const Icon = s.icon
              return (
                <motion.div
                  key={s.label}
                  variants={fadeUpItem}
                  className="flex flex-col items-center text-center gap-3"
                >
                  <div className={cn('flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5', s.color)}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className="font-heading text-4xl sm:text-5xl font-extrabold text-white">
                    <Counter to={s.value} suffix={s.suffix} />
                  </p>
                  <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">{s.label}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* ── Mission / Vision / Values ── */}
      <section className="bg-[#050B14] py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                variants={fadeUpItem}
                custom={i}
                className="group relative rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-sm hover:border-primary/30 hover:bg-white/8 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/10"
              >
                <div className="absolute top-0 left-8 h-[2px] w-12 bg-gradient-to-r from-primary to-accent rounded-full" />
                <h3 className="font-heading text-xl font-bold text-white mt-4">{v.title}</h3>
                <p className="mt-4 text-slate-400 leading-relaxed">{v.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Founder Spotlight ── */}
      <section className="bg-[#080E1A] py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          >
            {/* Avatar Side */}
            <div className="flex flex-col items-center lg:items-start gap-8">
              <div className="relative">
                {/* Glowing ring */}
                <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-primary to-accent blur-md opacity-50" />
                <div className="relative h-40 w-40 rounded-full border-2 border-white/20 bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center shadow-2xl overflow-hidden">
                  <span className="font-heading text-6xl font-extrabold text-white select-none">
                    {SITE.owner[0]}
                  </span>
                </div>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-xs font-bold uppercase tracking-widest text-primary dark:text-accent">Founder & CEO</p>
                <h2 className="font-heading text-4xl font-extrabold text-white mt-2">{SITE.owner}</h2>
                <p className="text-slate-400 mt-1 flex items-center gap-2 justify-center lg:justify-start">
                  <MapPin className="h-4 w-4" /> {SITE.location}
                </p>
                {/* Social Links */}
                <div className="flex gap-3 mt-6 justify-center lg:justify-start">
                  <a
                    href="#"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:border-white/30 hover:bg-white/10 transition-all duration-300"
                  >
                    <LinkedinIcon className="h-4 w-4" />
                  </a>
                  <a
                    href="#"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:border-white/30 hover:bg-white/10 transition-all duration-300"
                  >
                    <TwitterIcon className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Bio Side */}
            <div>
              <div className="relative">
                <div className="text-8xl text-primary/10 font-serif absolute -top-8 -left-4 leading-none select-none">"</div>
                <blockquote className="relative z-10 text-2xl font-medium text-white leading-relaxed italic">
                  Every business deserves enterprise-grade technology — not just the big ones.
                </blockquote>
              </div>
              <p className="mt-8 text-slate-400 text-lg leading-relaxed">
                Satyam Kumar is an IT professional and entrepreneur based in Mahua, Vaishali, Bihar. With a vision to bridge the technology gap between enterprise companies and growing Indian businesses, he founded {SITE.name} to deliver world-class digital solutions at accessible prices.
              </p>
              <p className="mt-4 text-slate-400 leading-relaxed">
                From designing pixel-perfect interfaces to architecting scalable backend APIs, Satyam leads every project with precision, care, and a relentless commitment to measurable results.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 mt-8 font-bold text-primary dark:text-accent border-b-2 border-primary/30 pb-1 hover:border-primary transition-colors"
              >
                Work directly with Satyam <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Alternating Zigzag Timeline ── */}
      <section className="bg-[#050B14] py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-bold text-primary dark:text-accent mb-4">
              Our Journey
            </span>
            <h2 className="font-heading text-4xl font-extrabold text-white">Milestones that shaped us</h2>
          </div>

          <div className="relative">
            {/* Central line */}
            <motion.div
              className="absolute left-1/2 top-0 hidden lg:block h-full w-px bg-gradient-to-b from-transparent via-white/10 to-transparent -translate-x-1/2"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              style={{ transformOrigin: 'top' }}
            />

            <div className="space-y-12">
              {milestones.map((m, i) => {
                const isLeft = i % 2 === 0
                return (
                  <motion.div
                    key={`${m.year}-${m.title}`}
                    initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className={cn(
                      'relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center',
                    )}
                  >
                    {/* Content block — swap order based on left/right */}
                    <div className={cn(isLeft ? 'lg:text-right lg:order-1' : 'lg:order-2')}>
                      <div className={cn(
                        'rounded-[1.5rem] border p-8 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl',
                        m.color
                      )}>
                        <span className={cn('inline-block rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-widest mb-3', m.badge)}>
                          {m.year}
                        </span>
                        <h3 className="font-heading text-2xl font-extrabold text-white">{m.title}</h3>
                        <p className="mt-3 text-slate-400 leading-relaxed">{m.text}</p>
                      </div>
                    </div>

                    {/* Center dot */}
                    <div className={cn(
                      'hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10',
                    )}>
                      <div className="h-5 w-5 rounded-full border-2 border-primary bg-[#050B14] shadow-[0_0_12px_rgba(37,99,235,0.5)]" />
                    </div>

                    {/* Empty opposing side */}
                    <div className={cn(isLeft ? 'lg:order-2' : 'lg:order-1')} />
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="bg-[#080E1A] py-24 border-t border-white/5">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-4xl sm:text-5xl font-extrabold text-white">
              Ready to work with us?
            </h2>
            <p className="mt-4 text-slate-400 text-lg max-w-lg mx-auto">
              Let's discuss your idea or project — we're just one message away and always excited to start something new.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-full bg-gradient-to-r from-primary to-accent text-white font-bold text-base shadow-xl shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 hover:-translate-y-1"
              >
                Start a conversation
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/portfolio"
                className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-full border border-white/15 bg-white/5 text-white font-bold text-base hover:bg-white/10 hover:border-white/25 transition-all duration-300 hover:-translate-y-1"
              >
                View our work
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
