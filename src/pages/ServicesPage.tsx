import { motion } from 'framer-motion'
import { ArrowRight, Zap, Layers, LayoutDashboard, Palette, ShieldCheck, Cpu, Cloud, Globe, MessageSquare, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

import { SEO } from '@/components/SEO'
import { cn } from '@/lib/utils'

const PREMIUM_SERVICES = [
  {
    title: 'Custom SaaS Platforms',
    description: 'End-to-end product engineering for high-growth software companies. We build multi-tenant, secure, and scalable architectures.',
    tech: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
    deliverables: ['Product Architecture', 'Auth Systems', 'API Integration', 'Cloud Deployment'],
    icon: Layers,
    color: 'from-blue-500/20 to-blue-500/5',
  },
  {
    title: 'Scalable Business Dashboards',
    description: 'Data-intensive internal tools and dashboards that streamline operations and provide real-time business intelligence.',
    tech: ['Next.js', 'TypeScript', 'Tailwind', 'Charts.js'],
    deliverables: ['Real-time Analytics', 'Role Management', 'Data Viz', 'Automated Reports'],
    icon: LayoutDashboard,
    color: 'from-violet-500/20 to-violet-500/5',
  },
  {
    title: 'High-Performance Web Apps',
    description: 'Conversion-optimized web experiences built with modern frameworks for sub-second load times and global reach.',
    tech: ['Vite', 'React', 'Framer Motion', 'SEO'],
    deliverables: ['Core Web Vitals Opt.', 'Bespoke UI', 'PWA Support', 'Global CDN'],
    icon: Globe,
    color: 'from-emerald-500/20 to-emerald-500/5',
  },
  {
    title: 'Modern UI/UX Design Systems',
    description: 'Scalable design languages that ensure brand consistency across all digital touchpoints and product modules.',
    tech: ['Figma', 'React', 'Storybook', 'Tokens'],
    deliverables: ['Component Library', 'Interactive Prototype', 'Style Guide', 'Asset Kit'],
    icon: Palette,
    color: 'from-amber-500/20 to-amber-500/5',
  },
  {
    title: 'AI-Integrated Solutions',
    description: 'Boosting digital products with LLM capabilities, intelligent search, and automated customer success workflows.',
    tech: ['OpenAI API', 'VectorDB', 'LangChain', 'Python'],
    deliverables: ['Smart Search', 'AI Chatbots', 'Workflow Automation', 'Prompt Eng.'],
    icon: Cpu,
    color: 'from-cyan-500/20 to-cyan-500/5',
  },
  {
    title: 'Enterprise Cloud Strategy',
    description: 'Robust infrastructure planning and migration to ensure zero-downtime, security compliance, and cost efficiency.',
    tech: ['Vercel', 'AWS', 'Docker', 'CI/CD'],
    deliverables: ['Security Audit', 'Migration Plan', 'Serverless Setup', 'Cost Optimization'],
    icon: Cloud,
    color: 'from-pink-500/20 to-pink-500/5',
  },
]

const PROCESS_STEPS = [
  { name: 'Discovery', desc: 'Understanding goals & requirements.' },
  { name: 'Planning', desc: 'Architecture & UX wireframing.' },
  { name: 'UI/UX Design', desc: 'High-fidelity visual systems.' },
  { name: 'Development', desc: 'Clean, agile engineering cycles.' },
  { name: 'Testing', desc: 'Quality assurance & edge cases.' },
  { name: 'Launch', desc: 'Production deployment & SEO.' },
  { name: 'Support', desc: 'Ongoing maintenance & growth.' }
]

const STATS = [
  { label: 'Deployment Uptime', value: '99.9%' },
  { label: 'Avg. Response Time', value: '< 12h' },
  { label: 'Customer Satisfaction', value: '100%' },
  { label: 'Tech Stack Mastery', value: '15+' }
]

const FAQ_ITEMS = [
  { q: 'What is your typical project timeline?', a: 'Standard web apps take 4-8 weeks, while complex SaaS platforms usually range from 3-6 months.' },
  { q: 'How do you ensure code quality?', a: 'We follow strict TypeScript standards, modular architecture, and thorough peer reviews for every line of code.' },
  { q: 'Do you offer custom pricing?', a: 'Yes, we provide flexible engagement models including fixed-price projects and dedicated engineering retainers.' },
  { q: 'Can you work with my existing tech team?', a: 'Absolutely. We often act as an extension of internal teams to provide specialized expertise or extra capacity.' }
]

export default function ServicesPage() {
  return (
    <div className="bg-background min-h-screen">
      <SEO 
        title="Our Services" 
        description="Premium software studio services: SaaS platforms, business dashboards, and scalable web engineering." 
        path="/services" 
      />

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-4 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-10 translate-x-1/3 -translate-y-1/3" />
        <div className="max-w-7xl mx-auto text-center lg:text-left grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
             <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-6 block">Our Capabilities</span>
             <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1] mb-8">
               Modern Digital Solutions Built for <span className="text-primary">Scale.</span>
             </h1>
             <p className="text-xl text-muted-foreground leading-relaxed max-w-xl mb-10 mx-auto lg:mx-0">
               We help startups and enterprises build high-performance SaaS products, scalable web platforms, and digital systems that drive business growth.
             </p>
             <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
               <Link to="/contact" className="w-full sm:w-auto px-10 py-4 rounded-xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
                 Start a Project
               </Link>
               <Link to="/pricing" className="w-full sm:w-auto px-10 py-4 rounded-xl bg-background border border-border font-bold hover:bg-secondary transition-all flex items-center justify-center gap-2">
                 Book Consultation <ArrowRight className="h-5 w-5" />
               </Link>
             </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="hidden lg:block relative"
          >
             <div className="bg-secondary/20 border border-border rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden group">
                <div className="flex items-center gap-2 mb-6">
                   <div className="w-3 h-3 rounded-full bg-red-500/50" />
                   <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                   <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                <div className="space-y-4">
                   <div className="h-4 w-2/3 bg-primary/20 rounded-lg animate-pulse" />
                   <div className="h-32 w-full bg-secondary/50 rounded-xl flex items-center justify-center border border-border/50">
                      <Zap className="h-8 w-8 text-primary animate-pulse" />
                   </div>
                   <div className="grid grid-cols-3 gap-4">
                      <div className="h-10 bg-primary/10 rounded-lg" />
                      <div className="h-10 bg-primary/10 rounded-lg" />
                      <div className="h-10 bg-primary/10 rounded-lg" />
                   </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-50" />
             </div>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 px-4 bg-secondary/5 border-y border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Strategic Solutions</h2>
            <p className="text-muted-foreground text-lg">Outcome-focused engineering for modern teams.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PREMIUM_SERVICES.map((s, i) => (
              <motion.div 
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative flex flex-col p-8 rounded-3xl border border-border bg-background hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
              >
                <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10", s.color)} />
                <div className="h-12 w-12 rounded-2xl bg-secondary border border-border flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform duration-500">
                   <s.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-4">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-8 flex-1">{s.description}</p>
                
                <div className="space-y-6 mb-8">
                   <div>
                     <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">Core Stack</p>
                     <div className="flex flex-wrap gap-2">
                        {s.tech.map(t => <span key={t} className="text-[10px] font-medium px-2 py-1 rounded-md bg-secondary border border-border">{t}</span>)}
                     </div>
                   </div>
                   <div>
                     <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">Key Deliverables</p>
                     <ul className="space-y-1.5">
                        {s.deliverables.map(d => (
                          <li key={d} className="flex items-center gap-2 text-[11px] text-muted-foreground">
                            <CheckCircle2 className="h-3 w-3 text-primary" />
                            {d}
                          </li>
                        ))}
                     </ul>
                   </div>
                </div>

                <Link to="/contact" className="inline-flex items-center gap-2 text-sm font-bold group-hover:text-primary transition-colors">
                  Start Inquiry <ChevronRight className="h-4 w-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why SatByte */}
      <section className="py-24 px-4 border-b border-border">
        <div className="max-w-7xl mx-auto">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                 <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-8">Why engineering leaders <br className="hidden md:block" /> choose SatByte.</h2>
                 <p className="text-lg text-muted-foreground leading-relaxed mb-10">
                   We don't just build features; we build high-performance systems that are maintainable, secure, and ready for your next 100,000 users.
                 </p>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {[
                      { icon: ShieldCheck, title: 'Scalable Architecture', desc: 'Enterprise-grade systems built for high-concurrency growth.' },
                      { icon: MessageSquare, title: 'Startup-First Workflow', desc: 'Agile development cycles that prioritize speed-to-market.' }
                    ].map(item => (
                      <div key={item.title}>
                         <item.icon className="h-6 w-6 text-primary mb-4" />
                         <h4 className="font-bold mb-2">{item.title}</h4>
                         <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 {STATS.map(stat => (
                   <div key={stat.label} className="p-8 rounded-3xl border border-border bg-secondary/10 text-center">
                      <p className="text-3xl md:text-4xl font-extrabold text-foreground mb-2">{stat.value}</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 px-4 bg-secondary/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl font-bold tracking-tight mb-4">The Development Lifecycle</h2>
            <p className="text-muted-foreground">From initial discovery to long-term support.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            {PROCESS_STEPS.map((step, i) => (
              <div key={step.name} className="relative p-6 rounded-2xl border border-border bg-background group hover:border-primary/30 transition-all">
                <span className="text-[10px] font-bold text-primary mb-4 block">Step 0{i + 1}</span>
                <h4 className="font-bold mb-2 text-sm">{step.name}</h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Grid */}
      <section className="py-24 px-4 border-y border-border">
        <div className="max-w-7xl mx-auto text-center">
           <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-muted-foreground mb-16">Preferred Tech Stack</h2>
           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 items-center opacity-60">
              {['React', 'Next.js', 'Node.js', 'TypeScript', 'PostgreSQL', 'Tailwind', 'AWS', 'Vercel'].map(tech => (
                <div key={tech} className="text-lg font-extrabold tracking-tight text-foreground/80">{tech}</div>
              ))}
           </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-4 bg-secondary/5">
         <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
               <HelpCircle className="h-10 w-10 text-primary mx-auto mb-4" />
               <h2 className="text-3xl font-bold tracking-tight">Project FAQs</h2>
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
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-8">Ready to build your next scalable digital product?</h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
               <Link to="/contact" className="w-full sm:w-auto px-10 py-4 rounded-xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
                 Start Your Project
               </Link>
               <Link to="/contact" className="w-full sm:w-auto px-10 py-4 rounded-xl bg-background border border-border font-bold hover:bg-secondary transition-all">
                 Contact SatByte
               </Link>
            </div>
         </div>
      </section>
    </div>
  )
}

