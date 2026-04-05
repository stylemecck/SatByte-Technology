import { motion } from 'framer-motion'
import { BadgeCheck, Clock, Cpu, Wallet } from 'lucide-react'

import { SectionHeader } from '@/components/SectionHeader'
import { fadeUpItem, staggerContainer } from '@/animations/pageVariants'

const items = [
  {
    title: 'Affordable Pricing',
    description: 'Transparent quotes and packages that scale with your stage — no surprise add-ons.',
    icon: Wallet,
  },
  {
    title: 'Modern Technologies',
    description: 'React, TypeScript, cloud-ready APIs, and best practices for speed and security.',
    icon: Cpu,
  },
  {
    title: 'Reliable Support',
    description: 'We stay reachable after launch with clear SLAs and practical documentation.',
    icon: BadgeCheck,
  },
  {
    title: 'Fast Delivery',
    description: 'Structured sprints and weekly demos so you see progress, not promises.',
    icon: Clock,
  },
] as const

export function WhyChooseUs() {
  return (
    <section className="bg-slate-100/50 px-4 py-20 dark:bg-white/[0.02] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Why SatByte"
          title="Why teams choose us"
          subtitle="Corporate polish with startup speed — built for businesses across India."
        />
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid gap-6 md:grid-cols-2"
        >
          {items.map((item) => (
            <motion.div
              key={item.title}
              variants={fadeUpItem}
              whileHover={{ y: -4, transition: { duration: 0.25 } }}
              className="group flex gap-4 rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-md transition-[border-color,box-shadow] duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 dark:border-white/10 dark:bg-white/5 dark:hover:border-accent/35 dark:hover:shadow-accent/15"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-lg transition-[transform,box-shadow] duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-primary/30">
                <item.icon className="h-6 w-6 transition-transform duration-300 group-hover:-rotate-6" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-semibold text-secondary dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
