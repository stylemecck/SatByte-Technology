import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

import { SectionHeader } from '@/components/SectionHeader'
import { LazyImage } from '@/components/LazyImage'
import { useProjectsQuery } from '@/hooks/useCmsQueries'
import { HOME_PORTFOLIO } from '@/lib/constants'
import { cn } from '@/lib/utils'

export function PortfolioPreview() {
  const { data } = useProjectsQuery()

  const slides = useMemo(() => {
    if (data?.length) {
      return data.slice(0, 4).map((p) => ({
        title: p.title,
        description: p.description,
        image: p.imageUrl,
        slug: p._id // fallback to ID if needed
      }))
    }
    return HOME_PORTFOLIO.map((p) => ({ title: p.title, description: p.description, image: p.image, slug: '' }))
  }, [data])

  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8 bg-slate-50 dark:bg-transparent">
      <div className="mx-auto max-w-7xl">
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16">
          <SectionHeader
            eyebrow="Capabilities"
            title="Recent highlights"
            subtitle="A glimpse of the high-end experiences we craft for enterprises and agencies."
            className="mb-0 text-left"
          />
          <Link to="/portfolio" className="hidden md:inline-flex items-center gap-2 text-[15px] font-bold text-primary dark:text-accent hover:opacity-80 transition-opacity mb-2">
            View full portfolio <ArrowRight className="h-4 w-4 stroke-[2.5]" />
          </Link>
        </div>

        {/* Bento Box Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-4 sm:gap-6 lg:min-h-[640px]">
          {slides.map((project, i) => {
            const isHero = i === 0
            const isWide = i === 1

            return (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
                className={cn(
                  "group relative overflow-hidden rounded-[1.5rem] bg-[#0B1121] shadow-xl border border-slate-200/50 dark:border-white/10 dark:shadow-2xl dark:shadow-black/60",
                  isHero ? "md:col-span-2 lg:col-span-2 lg:row-span-2 min-h-[440px] lg:min-h-0" :
                  isWide ? "md:col-span-2 lg:col-span-2 lg:row-span-1 min-h-[300px] lg:min-h-0" :
                  "md:col-span-1 lg:col-span-1 lg:row-span-1 min-h-[280px] lg:min-h-0"
                )}
              >
                {/* Background Full Cover Image */}
                <div className="absolute inset-0 z-0">
                  <LazyImage 
                    src={project.image} 
                    alt={project.title}
                    aspectClassName="h-full w-full rounded-none"
                    optimizeWidth={isHero ? 1200 : 800}
                    className="h-full w-full rounded-none object-cover transition-transform duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-105"
                  />
                </div>
                
                {/* Luxurious Gradient Overlays */}
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-900/95 via-slate-900/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="absolute inset-0 z-10 bg-primary/20 dark:bg-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 mix-blend-overlay" />

                {/* Content Block */}
                <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 sm:p-8">
                  <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]">
                    <h3 className={cn(
                      "font-heading font-extrabold text-white mb-2 leading-tight tracking-tight shadow-black/50 drop-shadow-md", 
                      isHero ? "text-3xl sm:text-4xl" : "text-xl sm:text-2xl"
                    )}>
                      {project.title}
                    </h3>
                    <p className={cn(
                      "text-slate-300 font-medium", 
                      isHero ? "text-lg mb-8 line-clamp-2 md:line-clamp-3 lg:max-w-[85%]" : "text-[15px] mb-5 line-clamp-1"
                    )}>
                      {project.description}
                    </p>
                    
                    {/* Ghosted View Button */}
                    <Link 
                      to="/portfolio" 
                      className="inline-flex items-center justify-center h-11 w-11 rounded-full bg-white text-slate-900 opacity-0 group-hover:opacity-100 transition-all duration-500 hover:scale-110 shadow-xl group-hover:translate-x-1"
                    >
                       <ArrowRight className="h-[18px] w-[18px] stroke-[2.5]" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Mobile "View All" Strip */}
        <div className="mt-10 md:hidden flex justify-center">
          <Link to="/portfolio" className="inline-flex items-center gap-2 text-[15px] font-bold text-primary dark:text-accent border-b-[2.5px] border-primary/30 dark:border-accent/30 pb-1.5 hover:border-primary dark:hover:border-accent transition-colors">
            View full portfolio <ArrowRight className="h-4 w-4 stroke-[3]" />
          </Link>
        </div>
      </div>
    </section>
  )
}
