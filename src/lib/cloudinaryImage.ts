/**
 * Insert Cloudinary delivery transforms (auto format/quality, max width) into a secure URL.
 * Non-Cloudinary URLs are returned unchanged.
 */
export function cloudinaryOptimizedUrl(
  url: string | undefined | null,
  opts?: { width?: number },
): string {
  if (!url) return ''
  const width = opts?.width ?? 800
  if (!url.includes('res.cloudinary.com') || !url.includes('/upload/')) {
    return url
  }
  const parts = url.split('/upload/')
  if (parts.length < 2) return url
  const [head, tail] = parts
  return `${head}/upload/f_auto,q_auto,w_${width},c_limit/${tail}`
}

/** `srcSet` for responsive `<img>` when using Cloudinary URLs. */
export function cloudinarySrcSet(url: string | undefined | null): string | undefined {
  if (!url || !url.includes('res.cloudinary.com')) return undefined
  const w400 = cloudinaryOptimizedUrl(url, { width: 400 })
  const w800 = cloudinaryOptimizedUrl(url, { width: 800 })
  const w1200 = cloudinaryOptimizedUrl(url, { width: 1200 })
  return `${w400} 400w, ${w800} 800w, ${w1200} 1200w`
}
