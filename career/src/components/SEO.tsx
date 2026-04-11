import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title?: string
  description?: string
  path?: string
  image?: string
}

export function SEO({ title, description, path, image }: SEOProps) {
  const fullTitle = title ? `${title} | SatByte Careers` : 'SatByte Careers — Join Our Team'
  const siteUrl = 'https://career.satbyte.in'
  const fullUrl = `${siteUrl}${path || ''}`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description || 'Join SatByte Technologies — Explore jobs, internships, and certification programs.'} />
      
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content="website" />
      {image && <meta property="og:image" content={image} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  )
}
