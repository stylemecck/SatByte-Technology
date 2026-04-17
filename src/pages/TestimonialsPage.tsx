import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

import { SectionHeader } from '@/components/SectionHeader'
import { SEO } from '@/components/SEO'
import { Card, CardContent } from '@/components/ui/card'
import { TESTIMONIALS } from '@/lib/constants'
import { fadeUpItem, staggerContainer } from '@/animations/pageVariants'

export default function TestimonialsPage() {
  return (
    <>
      <SEO
        title="Testimonials"
        description="Client testimonials for SatByte Technologies — schools, retailers, startups, and professional firms."
        path="/testimonials"
      />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Social proof"
          title="What our clients say"
          subtitle="Honest feedback from teams who shipped with us."
        />

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
        >
          {TESTIMONIALS.map((t) => (
            <motion.div key={t.name} variants={fadeUpItem}>
              <Card className="h-full border-border bg-card backdrop-blur-md transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-lg">
                <CardContent className="flex h-full flex-col p-6">
                  <div className="mb-4 flex gap-0.5 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="flex-1 text-foreground">“{t.quote}”</p>
                  <div className="mt-6 border-t border-border pt-4">
                    <p className="font-heading font-semibold text-foreground">{t.name}</p>
                    <p className="text-sm text-muted-foreground">{t.role}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </>
  )
}
