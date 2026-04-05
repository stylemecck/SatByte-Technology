import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { SectionHeader } from '@/components/SectionHeader'
import { LazyImage } from '@/components/LazyImage'
import { SEO } from '@/components/SEO'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { fadeUpItem, staggerContainer } from '@/animations/pageVariants'
import { useServicesQuery } from '@/hooks/useCmsQueries'
import { ALL_SERVICES } from '@/lib/constants'
import { getServiceIcon } from '@/lib/icons'

export default function ServicesPage() {
  const { data, isPending, isError } = useServicesQuery()
  const useApi = Boolean(data && data.length > 0)

  return (
    <>
      <SEO
        title="Services"
        description="Website development, web apps, e-commerce, UI/UX, SEO, digital marketing, maintenance, hosting, CCTV, repair, and IT consultancy."
        path="/services"
      />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Capabilities"
          title="Everything your digital stack needs"
          subtitle="Detailed offerings with clear outcomes — tap a service to start a conversation."
        />

        {isPending ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-2xl" />
            ))}
          </div>
        ) : null}

        {isError ? (
          <p className="mb-6 text-center text-sm text-amber-700 dark:text-amber-400">
            API unavailable — showing default service list.
          </p>
        ) : null}

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {useApi && data
            ? data.map((s) => (
                <motion.div key={s._id} variants={fadeUpItem}>
                  <Card className="group h-full overflow-hidden border-slate-200/80 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 dark:border-white/10 dark:hover:border-accent/40">
                    <CardContent className="flex h-full flex-col p-6">
                      <div className="mb-4 flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-primary/15 to-accent/15">
                        <LazyImage
                          src={s.iconUrl}
                          alt={s.title}
                          aspectClassName="h-14 w-14"
                          className="object-contain"
                          optimizeWidth={128}
                          responsive={false}
                        />
                      </div>
                      <h3 className="font-heading text-lg font-semibold text-secondary dark:text-white">{s.title}</h3>
                      <p className="mt-2 flex-1 text-sm text-slate-600 dark:text-slate-400">{s.description}</p>
                      <Button
                        asChild
                        variant="ghost"
                        className="mt-4 w-fit gap-1 px-0 text-primary hover:bg-transparent dark:text-accent"
                      >
                        <Link to="/contact">
                          Learn more
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            : ALL_SERVICES.map((s) => {
                const Icon = getServiceIcon(s.icon)
                return (
                  <motion.div key={s.title} variants={fadeUpItem}>
                    <Card className="group h-full overflow-hidden border-slate-200/80 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl dark:border-white/10 dark:hover:border-accent/40">
                      <CardContent className="flex h-full flex-col p-6">
                        <motion.div
                          whileHover={{ rotate: [0, -6, 6, 0], transition: { duration: 0.45 } }}
                          className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-accent/15 text-primary dark:text-accent"
                        >
                          <Icon className="h-7 w-7" />
                        </motion.div>
                        <h3 className="font-heading text-lg font-semibold text-secondary dark:text-white">{s.title}</h3>
                        <p className="mt-2 flex-1 text-sm text-slate-600 dark:text-slate-400">{s.description}</p>
                        <Button
                          asChild
                          variant="ghost"
                          className="mt-4 w-fit gap-1 px-0 text-primary hover:bg-transparent dark:text-accent"
                        >
                          <Link to="/contact">
                            Learn more
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
        </motion.div>
      </div>
    </>
  )
}
