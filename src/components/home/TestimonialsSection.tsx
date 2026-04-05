import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'
import { Autoplay, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import { SectionHeader } from '@/components/SectionHeader'
import { fadeUpItem } from '@/animations/pageVariants'
import { TESTIMONIALS } from '@/lib/constants'

import 'swiper/css'
import 'swiper/css/pagination'

/** Animated testimonial slider for social proof on the home page. */
export function TestimonialsSection() {
  return (
    <section className="bg-slate-100/50 px-4 py-20 dark:bg-white/[0.02] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <SectionHeader
          eyebrow="Testimonials"
          title="Trusted by clients"
          subtitle="Real feedback from schools, retailers, and professional firms."
        />

        <motion.div
          variants={fadeUpItem}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="group rounded-3xl border border-slate-200/80 bg-white/70 p-6 shadow-lg backdrop-blur-md transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-xl hover:shadow-primary/15 dark:border-white/10 dark:bg-white/5 dark:hover:border-accent/35 dark:hover:shadow-accent/15 md:p-10"
        >
          <Swiper
            className="home-testimonials-swiper"
            modules={[Autoplay, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            breakpoints={{
              768: { slidesPerView: 1 },
            }}
          >
            {TESTIMONIALS.map((t) => (
              <SwiperSlide key={t.name} className="!h-auto">
                <div className="flex flex-col items-center px-1 text-center">
                  <Quote className="mb-4 h-10 w-10 text-primary/40 transition-transform duration-300 group-hover:scale-110 dark:text-accent/40" />
                  <p className="max-w-2xl text-lg leading-relaxed text-slate-700 dark:text-slate-200">
                    “{t.quote}”
                  </p>
                  <div className="mt-6">
                    <p className="font-heading font-semibold text-secondary dark:text-white">{t.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{t.role}</p>
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
