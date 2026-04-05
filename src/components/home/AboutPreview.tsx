import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

import { fadeUpItem } from '@/animations/pageVariants'
import { Button } from '@/components/ui/button'
import { SITE } from '@/lib/constants'

/** Short intro with glass panel and CTA to full About page. */
export function AboutPreview() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          variants={fadeUpItem}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-white/80 to-slate-100/80 p-8 shadow-xl backdrop-blur-xl transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-2xl hover:shadow-primary/10 dark:border-white/10 dark:from-white/5 dark:to-slate-900/40 dark:shadow-none dark:hover:border-accent/30 dark:hover:shadow-accent/10 md:p-12 lg:flex lg:items-center lg:gap-12"
        >
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl dark:bg-accent/10" />
          <div className="relative flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary dark:text-accent">
              About {SITE.name}
            </p>
            <h2 className="font-heading mt-3 text-3xl font-bold text-secondary dark:text-white sm:text-4xl">
              Your technology partner in {SITE.location.split(',')[0]}
            </h2>
            <p className="mt-4 max-w-xl text-slate-600 dark:text-slate-300">
              We help businesses and institutions present themselves professionally online, automate
              operations, and reach customers through modern web experiences. Led by{' '}
              <span className="font-medium text-secondary dark:text-white">{SITE.owner}</span>, our
              team focuses on reliability, performance, and long-term maintainability.
            </p>
            <Button asChild className="mt-8">
              <Link to="/about">Our story</Link>
            </Button>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative mt-10 flex-1 lg:mt-0"
          >
            <div className="rounded-2xl border border-white/20 bg-secondary/90 p-6 text-white shadow-2xl transition-[transform,box-shadow] duration-300 hover:scale-[1.02] hover:shadow-primary/25 dark:bg-[#0f172a]/90">
              <ul className="space-y-4 text-sm">
                <li className="flex justify-between border-b border-white/10 pb-3">
                  <span className="text-slate-400">Founded focus</span>
                  <span className="font-medium">Web & software</span>
                </li>
                <li className="flex justify-between border-b border-white/10 pb-3">
                  <span className="text-slate-400">Delivery</span>
                  <span className="font-medium">Agile milestones</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-400">Support</span>
                  <span className="font-medium text-accent">Dedicated channel</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
