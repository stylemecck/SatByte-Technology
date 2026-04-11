import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Code, Rocket, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { staggerContainer, fadeUpItem } from '@/animations/pageVariants'
import { useRef } from 'react'

/** Premium Hero with floating orbs, glowing typography, and glass stat cards. */
export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] })
  
  // Parallax the background and stats slightly based on scroll
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const yStats = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"])
  const opacityStats = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section ref={containerRef} className="relative overflow-hidden bg-[#050B14] min-h-[90vh] flex flex-col justify-center pt-24 pb-32">
      
      {/* Interactive Floating Orbs Background */}
      <motion.div style={{ y: yBg }} className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[15%] left-[20%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] bg-primary/20 rounded-full blur-[100px] animate-pulse mix-blend-screen" />
        <div className="absolute top-[30%] right-[10%] w-[30vw] h-[30vw] max-w-[500px] max-h-[500px] bg-accent/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute -bottom-[20%] left-[40%] w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] bg-[#3B82F6]/10 rounded-full blur-[150px] mix-blend-screen" />
        
        {/* Subtle dot matrix grid */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=')] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />
      </motion.div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="max-w-5xl text-center flex flex-col items-center"
        >
          {/* Dynamic Badge */}
          <motion.div
            variants={fadeUpItem}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-5 py-2 text-sm font-bold text-primary dark:text-accent backdrop-blur-xl shadow-[0_0_20px_rgba(37,99,235,0.2)]"
          >
            <ShieldCheck className="h-4 w-4" />
            Engineering World-Class Digital Products
          </motion.div>

          {/* Epic Headline */}
          <motion.h1
            variants={fadeUpItem}
            className="font-heading text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-7xl lg:text-[5.5rem]"
          >
            Engineering scale through{' '}
            <br className="hidden md:block" />
            <span className="relative inline-block mt-2 md:mt-0">
              <span className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-accent/20 blur-2xl z-0" />
              <span className="relative bg-gradient-to-r from-accent via-white to-primary bg-clip-text text-transparent italic pr-2 break-words">
                Digital Excellence
              </span>
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUpItem}
            className="mt-8 max-w-2xl text-lg text-slate-300 sm:text-xl md:text-2xl font-medium leading-relaxed drop-shadow-md"
          >
            We deploy highly-aesthetic, data-driven web solutions, portals, and software designed exclusively for high-growth modern agencies.
          </motion.p>

          <motion.div
            variants={fadeUpItem}
            className="mt-12 flex flex-col items-center justify-center gap-5 sm:flex-row w-full sm:w-auto"
          >
            <Button asChild size="lg" className="w-full sm:w-auto min-w-[200px] h-14 rounded-full text-[16px] font-bold shadow-[0_0_40px_rgba(37,99,235,0.4)] hover:shadow-[0_0_60px_rgba(37,99,235,0.6)] transition-all hover:-translate-y-1">
              <Link to="/contact">
                Start a Project
                <ArrowRight className="ml-2 h-5 w-5 stroke-[2.5]" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto min-w-[200px] h-14 rounded-full text-[16px] font-bold border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30 transition-all hover:-translate-y-1">
              <Link to="/portfolio">
                View Showcase
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Parallax Stat Cards */}
      <motion.div
        style={{ y: yStats, opacity: opacityStats }}
        className="relative z-20 mx-auto mt-24 grid max-w-6xl w-full gap-6 px-4 sm:grid-cols-3 sm:px-6 lg:px-8"
      >
        {[
          { label: 'Lines of Code Shipped', value: '1.2M+', icon: Code, color: 'text-blue-400' },
          { label: 'Agency Partners', value: '45+', icon: Rocket, color: 'text-amber-400' },
          { label: 'Client Retention', value: '99%', icon: ShieldCheck, color: 'text-emerald-400' },
        ].map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + (i * 0.1), duration: 0.6, type: 'spring' }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl transition-all duration-500 hover:border-white/20 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]"
            >
              <div className="absolute -right-6 -top-6 opacity-10 transition-transform duration-500 group-hover:scale-150 group-hover:rotate-12">
                <Icon className={`h-32 w-32 ${stat.color}`} />
              </div>
              <p className="relative z-10 font-heading text-5xl font-extrabold text-white drop-shadow-sm tracking-tight">{stat.value}</p>
              <p className="relative z-10 mt-2 text-[15px] font-medium text-slate-400 uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          )
        })}
      </motion.div>
      
    </section>
  )
}
