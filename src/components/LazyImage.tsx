import { useMemo, useState, type ImgHTMLAttributes } from 'react'

import { cloudinaryOptimizedUrl, cloudinarySrcSet } from '@/lib/cloudinaryImage'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

type LazyImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  /** Shown while the image is loading. */
  aspectClassName?: string
  /** Default Cloudinary delivery width (f_auto, q_auto). */
  optimizeWidth?: number
  /** Add responsive srcSet for Cloudinary URLs. */
  responsive?: boolean
}

/**
 * Image with lazy loading, skeleton placeholder, and optional Cloudinary transforms.
 */
export function LazyImage({
  className,
  aspectClassName,
  alt,
  onLoad,
  src,
  optimizeWidth = 800,
  responsive = true,
  sizes,
  ...props
}: LazyImageProps) {
  const [loaded, setLoaded] = useState(false)

  const resolvedSrc = useMemo(() => {
    if (typeof src !== 'string') return src
    return cloudinaryOptimizedUrl(src, { width: optimizeWidth })
  }, [src, optimizeWidth])

  const srcSet = useMemo(() => {
    if (typeof src !== 'string' || !responsive) return undefined
    return cloudinarySrcSet(src)
  }, [src, responsive])

  if (!resolvedSrc) {
    return (
      <div className={cn('relative overflow-hidden rounded-xl', aspectClassName)}>
        <Skeleton className="h-full min-h-[120px] w-full rounded-xl" />
      </div>
    )
  }

  return (
    <div className={cn('relative overflow-hidden rounded-xl', aspectClassName)}>
      {!loaded && <Skeleton className="absolute inset-0 h-full w-full rounded-xl" />}
      <img
        alt={alt ?? ''}
        src={resolvedSrc}
        srcSet={srcSet}
        sizes={sizes ?? '(max-width: 768px) 100vw, 50vw'}
        loading="lazy"
        decoding="async"
        className={cn(
          'h-full w-full object-cover transition-opacity duration-500',
          loaded ? 'opacity-100' : 'opacity-0',
          className,
        )}
        onLoad={(e) => {
          setLoaded(true)
          onLoad?.(e)
        }}
        {...props}
      />
    </div>
  )
}
