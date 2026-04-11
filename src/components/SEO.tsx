import { Helmet } from 'react-helmet-async'
import { SITE } from '@/lib/constants'

type SEOProps = {
  title: string
  description?: string
  path?: string
  keywords?: string
  ogImage?: string
  type?: 'website' | 'article'
  schema?: object
}

const DEFAULT_DESC =
  'SatByte Technologies delivers high-performance websites, web apps, technical SEO, and IT consultancy services in Mahua, Vaishali, Bihar, and across India.'

const DEFAULT_KEYWORDS = 
  'web development, software company Bihar, SEO services India, IT solutions Mahua, Vaishali tech agency, custom web apps, SatByte Technologies'

/** 
 * Enhanced SEO Component 
 * Implements Meta Tags, Open Graph, Twitter Cards, and JSON-LD Schema.
 */
export function SEO({ 
  title, 
  description = DEFAULT_DESC, 
  path = '', 
  keywords = DEFAULT_KEYWORDS,
  ogImage = '/og-image.jpg', // Ensure this file exists in /public or is a valid URL
  type = 'website',
  schema 
}: SEOProps) {
  const fullTitle = title.includes(SITE.name) ? title : `${title} | ${SITE.name}`
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://satbyte.in'
  const url = `${origin}${path}`
  const image = ogImage.startsWith('http') ? ogImage : `${origin}${ogImage}`

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />
      <meta name="robots" content="index, follow" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* JSON-LD Schema Markup */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  )
}
