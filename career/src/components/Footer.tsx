import { Link } from 'react-router-dom'
import { Mail, Globe, ExternalLink, Rocket, ShieldCheck, Zap, Award } from 'lucide-react'
import { SITE } from '../lib/constants'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-[#020609] pt-32 pb-12 px-6 lg:px-8 border-t border-white/5 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
         <div className="absolute bottom-0 right-0 w-1/3 h-full bg-brand-blue/5 blur-[120px] rounded-full translate-x-1/2" />
         <div className="absolute top-0 left-0 w-1/4 h-full bg-brand-emerald/5 blur-[100px] rounded-full -translate-x-1/2" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 lg:gap-12 mb-24">
          {/* Brand & Mission */}
          <div className="flex flex-col gap-8">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="h-12 w-12 rounded-2xl bg-white text-black flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110">
                <Rocket className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-black text-2xl tracking-tighter text-white uppercase leading-none">
                  SatByte
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-blue">
                  Career Orbit
                </span>
              </div>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed font-medium">
              Empowering the next generation of engineers through high-impact career opportunities and industry-grade certifications.
            </p>
            <div className="flex items-center gap-4">
               <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all">
                  <ShieldCheck size={20} />
               </div>
               <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all">
                  <Zap size={20} />
               </div>
               <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all">
                  <Award size={20} />
               </div>
            </div>
          </div>

          {/* Portal Links */}
          <div className="lg:pl-8">
            <h4 className="text-white font-black text-[10px] uppercase tracking-[0.3em] mb-8">Career Hub</h4>
            <ul className="flex flex-col gap-4">
              <FooterLink to="/careers">Open Positions</FooterLink>
              <FooterLink to="/internships">Internships</FooterLink>
              <FooterLink to="/certifications">Certifications</FooterLink>
              <FooterLink to="/dashboard">Member Hub</FooterLink>
            </ul>
          </div>

          {/* Main Services */}
          <div>
            <h4 className="text-white font-black text-[10px] uppercase tracking-[0.3em] mb-8">Ecosystem</h4>
            <ul className="flex flex-col gap-4">
              <FooterLink href={`${SITE.mainSiteUrl}/services`}>Core Services</FooterLink>
              <FooterLink href={`${SITE.mainSiteUrl}/portfolio`}>Case Studies</FooterLink>
              <FooterLink href={`${SITE.mainSiteUrl}/pricing`}>Pricing Plans</FooterLink>
              <FooterLink href={`${SITE.mainSiteUrl}/about`}>Company Origin</FooterLink>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-black text-[10px] uppercase tracking-[0.3em] mb-8">Terminal</h4>
            <ul className="flex flex-col gap-8">
              <li className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-2xl bg-white/5 flex items-center justify-center text-brand-blue border border-white/5">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Email</span>
                  <span className="text-sm font-bold text-white">{SITE.email}</span>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-2xl bg-white/5 flex items-center justify-center text-brand-blue border border-white/5">
                  <Globe className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Global Terminal</span>
                  <a href={SITE.mainSiteUrl} className="text-sm font-bold text-white hover:text-brand-blue transition-colors flex items-center gap-2">
                    satbyte.in <ExternalLink size={12} className="opacity-50" />
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-white/40 text-[11px] font-black uppercase tracking-widest">
            © {currentYear} {SITE.parentName}. All Systems Operational.
          </p>
          <div className="flex items-center gap-8">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/10">
              Forged in Bihar, India
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterLink({ to, href, children }: any) {
  const Component = to ? Link : 'a'
  return (
    <li>
      <Component 
        to={to} 
        href={href} 
        className="text-white/40 hover:text-brand-blue transition-all hover:translate-x-1 inline-block text-xs font-black uppercase tracking-widest"
      >
        {children}
      </Component>
    </li>
  )
}
