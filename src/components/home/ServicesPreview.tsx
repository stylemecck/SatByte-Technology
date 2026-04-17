import { motion, AnimatePresence } from 'framer-motion'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight } from 'lucide-react'

import { LazyImage } from '@/components/LazyImage'
import { useServicesQuery } from '@/hooks/useCmsQueries'
import { HOME_SERVICES } from '@/lib/constants'
import { getServiceIcon } from '@/lib/icons'
import { cn } from '@/lib/utils'

/** Interactive split-screen reveal list with high-end glass interactions. */
export function ServicesPreview() {
  const { data } = useServicesQuery()
  const [activeIdx, setActiveIdx] = useState(0)

  const services = useMemo(() => {
    if (data?.length) return data.slice(0, 5) // Limit to 5 for better vertical fit
    return HOME_SERVICES.map((s) => ({
      _id: s.title,
      title: s.title,
      description: s.description,
      iconKey: s.icon,
      iconUrl: ''
    }))
  }, [data])

  const activeService = services[activeIdx]

  return (
    <section className="px-4 py-32 sm:px-6 lg:px-8 bg-background overflow-hidden relative border-y border-border">
      
      {/* Immersive ambient blend tied to content */}
      <div className="absolute inset-0 z-0 pointer-events-none flex justify-center items-center opacity-40">
         <div className="w-full max-w-[1000px] h-[600px] bg-gradient-to-r from-primary/10 via-transparent to-accent/10 blur-[150px] transition-all duration-[2000ms] rounded-full dark:mix-blend-screen" />
      </div>

      <div className="mx-auto max-w-[85rem] relative z-10">
        <div className="max-w-3xl mb-24">
           <h2 className="text-sm font-black uppercase tracking-[0.3em] text-primary mb-6 flex items-center gap-4">
              <span className="w-12 h-px bg-primary/50" />
              Core Capabilities
           </h2>
           <h3 className="text-4xl sm:text-6xl font-black text-foreground tracking-tighter leading-[1.1]">
              Architecting <span className="text-muted-foreground">digital ecosystems</span> that scale with you.
           </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-start">
          
          {/* Left Side: Magnetic List */}
          <div className="lg:col-span-7 flex flex-col w-full relative">
            <div className="absolute left-0 top-0 bottom-0 w-px bg-border" />
            {services.map((s, i) => {
              const isActive = activeIdx === i
              return (
                <div 
                  key={s._id}
                  onMouseEnter={() => setActiveIdx(i)}
                  className="group relative cursor-pointer"
                >
                  {/* Active Line Indicator */}
                  <motion.div 
                     initial={false}
                     animate={{ height: isActive ? '100%' : '0%' }}
                     className="absolute left-[-0.5px] top-0 w-[2px] bg-primary origin-top z-10"
                  />
                  
                  <div className={cn(
                    "flex flex-col py-10 pl-8 sm:pl-12 transition-all duration-500 border-b border-border",
                    isActive ? "opacity-100" : "opacity-40 hover:opacity-70"
                  )}>
                     <div className="flex items-center justify-between gap-6">
                       <h4 className={cn(
                         "font-heading text-4xl sm:text-5xl font-black tracking-tighter transition-all duration-500",
                         isActive ? "text-foreground translate-x-2" : "text-foreground"
                       )}>
                         {s.title}
                       </h4>
                       <div className={cn(
                         "hidden sm:flex items-center justify-center h-14 w-14 rounded-full border transition-all duration-500",
                         isActive ? "bg-foreground text-background border-transparent rotate-0 scale-100 shadow-md" : "bg-transparent text-foreground border-border -rotate-45 scale-75 opacity-0"
                       )}>
                         <ArrowRight className="h-6 w-6 stroke-[3]" />
                       </div>
                     </div>
                    
                    <AnimatePresence initial={false}>
                        {isActive && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden"
                          >
                            <p className="mt-8 text-muted-foreground text-xl leading-relaxed max-w-lg font-medium">
                              {s.description}
                            </p>
                            <Link
                              to="/services"
                              className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-full bg-card border border-border text-[14px] font-bold text-card-foreground hover:bg-foreground hover:text-background transition-all group/btn"
                            >
                              Explore Capability <ArrowUpRight className="h-4 w-4 stroke-[2.5] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                            </Link>
                          </motion.div>
                        )}
                    </AnimatePresence>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Right Side: Floating Visual Stage */}
          <div className="lg:col-span-5 relative hidden lg:block h-[650px] sticky top-32">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={activeIdx}
                initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 rounded-[3rem] overflow-hidden flex items-center justify-center bg-card border border-border shadow-md"
              >
                {/* Complex Internal Glass Layering */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
                <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-foreground/5 to-transparent" />
                
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/5 opacity-50 dark:mix-blend-screen z-0" />
                
                {/* 3D Orb Effect */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.1)_0%,transparent_70%)] opacity-60 z-0" />

                <div className="relative z-10 w-72 h-72 flex items-center justify-center rounded-3xl bg-secondary/50 backdrop-blur-2xl border border-border shadow-2xl overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  
                  {activeService?.iconUrl ? (
                    <LazyImage 
                      src={activeService.iconUrl} 
                      alt={activeService.title}
                      className="w-40 h-40 object-contain drop-shadow-[0_0_30px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                      aspectClassName="w-40 h-40" 
                    />
                  ) : (
                    (() => {
                      const IconRaw = getServiceIcon(activeService?.iconKey || 'Globe')
                      return <IconRaw className="w-32 h-32 text-foreground stroke-[1.5] transition-transform duration-700 group-hover:scale-110" />
                    })()
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
