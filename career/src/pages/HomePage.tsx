import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Briefcase, GraduationCap, Award, ArrowRight, ShieldCheck, Zap, Laptop, Star, Globe, ExternalLink } from 'lucide-react'
import { SEO } from '../components/SEO'
import { SITE } from '../lib/constants'

export default function HomePage() {
  return (
    <div className="bg-background selection:bg-brand-blue/30">
      <SEO title="Home" description="Build your future with SatByte. Careers, Internships, and Professional Certifications." />

      {/* --- Cinematic Hero Section --- */}
      <section className="relative min-h-[95vh] flex items-center overflow-hidden mesh-gradient pt-20">
        <div className="absolute inset-0 opacity-30 dark:opacity-20 pointer-events-none">
           <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-blue/20 blur-[120px] rounded-full translate-x-1/3" />
           <div className="absolute bottom-0 left-0 w-1/2 h-full bg-brand-emerald/20 blur-[120px] rounded-full -translate-x-1/3" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary text-foreground border border-border font-extrabold text-[10px] uppercase tracking-[0.2em] mb-8 shadow-sm">
                <ShieldCheck size={14} className="text-brand-blue" /> The Engineering Standard
              </span>
              <h1 className="font-heading text-5xl sm:text-7xl lg:text-[7.5rem] font-black text-foreground tracking-tighter leading-[0.85] mb-10">
                {SITE.tagline.split(' — ')[0]} <br />
                <span className="bg-gradient-to-r from-brand-blue to-foreground bg-clip-text text-transparent italic">
                   {SITE.tagline.split(' — ')[1]}
                </span>
              </h1>
               <p className="text-lg text-muted-foreground max-w-xl leading-relaxed mb-12 font-medium">
                Join a world-class ecosystem of developers and innovators. From career roles to high-impact structured masterclasses.
              </p>
              
              <div className="flex flex-wrap items-center gap-6">
                <Link
                  to="/careers"
                  className="flex items-center justify-center gap-2 px-10 py-5 rounded-[2rem] bg-brand-blue text-white font-black text-lg shadow-2xl shadow-brand-blue/20 hover:scale-105 transition-all duration-500"
                >
                  Explore Roles <ArrowRight size={22} />
                </Link>
                <Link
                  to="/dashboard"
                  className="flex items-center justify-center gap-3 px-8 py-5 rounded-[2rem] bg-secondary border border-border text-foreground font-extrabold text-lg hover:bg-muted transition-all duration-500 group"
                >
                  Student Portal <ExternalLink size={20} className="group-hover:rotate-45 transition-transform" />
                </Link>
              </div>

              {/* Quick Stats Overlay */}
              <div className="mt-16 flex items-center gap-12 border-t border-border pt-10">
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
              <div className="absolute -inset-10 bg-brand-blue/10 blur-[100px] rounded-full animate-pulse" />
              <div className="relative rounded-[4rem] overflow-hidden border border-border shadow-2xl aspect-square lg:aspect-auto lg:h-[750px]">
                <img 
                  src="/career_hero_illustration_1775908602153.png" 
                  alt="Future of Tech" 
                  className="w-full h-full object-cover scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
              </div>
              
              {/* Floating Achievement Card */}
              <motion.div 
                 animate={{ y: [0, -15, 0] }}
                 transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                 className="absolute -bottom-8 -left-8 p-6 rounded-[2.5rem] bg-card/80 backdrop-blur-2xl border border-border shadow-2xl flex items-center gap-6 max-w-xs"
              >
                 <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-brand-blue to-brand-emerald flex items-center justify-center text-white shadow-xl">
                    <Star size={24} className="fill-white" />
                 </div>
                 <div>
                    <h4 className="text-foreground font-black text-xs uppercase tracking-widest">Top Excellence</h4>
                    <p className="text-muted-foreground text-[11px] font-medium">Ranked #1 Engineering Internship Program 2024</p>
                 </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- The Pathways (Core Features) --- */}
      <section className="py-32 relative bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
             <div className="max-w-2xl">
                <span className="text-brand-blue font-black uppercase tracking-[0.3em] text-[10px]">Your Journey</span>
                <h2 className="mt-4 font-heading text-4xl sm:text-6xl font-black text-foreground tracking-tighter leading-none">
                  Choose your next <br /> <span className="bg-gradient-to-r from-brand-blue to-brand-emerald bg-clip-text text-transparent italic">Career Orbit.</span>
                </h2>
             </div>
             <p className="text-muted-foreground font-medium max-w-md">Our ecosystem is built for high-performers. Whether you're a student or a senior lead, we have a pathway for your orbit.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <FeatureCard 
              icon={Briefcase}
              title="Full-Time Roles"
              description="Join our engineering, design, and product units to build the infrastructure of tomorrow."
              link="/careers"
              color="var(--brand-blue)"
              sub="50+ Roles Open"
            />
            <FeatureCard 
              icon={GraduationCap}
              title="Global Internships"
              description="Structured programs for high-potential talent to work on production systems with senior mentorship."
              link="/internships"
              color="var(--brand-emerald)"
              sub="Cohort 2024 Open"
            />
            <FeatureCard 
              icon={Award}
              title="Masterclasses"
              description="Earn industry-recognized certifications in MERN, Cloud Ops, and AI Architecture."
              link="/certifications"
              color="var(--brand-amber)"
              sub="15+ Specializations"
            />
          </div>
        </div>
      </section>

      {/* --- Why SatByte (Modernized UX) --- */}
      <section className="py-32 bg-secondary/30 overflow-hidden relative border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="relative">
               <div className="absolute -inset-10 bg-brand-blue/5 rounded-[4rem] blur-[80px] rotate-6" />
               <div className="relative">
                  <div className="grid grid-cols-2 gap-6 pt-12">
                     <div className="space-y-6">
                        <img src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=400&q=80" className="rounded-[2.5rem] shadow-2xl h-80 object-cover w-full border border-border" alt="Team" />
                        <div className="p-8 rounded-[2.5rem] bg-card border border-border shadow-xl flex flex-col items-center text-center">
                           <div className="h-12 w-12 rounded-2xl bg-brand-blue flex items-center justify-center text-white mb-4 shadow-lg shadow-brand-blue/20">
                              <Globe size={24} />
                           </div>
                           <h4 className="font-black text-xs uppercase tracking-widest text-foreground">Global Team</h4>
                           <p className="text-[10px] text-muted-foreground mt-1 font-bold">12+ Countries</p>
                        </div>
                     </div>
                     <div className="space-y-6 -mt-12">
                        <div className="p-8 rounded-[2.5rem] bg-foreground text-background shadow-2xl flex flex-col items-center text-center">
                           <div className="h-12 w-12 rounded-2xl bg-background/10 flex items-center justify-center text-brand-emerald mb-4">
                              <Zap size={24} className="fill-brand-emerald" />
                           </div>
                           <h4 className="font-black text-xs uppercase tracking-widest">Rapid Growth</h4>
                           <p className="text-[10px] opacity-60 mt-1 font-bold">300% Yearly Scale</p>
                        </div>
                        <img src="https://images.unsplash.com/photo-1522071823991-b19c77663cf8?w=400&q=80" className="rounded-[2.5rem] shadow-2xl h-80 object-cover w-full border border-border" alt="Work" />
                     </div>
                  </div>
               </div>
            </div>

            <div>
              <span className="text-muted-foreground font-black uppercase tracking-[0.4em] text-[10px] mb-6 block">Our Engineering Culture</span>
              <h2 className="font-heading text-4xl sm:text-6xl font-black text-foreground tracking-tight leading-[0.9] mb-12">
                We don't build apps. <br /> <span className="text-brand-blue">We build the future.</span>
              </h2>
              
              <div className="space-y-10">
                <BenefitCard icon={Zap} title="Hyper-Growth environment" desc="Skip the corporate ladder. We operate with high-trust and high-ownership cycles that accelerate your career by years." />
                <BenefitCard icon={Laptop} title="High-Scale Systems" desc="Work on distributed systems serving millions of requests. Learn how to architect for infinity." />
                <BenefitCard icon={ShieldCheck} title="Proof of Achievement" desc="Every career milestone here is verified. Build a verifiable portfolio of excellence recognized globally." />
              </div>

              <div className="mt-16 pt-12 border-t border-border flex items-center gap-10">
                 <div className="flex -space-x-4">
                    {[1,2,3,4].map(i => (
                       <div key={i} className="h-12 w-12 rounded-full border-2 border-background bg-secondary overflow-hidden shadow-sm">
                          <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="avatar" />
                       </div>
                    ))}
                 </div>
                 <div>
                    <p className="text-sm font-bold text-foreground">Joined by 1,200+ engineers</p>
                    <p className="text-xs text-muted-foreground font-medium">Be part of the SatByte revolution.</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Unified CTA Experience --- */}
      <section className="py-40 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-6xl mx-auto rounded-[5rem] bg-foreground p-12 sm:p-32 text-center relative shadow-2xl overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue/20 via-transparent to-brand-emerald/10 pointer-events-none" />
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative z-10"
          >
             <h2 className="font-heading text-5xl sm:text-7xl font-black text-background leading-none mb-10 tracking-tighter">
               Become a part of <br /> the <span className="text-brand-blue underline decoration-background/20 underline-offset-8 italic">next evolution.</span>
             </h2>
             <p className="text-xl sm:text-2xl text-background/60 font-medium mb-16 max-w-2xl mx-auto leading-relaxed">
               Whether you want a career change or specialized training, we have a place for your ambition.
             </p>
             <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
               <Link
                 to="/careers"
                 className="w-full sm:w-auto px-12 py-6 rounded-[2.5rem] bg-background text-foreground font-black text-xl shadow-xl hover:scale-105 transition-all duration-500 flex items-center justify-center gap-3"
               >
                 Launch Application <ArrowRight size={24} />
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
    <div className="flex flex-col">
       <h4 className="text-4xl font-black text-foreground mb-1 tracking-tighter">{value}</h4>
       <p className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-muted-foreground">{label}</p>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, description, link, color, sub }: any) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group p-10 rounded-[2.5rem] bg-card border border-border shadow-2xl flex flex-col h-full relative overflow-hidden transition-all duration-500 hover:border-brand-blue/30"
    >
       <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.03] blur-3xl rounded-full transform translate-x-12 -translate-y-12 transition-all group-hover:opacity-10" style={{ backgroundColor: color }} />
       
       <div className="h-16 w-16 rounded-[1.8rem] flex items-center justify-center text-white mb-10 group-hover:scale-110 transition-transform duration-500 shadow-xl" style={{ backgroundColor: color }}>
         <Icon size={32} />
       </div>
       
       <div className="flex-1">
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4 block group-hover:text-foreground transition-colors">{sub}</span>
          <h3 className="font-heading text-3xl font-black text-foreground tracking-tighter mb-4">{title}</h3>
          <p className="text-muted-foreground leading-relaxed font-medium mb-10">{description}</p>
       </div>
       
       <Link to={link} className="mt-auto inline-flex items-center gap-3 font-black text-[11px] uppercase tracking-widest text-brand-blue group-hover:gap-5 transition-all">
         Explore Pathway <ArrowRight size={18} />
       </Link>
    </motion.div>
  )
}

function BenefitCard({ icon: Icon, title, desc }: any) {
  return (
    <div className="flex gap-8 group">
      <div className="h-14 w-14 rounded-2xl bg-card border border-border shadow-lg flex items-center justify-center text-brand-blue shrink-0 group-hover:bg-brand-blue group-hover:text-white transition-all duration-500">
        <Icon size={28} />
      </div>
      <div>
        <h4 className="font-heading font-black text-xl text-foreground tracking-tight mb-2">{title}</h4>
        <p className="text-muted-foreground text-sm font-medium leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}
