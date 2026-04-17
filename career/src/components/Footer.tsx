import { Link } from 'react-router-dom'
import { Mail, MapPin, Globe, ExternalLink, Rocket } from 'lucide-react'
import { SITE } from '../lib/constants'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-background pt-24 pb-12 px-6 sm:px-8 border-t border-border overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 blur-[100px] rounded-full translate-x-1/2 -z-10" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-12 mb-20">
          {/* Brand & Mission */}
          <div className="flex flex-col gap-6">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="h-10 w-10 rounded-2xl bg-foreground text-background flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                <Rocket className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-extrabold text-2xl tracking-tight text-foreground">
                  SatByte
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-blue -mt-1">
                  Careers
                </span>
              </div>
            </Link>
            <p className="text-muted-foreground text-[14px] leading-relaxed max-w-sm">
              Empowering the next generation of engineers through world-class career opportunities, structured internships, and industry-grade certifications.
            </p>
          </div>

          {/* Portal Links */}
          <div className="lg:pl-8">
            <h4 className="font-heading font-bold text-[11px] uppercase tracking-[0.3em] text-muted-foreground mb-8">Portal Hub</h4>
            <ul className="flex flex-col gap-4">
              <li><Link to="/careers" className="text-foreground/70 hover:text-brand-blue transition-all hover:translate-x-1 inline-block text-[14px] font-medium">Open Positions</Link></li>
              <li><Link to="/internships" className="text-foreground/70 hover:text-brand-blue transition-all hover:translate-x-1 inline-block text-[14px] font-medium">Internships</Link></li>
              <li><Link to="/certifications" className="text-foreground/70 hover:text-brand-blue transition-all hover:translate-x-1 inline-block text-[14px] font-medium">Certifications</Link></li>
              <li><Link to="/dashboard" className="text-foreground/70 hover:text-brand-blue transition-all hover:translate-x-1 inline-block text-[14px] font-medium">User Dashboard</Link></li>
            </ul>
          </div>

          {/* Main Services */}
          <div>
            <h4 className="font-heading font-bold text-[11px] uppercase tracking-[0.3em] text-muted-foreground mb-8">Main Platform</h4>
            <ul className="flex flex-col gap-4">
              <li><a href={`${SITE.mainSiteUrl}/services`} className="text-foreground/70 hover:text-brand-blue transition-all hover:translate-x-1 inline-block text-[14px] font-medium">Core Services</a></li>
              <li><a href={`${SITE.mainSiteUrl}/portfolio`} className="text-foreground/70 hover:text-brand-blue transition-all hover:translate-x-1 inline-block text-[14px] font-medium">Case Studies</a></li>
              <li><a href={`${SITE.mainSiteUrl}/pricing`} className="text-foreground/70 hover:text-brand-blue transition-all hover:translate-x-1 inline-block text-[14px] font-medium">Pricing Plans</a></li>
              <li><a href={`${SITE.mainSiteUrl}/about`} className="text-foreground/70 hover:text-brand-blue transition-all hover:translate-x-1 inline-block text-[14px] font-medium">Company Origin</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-bold text-[11px] uppercase tracking-[0.3em] text-muted-foreground mb-8">Contact & Locate</h4>
            <ul className="flex flex-col gap-6">
              <li className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <Mail className="h-4 w-4 text-brand-blue" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Email</span>
                  <span className="text-[14px] font-medium text-foreground">{SITE.email}</span>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <Globe className="h-4 w-4 text-brand-blue" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Main Site</span>
                  <a href={SITE.mainSiteUrl} className="text-[14px] font-medium text-foreground hover:text-brand-blue transition-colors flex items-center gap-1.5">
                    satbyte.in <ExternalLink size={12} className="opacity-50" />
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-muted-foreground text-[12px] font-medium tracking-tight">
            © {currentYear} {SITE.parentName}. All Rights Reserved.
          </p>
          <div className="flex items-center gap-8">
            <span className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-muted-foreground/40">
              Forged in Bihar, India
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
