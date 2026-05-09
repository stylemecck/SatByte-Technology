import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

import { SITE, NAV_LINKS } from '@/lib/constants'

export default function SitemapPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-32 sm:px-6 lg:px-8 bg-background min-h-screen">
      <Helmet>
        <title>Sitemap | {SITE.name}</title>
      </Helmet>
      
      <h1 className="text-4xl font-extrabold text-foreground mb-12 tracking-tight">
        Sitemap
      </h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">Pages</h2>
          <ul className="space-y-3">
            {NAV_LINKS.map(link => (
              <li key={link.href}>
                <Link to={link.href} className="text-muted-foreground hover:text-primary transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">Legal</h2>
          <ul className="space-y-3">
            <li>
              <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
        
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">Contact</h2>
          <ul className="space-y-3">
            <li className="text-muted-foreground">
              {SITE.location}
            </li>
            <li>
              <a href={`mailto:${SITE.email}`} className="text-muted-foreground hover:text-primary transition-colors">
                {SITE.email}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
