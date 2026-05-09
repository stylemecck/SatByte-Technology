import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

import { SectionHeader } from '@/components/SectionHeader'
import { LazyImage } from '@/components/LazyImage'
import { useProjectsQuery } from '@/hooks/useCmsQueries'
import { HOME_PORTFOLIO } from '@/lib/constants'

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
    return HOME_PORTFOLIO.map((p) => ({ title: p.title, description: p.description, image: p.image, slug: '' })).slice(0, 4)
  }, [data])

  return (
    <section className="px-4 py-24 sm:py-32 sm:px-6 lg:px-8 bg-background border-b border-border/50">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16">
          <SectionHeader
            eyebrow="Capabilities"
            title="Recent Highlights"
            subtitle="A glimpse of the high-end experiences we craft."
            className="mb-0 text-left"
          />
          <Link to="/portfolio" className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors mb-2">
            View full portfolio <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
          {slides.map((project, i) => {
            return (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group flex flex-col cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-secondary/20 aspect-[16/10] mb-6">
                  <LazyImage 
                    src={project.image} 
                    alt={project.title}
                    aspectClassName="w-full h-full"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Subtle overlay on hover */}
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-500" />
                </div>
                
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed max-w-md">
                      {project.description}
                    </p>
                  </div>
                  <div className="flex-shrink-0 w-10 h-10 rounded-full border border-border/50 flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        <div className="mt-12 md:hidden flex justify-center">
          <Link to="/portfolio" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
            View full portfolio <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
