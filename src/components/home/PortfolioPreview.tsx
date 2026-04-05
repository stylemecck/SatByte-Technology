import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Autoplay, EffectFade, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import { SectionHeader } from '@/components/SectionHeader'
import { Button } from '@/components/ui/button'
import { LazyImage } from '@/components/LazyImage'
import { fadeUpItem } from '@/animations/pageVariants'
import { useProjectsQuery } from '@/hooks/useCmsQueries'
import { HOME_PORTFOLIO } from '@/lib/constants'

import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/pagination'

type Slide = { title: string; description: string; image: string }

/** Swiper carousel — uses CMS projects when available, else static samples. */
export function PortfolioPreview() {
  const { data } = useProjectsQuery()

  const slides: Slide[] = useMemo(() => {
    if (data?.length) {
      return data.slice(0, 4).map((p) => ({
        title: p.title,
        description: p.description,
        image: p.imageUrl,
      }))
    }
    return HOME_PORTFOLIO.map((p) => ({ title: p.title, description: p.description, image: p.image }))
  }, [data])

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Portfolio"
          title="Recent highlights"
          subtitle="A glimpse of the experiences we craft for schools, commerce, and enterprises."
          className="mb-12 sm:mb-14"
        />

        <motion.div
          variants={fadeUpItem}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          whileHover={{ scale: 1.008 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className="group/card relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/50 shadow-xl backdrop-blur-md dark:border-white/10 dark:bg-white/5"
        >
          <Swiper
            className="portfolio-preview-swiper"
            modules={[Autoplay, Pagination, EffectFade]}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            speed={600}
            loop={slides.length > 1}
            autoHeight
            autoplay={{ delay: 4500, disableOnInteraction: false }}
            pagination={{ clickable: true }}
          >
            {slides.map((project) => (
              <SwiperSlide key={project.title} className="!h-auto">
                <div className="grid min-h-0 grid-cols-1 md:grid-cols-2">
                  <div className="relative isolate min-h-[220px] w-full overflow-hidden bg-slate-200/80 dark:bg-slate-800/80 md:min-h-[min(100%,360px)]">
                    <div className="group/img h-full min-h-[220px] md:absolute md:inset-0 md:min-h-0">
                      <LazyImage
                        src={project.image}
                        alt={project.title}
                        aspectClassName="h-full min-h-[220px] w-full rounded-none md:min-h-full"
                        className="h-full min-h-[220px] w-full rounded-none object-cover transition-[transform,filter] duration-700 ease-out group-hover/card:brightness-105 md:min-h-0 group-hover/img:scale-105"
                        optimizeWidth={900}
                      />
                    </div>
                  </div>

                  <div className="flex min-w-0 flex-col justify-center border-t border-slate-200/80 bg-white/95 px-6 pb-8 pt-8 dark:border-white/10 dark:bg-[#0f172a]/95 sm:px-10 md:border-l md:border-t-0 md:bg-white/90 md:pb-10 md:pt-10 md:backdrop-blur-md dark:md:bg-[#0f172a]/90">
                    <h3 className="font-heading text-2xl font-bold leading-snug tracking-tight text-secondary dark:text-white sm:text-3xl">
                      {project.title}
                    </h3>
                    <p className="mt-3 max-w-prose text-pretty text-base leading-relaxed text-slate-600 dark:text-slate-400">
                      {project.description}
                    </p>
                    <Button
                      asChild
                      variant="secondary"
                      className="mt-8 w-fit transition-transform duration-300 group-hover/card:translate-x-0.5"
                    >
                      <Link to="/portfolio">View full portfolio</Link>
                    </Button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  )
}
