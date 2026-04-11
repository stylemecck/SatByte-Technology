import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'

import { SectionHeader } from '@/components/SectionHeader'
import { LazyImage } from '@/components/LazyImage'
import { SEO } from '@/components/SEO'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useProjectsQuery } from '@/hooks/useCmsQueries'
import { cn } from '@/lib/utils'

export default function PortfolioPage() {
  const { data, isPending, isError } = useProjectsQuery()
  const [filter, setFilter] = useState<string>('All')

  const categories = useMemo(() => {
    const fromData = [...new Set(data?.map((p) => p.category) ?? [])]
    return ['All', ...fromData]
  }, [data])

  const filtered = useMemo(() => {
    if (!data) return []
    if (filter === 'All') return data
    return data.filter((p) => p.category === filter)
  }, [data, filter])

  return (
    <>
      <SEO
        title="Portfolio"
        description="Explore our high-end digital products: school management systems, college portals, custom e-commerce stores, and enterprise billing tools."
        path="/portfolio"
        schema={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://satbyte.in/"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Portfolio",
              "item": "https://satbyte.in/portfolio"
            }
          ]
        }}
      />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Work"
          title="Projects that shipped"
          subtitle="Filter by category to explore technologies and outcomes we deliver."
        />

        {isPending ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-96 rounded-2xl" />
            ))}
          </div>
        ) : null}

        {isError ? (
          <p className="text-center text-sm text-red-600 dark:text-red-400">
            Could not load portfolio. Is the API running?
          </p>
        ) : null}

        {!isPending && data?.length ? (
          <>
            <div className="mb-10 flex flex-wrap justify-center gap-2">
              {categories.map((c) => (
                <Button
                  key={c}
                  type="button"
                  size="sm"
                  variant={filter === c ? 'default' : 'outline'}
                  className={cn('rounded-full', filter === c && 'shadow-md shadow-primary/25')}
                  onClick={() => setFilter(c)}
                >
                  {c}
                </Button>
              ))}
            </div>

            <motion.div layout className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {filtered.map((project) => (
                  <motion.div
                    key={project._id}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.25 }}
                  >
                    <Card className="h-full overflow-hidden border-slate-200/80 dark:border-white/10">
                      <LazyImage
                        src={project.imageUrl}
                        alt={project.title}
                        aspectClassName="aspect-video"
                        optimizeWidth={900}
                      />
                      <CardContent className="p-6">
                        <Badge variant="accent" className="mb-2">
                          {project.category}
                        </Badge>
                        <h3 className="font-heading text-lg font-semibold text-secondary dark:text-white">
                          {project.title}
                        </h3>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{project.description}</p>
                        <p className="mt-4 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-500">
                          Technologies
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {project.technologies.map((t) => (
                            <span
                              key={t}
                              className="rounded-lg bg-slate-100 px-2 py-1 text-xs text-slate-700 dark:bg-white/10 dark:text-slate-200"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </>
        ) : null}

        {!isPending && !data?.length ? (
          <p className="text-center text-slate-600 dark:text-slate-400">
            No projects yet. Add some from the{' '}
            <a href="/admin/login" className="text-primary underline dark:text-accent">
              admin dashboard
            </a>
            .
          </p>
        ) : null}
      </div>
    </>
  )
}
