import { Link } from 'react-router-dom'
import { Mail, MapPin, Globe, ExternalLink, X, Link as LinkIcon } from 'lucide-react'
import { SITE } from '../lib/constants'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-secondary text-white pt-20 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Brand */}
          <div className="flex flex-col gap-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/25">
                S
              </div>
              <span className="font-heading font-extrabold text-2xl tracking-tight">
                SatByte
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Building the next generation of IT solutions and empowering the workforce of tomorrow with industry-grade skills.
            </p>
            <div className="flex gap-4">
              <a href="#" className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors border border-white/10" aria-label="LinkedIn">
                <ExternalLink size={18} />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors border border-white/10" aria-label="Twitter">
                <X size={18} />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors border border-white/10" aria-label="GitHub">
                <LinkIcon size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-6">Portal Links</h4>
            <ul className="flex flex-col gap-4">
              <li><Link to="/careers" className="text-slate-400 hover:text-white transition-colors text-sm">Open Positions</Link></li>
              <li><Link to="/internships" className="text-slate-400 hover:text-white transition-colors text-sm">Internships</Link></li>
              <li><Link to="/certifications" className="text-slate-400 hover:text-white transition-colors text-sm">Certifications</Link></li>
              <li><Link to="/dashboard" className="text-slate-400 hover:text-white transition-colors text-sm">My Dashboard</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-6">Company</h4>
            <ul className="flex flex-col gap-4">
              <li><a href={SITE.mainSiteUrl} className="text-slate-400 hover:text-white transition-colors text-sm">SatByte Main Site</a></li>
              <li><Link to="/" className="text-slate-400 hover:text-white transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link to="/" className="text-slate-400 hover:text-white transition-colors text-sm">Terms of Service</Link></li>
              <li><Link to="/" className="text-slate-400 hover:text-white transition-colors text-sm">Cookie Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-6">Contact Us</h4>
            <ul className="flex flex-col gap-5">
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span className="text-slate-400 text-sm">{SITE.email}</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <span className="text-slate-400 text-sm">{SITE.location}</span>
              </li>
              <li className="flex items-start gap-3">
                <Globe className="h-5 w-5 text-primary shrink-0" />
                <a href={SITE.mainSiteUrl} className="text-slate-400 hover:text-white transition-colors text-sm">services.satbyte.in</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-xs">
            © {currentYear} {SITE.parentName}. All rights reserved.
          </p>
          <div className="flex items-center gap-8">
            <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-600">
              Made with passion in India
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
