import { Helmet } from 'react-helmet-async'

type SEOProps = {
  title: string
  description?: string
  path?: string
}

const DEFAULT_DESC =
  'SatByte Technologies delivers websites, web apps, SEO, and digital marketing from Mahua, Vaishali, Bihar.'

/** Per-page SEO tags via react-helmet-async. */
export function SEO({ title, description = DEFAULT_DESC, path = '' }: SEOProps) {
  const fullTitle = title.includes('SatByte') ? title : `${title} | SatByte Technologies`
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const url = `${origin}${path}`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      {origin ? <meta property="og:url" content={url} /> : null}
    </Helmet>
  )
}
