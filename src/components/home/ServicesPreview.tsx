import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

import { LazyImage } from '@/components/LazyImage'
import { useServicesQuery } from '@/hooks/useCmsQueries'
import { HOME_SERVICES } from '@/lib/constants'
import { getServiceIcon } from '@/lib/icons'

export function ServicesPreview() {
  const { data } = useServicesQuery()

  const services = useMemo(() => {
    if (data?.length) return data.slice(0, 6)
    return HOME_SERVICES.map((s) => ({
      _id: s.title,
      title: s.title,
      description: s.description,
      iconKey: s.icon,
      iconUrl: ''
    })).slice(0, 6)
  }, [data])

  return (
    <section className="px-4 py-24 sm:py-32 sm:px-6 lg:px-8 bg-background border-b border-border">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl mb-16">
           <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4">
              Core Capabilities
           </h2>
           <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight leading-[1.15]">
              Architecting <span className="text-muted-foreground">digital ecosystems</span> that scale.
           </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => {
            const IconRaw = getServiceIcon(s.iconKey || 'Globe')
            return (
              <motion.div 
                key={s._id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="group relative flex flex-col p-6 sm:p-8 rounded-xl bg-background border border-border hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <div className="h-10 w-10 rounded-md bg-secondary/50 border border-border/50 flex items-center justify-center mb-5 text-foreground group-hover:text-primary transition-colors overflow-hidden">
                  {s.iconUrl ? (
                    <LazyImage src={s.iconUrl} alt={s.title} className="w-full h-full object-cover" aspectClassName="w-10 h-10" />
                  ) : (
                    <IconRaw className="w-5 h-5 stroke-[2]" />
                  )}
                </div>
                <h4 className="text-lg font-bold text-foreground mb-2">
                  {s.title}
                </h4>
                <p className="text-muted-foreground mb-6 flex-grow leading-relaxed text-sm">
                  {s.description}
                </p>
                <Link
                  to="/services"
                  className="inline-flex items-center text-sm font-semibold text-primary opacity-80 group-hover:opacity-100 transition-opacity mt-auto"
                >
                  Explore <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
