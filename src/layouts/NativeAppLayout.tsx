import { AnimatePresence, motion } from 'framer-motion'
import { Suspense } from 'react'
import { useLocation, useOutlet, Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, User } from 'lucide-react'

import { pageVariants } from '@/animations/pageVariants'
import { PageSkeleton } from '@/components/PageSkeleton'
import { BottomNav } from '../components/BottomNav'
import { SITE } from '@/lib/constants'
import { Logo } from '@/components/Logo'

export function NativeAppLayout() {
  const location = useLocation()
  const outlet = useOutlet()
  const navigate = useNavigate()

  // Determine page title based on route
  const getPageTitle = (path: string) => {
    if (path === '/') return SITE.name
    if (path.startsWith('/services')) return 'Services'
    if (path.startsWith('/portfolio')) return 'Portfolio'
    if (path.startsWith('/pricing')) return 'Pricing'
    if (path.startsWith('/portal')) return 'Dashboard'
    if (path.startsWith('/about')) return 'About Us'
    if (path.startsWith('/contact')) return 'Contact'
    if (path.startsWith('/blog')) return 'Blog'
    return SITE.name
  }

  const isHome = location.pathname === '/'

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-black text-white font-body selection:bg-primary selection:text-primary-foreground">
      
      {/* Native-style App Header */}
      <header className="flex-none h-14 px-4 flex items-center justify-between pt-safe bg-black/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-[100]">
        <div className="flex-1 flex items-center">
          {!isHome ? (
            <button 
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 rounded-full active:bg-white/10 transition-colors"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          ) : (
            <div className="h-8 w-8 flex items-center justify-center">
              <Logo variant="icon" theme="dark" className="scale-75" />
            </div>
          )}
        </div>

        <div className="flex-1 text-center truncate">
          <h1 className="text-sm font-bold tracking-tight uppercase">
            {getPageTitle(location.pathname)}
          </h1>
        </div>

        <div className="flex-1 flex justify-end">
          <Link to="/portal" className="p-2 -mr-2 rounded-full active:bg-white/10 transition-colors">
            <User className="h-5 w-5" />
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar pb-safe">
        <Suspense fallback={<PageSkeleton />}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="min-h-full pb-20"
            >
              {outlet}
            </motion.div>
          </AnimatePresence>
        </Suspense>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  )
}
