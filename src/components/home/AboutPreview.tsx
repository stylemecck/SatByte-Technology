import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Zap, Target, ShieldCheck } from 'lucide-react'

import { fadeUpItem, staggerContainer } from '@/animations/pageVariants'
import { SITE } from '@/lib/constants'

/** Ultra-modern "Bento Box" grid for the About section. */
export function AboutPreview() {
  return (
    <section className="px-4 py-32 sm:px-6 lg:px-8 bg-background relative">
      <div className="mx-auto max-w-[85rem]">
        
        <motion.div
           variants={fadeUpItem}
           initial="initial"
           whileInView="animate"
           viewport={{ once: true }}
           className="mb-16"
        >
           <h2 className="text-sm font-black uppercase tracking-[0.3em] text-primary mb-6 flex items-center gap-4">
              <span className="w-12 h-px bg-primary/50" />
              About {SITE.name}
           </h2>
           <h3 className="text-4xl sm:text-6xl font-black text-foreground tracking-tighter leading-[1.1] max-w-3xl">
              Your elite technology partner located in <span className="text-muted-foreground">{SITE.location.split(',')[0]}</span>.
           </h3>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Main Story Box (Spans 2 columns on desktop) */}
          <motion.div
            variants={fadeUpItem}
            className="md:col-span-2 relative overflow-hidden rounded-[2.5rem] border border-border bg-card p-10 sm:p-14 shadow-md group hover:border-foreground/20 transition-colors duration-500"
          >
            <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-primary/5 blur-[100px] transition-opacity duration-700 group-hover:opacity-100 opacity-50" />
            
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                 <p className="text-2xl sm:text-3xl font-medium leading-[1.6] text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
                   We help ambitious businesses build <span className="text-foreground font-bold">bulletproof digital infrastructures</span>, automate complex operations, and capture markets through hyper-optimized web experiences.
                 </p>
                 <p className="mt-8 text-lg text-muted-foreground opacity-80 font-medium">
                   Led by <span className="text-foreground">{SITE.owner}</span>, our methodology emphasizes performance, architectural scalability, and zero-compromise security.
                 </p>
              </div>
              
              <Link 
                to="/about" 
                className="mt-14 inline-flex w-fit items-center gap-3 rounded-xl bg-primary px-8 py-4 text-[15px] font-extrabold text-primary-foreground hover:bg-primary/90 transition-all hover:scale-105 active:scale-95"
              >
                Read Our Story <ArrowUpRight className="h-5 w-5 stroke-[3]" />
              </Link>
            </div>
          </motion.div>

          {/* Delivery Box */}
          <motion.div
            variants={fadeUpItem}
            className="relative overflow-hidden rounded-[2.5rem] border border-border bg-card p-10 shadow-md group hover:border-foreground/20 transition-colors duration-500"
          >
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-accent/5 to-transparent z-0" />
            <div className="relative z-10 flex flex-col h-full">
               <div className="h-14 w-14 rounded-xl bg-secondary border border-border flex items-center justify-center text-foreground mb-8 group-hover:scale-110 transition-transform duration-500">
                 <Zap className="h-6 w-6 stroke-[2]" />
               </div>
               <h4 className="font-heading text-2xl font-bold text-foreground mb-4">Agile Delivery</h4>
               <p className="text-muted-foreground text-lg leading-relaxed mb-8 flex-1">
                 Iterative deployment cycles ensuring you see continuous value and retain absolute control.
               </p>
            </div>
          </motion.div>

          {/* Support Box */}
          <motion.div
            variants={fadeUpItem}
            className="relative overflow-hidden rounded-[2.5rem] border border-border bg-gradient-to-br from-primary/5 to-card p-10 shadow-md group hover:border-foreground/20 transition-colors duration-500"
          >
            <div className="relative z-10 flex flex-col h-full">
               <div className="h-14 w-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-8 group-hover:rotate-12 transition-transform duration-500">
                 <ShieldCheck className="h-6 w-6 stroke-[2]" />
               </div>
               <h4 className="font-heading text-2xl font-bold text-foreground mb-4">Dedicated Support</h4>
               <p className="text-muted-foreground text-lg leading-relaxed flex-1">
                 Direct engineer access for absolute peace of mind and rapid issue resolution.
               </p>
            </div>
          </motion.div>

          {/* Specialization Box (Spans 2 columns on desktop) */}
          <motion.div
            variants={fadeUpItem}
            className="md:col-span-2 relative overflow-hidden rounded-[2.5rem] border border-border bg-card p-10 shadow-md group hover:border-foreground/20 transition-colors duration-500 flex flex-col sm:flex-row items-center gap-10"
          >
             <div className="h-24 w-24 shrink-0 rounded-full bg-secondary border border-border flex items-center justify-center text-foreground relative">
               <div className="absolute inset-0 rounded-full animate-spin border-t-2 border-primary border-r-2 border-transparent duration-[3000ms]" />
               <Target className="h-10 w-10 stroke-[1.5]" />
             </div>
             <div>
               <h4 className="font-heading text-2xl font-bold text-foreground mb-3">Surgical Precision</h4>
               <p className="text-muted-foreground text-lg leading-relaxed">
                 We don't build generic templates. Every line of code, database query, and animation frame is optimized for your specific conversion goals.
               </p>
             </div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  )
}
