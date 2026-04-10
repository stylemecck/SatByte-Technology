import { motion, AnimatePresence } from 'framer-motion'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

import { SectionHeader } from '@/components/SectionHeader'
import { LazyImage } from '@/components/LazyImage'
import { useServicesQuery } from '@/hooks/useCmsQueries'
import { HOME_SERVICES } from '@/lib/constants'
import { getServiceIcon } from '@/lib/icons'
import { cn } from '@/lib/utils'

/** Interactive split-screen hover reveal list for services. */
export function ServicesPreview() {
  const { data } = useServicesQuery()
  const [activeIdx, setActiveIdx] = useState(0)

  const services = useMemo(() => {
    if (data?.length) return data.slice(0, 6)
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
    <section className="px-4 py-24 sm:px-6 lg:px-8 bg-slate-950 overflow-hidden relative">
      {/* Background ambient glow matching the active service */}
      <div className="absolute inset-0 z-0 pointer-events-none blur-[120px] opacity-30 transition-colors duration-1000 bg-primary/20 dark:bg-accent/20" />

      <div className="mx-auto max-w-7xl relative z-10">
        <SectionHeader
          eyebrow="What we do"
          title="Digital engineering mapped to your goals"
          subtitle="From your first website to complex automated full-stack digital products — we ship with clarity and care."
          className="text-white [&_h2]:text-white [&_p]:text-slate-400 mb-16"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
          {/* Left Side: Interactive List */}
          <div className="lg:col-span-7 flex flex-col w-full">
            {services.map((s, i) => {
              const isActive = activeIdx === i
              return (
                <div 
                  key={s._id}
                  onMouseEnter={() => setActiveIdx(i)}
                  className={cn(
                    "group flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-8 border-b border-white/10 cursor-pointer transition-all duration-300",
                    isActive ? "opacity-100 pl-4 sm:pl-8 border-primary dark:border-accent" : "opacity-50 hover:opacity-80"
                  )}
                >
                  <div className="flex flex-col gap-2 max-w-lg">
                    <h3 className={cn(
                      "font-heading text-3xl sm:text-4xl font-extrabold tracking-tight transition-colors duration-300",
                      isActive ? "text-white" : "text-white group-hover:text-slate-300"
                    )}>
                      {s.title}
                    </h3>
                    
                    <motion.div 
                      initial={false}
                      animate={{ height: isActive ? "auto" : 0, opacity: isActive ? 1 : 0 }}
                      className="overflow-hidden"
                    >
                      <p className="mt-4 text-slate-400 text-lg leading-relaxed">
                        {s.description}
                      </p>
                      <Link
                        to="/services"
                        className="inline-flex items-center gap-2 mt-6 text-[15px] font-bold text-primary dark:text-accent hover:text-white transition-colors"
                      >
                        Explore capability <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                      </Link>
                    </motion.div>
                  </div>

                  {/* Icon Indicator for Desktop */}
                  <div className={cn(
                    "hidden sm:flex transition-transform duration-500",
                    isActive ? "rotate-0 scale-100" : "-rotate-45 scale-75 opacity-0"
                  )}>
                    <ArrowRight className="h-8 w-8 text-white stroke-[2]" />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Right Side: Sticky Visual Container */}
          <div className="lg:col-span-5 relative hidden lg:block h-[600px] sticky top-32">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={activeIdx}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.05, y: -20 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 rounded-[2rem] overflow-hidden flex items-center justify-center bg-slate-900 border border-white/10 shadow-2xl"
              >
                {/* Visual Representation */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 z-0" />
                <div className="relative z-10 w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl drop-shadow-[0_0_50px_rgba(37,99,235,0.2)]">
                  {activeService?.iconUrl ? (
                    <LazyImage 
                      src={activeService.iconUrl} 
                      alt={activeService.title}
                      className="w-32 h-32 object-contain"
                      aspectClassName="w-32 h-32" 
                    />
                  ) : (
                    (() => {
                      const IconRaw = getServiceIcon(activeService?.iconKey || 'Globe')
                      return <IconRaw className="w-24 h-24 text-white stroke-[1.5]" />
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
