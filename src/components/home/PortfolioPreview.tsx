import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ExternalLink } from 'lucide-react'

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
        slug: p._id,
        tech: (p as any).tech || [],
        demoUrl: (p as any).demoUrl || '#',
        githubUrl: (p as any).githubUrl || '#'
      }))
    }
    return HOME_PORTFOLIO.map((p) => ({
      title: p.title,
      description: p.description,
      image: p.image,
      slug: '',
      tech: p.tech || [],
      demoUrl: p.demoUrl || '#',
      githubUrl: p.githubUrl || '#'
    })).slice(0, 4)
  }, [data])

  return (
    <section className="px-4 py-24 sm:py-32 sm:px-6 lg:px-8 bg-background border-b border-border">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div className="max-w-2xl">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4">
               Selected Work
            </h2>
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight leading-[1.15]">
               Case studies in <span className="text-muted-foreground">engineering excellence</span>.
            </h3>
          </div>
          <Link to="/portfolio" className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors mb-2">
            View all projects <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="flex flex-col gap-12 sm:gap-24">
          {slides.map((project, i) => {
            return (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group flex flex-col lg:flex-row gap-8 lg:gap-16 items-center"
              >
                {/* Project Image */}
                <div className="w-full lg:w-[55%] relative overflow-hidden rounded-xl border border-border bg-secondary/20 aspect-[16/10] shadow-sm group-hover:shadow-md transition-shadow">
                  <LazyImage 
                    src={project.image} 
                    alt={project.title}
                    aspectClassName="w-full h-full"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-500" />
                </div>
                
                {/* Project Details */}
                <div className="w-full lg:w-[45%] flex flex-col justify-center">
                  {/* Tech Stack Pills */}
                  {project.tech && project.tech.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tech.map((t: string, idx: number) => (
                        <span key={idx} className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-secondary/50 border border-border/50 rounded-full">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 tracking-tight">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-base leading-relaxed mb-8 max-w-lg">
                    {project.description}
                  </p>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-4">
                    <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-primary-foreground bg-primary rounded-md shadow-sm hover:bg-primary/90 transition-transform active:scale-95">
                      Live Preview <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-foreground bg-secondary/50 border border-border rounded-md hover:bg-secondary transition-transform active:scale-95">
                      Read Case Study <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        <div className="mt-16 md:hidden flex justify-center">
          <Link to="/portfolio" className="inline-flex items-center justify-center w-full px-6 py-3 text-sm font-semibold text-foreground bg-secondary/50 border border-border rounded-md hover:bg-secondary transition-colors">
            View all projects
          </Link>
        </div>
      </div>
    </section>
  )
}
