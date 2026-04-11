import { AnimatePresence, motion } from 'framer-motion'
import { Suspense } from 'react'
import { useLocation, useOutlet } from 'react-router-dom'

import { pageVariants } from '@/animations/pageVariants'
import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'
import { PageSkeleton } from '@/components/PageSkeleton'
import { ScrollToTop } from '@/components/ScrollToTop'

/** Shell: sticky nav, lazy-route Suspense, Framer transitions, footer. */
export function MainLayout() {
  const location = useLocation()
  const outlet = useOutlet()

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 pt-20">
        <Suspense fallback={<PageSkeleton />}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="min-h-full"
            >
              {outlet}
            </motion.div>
          </AnimatePresence>
        </Suspense>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  )
}
