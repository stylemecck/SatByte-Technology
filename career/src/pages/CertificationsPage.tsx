import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Award, 
  Clock, 
  CheckCircle2, 
  IndianRupee, 
  BookOpen, 
  Star, 
  Sparkles, 
  ArrowRight, 
  Loader2, 
  ShieldCheck, 
  Zap, 
  Eye, 
  Trophy, 
  FileText,
  Target
} from 'lucide-react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { api } from '../lib/apiClient'
import { SEO } from '../components/SEO'
import type { Certification } from '../types'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { CertificatePreview } from '../components/CertificatePreview'
import { cn } from '../utils/cn'

export default function CertificationsPage() {
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewType, setPreviewType] = useState<'certificate' | 'lor'>('certificate')

  const { data: certifications, isLoading } = useQuery<Certification[]>({
    queryKey: ['certifications'],
    queryFn: async () => {
      const { data } = await api.get('certifications')
      return data
    }
  })

  const openPreview = (type: 'certificate' | 'lor') => {
    setPreviewType(type)
    setPreviewOpen(true)
  }

  return (
    <div className="bg-[#020609] min-h-screen selection:bg-brand-blue/30 overflow-hidden">
      <SEO title="Professional Certifications" description="Upskill with industry-recognized certifications from SatByte." />

      {/* --- Cinematic Header --- */}
      <section className="relative pt-32 pb-24 border-b border-white/5">
        <div className="absolute inset-0">
           <div className="absolute top-0 right-0 w-[50%] h-full bg-brand-violet/5 blur-[120px] rounded-full" />
           <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-violet/10 border border-brand-violet/20 mb-8">
               <Sparkles size={12} className="text-brand-violet" />
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Platinum Learning Paths</span>
            </div>
            <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.85] mb-8 tracking-tighter">
               Master the <br />
               <span className="text-brand-violet italic">Core Architecture.</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground leading-relaxed mb-12 font-medium">
               High-fidelity curriculum architected by veteran engineers. Earn verifiable professional credentials that define your trajectory.
            </p>
            
            <div className="flex flex-wrap justify-center gap-5">
               <button 
                  onClick={() => openPreview('certificate')}
                  className="h-16 px-10 rounded-2xl bg-white text-black font-black text-xs uppercase tracking-widest shadow-xl shadow-white/5 hover:bg-brand-violet hover:text-white transition-all flex items-center gap-3"
               >
                  <Eye size={18} /> View Sample Credential
               </button>
               <button 
                  onClick={() => openPreview('lor')}
                  className="h-16 px-10 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3"
               >
                  <FileText size={18} /> Review LOR Format
               </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- Standards Ticker --- */}
      <div className="max-w-6xl mx-auto px-6 -mt-10 relative z-20">
         <div className="premium-card bg-[#0A0F14]/80 backdrop-blur-2xl p-8 flex flex-wrap items-center justify-around gap-8 border-white/5">
            <StandardBadge icon={Award} label="ISO 9001:2015" />
            <div className="h-4 w-px bg-white/5 hidden md:block" />
            <StandardBadge icon={ShieldCheck} label="STQC Verified" />
            <div className="h-4 w-px bg-white/5 hidden md:block" />
            <StandardBadge icon={Target} label="Industry 4.0 Standard" />
         </div>
      </div>

      {/* --- Programs Area --- */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 mb-20">
           <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
              <div className="max-w-2xl">
                 <span className="text-brand-violet font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Available Specializations</span>
                 <h2 className="font-heading text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">
                   Synchronize with <br /> <span className="text-gradient">Professional Standards.</span>
                 </h2>
              </div>
              <p className="text-muted-foreground text-lg font-medium max-w-sm leading-relaxed">
                 Every masterclass is structured to simulate a high-scale production engineering environment.
              </p>
           </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-10">
           {isLoading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {[1, 2].map(i => <div key={i} className="h-[600px] rounded-4xl bg-[#0A0F14] animate-pulse border border-white/5" />)}
             </div>
           ) : certifications?.length ? (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16">
                {certifications.map((cert, i) => (
                   <CertificationItem key={cert._id} cert={cert} index={i} />
                ))}
             </div>
           ) : (
             <div className="py-40 text-center premium-card border-dashed">
                <Trophy size={48} className="mx-auto text-muted-foreground/20 mb-6" />
                <h3 className="text-2xl font-black text-white mb-2">Architecting New Paths</h3>
                <p className="text-muted-foreground text-sm max-w-sm mx-auto">We are currently refining the next generation of certification modules. Join the hub to get notified.</p>
             </div>
           )}
        </div>
      </section>

      {/* --- The SatByte Standard --- */}
      <section className="py-32 bg-[#0A0F14] border-y border-white/5 overflow-hidden">
         <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
               <div>
                  <span className="text-brand-blue font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Verification Protocol</span>
                  <h2 className="text-4xl md:text-6xl font-heading font-black tracking-tighter leading-none mb-12 text-white">
                     More than a <br /> <span className="text-brand-blue italic">piece of paper.</span>
                  </h2>
                  <div className="space-y-12">
                     <StandardFeature 
                       icon={ShieldCheck} 
                       title="Cryptographically Hashed" 
                       desc="Every certificate carries a unique ID verified on our global recruitment ledger." 
                       color="text-brand-blue"
                     />
                     <StandardFeature 
                       icon={Zap} 
                       title="Impact-Driven Curriculum" 
                       desc="Focus on production-grade standards used by elite software squads." 
                       color="text-brand-emerald"
                     />
                     <StandardFeature 
                       icon={Star} 
                       title="Ecosystem Access" 
                       desc="Get prioritized for internal internships and full-time engineering orbits." 
                       color="text-brand-amber"
                     />
                  </div>
               </div>
               <div className="relative">
                  <div className="absolute inset-0 bg-brand-blue/10 blur-[100px] rounded-full" />
                  <motion.div 
                     initial={{ rotate: 5, y: 50 }}
                     whileInView={{ rotate: -5, y: 0 }}
                     className="relative z-10 premium-card bg-[#111827] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)] border-white/10"
                  >
                     <img src="https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&q=80" alt="Certificate" className="w-full h-auto opacity-80" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                     <div className="absolute bottom-8 left-8">
                        <div className="h-10 w-10 rounded-xl bg-brand-blue flex items-center justify-center text-white mb-4">
                           <Award size={24} />
                        </div>
                        <h4 className="text-white font-black text-xl tracking-tighter">Verified Credential</h4>
                     </div>
                  </motion.div>
               </div>
            </div>
         </div>
      </section>

      <CertificatePreview 
        isOpen={previewOpen} 
        onClose={() => setPreviewOpen(false)} 
        type={previewType}
      />
    </div>
  )
}

function StandardBadge({ icon: Icon, label }: any) {
  return (
    <div className="flex items-center gap-3">
       <Icon size={20} className="text-brand-blue" />
       <span className="text-[10px] font-black text-white uppercase tracking-widest">{label}</span>
    </div>
  )
}

function StandardFeature({ icon: Icon, title, desc, color }: any) {
  return (
    <div className="flex gap-6 group">
       <div className={cn("h-12 w-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center shrink-0 group-hover:scale-110 transition-all", color)}>
          <Icon size={24} />
       </div>
       <div>
          <h4 className="text-xl font-black text-white tracking-tight mb-2 group-hover:text-brand-blue transition-colors">{title}</h4>
          <p className="text-sm text-muted-foreground leading-relaxed font-medium">{desc}</p>
       </div>
    </div>
  )
}

function CertificationItem({ cert, index }: { cert: Certification, index: number }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [isProcessing, setIsProcessing] = useState(false)

  const enrollMutation = useMutation({
    mutationFn: async () => {
       const { data } = await api.post('certifications/enroll', { certificationId: cert._id })
       return data
    },
    onSuccess: (data) => {
       if (data.url) window.location.href = data.url
    }
  })

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login', { state: { from: window.location.pathname } })
      return
    }
    setIsProcessing(true)
    try {
      await enrollMutation.mutateAsync()
    } catch (e) {
      alert('Could not initiate enrollment.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="premium-card p-10 md:p-14 bg-[#0A0F14] group flex flex-col relative overflow-hidden"
    >
       <div className="absolute top-0 right-0 w-64 h-64 bg-brand-violet/5 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />

       <div className="flex justify-between items-start mb-12 relative z-10">
          <div className="h-16 w-16 rounded-2xl bg-white text-black flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-500">
             <BookOpen size={28} />
          </div>
          <div className="text-right">
             <span className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1 block">Deployment Access</span>
             <div className="flex items-center justify-end gap-1 font-heading font-black text-4xl text-white tracking-tighter leading-none">
                <IndianRupee size={22} className="text-brand-violet" /> {cert.price.toLocaleString()}
             </div>
          </div>
       </div>

       <h3 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none mb-6 group-hover:text-brand-violet transition-colors">
         {cert.title}
       </h3>
       <p className="text-lg text-muted-foreground font-medium leading-relaxed mb-12 flex-1 line-clamp-3">
         {cert.description}
       </p>

       <div className="grid grid-cols-2 gap-8 mb-12 py-10 border-y border-white/5 relative z-10">
          <div>
             <span className="text-[9px] font-black text-white/20 uppercase tracking-widest block mb-2">Cohort Duration</span>
             <div className="flex items-center gap-2 font-black text-white uppercase text-xs tracking-widest">
                <Clock size={16} className="text-brand-blue" /> {cert.duration}
             </div>
          </div>
          <div className="text-right">
             <span className="text-[9px] font-black text-white/20 uppercase tracking-widest block mb-2">Ecosystem Rating</span>
             <div className="flex items-center justify-end gap-2 font-black text-white text-xs uppercase tracking-widest">
                <Star size={16} className="text-brand-amber fill-brand-amber" /> 4.9 Precision
             </div>
          </div>
       </div>

       <div className="space-y-8 mb-12 relative z-10">
          <div>
             <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                <Zap size={16} className="text-brand-violet" /> Module Highlights
             </h4>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {cert.features.slice(0, 4).map((f, i) => (
                   <div key={i} className="flex gap-3 text-xs text-muted-foreground font-bold leading-tight">
                      <CheckCircle2 size={16} className="text-brand-emerald shrink-0" />
                      {f}
                   </div>
                ))}
             </div>
          </div>
       </div>

       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
          <button
             onClick={handleEnroll}
             disabled={isProcessing}
             className="h-16 flex items-center justify-center gap-3 rounded-2xl bg-brand-violet text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-brand-violet/20 hover:scale-[1.03] active:scale-[0.98] transition-all disabled:opacity-50"
          >
             {isProcessing ? <Loader2 className="animate-spin" size={20} /> : <>Enroll Mission <ArrowRight size={20} /></>}
          </button>
          <button
             className="h-16 rounded-2xl bg-white/5 border border-white/5 text-white font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
          >
             Syllabus Sync
          </button>
       </div>
    </motion.div>
  )
}
