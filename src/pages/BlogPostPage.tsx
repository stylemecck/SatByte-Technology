import { motion, useScroll, useSpring } from 'framer-motion'
import { ArrowLeft, Calendar, Clock, Link as LinkIcon, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { LazyImage } from '@/components/LazyImage'
import { SEO } from '@/components/SEO'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useBlogBySlug, useBlogsQuery } from '@/hooks/useCmsQueries'
import { cn } from '@/lib/utils'
import { pageVariants } from '@/animations/pageVariants'

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat('en-IN', { dateStyle: 'long', month: 'short', year: 'numeric' }).format(new Date(iso))
  } catch {
    return iso
  }
}

const Twitter = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

const Linkedin = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

// 1. Reading Progress Bar Component
function ProgressBar() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent origin-left z-[100]"
      style={{ scaleX }}
    />
  )
}

// 2. Table of Contents
function TableOfContents() {
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    // Wait a brief moment to ensure React has fully rendered dangerouslySetInnerHTML
    setTimeout(() => {
      const elements = Array.from(document.querySelectorAll('.blog-content h2, .blog-content h3'))
      
      const mapped = elements.map(elem => {
        if (!elem.id) {
          elem.id = elem.textContent?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'section'
        }
        return {
          id: elem.id,
          text: elem.textContent || '',
          level: elem.tagName === 'H2' ? 2 : 3
        }
      })
      setHeadings(mapped)

      const callback = (entries: IntersectionObserverEntry[]) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      }
      const observer = new IntersectionObserver(callback, { rootMargin: '-10% 0px -70% 0px' })
      elements.forEach(el => observer.observe(el))
      return () => observer.disconnect()
    }, 100)
  }, [])

  if (headings.length === 0) return null

  return (
    <div className="sticky top-24 mb-12 hidden lg:block border-l border-slate-200 dark:border-white/10 pl-6 space-y-4">
      <h4 className="font-heading font-bold text-slate-900 dark:text-white uppercase tracking-wider text-sm">Table of Contents</h4>
      <nav className="flex flex-col gap-2.5">
        {headings.map(h => (
          <a
            key={h.id}
            href={`#${h.id}`}
            onClick={(e) => {
              e.preventDefault()
              document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth' })
            }}
            className={cn(
              "text-[15px] transition-colors block leading-snug",
              h.level === 3 ? "pl-4 text-slate-500" : "text-slate-600 dark:text-slate-400 font-medium",
              activeId === h.id ? "text-primary dark:text-accent" : "hover:text-primary dark:hover:text-accent"
            )}
          >
            {h.text}
          </a>
        ))}
      </nav>
    </div>
  )
}

// 3. Social Share Buttons
function ShareButtons() {
  const [url, setUrl] = useState('')
  useEffect(() => setUrl(window.location.href), [])
  const copyLink = () => {
    navigator.clipboard.writeText(url)
    alert("Link copied!")
  }
  return (
    <div className="flex gap-2 items-center">
      <span className="text-sm font-medium text-slate-500 mr-2">Share:</span>
      <Button variant="outline" size="icon" className="rounded-full h-9 w-9 text-blue-500 border-slate-200 bg-slate-50 hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10" asChild>
        <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`} target="_blank" rel="noreferrer">
          <Twitter className="h-4 w-4" />
        </a>
      </Button>
      <Button variant="outline" size="icon" className="rounded-full h-9 w-9 text-blue-700 border-slate-200 bg-slate-50 hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10" asChild>
        <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`} target="_blank" rel="noreferrer">
          <Linkedin className="h-4 w-4" />
        </a>
      </Button>
      <Button variant="outline" size="icon" className="rounded-full h-9 w-9 text-slate-600 dark:text-slate-300 border-slate-200 bg-slate-50 hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10" onClick={copyLink}>
        <LinkIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}

function RelatedPosts({ currentSlug }: { currentSlug?: string }) {
  const { data } = useBlogsQuery()
  if (!data) return null
  
  const related = data.filter(d => d.slug !== currentSlug).slice(0, 3)
  if (related.length === 0) return null

  return (
    <div className="mt-16 pt-16 border-t border-slate-200 dark:border-white/10">
      <h3 className="font-heading text-2xl font-bold text-slate-900 dark:text-white mb-8">Related Articles</h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {related.map(post => (
          <Link to={`/blog/${post.slug}`} key={post._id} className="group flex flex-col gap-3">
            <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-white/10 shadow-sm">
              <LazyImage 
                src={post.imageUrl}
                alt={post.title}
                optimizeWidth={400}
                aspectClassName="aspect-video w-full transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div>
              <span className="text-xs font-bold text-primary dark:text-accent mb-1 inline-block uppercase tracking-wider">{post.category || 'Technology'}</span>
              <h4 className="font-semibold text-[17px] leading-snug line-clamp-2 dark:text-slate-100 group-hover:text-primary dark:group-hover:text-accent transition-colors">{post.title}</h4>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: post, isPending, isError } = useBlogBySlug(slug)

  return (
    <>
      <ProgressBar />
      {post ? (
        <SEO
          title={post.title}
          description={post.excerpt || post.title}
          path={`/blog/${post.slug}`}
        />
      ) : (
        <SEO title="Blog post" description="SatByte Technologies blog." path={`/blog/${slug ?? ''}`} />
      )}

      <motion.main 
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
      >
        <Button variant="link" className="mb-8 gap-2 pl-0 text-slate-500 hover:text-primary" asChild>
          <Link to="/blog">
            <ArrowLeft className="h-4 w-4 leading-none" />
            <span className="leading-none pt-0.5">Back to all posts</span>
          </Link>
        </Button>

        {isPending ? (
          <div className="max-w-3xl space-y-6 mx-auto">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="aspect-[21/9] w-full rounded-2xl" />
          </div>
        ) : null}

        {isError && (
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-8 text-center dark:border-white/10 dark:bg-white/5 max-w-2xl mx-auto">
            <p className="text-slate-700 dark:text-slate-200">
              This post could not be found.
            </p>
            <Button asChild className="mt-6">
              <Link to="/blog">Back to blog</Link>
            </Button>
          </div>
        )}

        {post && (
          <article className="pb-16 grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
            
            {/* Sidebar Left: Share anchors (Desktop) */}
            <div className="hidden lg:flex col-span-2 flex-col items-end pt-32 pr-6 border-r border-slate-100 dark:border-white/5">
              <div className="sticky top-32 flex flex-col gap-4 items-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Share</p>
                <div className="flex flex-col gap-3">
                  <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noreferrer" className="flex items-center justify-center h-10 w-10 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-sky-500 transition-colors shadow-sm dark:bg-[#0f172a] dark:border-white/10 dark:text-slate-400 dark:hover:text-blue-400 dark:hover:bg-blue-400/10">
                    <Twitter className="h-4 w-4" />
                  </a>
                  <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noreferrer" className="flex items-center justify-center h-10 w-10 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-blue-600 transition-colors shadow-sm dark:bg-[#0f172a] dark:border-white/10 dark:text-slate-400 dark:hover:text-blue-500 dark:hover:bg-blue-500/10">
                    <Linkedin className="h-4 w-4" />
                  </a>
                  <button onClick={() => { navigator.clipboard.writeText(window.location.href); alert('Copied!'); }} className="flex items-center justify-center h-10 w-10 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-700 transition-colors shadow-sm dark:bg-[#0f172a] dark:border-white/10 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/10">
                    <LinkIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="col-span-1 border-t lg:border-t-0 pt-8 lg:pt-0 lg:col-span-7 w-full max-w-3xl mx-auto">
              {/* Hero Header */}
              <motion.header 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10 text-center lg:text-left"
              >
                <div className="mb-6 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm font-medium">
                  {post.category && (
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-primary dark:bg-accent/10 dark:text-accent ring-1 ring-primary/20 dark:ring-accent/30 font-semibold tracking-wide">
                      {post.category}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                    <Calendar className="h-4 w-4 opacity-70" />
                    {formatDate(post.createdAt)}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                    <Clock className="h-4 w-4 opacity-70" />
                    {post.readTime}
                  </span>
                </div>
                <h1 className="font-heading text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl leading-[1.15] mb-8">
                  {post.title}
                </h1>
                
                {/* Author Meta Row */}
                <div className="flex items-center justify-center lg:justify-start gap-3 mt-4">
                  <div className="h-11 w-11 rounded-full shadow-md bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold shrink-0 text-lg">
                    {(post.author || 'S')[0].toUpperCase()}
                  </div>
                  <div className="text-left">
                    <p className="text-[15px] font-bold text-slate-900 dark:text-slate-100 leading-tight">{post.author || 'SatByte Team'}</p>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Author</p>
                  </div>
                </div>
              </motion.header>

              {/* Featured Image */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="group relative overflow-hidden rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-black/60 mb-14 border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5"
              >
                <LazyImage
                  src={post.imageUrl}
                  alt={post.title}
                  aspectClassName="aspect-[21/9] sm:aspect-[16/9] w-full transition-transform duration-700 group-hover:scale-[1.02]"
                  optimizeWidth={1200}
                />
              </motion.div>

              {/* Advanced Typography Blog Content Wrapper */}
              <div 
                className="blog-content w-full text-lg leading-relaxed text-slate-700 dark:text-slate-300
                [&_p]:mb-6
                [&_h2]:text-3xl [&_h2]:font-heading [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-slate-900 dark:[&_h2]:text-white [&_h2]:mt-14 [&_h2]:mb-6 [&_h2]:border-l-4 [&_h2]:border-primary dark:[&_h2]:border-accent [&_h2]:pl-5
                [&_h3]:text-2xl [&_h3]:font-heading [&_h3]:font-bold [&_h3]:text-slate-800 dark:[&_h3]:text-slate-100 [&_h3]:mt-10 [&_h3]:mb-4
                [&_ul]:mb-6 [&_ul]:list-disc [&_ul]:pl-6 [&_ul_li]:mb-2 [&_ul_li::marker]:text-primary dark:[&_ul_li::marker]:text-accent
                [&_ol]:mb-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol_li]:mb-2
                [&_a]:text-primary dark:[&_a]:text-accent [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-blue-600 dark:hover:[&_a]:text-blue-400
                [&_blockquote]:border-l-primary dark:[&_blockquote]:border-l-accent [&_blockquote]:border-l-4 [&_blockquote]:bg-slate-50 dark:[&_blockquote]:bg-white/5 [&_blockquote]:py-4 [&_blockquote]:px-6 [&_blockquote]:rounded-r-xl [&_blockquote]:italic [&_blockquote]:my-8 [&_blockquote]:text-slate-600 dark:[&_blockquote]:text-slate-400
                [&_strong]:font-bold [&_strong]:text-slate-900 dark:[&_strong]:text-white
                [&_pre]:bg-slate-900 [&_pre]:text-slate-100 [&_pre]:p-4 [&_pre]:rounded-xl [&_pre]:my-6 [&_pre]:overflow-x-auto
                [&_code]:bg-slate-100 dark:[&_code]:bg-white/10 [&_code]:text-primary dark:[&_code]:text-accent [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:text-[15px]
                [&_img]:max-w-full [&_img]:rounded-xl [&_img]:border [&_img]:border-slate-200 dark:[&_img]:border-white/10 [&_img]:my-8
                [&_table]:w-full [&_table]:border-collapse [&_table]:my-8 [&_table]:border [&_table]:border-slate-200 dark:[&_table]:border-white/10 [&_th]:border [&_th]:border-slate-200 dark:[&_th]:border-white/10 [&_th]:p-3 [&_th]:bg-slate-50 dark:[&_th]:bg-white/5 [&_th]:font-bold [&_th]:text-left [&_td]:border [&_td]:border-slate-200 dark:[&_td]:border-white/10 [&_td]:p-3
                "
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Mobile Share (Bottom) */}
              <div className="mt-12 pt-6 border-t border-slate-200 dark:border-white/10 lg:hidden flex justify-center">
                <ShareButtons />
              </div>

              {/* Author Footer Card */}
              <div className="mt-16 p-8 rounded-2xl bg-white shadow-xl shadow-slate-200/50 dark:shadow-none dark:bg-[#151e32] border border-slate-200 dark:border-[#1e293b] flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left transition-all hover:shadow-2xl hover:border-primary/30 dark:hover:border-accent/30">
                <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold text-3xl shrink-0 shadow-lg ring-4 ring-white dark:ring-[#0f172a]">
                  {(post.author || 'S')[0].toUpperCase()}
                </div>
                <div className="flex-1">
                  <h4 className="text-2xl font-bold tracking-tight mb-1 max-w-full dark:text-white break-words">{post.author || 'SatByte Team'}</h4>
                  <p className="text-[15px] font-medium text-primary dark:text-accent mb-3 uppercase tracking-wider">Lead Editor</p>
                  <p className="text-[16px] text-slate-600 dark:text-slate-400 mb-5 leading-relaxed">
                    Passionate experts delivering high-end enterprise web solutions, custom portals, and automated business architectures for fast-scaling agencies worldwide.
                  </p>
                  <Button variant="outline" size="sm" className="rounded-full gap-2 font-medium bg-transparent hover:bg-slate-100 dark:hover:bg-white/10 dark:text-white dark:border-white/20">
                    Follow on X <ChevronRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Related Posts */}
              <RelatedPosts currentSlug={post.slug} />
              
              {/* Newsletter Sub */}
              <div className="mt-16 relative overflow-hidden rounded-3xl bg-[#0f1423] text-center p-8 sm:p-14 shadow-2xl border border-white/10">
                <div className="absolute inset-x-0 -top-24 h-64 bg-gradient-to-b from-primary/30 to-transparent blur-3xl rounded-full" />
                <h3 className="relative font-heading text-3xl font-bold tracking-tight text-white mb-4">Subscribe for Updates</h3>
                <p className="relative text-slate-300 mb-10 max-w-lg mx-auto text-lg">Get the latest web tech articles, custom portal case studies, and business automation tips directly to your inbox.</p>
                <form className="relative flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => { e.preventDefault(); alert('Subscribed!') }}>
                  <input type="email" placeholder="Enter your email address" required className="flex-1 rounded-xl bg-white/5 border border-white/10 px-5 py-4 text-white placeholder-slate-400 outline-none backdrop-blur-md focus:bg-white/10 focus:ring-2 focus:ring-primary focus:border-transparent transition-all w-full" />
                  <Button type="submit" size="lg" className="rounded-xl px-8 shadow-lg shadow-primary/30 py-4 h-auto text-base">Subscribe</Button>
                </form>
              </div>

            </div>

            {/* Sidebar Right: TOC */}
            <aside className="col-span-3 hidden lg:block relative text-sm pb-10 pt-4">
              <TableOfContents />
            </aside>
            
          </article>
        )}
      </motion.main>
    </>
  )
}
