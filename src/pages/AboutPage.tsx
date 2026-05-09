import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Code2, Cpu, Layout, Lightbulb, Rocket, ShieldCheck, Zap, Search, Palette, MessageSquare, Database, Layers, Cloud } from 'lucide-react'

import { SEO } from '@/components/SEO'
import { SITE } from '@/lib/constants'

import heroVisual from '@/assets/about_hero_visual.png'

const TECH_STACK = [
  { name: 'React', icon: Layout },
  { name: 'Node.js', icon: Cpu },
  { name: 'MongoDB', icon: Database },
  { name: 'Tailwind', icon: Palette },
  { name: 'Framer Motion', icon: Zap },
  { name: 'Cloud Native', icon: Cloud },
  { name: 'API First', icon: Layers },
]

const WHY_SATBYTE = [
  { title: 'Scalable Engineering', description: 'Systems built to handle growth without compromising stability.', icon: Layers },
  { title: 'Modern UI/UX', description: 'Design that feels intuitive and visually stunning.', icon: Palette },
  { title: 'Performance First', description: 'Lightweight builds with lightning-fast load times.', icon: Zap },
  { title: 'Clean Architecture', description: 'Maintainable code that doesn\'t slow down future features.', icon: Code2 },
  { title: 'Long-term Support', description: 'Partnerships that go beyond the initial launch.', icon: ShieldCheck },
  { title: 'Startup Focused', description: 'Speed and agility tailored for fast-moving founders.', icon: Rocket },
]

const PROCESS_STEPS = [
  { title: 'Discovery', description: 'Understanding your goals and user needs.', icon: Search },
  { title: 'Strategy', description: 'Mapping out the technical and design path.', icon: Lightbulb },
  { title: 'Design', description: 'Prototyping pixel-perfect user experiences.', icon: Palette },
  { title: 'Development', description: 'Crafting clean, production-ready code.', icon: Code2 },
  { title: 'Launch', description: 'Seamless deployment and optimization.', icon: Rocket },
  { title: 'Support', description: 'Active monitoring and iterative scaling.', icon: MessageSquare },
]

const STATS = [
  { label: 'Uptime SLA', value: '99.9%' },
  { label: 'Avg. Load Time', value: '<1.2s' },
  { label: 'Deployment Success', value: '100%' },
  { label: 'Client Satisfaction', value: '4.9/5' },
]

export default function AboutPage() {
  return (
    <div className="bg-background min-h-screen">
      <SEO 
        title="About Us" 
        description={`Building modern digital products at ${SITE.name}. Lead by ${SITE.owner}.`} 
        path="/about" 
      />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-6 block">Our Mission</span>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1] mb-8">
                Building modern digital products with <span className="text-primary">clean design</span> and scalable engineering.
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mb-10">
                At {SITE.name}, we believe every business deserves enterprise-grade technology. We combine aesthetic precision with rigorous engineering to build tools that drive growth.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/contact" className="px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
                  Start a Project
                </Link>
                <div className="flex items-center gap-4 px-4">
                   <div className="flex -space-x-2">
                     {[1,2,3].map(i => <div key={i} className="h-8 w-8 rounded-full border-2 border-background bg-secondary" />)}
                   </div>
                   <span className="text-sm font-medium text-muted-foreground">Trusted by 10+ founders</span>
                </div>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-square lg:aspect-video rounded-2xl overflow-hidden border border-border bg-secondary/30"
            >
               <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
               {/* Generated Premium Visual */}
               <img 
                 src={heroVisual} 
                 alt="SatByte Studio Visual"
                 className="w-full h-full object-cover opacity-80"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 px-4 border-t border-border bg-secondary/10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-8">The SatByte Story</h2>
          <div className="space-y-6 text-lg md:text-xl text-foreground leading-relaxed font-medium">
            <p>
              SatByte started with a simple observation: most small to medium businesses were being left behind by the rapid pace of digital transformation.
            </p>
            <p>
              Founded by {SITE.owner}, we set out to build a studio that combines the agility of a startup with the discipline of an enterprise engineering firm.
            </p>
            <p>
              Today, we are a small but focused team of engineers and designers dedicated to one thing: building products that matter.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { label: 'Mission', title: 'Empower growth through technology.', content: 'Our mission is to provide businesses with the technical tools they need to compete on a global scale.' },
              { label: 'Vision', title: 'The standard for modern studio.', content: 'We aim to become the leading choice for founders who value quality, transparency, and speed.' },
              { label: 'Philosophy', title: 'Code is a means to an end.', content: 'We don\'t just write code; we solve business problems. Every line we ship must deliver measurable value.' }
            ].map((item) => (
              <div key={item.label} className="space-y-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{item.label}</span>
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{item.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why SatByte */}
      <section className="py-24 px-4 bg-secondary/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Why founders choose SatByte</h2>
            <p className="text-muted-foreground">Engineering excellence meets modern product strategy.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {WHY_SATBYTE.map((item) => (
               <div key={item.title} className="p-8 rounded-2xl border border-border bg-background hover:border-primary/50 transition-colors group">
                  <item.icon className="h-6 w-6 text-primary mb-6 transition-transform group-hover:scale-110" />
                  <h4 className="text-lg font-bold mb-3">{item.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Our Process</h2>
            <p className="text-muted-foreground">A rigorous approach to building digital products.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-8 relative">
             <div className="hidden md:block absolute top-10 left-0 w-full h-px bg-border -z-10" />
             {PROCESS_STEPS.map((step) => (
               <div key={step.title} className="flex flex-col items-center text-center bg-background px-4">
                  <div className="h-20 w-20 rounded-2xl bg-secondary/50 border border-border flex items-center justify-center text-primary mb-6">
                    <step.icon className="h-8 w-8" />
                  </div>
                  <h4 className="text-sm font-bold mb-2">{step.title}</h4>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">{step.description}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-24 px-4 bg-secondary/10 border-y border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-md">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Built with a modern stack.</h2>
              <p className="text-muted-foreground leading-relaxed">
                We use the latest technologies to ensure your product is fast, secure, and ready to scale from day one.
              </p>
            </div>
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4">
               {TECH_STACK.map((tech) => (
                 <div key={tech.name} className="flex flex-col items-center gap-3 p-6 rounded-xl border border-border bg-background">
                    <tech.icon className="h-6 w-6 text-primary" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">{tech.name}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <span className="text-sm font-bold text-primary mb-6 block uppercase tracking-widest">The Founder's Note</span>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-8">Building for the long term.</h2>
              <div className="space-y-6 text-muted-foreground leading-relaxed text-lg italic border-l-4 border-primary pl-8">
                <p>
                  "At {SITE.name}, we don't just ship features. We ship confidence. My goal is to build a studio where founders feel like they have a technical co-founder, not just a service provider."
                </p>
              </div>
              <div className="mt-12 flex items-center gap-4">
                 <div>
                   <h4 className="font-bold text-foreground">{SITE.owner}</h4>
                   <p className="text-sm text-muted-foreground">Founder & Lead Engineer</p>
                 </div>
              </div>
            </div>
            <div className="order-1 lg:order-2 flex justify-center">
               <div className="relative w-80 h-80 lg:w-96 lg:h-96">
                  <div className="absolute inset-0 bg-primary/20 rounded-[3rem] rotate-6" />
                  <div className="absolute inset-0 bg-background border-2 border-border rounded-[3rem] overflow-hidden">
                    <img 
                      src={SITE.ownerImage} 
                      alt={SITE.owner}
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" 
                    />
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-4 border-y border-border bg-secondary/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
             {STATS.map((stat) => (
               <div key={stat.label} className="text-center">
                  <p className="text-4xl font-extrabold text-foreground mb-2">{stat.value}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
           <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-8">Let's build something meaningful together.</h2>
           <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
             Ready to take your product from idea to production? We're currently accepting new projects for {new Date().getFullYear()}.
           </p>
           <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
             <Link to="/contact" className="w-full sm:w-auto px-10 py-4 rounded-xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
               Start a Project <ArrowRight className="h-5 w-5" />
             </Link>
             <Link to="/portfolio" className="w-full sm:w-auto px-10 py-4 rounded-xl bg-background border border-border font-bold hover:bg-secondary transition-all">
               View Work
             </Link>
           </div>
        </div>
      </section>
    </div>
  )
}

