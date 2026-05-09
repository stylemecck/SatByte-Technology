import { motion } from 'framer-motion'
import { ExternalLink, Zap, Globe, Cpu, Layout, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const FEATURES = [
  { icon: Globe, label: '80+ Tools', desc: 'Comprehensive utility ecosystem' },
  { icon: Zap, label: 'Fast Processing', desc: 'Client-side browser performance' },
  { icon: Layout, label: 'Modern UI', desc: 'Responsive & intuitive design' },
  { icon: Cpu, label: 'Zero Install', desc: 'No-installation web access' },
]

const STATS = [
  { value: '80+', label: 'Utilities' },
  { value: '100%', label: 'Browser-Based' },
  { value: 'Zero', label: 'Installation' },
]

export function FlagshipProduct() {
  return (
    <section className="relative overflow-hidden bg-background py-24 sm:py-32 border-b border-border">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] -z-10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 lg:items-center">
          
          {/* Left Content */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Badge variant="outline" className="mb-6 border-primary/20 text-primary bg-primary/5 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
                Flagship Product
              </Badge>
              
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-6">
                Toolkit — <br />
                <span className="text-muted-foreground">The Utility Platform for Modern Teams.</span>
              </h2>
              
              <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-xl">
                A scalable collection of modern developer, SEO, productivity, and web utilities built for speed, simplicity, and real-world workflows. No installation required.
              </p>

              {/* Features Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                {FEATURES.map((f) => (
                  <div key={f.label} className="flex gap-4 group">
                    <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-secondary border border-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      <f.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-foreground mb-1">{f.label}</h4>
                      <p className="text-xs text-muted-foreground leading-snug">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Stats Bar */}
              <div className="flex flex-wrap gap-8 py-8 border-y border-border/50 mb-10">
                {STATS.map(s => (
                  <div key={s.label}>
                    <p className="text-2xl font-black text-foreground mb-1">{s.value}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="rounded-xl font-bold px-8 h-14 bg-primary text-primary-foreground shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform">
                  <a href="https://toolkit.satbyte.in" target="_blank" rel="noopener noreferrer">
                    Live Demo <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button variant="outline" size="lg" className="rounded-xl font-bold px-8 h-14 border-border bg-background/50 hover:bg-secondary transition-all">
                  <a href="https://toolkit.satbyte.in/tools" target="_blank" rel="noopener noreferrer">
                    Explore Tools
                  </a>
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Right Preview */}
          <div className="w-full lg:w-1/2 relative">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative"
            >
              {/* Browser Mockup */}
              <div className="relative rounded-2xl border border-border bg-card shadow-2xl overflow-hidden group">
                {/* Browser Header */}
                <div className="h-10 bg-secondary/80 border-b border-border flex items-center px-4 gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/30" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/30" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/30" />
                  </div>
                  <div className="flex-1 max-w-[200px] h-6 bg-background/50 rounded-md border border-border/50 mx-auto flex items-center px-3">
                    <div className="text-[10px] text-muted-foreground font-mono">toolkit.satbyte.in</div>
                  </div>
                </div>
                
                {/* Dashboard Image */}
                <div className="aspect-[14/10] relative overflow-hidden bg-background">
                  <img 
                    src="/toolkit-preview.png" 
                    alt="Toolkit Dashboard" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  
                  {/* Floating UI Elements (Subtle Overlays) */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-6 left-6 p-4 rounded-2xl bg-background/90 border border-border backdrop-blur-xl shadow-2xl flex items-center gap-3 z-10"
                  >
                    <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-foreground">Lightweight</p>
                      <p className="text-[8px] text-muted-foreground">Fast Browser Processing</p>
                    </div>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute top-12 right-6 p-4 rounded-2xl bg-background/90 border border-border backdrop-blur-xl shadow-2xl flex items-center gap-3 z-10"
                  >
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <Cpu className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-foreground">Scalable Architecture</p>
                      <p className="text-[8px] text-muted-foreground">React + Vite + Tailwind</p>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Decorative Glow */}
              <div className="absolute inset-0 -z-10 bg-primary/10 blur-[80px] rounded-full scale-90" />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}
