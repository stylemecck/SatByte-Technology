import { motion } from 'framer-motion'
import { ArrowRight, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section className="relative bg-background min-h-[90vh] flex flex-col justify-center pt-32 pb-24 overflow-hidden border-b border-border">
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        
        {/* Minimal Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/30 px-3 py-1.5 text-xs font-semibold text-foreground"
        >
          <Zap className="h-3.5 w-3.5 text-primary" />
          <span className="uppercase tracking-widest text-[10px]">Premium Software Studio</span>
        </motion.div>

        {/* Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
          className="font-heading text-4xl font-extrabold leading-[1.15] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl"
        >
          Building Modern Web Platforms for{' '}
          <span className="text-primary">Startups & Businesses</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg font-medium leading-relaxed"
        >
          We engineer scalable React & Node.js architectures that handle enterprise traffic, helping you ship features faster and convert better.
        </motion.p>

        {/* Clean CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <Button asChild size="lg" className="h-12 px-8 rounded-md text-sm font-semibold shadow-sm transition-transform active:scale-95">
            <Link to="/contact">
              Start a Project
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-12 px-8 rounded-md text-sm font-semibold bg-transparent border-border hover:bg-secondary transition-colors active:scale-95">
            <Link to="/portfolio">
              View Work <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        {/* Minimal Stats / Trust */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-12 w-full max-w-4xl border-t border-border pt-10 text-center sm:text-left"
        >
          {[
            { label: 'Lines of Code Shipped', value: '1M+' },
            { label: 'Uptime SLA', value: '99.9%' },
            { label: 'Average Load Time', value: '<100ms' },
            { label: 'Client Retention', value: '100%' },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center sm:items-start">
              <span className="text-2xl font-bold text-foreground tracking-tight">{stat.value}</span>
              <span className="text-xs font-medium text-muted-foreground mt-1">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
