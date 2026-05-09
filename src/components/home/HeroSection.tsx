import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { ArrowRight, Code, Rocket, ShieldCheck, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'

const fadeUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
}

export function HeroSection() {
  return (
    <section className="relative bg-background min-h-[90vh] flex flex-col justify-center pt-32 pb-24 overflow-hidden border-b border-border/50">
      
      {/* Subtle Dot Pattern */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#27272A_1px,transparent_1px)] [background-size:24px_24px] opacity-20 dark:opacity-40" />

      {/* Top Gradient Fade for header integration */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-background to-transparent z-0" />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        
        {/* Sleek Pill Badge */}
        <motion.div
          initial="initial" animate="animate" variants={fadeUp}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-border/50 bg-secondary/50 px-4 py-1.5 text-sm font-semibold text-foreground backdrop-blur-md shadow-sm"
        >
          <Sparkles className="h-4 w-4 text-primary" />
          <span>Pioneering Digital Architectures</span>
        </motion.div>

        {/* Minimal Headline */}
        <motion.h1 
          initial="initial" animate="animate" variants={fadeUp} transition={{ delay: 0.1 }}
          className="font-heading text-5xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl max-w-5xl"
        >
          Engineering scale through{' '}
          <span className="text-primary">Digital Excellence</span>
        </motion.h1>

        {/* Crisp Subtitle */}
        <motion.p
          initial="initial" animate="animate" variants={fadeUp} transition={{ delay: 0.2 }}
          className="mt-8 max-w-2xl text-lg text-muted-foreground sm:text-xl font-medium leading-relaxed"
        >
          Deploying high-fidelity, data-driven web solutions and software ecosystems designed for modern high-growth agencies and brands.
        </motion.p>

        {/* Clean CTA Buttons */}
        <motion.div
          initial="initial" animate="animate" variants={fadeUp} transition={{ delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <Button asChild size="lg" className="h-12 px-8 rounded-full text-base font-bold shadow-md hover:scale-[1.02] transition-transform">
            <Link to="/contact">
              Start a Project <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-12 px-8 rounded-full text-base font-bold bg-transparent border-border hover:bg-secondary transition-colors">
            <Link to="/portfolio">
              View Showcase
            </Link>
          </Button>
        </motion.div>

        {/* Sleek Stats Footer */}
        <motion.div
          initial="initial" animate="animate" variants={fadeUp} transition={{ delay: 0.4 }}
          className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 w-full max-w-4xl border-t border-border/50 pt-10"
        >
          {[
            { label: 'Lines of Code', value: '100k+', icon: Code },
            { label: 'Agency Partners', value: '5+', icon: Rocket },
            { label: 'Client Retention', value: '99%', icon: ShieldCheck },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <div className="flex items-center gap-3 mb-2">
                  <Icon className="h-5 w-5 text-primary" />
                  <span className="text-3xl font-extrabold text-foreground tracking-tight">{stat.value}</span>
                </div>
                <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</span>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  )
}
