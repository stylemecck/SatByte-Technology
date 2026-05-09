import { motion } from 'framer-motion'
import { Download, ShieldCheck, Smartphone, Zap, Globe, Monitor, Terminal, Shield, RefreshCw, ArrowRight, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const PLATFORMS = [
  {
    name: 'Windows',
    icon: Monitor,
    version: 'v1.2.0-stable',
    size: '42.5 MB',
    compatibility: 'Windows 10/11',
    downloadUrl: '#',
    isComingSoon: true,
  },
  {
    name: 'Android',
    icon: Smartphone,
    version: 'v1.0.1-prod',
    size: '5.9 MB',
    compatibility: 'Android 8.0+',
    downloadUrl: '/satbyte-v1.0.1.apk',
    isComingSoon: false,
  },
  {
    name: 'Web App',
    icon: Globe,
    version: 'Cloud v2.4',
    size: 'N/A',
    compatibility: 'Chrome, Safari, Edge',
    downloadUrl: '/client-login',
    isComingSoon: false,
  },
]

const FEATURES = [
  { icon: Zap, title: "Engineered for Speed", description: "Sub-100ms sync times and optimized resource management." },
  { icon: Shield, title: "Enterprise Security", description: "End-to-end encryption for all project data and communication." },
  { icon: RefreshCw, title: "Cloud Sync", description: "Work offline and sync automatically across all your devices." }
]

const SETUP_STEPS = [
  { title: 'Download', desc: 'Get the installer for your OS.' },
  { title: 'Install', desc: 'Run the setup and follow prompts.' },
  { title: 'Setup', desc: 'Login or create your studio account.' },
  { title: 'Build', desc: 'Start creating your next big product.' }
]

const FAQ_ITEMS = [
  { q: 'Is the Windows version secure?', a: 'Yes, all our installers are code-signed and scanned for security before release.' },
  { q: 'How do I update the app?', a: 'The app features an auto-updater that will notify you when a new stable build is available.' },
  { q: 'Can I use the web app on mobile?', a: 'Yes, our web app is fully responsive, though we recommend the Android app for the best experience.' }
]

export default function DownloadAppPage() {
  return (
    <div className="bg-background min-h-screen text-foreground">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/4" />
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Badge variant="outline" className="px-4 py-1 rounded-full border-primary/30 bg-primary/5 text-primary mb-6 font-bold">
              v1.2.0 Available Now
            </Badge>
            <h1 className="text-5xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-8">
              Download SatByte and <br className="hidden md:block" />
              <span className="text-primary">Build Faster.</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10">
              The professional environment for managing your software studio, team assets, and client projects — synced across every device.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
               <Button size="lg" className="h-14 px-8 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20">
                 Get Started Free
               </Button>
               <Button variant="outline" size="lg" className="h-14 px-8 rounded-xl border-border hover:bg-secondary font-bold">
                 View Documentation
               </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Platform Cards Grid */}
      <section className="py-24 px-4 bg-secondary/5 border-y border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {PLATFORMS.map((platform) => (
               <Card key={platform.name} className="p-8 rounded-[2rem] border-border bg-background hover:border-primary/40 transition-all group relative overflow-hidden">
                  <div className="flex items-center gap-4 mb-8">
                     <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <platform.icon className="h-6 w-6" />
                     </div>
                     <div>
                        <h3 className="font-bold text-lg">{platform.name}</h3>
                        <p className="text-xs text-muted-foreground">{platform.compatibility}</p>
                     </div>
                  </div>
                  
                  <div className="space-y-4 mb-8">
                     <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Version</span>
                        <span className="font-bold">{platform.version}</span>
                     </div>
                     <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">File Size</span>
                        <span className="font-bold">{platform.size}</span>
                     </div>
                  </div>

                  {platform.isComingSoon ? (
                    <Button disabled className="w-full h-12 rounded-xl opacity-50 cursor-not-allowed">
                       Coming Soon
                    </Button>
                  ) : (
                    <a href={platform.downloadUrl} className="block w-full">
                       <Button className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-bold flex items-center justify-center gap-2">
                          {platform.name === 'Web App' ? <ExternalLink className="h-4 w-4" /> : <Download className="h-4 w-4" />}
                          {platform.name === 'Web App' ? 'Launch Web App' : `Download for ${platform.name}`}
                       </Button>
                    </a>
                  )}
                  
                  <div className="mt-4 flex items-center gap-2 justify-center">
                     <ShieldCheck className="h-3 w-3 text-primary" />
                     <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Verified & Secure</span>
                  </div>
               </Card>
             ))}
          </div>
        </div>
      </section>

      {/* Quick Setup Onboarding */}
      <section className="py-24 px-4">
         <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-16">Get started in minutes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 relative">
               <div className="hidden lg:block absolute top-6 left-1/4 right-1/4 h-[1px] bg-border -z-10" />
               {SETUP_STEPS.map((step, i) => (
                 <div key={step.title} className="space-y-4">
                    <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto font-bold shadow-lg shadow-primary/20">
                       {i + 1}
                    </div>
                    <h4 className="font-bold">{step.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Feature Showcase */}
      <section className="py-24 px-4 bg-secondary/10 border-y border-border">
         <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
               <div className="space-y-8">
                  <h2 className="text-4xl font-bold leading-tight">Built for modern <br /> product teams.</h2>
                  <div className="grid gap-6">
                     {FEATURES.map(f => (
                       <div key={f.title} className="flex gap-4">
                          <div className="h-10 w-10 shrink-0 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                             <f.icon className="h-5 w-5" />
                          </div>
                          <div>
                             <h4 className="font-bold text-sm">{f.title}</h4>
                             <p className="text-xs text-muted-foreground leading-relaxed">{f.description}</p>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
               <div className="relative">
                  <div className="aspect-video bg-secondary/30 rounded-3xl border border-border overflow-hidden p-4 relative group">
                     <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                     <div className="h-full w-full bg-background/50 rounded-2xl border border-border/50 p-6">
                        <div className="flex items-center gap-2 mb-6">
                           <div className="h-3 w-3 rounded-full bg-red-500/50" />
                           <div className="h-3 w-3 rounded-full bg-amber-500/50" />
                           <div className="h-3 w-3 rounded-full bg-green-500/50" />
                        </div>
                        <div className="space-y-4">
                           <div className="h-4 w-2/3 bg-primary/10 rounded" />
                           <div className="h-4 w-full bg-primary/5 rounded" />
                           <div className="h-24 w-full bg-primary/5 rounded-xl border border-primary/10 flex items-center justify-center">
                              <Terminal className="h-8 w-8 text-primary opacity-30" />
                           </div>
                        </div>
                     </div>
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button className="rounded-full gap-2">View Demo <ArrowRight className="h-4 w-4" /></Button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* System Requirements */}
      <section className="py-24 px-4">
         <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center">System Requirements</h2>
            <div className="rounded-2xl border border-border overflow-hidden">
               <table className="w-full text-sm">
                  <tbody className="divide-y divide-border">
                     <tr className="bg-secondary/20">
                        <td className="p-4 font-bold text-muted-foreground uppercase tracking-widest text-[10px]">Component</td>
                        <td className="p-4 font-bold text-muted-foreground uppercase tracking-widest text-[10px]">Requirement</td>
                     </tr>
                     <tr>
                        <td className="p-4 font-medium">Desktop OS</td>
                        <td className="p-4 text-muted-foreground">Windows 10+, macOS 11+, Linux (Ubuntu 20+)</td>
                     </tr>
                     <tr>
                        <td className="p-4 font-medium">Memory</td>
                        <td className="p-4 text-muted-foreground">4GB RAM (8GB recommended)</td>
                     </tr>
                     <tr>
                        <td className="p-4 font-medium">Storage</td>
                        <td className="p-4 text-muted-foreground">200MB free space</td>
                     </tr>
                     <tr>
                        <td className="p-4 font-medium">Browsers</td>
                        <td className="p-4 text-muted-foreground">Chrome, Safari, Firefox, Edge (Current versions)</td>
                     </tr>
                  </tbody>
               </table>
            </div>
         </div>
      </section>

      {/* FAQ & Support */}
      <section className="py-24 px-4 bg-secondary/5 border-t border-border">
         <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
               <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-4">
               {FAQ_ITEMS.map(faq => (
                 <div key={faq.q} className="p-6 rounded-2xl border border-border bg-background">
                    <h4 className="font-bold mb-2 text-sm">{faq.q}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-4 border-t border-border">
         <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-8">Ready to experience SatByte?</h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
               <Button size="lg" className="h-14 px-10 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20">
                 Download Now
               </Button>
               <Link to="/contact">
                  <Button variant="outline" size="lg" className="h-14 px-10 rounded-xl border-border font-bold">
                    Contact Support
                  </Button>
               </Link>
            </div>
            <p className="mt-8 text-xs text-muted-foreground uppercase tracking-[0.4em]">Engineered for high-performance teams</p>
         </div>
      </section>
    </div>
  )
}

