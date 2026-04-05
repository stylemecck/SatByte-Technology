import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

import { pageVariants } from '@/animations/pageVariants'
import { LazyImage } from '@/components/LazyImage'
import { SEO } from '@/components/SEO'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useBlogBySlug } from '@/hooks/useCmsQueries'

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat('en-IN', { dateStyle: 'long' }).format(new Date(iso))
  } catch {
    return iso
  }
}

/** Renders admin-authored body: plain text with line breaks, or basic HTML if present. */
function BlogBody({ content }: { content: string }) {
  const looksLikeHtml = /<[a-z][\s\S]*>/i.test(content.trim())
  if (looksLikeHtml) {
    return (
      <div
        className="space-y-4 text-base leading-relaxed text-slate-700 dark:text-slate-300 [&_h1]:mb-3 [&_h1]:font-heading [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:mb-2 [&_h2]:mt-6 [&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:font-heading [&_p]:mb-3 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_a]:text-primary [&_a]:underline [&_img]:max-w-full [&_img]:rounded-xl dark:[&_a]:text-accent"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    )
  }
  return (
    <div className="whitespace-pre-wrap text-base leading-relaxed text-slate-700 dark:text-slate-300">
      {content}
    </div>
  )
}

/** Single post view — loaded by slug from the API. */
export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: post, isPending, isError, error } = useBlogBySlug(slug)

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8"
    >
      {post ? (
        <SEO
          title={post.title}
          description={post.excerpt || post.title}
          path={`/blog/${post.slug}`}
        />
      ) : (
        <SEO title="Blog post" description="SatByte Technologies blog." path={`/blog/${slug ?? ''}`} />
      )}

      <Button variant="ghost" className="mb-8 gap-2 pl-0 hover:bg-transparent" asChild>
        <Link to="/blog">
          <ArrowLeft className="h-4 w-4" />
          All posts
        </Link>
      </Button>

      {isPending ? (
        <div className="space-y-6">
          <Skeleton className="h-10 w-3/4 max-w-md" />
          <Skeleton className="aspect-[21/9] w-full rounded-2xl" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ) : null}

      {isError ? (
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-8 text-center dark:border-white/10 dark:bg-white/5">
          <p className="text-slate-700 dark:text-slate-200">
            {(error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
              'This post could not be found.'}
          </p>
          <Button asChild className="mt-6">
            <Link to="/blog">Back to blog</Link>
          </Button>
        </div>
      ) : null}

      {post ? (
        <article>
          <header className="mb-8">
            <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {formatDate(post.createdAt)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {post.readTime}
              </span>
            </div>
            <h1 className="font-heading text-3xl font-bold tracking-tight text-secondary dark:text-white sm:text-4xl">
              {post.title}
            </h1>
          </header>

          <LazyImage
            src={post.imageUrl}
            alt={post.title}
            aspectClassName="mb-10 aspect-[21/9] w-full overflow-hidden rounded-2xl"
            optimizeWidth={1200}
            sizes="(max-width: 768px) 100vw, 768px"
          />

          <BlogBody content={post.content} />
        </article>
      ) : null}
    </motion.div>
  )
}
