import { motion } from 'framer-motion'
import { Quote, Star } from 'lucide-react'

import { SectionHeader } from '@/components/SectionHeader'
import { fadeUpItem } from '@/animations/pageVariants'
import { TESTIMONIALS } from '@/lib/constants'

/** Infinite scrolling animated testimonial strip for social proof. */
export function TestimonialsSection() {
  // We duplicate the testimonials list to create a seamless infinite loop
  const duplicatedTestimonials = [...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS]

  return (
    <section className="bg-[#020617] py-32 sm:px-6 lg:px-8 overflow-hidden relative border-t border-white/5">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Testimonials"
          title="What our partners say"
          subtitle="Real, unfiltered feedback from high-growth enterprise agencies and brands."
        />

        <motion.div
          variants={fadeUpItem}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-100px' }}
          className="relative mt-8 sm:mt-12"
        >
          {/* Gradient fade borders for marquee effect */}
          <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-48 bg-gradient-to-r from-[#020617] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-48 bg-gradient-to-l from-[#020617] to-transparent z-10 pointer-events-none" />

          {/* The Scrolling Track */}
          <div className="flex overflow-hidden py-10">
            <motion.div
              animate={{ x: ["0%", "-33.333333%"] }}
              transition={{ 
                repeat: Infinity, 
                ease: "linear", 
                duration: 35 
              }}
              className="flex gap-6 sm:gap-8 w-max shrink-0 hover:[animation-play-state:paused]"
            >
              {duplicatedTestimonials.map((t, idx) => (
                <div 
                  key={`${t.name}-${idx}`} 
                  className="group relative w-[85vw] sm:w-[450px] shrink-0 rounded-[2.5rem] border border-white/5 bg-[#0A111D]/80 p-8 sm:p-10 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-white/10"
                >
                  <div className="absolute -top-6 -left-2 text-primary/10 dark:text-accent/10 transition-transform duration-500 group-hover:scale-125 group-hover:rotate-12 group-hover:text-primary/20 dark:group-hover:text-accent/20">
                    <Quote className="h-24 w-24 fill-current stroke-none" />
                  </div>
                  
                  <div className="relative z-10 flex flex-col h-full justify-between gap-8">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    
                    <p className="text-[17px] leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
                      “{t.quote}”
                    </p>
                    
                    <div className="flex items-center gap-4 border-t border-slate-100 dark:border-white/5 pt-6 mt-auto">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-lg font-bold text-white shadow-lg">
                        {t.name[0]}
                      </div>
                      <div>
                        <p className="font-heading font-bold text-white leading-tight">{t.name}</p>
                        <p className="text-sm font-medium text-accent">{t.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
