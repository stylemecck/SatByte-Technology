import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

import { fadeUpItem, staggerContainer } from '@/animations/pageVariants'
import { SectionHeader } from '@/components/SectionHeader'
import { SEO } from '@/components/SEO'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { SITE } from '@/lib/constants'

const milestones = [
  { year: '2024', title: 'Foundations', text: 'Started delivering websites and support for local businesses.' },
  { year: '2025', title: 'Product builds', text: 'Expanded into custom dashboards, billing tools, and school portals.' },
  { year: '2025', title: 'Full-stack', text: 'End-to-end apps with APIs, auth, and cloud deployment.' },
  { year: '2026', title: 'SatByte today', text: 'Serving clients across Bihar and India with a premium delivery standard.' },
] as const

/** About: mission, vision, founder, animated vertical timeline. */
export default function AboutPage() {
  return (
    <>
      <SEO
        title="About Us"
        description={`Learn about ${SITE.name}, our mission, vision, and founder ${SITE.owner} in ${SITE.location}.`}
        path="/about"
      />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Who we are"
          title="Built for businesses that move forward"
          subtitle={`${SITE.name} combines technical depth with clear communication — so your digital presence works as hard as you do.`}
        />

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="space-y-6"
          >
            <motion.div variants={fadeUpItem}>
              <h3 className="font-heading text-xl font-semibold text-secondary dark:text-white">Company introduction</h3>
              <p className="mt-3 text-slate-600 dark:text-slate-400">
                We are an IT services company focused on websites, web applications, e-commerce, SEO, and digital
                marketing. From discovery to deployment, we align technology choices with your budget and timeline.
              </p>
            </motion.div>
            <motion.div variants={fadeUpItem}>
              <h3 className="font-heading text-xl font-semibold text-secondary dark:text-white">Mission</h3>
              <p className="mt-3 text-slate-600 dark:text-slate-400">
                Deliver dependable, modern digital products that help organizations grow — with transparent pricing and
                measurable outcomes.
              </p>
            </motion.div>
            <motion.div variants={fadeUpItem}>
              <h3 className="font-heading text-xl font-semibold text-secondary dark:text-white">Vision</h3>
              <p className="mt-3 text-slate-600 dark:text-slate-400">
                Become the most trusted technology partner for SMBs and institutions in Eastern India, known for quality
                engineering and human support.
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-white/90 to-slate-50/90 dark:from-white/5 dark:to-slate-900/40">
              <CardContent className="p-8">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary dark:text-accent">Founder</p>
                <h3 className="font-heading mt-2 text-2xl font-bold text-secondary dark:text-white">{SITE.owner}</h3>
                <p className="mt-4 text-slate-600 dark:text-slate-300">
                  Satyam Kumar is an IT professional based in Mahua, Vaishali, Bihar, delivering reliable IT solutions
                  to businesses and individuals.
                </p>
                <Button asChild className="mt-8">
                  <Link to="/contact">Work with us</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="mt-24">
          <SectionHeader title="Our journey" subtitle="Milestones that shaped how we build and support clients today." />
          <div className="relative mx-auto max-w-3xl">
            <motion.div
              className="absolute left-[11px] top-0 hidden h-full w-px bg-gradient-to-b from-primary via-accent to-primary md:block"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: 'easeOut' }}
              style={{ transformOrigin: 'top' }}
            />
            <ul className="space-y-10">
              {milestones.map((m, i) => (
                <motion.li
                  key={m.year}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  className="relative flex gap-6 md:gap-8"
                >
                  <div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-white dark:border-accent dark:bg-[#020617]">
                    <span className="h-2 w-2 rounded-full bg-primary dark:bg-accent" />
                  </div>
                  <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-6 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/5">
                    <p className="text-xs font-bold text-primary dark:text-accent">{m.year}</p>
                    <h4 className="font-heading mt-1 text-lg font-semibold text-secondary dark:text-white">{m.title}</h4>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{m.text}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}
