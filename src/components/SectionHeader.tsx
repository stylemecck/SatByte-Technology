import { motion } from 'framer-motion'

import { fadeUpItem } from '@/animations/pageVariants'
import { cn } from '@/lib/utils'

type SectionHeaderProps = {
  eyebrow?: string
  title: string
  subtitle?: string
  className?: string
  centered?: boolean
}

/** Consistent section title block with optional Framer Motion reveal. */
export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  className,
  centered = true,
}: SectionHeaderProps) {
  return (
    <motion.div
      variants={fadeUpItem}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: '-80px' }}
      className={cn('mb-10 max-w-3xl', centered && 'mx-auto text-center', className)}
    >
      {eyebrow ? (
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary dark:text-accent">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-heading text-3xl font-bold tracking-tight text-secondary dark:text-white sm:text-4xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-3 text-slate-600 dark:text-slate-400">{subtitle}</p>
      ) : null}
    </motion.div>
  )
}
