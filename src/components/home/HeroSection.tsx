import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { staggerContainer, fadeUpItem } from '@/animations/pageVariants'

/** Hero with gradient mesh, animated headline, and dual CTAs. */
export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-16 sm:px-6 sm:pt-20 lg:px-8 lg:pt-28">
      <div
        className="animate-gradient-mesh absolute inset-0 -z-10 opacity-90"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 80% 60% at 20% 20%, rgba(37, 99, 235, 0.35), transparent),
            radial-gradient(ellipse 70% 50% at 80% 10%, rgba(56, 189, 248, 0.25), transparent),
            radial-gradient(ellipse 60% 40% at 50% 90%, rgba(37, 99, 235, 0.2), transparent),
            linear-gradient(180deg, #020617 0%, #0f172a 50%, #020617 100%)
          `,
        }}
      />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,transparent_0%,#020617_75%)] opacity-80 dark:opacity-90" />

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="mx-auto max-w-4xl text-center"
      >
        <motion.div
          variants={fadeUpItem}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-accent backdrop-blur-md"
        >
          <Sparkles className="h-3.5 w-3.5" />
          IT Services · Bihar · India
        </motion.div>

        <motion.h1
          variants={fadeUpItem}
          className="font-heading text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl"
        >
          Empowering Businesses with{' '}
          <span className="bg-gradient-to-r from-accent via-white to-primary bg-clip-text text-transparent">
            Smart IT Solutions
          </span>
        </motion.h1>

        <motion.p
          variants={fadeUpItem}
          className="mx-auto mt-6 max-w-2xl text-lg text-slate-300 sm:text-xl"
        >
          We build modern websites, software and digital solutions
        </motion.p>

        <motion.div
          variants={fadeUpItem}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Button asChild size="lg" className="min-w-[180px] shadow-xl shadow-primary/30">
            <Link to="/contact">
              Get Quote
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="min-w-[180px] border-white/20 bg-white/5 text-white hover:bg-white/10">
            <Link to="/services">View Services</Link>
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="mx-auto mt-16 grid max-w-5xl gap-4 sm:grid-cols-3"
      >
        {[
          { label: 'Projects Delivered', value: '120+' },
          { label: 'Client Satisfaction', value: '98%' },
          { label: 'Support Response', value: '< 24h' },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            whileHover={{ y: -8, transition: { type: 'spring', stiffness: 420, damping: 22 } }}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-md transition-[border-color,box-shadow,background-color] duration-300 hover:border-white/25 hover:bg-white/10 hover:shadow-lg hover:shadow-primary/20"
          >
            <p className="font-heading text-3xl font-bold text-white">{stat.value}</p>
            <p className="mt-1 text-sm text-slate-400">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
