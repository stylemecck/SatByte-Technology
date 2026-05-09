import { motion } from 'framer-motion'
import { Star, CheckCircle2, ArrowRight, Quote, MessageSquare, ShieldCheck, Zap, Globe, Users, Palette, Rocket, User } from 'lucide-react'
import { Link } from 'react-router-dom'

import { SEO } from '@/components/SEO'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const FEATURED_STORIES = [
  {
    client: 'Unique ITI Pvt Ltd',
    title: 'Modernizing Vocational Education',
    challenge: 'Managing student records and certification across their Hajipur campus was manual and time-consuming.',
    solution: 'Developed a custom ERP system for student attendance, fee management, and digital certification tracking.',
    outcome: 'Streamlined operations for Director Lakshmi Bhakta & Swetank Kushwaha, achieving 100% record accuracy.',
    tech: ['React', 'Node.js', 'PostgreSQL'],
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80',
  },
  {
    client: 'Starlight E-commerce',
    title: 'Scaling for Global Demand',
    challenge: 'Existing platform crashed during peak sales and lacked mobile optimization.',
    solution: 'Rebuilt the storefront using Next.js with a headless architecture and global CDN integration.',
    outcome: 'Achieved sub-100ms load times and a 25% increase in mobile conversion rates.',
    tech: ['Next.js', 'Stripe', 'Tailwind CSS'],
    image: 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?w=800&q=80',
  },
  {
    client: 'Regional Science College',
    title: 'Digital Admissions & Information Hub',
    challenge: 'Manual admission workflows were causing delays and information gaps for prospective students.',
    solution: 'Built a comprehensive portal for admissions, department details, real-time notifications, and student information.',
    outcome: 'Transformed the admission process into a seamless digital experience with 24/7 information access.',
    tech: ['React', 'TypeScript', 'Framer Motion'],
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80',
  }
]

const DETAILED_TESTIMONIALS = [
  {
    name: 'Ar. Nirupita Kumari',
    role: 'Principal & Owner',
    company: 'Unique ITI / Unique Architech',
    quote: 'SatByte transformed how we manage our institution and architectural projects. The custom systems they built for Unique ITI and Unique Architech are intuitive and powerful.',
    outcome: '100% Digital Workflow',
    service: 'Enterprise ERP',
    avatar: '',
    rating: 5
  },
  {
    name: 'Lakshmi Bhakta',
    role: 'Director',
    company: 'Unique ITI Pvt Ltd',
    quote: 'The ERP solution provided by SatByte has significantly reduced our administrative workload in Hajipur. Their team is professional and highly skilled.',
    outcome: '50% Faster Certification',
    service: 'ERP Development',
    avatar: '',
    rating: 5
  },
  {
    name: 'Priya Singh',
    role: 'Founder',
    company: 'Starlight Boutique',
    quote: 'Our online store looks premium and loads fast on phones. Sales inquiries doubled within the first month. They understood our brand perfectly.',
    outcome: '2x Sales Leads',
    service: 'E-commerce',
    avatar: '',
    rating: 5
  },
  {
    name: 'Amit Verma',
    role: 'Partner',
    company: 'Verma & Associates',
    quote: 'Professional, transparent, and strong on detail. The billing workflow they built saves hours every week. Truly an extension of our team.',
    outcome: '15hrs/week saved',
    service: 'Internal Tools',
    avatar: '',
    rating: 5
  },
  {
    name: 'Neha Kumari',
    role: 'Marketing Head',
    company: 'Global Retailers',
    quote: 'SEO and landing pages were structured properly from day one. We saw steady growth in qualified leads and much better search visibility.',
    outcome: 'Top 3 Search Rank',
    service: 'Technical SEO',
    avatar: '',
    rating: 5
  },
  {
    name: 'Vikash Patel',
    role: 'CTO',
    company: 'TechFlow Systems',
    quote: 'Clear communication and modern tech choices. SatByte felt like an extension of our team, handling our cloud migration flawlessly.',
    outcome: 'Zero Migration Downtime',
    service: 'Cloud Strategy',
    avatar: '',
    rating: 5
  },
  {
    name: 'Suresh Kumar',
    role: 'Operations Director',
    company: 'Loomis Logistics',
    quote: 'The real-time tracking dashboard has transformed how we manage our fleet. The UI is intuitive and the backend is rock solid.',
    outcome: '100% Data Accuracy',
    service: 'SaaS Platform',
    avatar: '',
    rating: 5
  }
]

const LOGOS = [
  { name: 'Unique ITI', icon: Globe },
  { name: 'Unique Architech', icon: Zap },
  { name: 'Starlight', icon: Zap },
  { name: 'Global Retail', icon: ShieldCheck },
  { name: 'Verma & Co', icon: Users },
  { name: 'Loomis', icon: ShieldCheck },
]

export default function TestimonialsPage() {
  return (
    <div className="bg-background min-h-screen text-foreground overflow-hidden">
      <SEO
        title="Success Stories & Testimonials"
        description="Explore how SatByte helps founders and businesses build high-performance digital products through clean design and scalable engineering."
        path="/testimonials"
      />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-10 translate-x-1/3 -translate-y-1/3" />
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className="px-4 py-1 rounded-full border-primary/30 bg-primary/5 text-primary mb-6 font-bold uppercase tracking-widest text-[10px]">
              The Proof of Progress
            </Badge>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] mb-8">
              Trusted by founders, <br className="hidden md:block" />
              <span className="text-primary text-glow">creators & businesses.</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10">
              We help ambitious teams build scalable digital products with a focus on high-end engineering and conversion-driven design.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="h-14 px-10 rounded-xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                <Link to="/contact">Start Your Project</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-14 px-10 rounded-xl border-border hover:bg-secondary font-bold hover:scale-[1.02] active:scale-95 transition-all">
                <Link to="/contact">Work With SatByte</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Stats Bar */}
      <section className="py-12 border-y border-border bg-secondary/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: 'Successful Launches', value: '25+', icon: CheckCircle2 },
              { label: 'Client Satisfaction', value: '100%', icon: Users },
              { label: 'Avg. Load Time', value: '< 1.2s', icon: Zap },
              { label: 'Direct Support', value: '24/7', icon: MessageSquare },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <div className="flex items-center gap-2 mb-2 text-primary">
                  <stat.icon className="h-4 w-4" />
                  <span className="text-2xl font-black tracking-tighter text-foreground">{stat.value}</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Monochrome Logo Wall */}
      <section className="py-20 px-4 border-b border-border">
        <div className="max-w-5xl mx-auto opacity-30 grayscale contrast-125">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-12 items-center justify-items-center">
             {LOGOS.map((logo, i) => (
               <div key={i} className="flex items-center gap-2 font-black text-xl tracking-tighter">
                  <logo.icon className="h-6 w-6" />
                  <span>{logo.name}</span>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Featured Client Stories */}
      <section className="py-24 px-4 bg-secondary/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-4 block">Featured Outcomes</span>
              <h2 className="text-4xl font-black tracking-tight leading-[1.1]">Transforming visions into <br className="hidden md:block" /> high-performance reality.</h2>
            </div>
            <Link to="/portfolio" className="text-sm font-bold text-primary flex items-center gap-2 hover:underline">
              Explore Full Portfolio <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-12">
            {FEATURED_STORIES.map((story, i) => (
              <motion.div
                key={story.client}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "flex flex-col lg:flex-row gap-12 items-center bg-background border border-border p-8 lg:p-12 rounded-[2.5rem] relative overflow-hidden group",
                  i % 2 !== 0 && "lg:flex-row-reverse"
                )}
              >
                <div className="flex-1 space-y-8 z-10">
                   <div className="space-y-2">
                     <Badge variant="secondary" className="bg-primary/10 text-primary border-none font-bold px-3 py-1">{story.client}</Badge>
                     <h3 className="text-3xl font-bold">{story.title}</h3>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">The Challenge</p>
                        <p className="text-sm text-foreground/80 leading-relaxed">{story.challenge}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Our Solution</p>
                        <p className="text-sm text-foreground/80 leading-relaxed">{story.solution}</p>
                      </div>
                   </div>

                   <div className="p-6 rounded-2xl bg-secondary/30 border border-primary/10">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-3">The Outcome</p>
                      <p className="text-lg font-bold text-foreground leading-snug">{story.outcome}</p>
                   </div>

                   <div className="flex flex-wrap gap-2">
                      {story.tech.map(t => <span key={t} className="px-3 py-1 rounded-full bg-secondary border border-border text-[10px] font-bold">{t}</span>)}
                   </div>
                </div>
                
                <div className="flex-1 w-full aspect-[4/3] rounded-[1.5rem] overflow-hidden border border-border relative">
                   <img src={story.image} alt={story.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                   <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Testimonial Grid */}
      <section className="py-24 px-4 border-y border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">Market leaders speak.</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Honest feedback from the engineering leaders and founders we partner with.</p>
          </div>

          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {DETAILED_TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="break-inside-avoid"
              >
                <Card className="border-border bg-background/50 hover:bg-card transition-all duration-300 group rounded-[2rem] overflow-hidden">
                  <CardContent className="p-8">
                    <div className="flex gap-1 text-amber-400 mb-6">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-current" />
                      ))}
                    </div>
                    
                    <div className="relative mb-8">
                       <Quote className="absolute -top-4 -left-4 h-8 w-8 text-primary/10 -z-10" />
                       <p className="text-lg font-medium leading-relaxed italic">“{t.quote}”</p>
                    </div>

                    <div className="flex items-center justify-between py-4 border-y border-border/50 mb-8">
                       <div className="space-y-1">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Outcome</p>
                          <p className="text-xs font-bold">{t.outcome}</p>
                       </div>
                       <div className="text-right space-y-1">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Service</p>
                          <p className="text-xs font-bold">{t.service}</p>
                       </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-primary/20 bg-secondary flex items-center justify-center">
                        {t.avatar ? (
                          <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                        ) : (
                          <User className="h-6 w-6 text-primary/60" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-sm leading-none mb-1">{t.name}</p>
                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{t.role} @ {t.company}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Clients Trust SatByte */}
      <section className="py-24 px-4 bg-secondary/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Why founders choose SatByte.</h2>
            <p className="text-muted-foreground">The values that drive every line of code we ship.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {[
               { icon: ShieldCheck, title: 'Scalable Engineering', desc: 'Architecture built for 100k+ concurrent users and enterprise security.' },
               { icon: Palette, title: 'Modern UI/UX', desc: 'Interfaces that feel intuitive, premium, and convert at higher rates.' },
               { icon: Zap, title: 'Startup Velocity', desc: 'Fast execution without compromising on code quality or long-term debt.' },
               { icon: Code2, title: 'Clean Architecture', desc: 'Modular, typed codebases that remain maintainable as you scale.' },
               { icon: MessageSquare, title: 'Direct Access', desc: 'Communicate directly with lead engineers, not account managers.' },
               { icon: Rocket, title: 'Long-term Support', desc: 'We stay reachable long after the initial launch for scaling and updates.' }
             ].map((item) => (
               <div key={item.title} className="p-8 rounded-3xl border border-border bg-background hover:border-primary/50 transition-colors group">
                  <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h4 className="text-lg font-bold mb-3">{item.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 px-4 border-t border-border relative overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/5 rounded-full blur-[100px] -z-10" />
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-8">Ready to build something <br className="hidden md:block" /> <span className="text-primary">exceptional together?</span></h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            Tell us about your project vision. We respond within 12 hours with a clear plan, timeline, and investment outline.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="h-14 px-10 rounded-xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all">
              <Link to="/contact">Start Your Project</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 px-10 rounded-xl border-border hover:bg-secondary font-bold hover:scale-[1.02] transition-all">
              <Link to="/contact">Contact SatByte</Link>
            </Button>
          </div>
          <p className="mt-8 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.5em]">Engineered for Excellence</p>
        </div>
      </section>
    </div>
  )
}

const Code2 = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m18 16 4-4-4-4" />
    <path d="m6 8-4 4 4 4" />
    <path d="m14.5 4-5 16" />
  </svg>
)
