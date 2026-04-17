import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Code, Rocket, ShieldCheck, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useRef } from 'react'

import { Button } from '@/components/ui/button'

const staggerContainer = {
  initial: {},
  animate: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
}

const letterAnimation = {
  initial: { y: 100, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
}

/** Ultra-Premium Hero with mesh gradients, dynamic typography, and 3D glass cards. */
export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] })
  
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "40%"])
  const opacityBg = useTransform(scrollYProgress, [0, 1], [1, 0])
  const yStats = useTransform(scrollYProgress, [0, 1], ["0%", "-60%"])
  const opacityStats = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <section ref={containerRef} className="relative overflow-hidden bg-[#020617] min-h-screen flex flex-col justify-center pt-20 sm:pt-32 pb-32">
      
      {/* Dynamic Fluid Mesh Background */}
      <motion.div style={{ y: yBg, opacity: opacityBg }} className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Deep blue base glow */}
        <div className="absolute top-1/4 left-1/4 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-primary/20 rounded-full blur-[120px] animate-pulse mix-blend-screen opacity-60" />
        {/* Purple/Indigo accent moving */}
        <div className="absolute top-1/3 right-1/4 w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] bg-indigo-500/20 rounded-full blur-[140px] mix-blend-screen opacity-50 transition-transform duration-[10000ms] animate-[spin_20s_linear_infinite]" />
        {/* Cyan highlight */}
        <div className="absolute -bottom-1/4 left-1/3 w-[70vw] h-[70vw] max-w-[1000px] max-h-[1000px] bg-cyan-500/10 rounded-full blur-[160px] mix-blend-screen" />
        
        {/* Premium Noise Overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjAwIDIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZUZpbHRlciI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNjUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbm9pc2VGaWx0ZXIpIi8+PC9zdmc+')] opacity-[0.03] mix-blend-overlay" />
        
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNCkiLz48L3N2Zz4=')] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]" />
      </motion.div>

      <div className="relative z-10 w-full max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="max-w-6xl text-center flex flex-col items-center"
        >
          {/* Glowing Pill Badge */}
          <motion.div
            variants={{
               initial: { opacity: 0, scale: 0.8, y: 20 },
               animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
            }}
            className="mb-10 inline-flex items-center gap-2.5 rounded-full border border-primary/20 bg-primary/5 px-6 py-2.5 text-sm font-bold text-blue-300 backdrop-blur-2xl shadow-[0_0_30px_rgba(37,99,235,0.15)] ring-1 ring-white/10"
          >
            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            <span className="bg-gradient-to-r from-blue-200 to-indigo-300 bg-clip-text text-transparent">Pioneering Digital Architectures</span>
          </motion.div>

          {/* Cinematic Headline */}
          <h1 className="font-heading text-5xl font-black leading-[1.05] tracking-tight text-white sm:text-7xl lg:text-[7.5rem] flex flex-wrap justify-center w-full max-w-[1400px]">
            {["Engineering", "scale"].map((word, i) => (
              <span key={i} className="inline-block mr-3 sm:mr-5 lg:mr-8 mb-2 sm:mb-0">
                <motion.span variants={letterAnimation} className="inline-block pb-4">{word}</motion.span>
              </span>
            ))}
            <span className="w-full flex flex-wrap justify-center">
               {["through", "Digital", "Excellence"].map((word, i) => (
                  <span key={i} className={`inline-block mr-3 sm:mr-5 lg:mr-8 ${i >= 1 ? '-mt-2 sm:-mt-4' : ''}`}>
                     <motion.span 
                        variants={letterAnimation} 
                        className={`inline-block pb-4 ${i >= 1 ? 'bg-gradient-to-r from-white via-blue-200 to-slate-400 bg-clip-text text-transparent' : ''}`}
                     >
                        {word}
                     </motion.span>
                  </span>
               ))}
            </span>
          </h1>

          <motion.p
            variants={{
               initial: { opacity: 0 },
               animate: { opacity: 1, transition: { duration: 1, delay: 0.6 } }
            }}
            className="mt-6 sm:mt-10 max-w-3xl text-lg text-slate-400 sm:text-2xl font-medium leading-[1.6]"
          >
            Deploying high-fidelity, data-driven web solutions and software ecosystems designed for modern high-growth agencies and brands.
          </motion.p>

          <motion.div
            variants={{
               initial: { opacity: 0, y: 20 },
               animate: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.8 } }
            }}
            className="mt-14 flex flex-col items-center justify-center gap-6 sm:flex-row w-full sm:w-auto"
          >
            <Button asChild size="lg" className="group relative w-full sm:w-auto min-w-[220px] h-16 rounded-[2rem] text-[17px] font-extrabold bg-white text-primary hover:bg-slate-100 hover:text-primary transition-all duration-300 overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_60px_rgba(255,255,255,0.25)] hover:-translate-y-1">
              <Link to="/contact">
                <span className="relative z-10 flex items-center justify-center">
                  Start a Project
                  <ArrowRight className="ml-3 h-5 w-5 stroke-[3] group-hover:translate-x-1.5 transition-transform" />
                </span>
                <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-[150%] skew-x-[-20deg] group-hover:animate-shine" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto min-w-[220px] h-16 rounded-[2rem] text-[17px] font-extrabold border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-xl">
              <Link to="/portfolio">
                View Showcase
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Parallax Stat Cards with 3D feel */}
      <motion.div
        style={{ y: yStats, opacity: opacityStats }}
        className="relative z-20 mx-auto mt-32 grid max-w-[85rem] w-full gap-8 px-4 sm:grid-cols-3 sm:px-6 lg:px-8"
      >
        {[
          { label: 'Lines of Code Shipped', value: '1.2M+', icon: Code, color: 'text-blue-400', glow: 'shadow-blue-500/20' },
          { label: 'Agency Partners', value: '45+', icon: Rocket, color: 'text-amber-400', glow: 'shadow-amber-500/20' },
          { label: 'Client Retention', value: '99%', icon: ShieldCheck, color: 'text-emerald-400', glow: 'shadow-emerald-500/20' },
        ].map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + (i * 0.15), duration: 0.8, type: 'spring', bounce: 0.4 }}
              whileHover={{ y: -12, scale: 1.03 }}
              className={`group relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#0A111D]/80 p-10 text-center backdrop-blur-2xl transition-all duration-500 hover:border-white/20 hover:bg-white/5 shadow-2xl hover:${stat.glow}`}
            >
               {/* Internal ambient glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent z-0" />
              
              <div className="absolute -right-8 -top-8 opacity-[0.07] transition-transform duration-700 group-hover:scale-150 group-hover:-rotate-12 group-hover:opacity-20 z-0">
                <Icon className={`h-40 w-40 ${stat.color}`} />
              </div>
              
              <div className="relative z-10">
                 <p className="font-heading text-6xl font-black text-white drop-shadow-lg tracking-tighter">{stat.value}</p>
                 <div className="h-1 w-12 bg-white/20 mx-auto rounded-full my-4 group-hover:bg-primary transition-colors duration-500" />
                 <p className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
              </div>
            </motion.div>
          )
        })}
      </motion.div>
      
    </section>
  )
}
