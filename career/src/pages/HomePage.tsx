import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Briefcase, 
  GraduationCap, 
  Award, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Cpu, 
  Sparkles, 
  Globe, 
  CheckCircle2, 
  LayoutDashboard,
  Search,
  Star,
  Users
} from 'lucide-react'
import { SEO } from '../components/SEO'
import { SITE } from '../lib/constants'

export default function HomePage() {
  return (
    <div className="bg-background selection:bg-brand-blue/30 overflow-hidden">
      <SEO title="Career Ecosystem" description="Build your future with SatByte. Modern AI-powered careers, internships, and professional masterclasses." />

      {/* --- AI-Powered Hero Section --- */}
      <section className="relative min-h-screen flex items-center pt-20 pb-32">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] bg-brand-blue/10 blur-[150px] rounded-full animate-pulse" />
          <div className="absolute bottom-[10%] left-[-10%] w-[40%] h-[40%] bg-brand-violet/10 blur-[120px] rounded-full" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(white,transparent_85%)] opacity-20" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
                <Sparkles size={14} className="text-brand-blue animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">AI-Powered Career Hub</span>
              </div>
              
              <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter mb-8">
                Build Your Career <br />
                <span className="text-brand-blue italic">With Modern</span> <br />
                Opportunities.
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed mb-10 font-medium">
                Discover internships, jobs, certifications, and AI-driven career tools in one unified professional ecosystem.
              </p>
              
              <div className="flex flex-wrap items-center gap-5">
                <Link
                  to="/careers"
                  className="h-16 px-10 rounded-2xl bg-brand-blue text-white font-black text-lg shadow-xl shadow-brand-blue/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3"
                >
                  Explore Opportunities <ArrowRight size={22} />
                </Link>
                <Link
                  to="/dashboard"
                  className="h-16 px-10 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-lg hover:bg-white/10 transition-all flex items-center gap-3"
                >
                  Student Portal <LayoutDashboard size={22} />
                </Link>
              </div>

              {/* Ecosystem Metrics */}
              <div className="mt-16 grid grid-cols-3 gap-8 border-t border-white/5 pt-10">
                <Metric label="Active Roles" value="50+" />
                <Metric label="Live Hubs" value="12" />
                <Metric label="Hiring" value="24/7" />
              </div>
            </motion.div>

            {/* Dashboard Preview Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="premium-card p-4 bg-[#0A0F14]/80 backdrop-blur-3xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <img 
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80" 
                  alt="Platform Dashboard" 
                  className="rounded-2xl shadow-2xl border border-white/5"
                />
                
                {/* Floating AI Insights Widget */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 5, repeat: Infinity }}
                  className="absolute -bottom-6 -left-6 p-6 rounded-3xl bg-[#111827] border border-white/10 shadow-2xl flex items-center gap-5 max-w-xs"
                >
                  <div className="h-12 w-12 rounded-2xl bg-brand-blue/20 flex items-center justify-center text-brand-blue">
                    <Cpu size={24} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-1">AI Recommendation</h4>
                    <p className="text-muted-foreground text-[10px]">Full-Stack Intern role matched with your React profile.</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- Live Opportunity Feed --- */}
      <section className="py-32 bg-[#020609] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-20">
            <div>
              <div className="flex items-center gap-2 text-brand-blue font-black uppercase tracking-[0.3em] text-[10px] mb-4">
                <div className="h-2 w-2 rounded-full bg-brand-blue animate-pulse" /> Live Now
              </div>
              <h2 className="font-heading text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">
                Direct Path to the <br /> <span className="text-gradient">Next Generation.</span>
              </h2>
            </div>
            <Link to="/careers" className="text-muted-foreground hover:text-white font-bold flex items-center gap-2 transition-colors">
              View all listings <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <OpportunityCard 
              type="Internship"
              title="Full-Stack Developer"
              location="Remote / Mumbai"
              salary="₹15k - ₹25k / mo"
              tags={['React', 'Node.js', 'MongoDB']}
              status="New"
            />
            <OpportunityCard 
              type="Full-Time"
              title="Product Designer"
              location="Remote"
              salary="₹12L - ₹18L PA"
              tags={['Figma', 'UX Research', 'UI']}
              status="Hot"
            />
            <OpportunityCard 
              type="Internship"
              title="Marketing Associate"
              location="Pune"
              salary="₹10k - ₹15k / mo"
              tags={['Growth', 'SEO', 'Ads']}
              status="Active"
            />
          </div>
        </div>
      </section>

      {/* --- Why the Ecosystem? --- */}
      <section className="py-32 bg-background relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="relative">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="premium-card p-8 bg-brand-blue/5 border-brand-blue/10">
                    <Zap size={32} className="text-brand-blue mb-4" />
                    <h4 className="text-white font-black text-xl mb-2">Fast-Track</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">Skip the line with direct ecosystem placement referrals.</p>
                  </div>
                  <div className="premium-card p-8 bg-brand-emerald/5 border-brand-emerald/10">
                    <Award size={32} className="text-brand-emerald mb-4" />
                    <h4 className="text-white font-black text-xl mb-2">Verified</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">Get cryptographically signed experience certificates.</p>
                  </div>
                </div>
                <div className="space-y-6 mt-12">
                  <div className="premium-card p-8 bg-brand-violet/5 border-brand-violet/10">
                    <Users size={32} className="text-brand-violet mb-4" />
                    <h4 className="text-white font-black text-xl mb-2">Community</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">Network with top engineers and designers globally.</p>
                  </div>
                  <div className="premium-card p-8 bg-brand-amber/5 border-brand-amber/10">
                    <Globe size={32} className="text-brand-amber mb-4" />
                    <h4 className="text-white font-black text-xl mb-2">Global</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">Work on products serving international audiences.</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <span className="text-brand-blue font-black uppercase tracking-[0.3em] text-[10px] mb-6 block">Career Evolution</span>
              <h2 className="font-heading text-4xl md:text-6xl font-black text-white leading-[0.9] tracking-tighter mb-10">
                It's Not a Job Board. <br /> <span className="text-gradient italic">It's an Ecosystem.</span>
              </h2>
              <p className="text-lg text-muted-foreground font-medium leading-relaxed mb-12">
                We've built a professional orbit designed to accelerate student and developer careers through real-world high-scale production experience.
              </p>
              
              <ul className="space-y-6">
                {[
                  { title: "Direct Mentorship", desc: "Work directly with core engineering leads." },
                  { title: "AI Skill Gap Analysis", desc: "Our platform identifies what you need to learn next." },
                  { title: "Verifiable Excellence", desc: "Built-in professional portfolio of your project impact." }
                ].map((item, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="h-6 w-6 rounded-full bg-brand-blue/20 flex items-center justify-center text-brand-blue shrink-0 mt-1">
                      <CheckCircle2 size={14} />
                    </div>
                    <div>
                      <h4 className="text-white font-bold">{item.title}</h4>
                      <p className="text-muted-foreground text-sm">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* --- Launchpad CTA --- */}
      <section className="py-40 px-6">
        <div className="max-w-6xl mx-auto premium-card bg-foreground p-12 md:p-32 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue/20 via-transparent to-brand-emerald/10 opacity-50" />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative z-10"
          >
            <h2 className="font-heading text-4xl md:text-7xl font-black text-background leading-none mb-8 tracking-tighter">
              Ready to synchronize <br /> with your <span className="text-brand-blue italic">next orbit?</span>
            </h2>
            <p className="text-lg md:text-2xl text-background/60 font-medium mb-12 max-w-2xl mx-auto">
              Whether you are looking for your first internship or a senior engineering role, your journey starts here.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link
                to="/register"
                className="w-full sm:w-auto h-20 px-12 rounded-full bg-background text-foreground font-black text-xl shadow-2xl flex items-center justify-center gap-3 hover:scale-[1.03] transition-all"
              >
                Join the Ecosystem <ArrowRight size={24} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

function Metric({ label, value }: { label: string, value: string }) {
  return (
    <div>
      <h4 className="text-3xl font-black text-white tracking-tighter mb-1">{value}</h4>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
    </div>
  )
}

function OpportunityCard({ type, title, location, salary, tags, status }: any) {
  return (
    <div className="premium-card p-8 bg-[#0A0F14] hover:bg-[#0F1720] border-white/5 group relative overflow-hidden">
      <div className="flex justify-between items-start mb-6">
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${type === 'Internship' ? 'bg-brand-emerald/10 text-brand-emerald' : 'bg-brand-blue/10 text-brand-blue'}`}>
          {type}
        </span>
        {status && (
          <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{status}</span>
        )}
      </div>
      
      <h3 className="text-2xl font-black text-white tracking-tight mb-2 group-hover:text-brand-blue transition-colors">{title}</h3>
      <p className="text-muted-foreground text-sm font-medium mb-6">{location} • {salary}</p>
      
      <div className="flex flex-wrap gap-2 mb-8">
        {tags.map((tag: string) => (
          <span key={tag} className="px-3 py-1 rounded-lg bg-white/5 text-[10px] font-bold text-white/60">
            {tag}
          </span>
        ))}
      </div>
      
      <Link to="/careers" className="w-full h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-xs font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all">
        Quick View
      </Link>
    </div>
  )
}
