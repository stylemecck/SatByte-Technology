import { motion } from 'framer-motion'
import { Calendar, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'

import { SectionHeader } from '@/components/SectionHeader'
import { LazyImage } from '@/components/LazyImage'
import { SEO } from '@/components/SEO'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { fadeUpItem, staggerContainer } from '@/animations/pageVariants'
import { useBlogsQuery } from '@/hooks/useCmsQueries'

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(new Date(iso))
  } catch {
    return iso
  }
}

/** Blog listing from API (Cloudinary cover images, TanStack Query). */
export default function BlogPage() {
  const { data, isPending, isError } = useBlogsQuery()

  return (
    <>
      <SEO
        title="Blog"
        description="Insights on websites, SEO, and digital marketing from SatByte Technologies."
        path="/blog"
      />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Insights"
          title="From our desk"
          subtitle="Practical notes for owners investing in digital growth."
        />

        {isPending ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-56 rounded-2xl" />
            ))}
          </div>
        ) : null}

        {isError ? (
          <p className="text-center text-sm text-red-600 dark:text-red-400">
            Could not load articles. Please refresh and try again.
          </p>
        ) : null}

        {data?.length ? (
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {data.map((post) => (
              <motion.article key={post._id} variants={fadeUpItem}>
                <Link
                  to={`/blog/${encodeURIComponent(post.slug)}`}
                  className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl"
                >
                  <Card className="group h-full cursor-pointer overflow-hidden border-slate-200/80 transition-all hover:border-primary/30 hover:shadow-lg dark:border-white/10 dark:hover:border-accent/30">
                    <LazyImage
                      src={post.imageUrl}
                      alt={post.title}
                      aspectClassName="aspect-[16/10]"
                      optimizeWidth={600}
                    />
                    <CardContent className="flex h-full flex-col p-6">
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(post.createdAt)}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {post.readTime}
                        </span>
                      </div>
                      <h2 className="font-heading mt-4 text-lg font-semibold text-secondary transition-colors group-hover:text-primary dark:text-white dark:group-hover:text-accent">
                        {post.title}
                      </h2>
                      <p className="mt-2 flex-1 text-sm text-slate-600 dark:text-slate-400">{post.excerpt}</p>
                      <span className="mt-4 text-sm font-medium text-primary dark:text-accent">Read full article →</span>
                    </CardContent>
                  </Card>
                </Link>
              </motion.article>
            ))}
          </motion.div>
        ) : null}

        {!isPending && !data?.length ? (
          <p className="text-center text-slate-600 dark:text-slate-400">
            No posts yet. Publish from the admin dashboard.
          </p>
        ) : null}
      </div>
    </>
  )
}
