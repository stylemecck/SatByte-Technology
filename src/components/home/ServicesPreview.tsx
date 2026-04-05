import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'

import { SectionHeader } from '@/components/SectionHeader'
import { Card, CardContent } from '@/components/ui/card'
import { LazyImage } from '@/components/LazyImage'
import { fadeUpItem, staggerContainer } from '@/animations/pageVariants'
import { useServicesQuery } from '@/hooks/useCmsQueries'
import { HOME_SERVICES } from '@/lib/constants'
import { getServiceIcon } from '@/lib/icons'

/** Service cards — CMS services (Cloudinary icons) when present, else static list. */
export function ServicesPreview() {
  const { data } = useServicesQuery()

  const apiSlice = useMemo(() => (data?.length ? data.slice(0, 6) : null), [data])

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="What we do"
          title="Services built for growth"
          subtitle="From first website to full-stack products — we ship with clarity and care."
        />

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-60px' }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {apiSlice
            ? apiSlice.map((s, i) => (
                <motion.div key={s._id} variants={fadeUpItem} custom={i}>
                  <Card className="group h-full border-slate-200/80 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/15 dark:border-white/10 dark:hover:border-accent/40 dark:hover:shadow-accent/20">
                    <CardContent className="flex flex-col gap-4 p-6">
                      <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-primary/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20 dark:bg-accent/10 dark:group-hover:bg-accent/25">
                        <LazyImage
                          src={s.iconUrl}
                          alt={s.title}
                          aspectClassName="h-10 w-10"
                          className="object-contain"
                          optimizeWidth={96}
                          responsive={false}
                        />
                      </div>
                      <div>
                        <h3 className="font-heading text-lg font-semibold text-secondary dark:text-white">
                          {s.title}
                        </h3>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{s.description}</p>
                      </div>
                      <Link
                        to="/services"
                        className="text-sm font-medium text-primary transition-[color,transform] duration-200 hover:translate-x-0.5 hover:underline dark:text-accent"
                      >
                        Explore services →
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            : HOME_SERVICES.map((s, i) => {
                const Icon = getServiceIcon(s.icon)
                return (
                  <motion.div key={s.title} variants={fadeUpItem} custom={i}>
                    <Card className="group h-full border-slate-200/80 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/15 dark:border-white/10 dark:hover:border-accent/40 dark:hover:shadow-accent/20">
                      <CardContent className="flex flex-col gap-4 p-6">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20 group-hover:shadow-md group-hover:shadow-primary/20 dark:bg-accent/10 dark:text-accent dark:group-hover:bg-accent/25 dark:group-hover:shadow-accent/20">
                          <Icon className="h-6 w-6 transition-transform duration-300 group-hover:rotate-6" />
                        </div>
                        <div>
                          <h3 className="font-heading text-lg font-semibold text-secondary dark:text-white">
                            {s.title}
                          </h3>
                          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{s.description}</p>
                        </div>
                        <Link
                          to="/services"
                          className="text-sm font-medium text-primary transition-[color,transform] duration-200 hover:translate-x-0.5 hover:underline dark:text-accent"
                        >
                          Explore services →
                        </Link>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
        </motion.div>
      </div>
    </section>
  )
}
