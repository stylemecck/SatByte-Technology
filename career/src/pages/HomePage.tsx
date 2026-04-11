import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Briefcase, GraduationCap, Award, CheckCircle2, ArrowRight, ShieldCheck, Zap, Laptop, Star, Users, Globe, ExternalLink } from 'lucide-react'
import { SEO } from '../components/SEO'
import { SITE } from '../lib/constants'
import { cn } from '../utils/cn'

export default function HomePage() {
  return (
    <div className="bg-[#FDFDFF]">
      <SEO title="Home" description="Build your future with SatByte. Careers, Internships, and Professional Certifications." />

      {/* --- Cinematic Hero Section --- */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden mesh-gradient pt-20">
        <div className="absolute inset-0 opacity-20">
           <div className="absolute top-0 right-0 w-1/2 h-full bg-accent/20 blur-[120px] rounded-full translate-x-1/3" />
           <div className="absolute bottom-0 left-0 w-1/2 h-full bg-primary/20 blur-[120px] rounded-full -translate-x-1/3" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 font-extrabold text-[10px] uppercase tracking-[0.2em] mb-8 shadow-2xl">
                <ShieldCheck size={14} className="text-accent shadow-glow" /> The Engineering Standard
              </span>
              <h1 className="font-heading text-5xl sm:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[0.95] mb-8">
                {SITE.tagline.split(' — ')[0]} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-emerald-400">
                   {SITE.tagline.split(' — ')[1]}
                </span>
              </h1>
              <p className="text-xl text-indigo-100/70 max-w-xl leading-relaxed mb-12 font-medium">
                Join a world-class ecosystem of developers, designers, and innovators. From high-growth roles to structured masterclasses, your future starts at {SITE.parentName}.
              </p>
              
              <div className="flex flex-wrap items-center gap-6">
                <Link
                  to="/careers"
                  className="flex items-center justify-center gap-2 px-10 py-5 rounded-[2rem] bg-accent text-secondary font-black text-lg shadow-2xl shadow-accent/20 hover:scale-105 hover:bg-white transition-all duration-500"
                >
                  Explore Roles <ArrowRight size={22} />
                </Link>
                <Link
                  to="/dashboard"
                  className="flex items-center justify-center gap-3 px-8 py-5 rounded-[2rem] bg-white/5 backdrop-blur-xl border border-white/10 text-white font-extrabold text-lg hover:bg-white/10 transition-all duration-500 group"
                >
                  Student Portal <ExternalLink size={20} className="group-hover:rotate-45 transition-transform" />
                </Link>
              </div>

              {/* Quick Stats Overlay */}
              <div className="mt-16 flex items-center gap-12 border-t border-white/10 pt-10">
                <QuickStat label="Active Roles" value="50+" />
                <QuickStat label="Global Interns" value="200+" />
                <QuickStat label="Certified" value="1.2k" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="absolute -inset-10 bg-accent/20 blur-[100px] rounded-full animate-pulse" />
              <div className="relative rounded-[4rem] overflow-hidden border border-white/10 shadow-[0_0_80px_rgba(255,255,255,0.05)] aspect-square lg:aspect-auto lg:h-[700px]">
                <img 
                  src="/career_hero_illustration_1775908602153.png" 
                  alt="Future of Tech" 
                  className="w-full h-full object-cover scale-110 motion-safe:animate-slow-zoom"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary via-transparent to-transparent opacity-60" />
              </div>
              
              {/* Floating Achievement Card */}
              <motion.div 
                 animate={{ y: [0, -15, 0] }}
                 transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                 className="absolute -bottom-8 -left-8 p-6 rounded-[2.5rem] bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl flex items-center gap-6 max-w-xs"
              >
                 <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-accent to-emerald-400 flex items-center justify-center text-secondary shadow-xl">
                    <Star size={24} className="fill-secondary" />
                 </div>
                 <div>
                    <h4 className="text-white font-black text-sm uppercase tracking-widest">Top Excellence</h4>
                    <p className="text-indigo-100/60 text-xs font-medium">Ranked #1 Engineering Internship Program 2024</p>
                 </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- The Pathways (Core Features) --- */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
             <div className="max-w-2xl">
                <span className="text-primary font-black uppercase tracking-[0.3em] text-[10px]">Your Journey</span>
                <h2 className="mt-4 font-heading text-4xl sm:text-6xl font-extrabold text-secondary tracking-tight leading-none">
                  Choose your next <br /> <span className="text-primary italic">Career Orbit.</span>
                </h2>
             </div>
             <p className="text-slate-500 font-medium max-w-md">Our ecosystem is built for high-performers. Whether you're a student or a senior lead, we have a pathway for your orbit.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <FeatureCard 
              icon={Briefcase}
              title="Full-Time Roles"
              description="Join our engineering, design, and product units to build the infrastructure of tomorrow."
              link="/careers"
              accent="bg-indigo-600"
              sub="50+ Roles Open"
            />
            <FeatureCard 
              icon={GraduationCap}
              title="Global Internships"
              description="Structured programs for high-potential talent to work on production systems with senior mentorship."
              link="/internships"
              accent="bg-emerald-600"
              sub="Cohort 2024 Open"
            />
            <FeatureCard 
              icon={Award}
              title="Masterclasses"
              description="Earn industry-recognized certifications in MERN, Cloud Ops, and AI Architecture."
              link="/certifications"
              accent="bg-amber-600"
              sub="15+ Specializations"
            />
          </div>
        </div>
      </section>

      {/* --- Why SatByte (Modernized UX) --- */}
      <section className="py-32 bg-slate-50 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="relative">
               <div className="absolute -inset-10 bg-primary/10 rounded-[4rem] blur-[80px] rotate-6" />
               <div className="relative">
                  <div className="grid grid-cols-2 gap-6 pt-12">
                     <div className="space-y-6">
                        <img src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=400&q=80" className="rounded-[2.5rem] shadow-2xl h-80 object-cover w-full" alt="Team" />
                        <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl flex flex-col items-center text-center">
                           <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-white mb-4 shadow-xl">
                              <Globe size={24} />
                           </div>
                           <h4 className="font-black text-sm uppercase tracking-widest text-secondary">Global Team</h4>
                           <p className="text-[10px] text-slate-400 mt-1 font-bold">12+ Countries</p>
                        </div>
                     </div>
                     <div className="space-y-6 -mt-12">
                        <div className="p-8 rounded-[2.5rem] bg-secondary text-white shadow-2xl flex flex-col items-center text-center">
                           <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center text-accent mb-4">
                              <Zap size={24} className="fill-accent" />
                           </div>
                           <h4 className="font-black text-sm uppercase tracking-widest">Rapid Growth</h4>
                           <p className="text-[10px] text-indigo-200 mt-1 font-bold">300% Yearly Scale</p>
                        </div>
                        <img src="https://images.unsplash.com/photo-1522071823991-b19c77663cf8?w=400&q=80" className="rounded-[2.5rem] shadow-2xl h-80 object-cover w-full" alt="Work" />
                     </div>
                  </div>
               </div>
            </div>

            <div>
              <span className="text-secondary font-black uppercase tracking-[0.4em] text-[10px] mb-6 block">Our Engineering Culture</span>
              <h2 className="font-heading text-4xl sm:text-6xl font-extrabold text-secondary tracking-tight leading-[0.9] mb-12">
                We don't build apps. <br /> <span className="text-primary">We build the future.</span>
              </h2>
              
              <div className="space-y-10">
                <BenefitCard 
                  icon={Zap} 
                  title="Hyper-Growth environment" 
                  desc="Skip the corporate ladder. We operate with high-trust and high-ownership cycles that accelerate your career by years." 
                />
                <BenefitCard 
                  icon={Laptop} 
                  title="High-Scale Systems" 
                  desc="Work on distributed systems serving millions of requests. Learn how to architect for infinity." 
                />
                <BenefitCard 
                  icon={ShieldCheck} 
                  title="Proof of Achievement" 
                  desc="Every career milestone here is verified. Build a verifiable portfolio of excellence recognized by global giants." 
                />
              </div>

              <div className="mt-16 pt-12 border-t border-slate-200 flex items-center gap-12">
                 <div className="flex -space-x-4">
                    {[1,2,3,4].map(i => (
                       <div key={i} className="h-12 w-12 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm">
                          <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="avatar" />
                       </div>
                    ))}
                 </div>
                 <div>
                    <p className="text-sm font-bold text-secondary">Joined by 1,200+ engineers</p>
                    <p className="text-xs text-slate-400 font-medium">Be part of the SatByte revolution.</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Unified CTA Experience --- */}
      <section className="py-40 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-6xl mx-auto rounded-[5rem] bg-secondary p-12 sm:p-32 text-center relative shadow-[0_40px_100px_rgba(15,18,33,0.5)]">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-primary/10 via-transparent to-accent/10 pointer-events-none" />
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
             <h2 className="relative z-10 font-heading text-5xl sm:text-7xl font-black text-white leading-tight mb-10 tracking-tighter">
               Become a part of <br /> the <span className="text-accent underline decoration-white/20 underline-offset-8">next evolution.</span>
             </h2>
             <p className="relative z-10 text-xl sm:text-2xl text-indigo-100/60 font-medium mb-16 max-w-2xl mx-auto leading-relaxed">
               Whether you want a career change or specialized training, we have a place for your ambition.
             </p>
             <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-6">
               <Link
                 to="/careers"
                 className="w-full sm:w-auto px-12 py-6 rounded-[2.5rem] bg-white text-secondary font-black text-xl shadow-2xl shadow-white/10 hover:scale-105 hover:bg-accent transition-all duration-500 flex items-center justify-center gap-3 group"
               >
                 Launch Application <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
               </Link>
             </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

function QuickStat({ label, value }: { label: string, value: string }) {
  return (
    <div>
       <h4 className="text-4xl font-black text-white mb-1 tracking-tighter">{value}</h4>
       <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">{label}</p>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, description, link, accent, sub }: any) {
  return (
    <motion.div
      whileHover={{ y: -12 }}
      className="group p-10 rounded-[3rem] bg-white border border-slate-100 shadow-2xl shadow-slate-200/40 flex flex-col h-full relative overflow-hidden transition-all duration-500 hover:border-primary/20"
    >
       <div className={cn('absolute top-0 right-0 w-32 h-32 opacity-5 blur-3xl rounded-full transform translate-x-12 -translate-y-12 transition-all group-hover:opacity-10', accent)} />
       
       <div className={cn('h-16 w-16 rounded-[1.8rem] flex items-center justify-center text-white shadow-2xl mb-10 group-hover:scale-110 transition-transform duration-500', accent)}>
         <Icon size={32} />
       </div>
       
       <div className="flex-1">
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4 block group-hover:text-primary transition-colors">{sub}</span>
          <h3 className="font-heading text-3xl font-extrabold text-secondary tracking-tight mb-4 group-hover:text-primary transition-colors">{title}</h3>
          <p className="text-slate-500 leading-relaxed font-medium mb-10">{description}</p>
       </div>
       
       <Link to={link} className="mt-auto inline-flex items-center gap-3 font-black text-xs uppercase tracking-widest text-primary group-hover:gap-5 transition-all">
         Explore Pathway <ArrowRight size={18} />
       </Link>
    </motion.div>
  )
}

function BenefitCard({ icon: Icon, title, desc }: any) {
  return (
    <div className="flex gap-8 group">
      <div className="h-14 w-14 rounded-2xl bg-white border border-slate-100 shadow-xl flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-slate-200/50">
        <Icon size={28} />
      </div>
      <div>
        <h4 className="font-heading font-black text-xl text-secondary tracking-tight mb-2 group-hover:text-primary transition-colors">{title}</h4>
        <p className="text-slate-500 text-sm font-medium leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}

