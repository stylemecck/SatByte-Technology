import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Globe, 
  Award, 
  Edit3, 
  Plus, 
  ExternalLink,
  ShieldCheck,
  Code,
  LayoutDashboard
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import { SEO } from '../components/SEO'
import { cn } from '../utils/cn'

export default function ProfilePage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'experience' | 'skills' | 'projects'>('experience')

  return (
    <div className="bg-[#020609] min-h-screen pb-32 selection:bg-brand-blue/30">
      <SEO title="Professional Identity" />

      {/* --- Profile Header Orbit --- */}
      <section className="relative pt-32 pb-24 border-b border-white/5">
        <div className="absolute inset-0">
           <div className="absolute top-0 right-0 w-[40%] h-full bg-brand-blue/5 blur-[120px] rounded-full" />
           <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
           <div className="flex flex-col lg:flex-row items-center lg:items-end gap-12">
              <div className="relative group">
                 <div className="h-40 w-40 rounded-4xl bg-[#0A0F14] border-2 border-white/10 flex items-center justify-center text-5xl font-black text-white shadow-2xl overflow-hidden group-hover:border-brand-blue/50 transition-all">
                    {user?.name?.[0] || 'U'}
                    <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                 </div>
                 <button className="absolute -bottom-2 -right-2 h-12 w-12 rounded-2xl bg-brand-blue text-white flex items-center justify-center shadow-xl border-4 border-[#020609] hover:scale-110 transition-all">
                    <Edit3 size={20} />
                 </button>
              </div>

              <div className="flex-1 text-center lg:text-left">
                 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-emerald/10 border border-brand-emerald/20 mb-6">
                    <ShieldCheck size={12} className="text-brand-emerald" />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white">Verified Ecosystem Member</span>
                 </div>
                 <h1 className="font-heading text-5xl md:text-7xl font-black text-white tracking-tighter leading-none mb-4">
                    {user?.name || 'New Member'}
                 </h1>
                 <p className="text-lg text-muted-foreground font-medium mb-8">Engineering Student & Aspiring Full-Stack Developer</p>
                 
                 <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                    <SocialLink icon={Code} label="GitHub" />
                    <SocialLink icon={LayoutDashboard} label="LinkedIn" />
                    <SocialLink icon={Globe} label="Portfolio" />
                 </div>
              </div>

              <div className="lg:w-64 p-8 rounded-4xl bg-white/5 border border-white/5 text-center">
                 <div className="text-brand-blue font-black text-3xl mb-1 tracking-tighter">92%</div>
                 <div className="text-[10px] font-black text-white/40 uppercase tracking-widest">Profile Sync Status</div>
                 <div className="h-1.5 w-full bg-white/5 rounded-full mt-4 overflow-hidden">
                    <div className="h-full w-[92%] bg-brand-blue shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* --- Main Profile Hub --- */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 mt-16">
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            
            {/* Left Column: Metadata & Skills */}
            <aside className="space-y-12">
               <div className="premium-card p-10 bg-[#0A0F14] border-white/5">
                  <h3 className="text-white font-black text-xs uppercase tracking-widest mb-8">Bio Protocol</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                     Passionate about building scalable web architectures and modern user experiences. Currently focusing on distributed systems and cloud-native deployments.
                  </p>
               </div>

               <div className="premium-card p-10 bg-[#0A0F14] border-white/5">
                  <div className="flex items-center justify-between mb-8">
                     <h3 className="text-white font-black text-xs uppercase tracking-widest">Skill Cloud</h3>
                     <button className="text-brand-blue"><Plus size={16} /></button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                     {['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS', 'Figma'].map(skill => (
                       <span key={skill} className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white hover:border-brand-blue/30 transition-all cursor-default">
                         {skill}
                       </span>
                     ))}
                  </div>
               </div>

               <div className="premium-card p-10 bg-brand-blue/5 border-brand-blue/10">
                  <div className="flex items-center gap-3 mb-4">
                     <Sparkles size={20} className="text-brand-blue" />
                     <h4 className="text-white font-black text-sm">AI Skill Analysis</h4>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed mb-6">Your profile is missing 'System Design' fundamentals. Our AI recommends the <strong>Masterclass 04</strong> cohort.</p>
                  <Link to="/certifications" className="text-[10px] font-black uppercase tracking-widest text-brand-blue flex items-center gap-2 hover:underline">
                    Begin Synchronization <ChevronRight size={14} />
                  </Link>
               </div>
            </aside>

            {/* Main Column: Timeline & Content */}
            <div className="lg:col-span-2 space-y-10">
               <nav className="flex gap-10 border-b border-white/5 pb-1">
                  <TabNavItem active={activeTab === 'experience'} onClick={() => setActiveTab('experience')} label="Trajectory" />
                  <TabNavItem active={activeTab === 'skills'} onClick={() => setActiveTab('skills')} label="Credentials" />
                  <TabNavItem active={activeTab === 'projects'} onClick={() => setActiveTab('projects')} label="Artifacts" />
               </nav>

               <div className="min-h-[500px]">
                  {activeTab === 'experience' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                       <TimelineItem 
                         title="Full-Stack Engineering Intern" 
                         company="SatByte Technology" 
                         date="May 2024 - Present" 
                         desc="Architecting real-time collaboration engines and optimizing production deployment pipelines." 
                         current
                       />
                       <TimelineItem 
                         title="Frontend Specialist" 
                         company="Open Source Contributor" 
                         date="Jan 2024 - April 2024" 
                         desc="Contributed to major React-based ecosystems focusing on performance and accessibility." 
                       />
                       <button className="w-full py-6 rounded-3xl border-2 border-dashed border-white/5 text-muted-foreground hover:text-white hover:border-brand-blue/20 transition-all flex items-center justify-center gap-3">
                          <Plus size={20} /> Add Experience Node
                       </button>
                    </motion.div>
                  )}

                  {activeTab === 'skills' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <CredentialCard 
                         title="Professional Frontend Hub" 
                         issuer="SatByte Academy" 
                         id="SB-2024-FE-092" 
                         date="April 2024"
                       />
                       <CredentialCard 
                         title="Cloud Architecture Sync" 
                         issuer="AWS Ecosystem" 
                         id="AWS-CERT-9921" 
                         date="March 2024"
                       />
                    </motion.div>
                  )}

                  {activeTab === 'projects' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <ArtifactCard 
                         title="Orbit Collaboration Engine" 
                         desc="A real-time synchronization engine for remote development squads." 
                         tech={['Socket.io', 'Redis', 'Node.js']}
                       />
                       <ArtifactCard 
                         title="Neural Designer UI" 
                         desc="AI-driven design system generator for professional SaaS applications." 
                         tech={['React', 'Tailwind', 'OpenAI']}
                       />
                    </motion.div>
                  )}
               </div>
            </div>
         </div>
      </div>
    </div>
  )
}

function SocialLink({ icon: Icon, label }: any) {
  return (
    <button className="flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all text-xs font-bold">
       <Icon size={16} /> {label}
    </button>
  )
}

function TabNavItem({ active, onClick, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "pb-6 text-sm font-black uppercase tracking-widest transition-all relative",
        active ? "text-white" : "text-muted-foreground hover:text-white"
      )}
    >
      {label}
      {active && (
        <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-brand-blue rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
      )}
    </button>
  )
}

function TimelineItem({ title, company, date, desc, current }: any) {
  return (
    <div className="flex gap-8 group">
       <div className="flex flex-col items-center">
          <div className={cn("h-4 w-4 rounded-full border-2", current ? "bg-brand-blue border-brand-blue shadow-[0_0_10px_rgba(59,130,246,0.5)]" : "border-white/10 bg-[#020609]")} />
          <div className="w-0.5 flex-1 bg-white/5" />
       </div>
       <div className="pb-12">
          <div className="text-[10px] font-black text-brand-blue uppercase tracking-widest mb-2">{date}</div>
          <h4 className="text-xl font-black text-white mb-1 group-hover:text-brand-blue transition-colors">{title}</h4>
          <p className="text-sm font-bold text-white/60 mb-4">{company}</p>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">{desc}</p>
       </div>
    </div>
  )
}

function CredentialCard({ title, issuer, id, date }: any) {
  return (
    <div className="premium-card p-8 bg-[#0A0F14] border-white/5 group hover:border-brand-emerald/20">
       <div className="h-12 w-12 rounded-2xl bg-brand-emerald/10 text-brand-emerald flex items-center justify-center mb-6">
          <Award size={24} />
       </div>
       <h4 className="text-lg font-black text-white mb-1 group-hover:text-brand-emerald transition-colors">{title}</h4>
       <p className="text-xs font-bold text-white/40 mb-6">{issuer} • {date}</p>
       <div className="pt-6 border-t border-white/5 flex items-center justify-between">
          <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">ID: {id}</span>
          <ExternalLink size={14} className="text-muted-foreground group-hover:text-white transition-colors" />
       </div>
    </div>
  )
}

function ArtifactCard({ title, desc, tech }: any) {
  return (
    <div className="premium-card p-8 bg-[#0A0F14] border-white/5 group hover:border-brand-blue/20">
       <div className="h-12 w-12 rounded-2xl bg-brand-blue/10 text-brand-blue flex items-center justify-center mb-6">
          <Code size={24} />
       </div>
       <h4 className="text-lg font-black text-white mb-1 group-hover:text-brand-blue transition-colors">{title}</h4>
       <p className="text-xs text-muted-foreground leading-relaxed mb-8 line-clamp-2">{desc}</p>
       <div className="flex flex-wrap gap-2">
          {tech.map((t: any) => (
             <span key={t} className="px-3 py-1 rounded-lg bg-white/5 text-[9px] font-bold text-white/40">{t}</span>
          ))}
       </div>
    </div>
  )
}
