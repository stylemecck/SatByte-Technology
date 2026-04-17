import { useState } from 'react'
import { motion } from 'framer-motion'
import { Award, Clock, CheckCircle2, IndianRupee, BookOpen, Star, Sparkles, ArrowRight, Loader2, ShieldCheck, Zap, Eye, Trophy, FileText } from 'lucide-react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { api } from '../lib/apiClient'
import { SEO } from '../components/SEO'
import type { Certification } from '../types'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { CertificatePreview } from '../components/CertificatePreview'

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
    <div className="bg-background selection:bg-brand-blue/30">
      <SEO title="Certifications" description="Upskill with industry-recognized certifications from SatByte." />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-24 mesh-gradient">
        <div className="absolute inset-0 opacity-30 dark:opacity-20 pointer-events-none">
           <div className="absolute top-0 -left-1/4 w-1/2 h-full bg-brand-blue/20 blur-[120px] rounded-full" />
           <div className="absolute bottom-0 -right-1/4 w-1/2 h-full bg-brand-emerald/10 blur-[120px] rounded-full" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-secondary text-foreground border border-border font-extrabold text-[10px] uppercase tracking-[0.2em] mb-8 shadow-sm">
               <Sparkles size={14} className="text-brand-blue" /> Platinum Learning Paths
            </span>
            <h1 className="font-heading text-5xl sm:text-7xl font-black text-foreground leading-[0.85] mb-8 tracking-tighter">
               Elevate your <br />
               <span className="bg-gradient-to-r from-brand-blue to-foreground bg-clip-text text-transparent italic">professional trajectory</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground leading-relaxed mb-12 font-medium">
               Master cutting-edge technologies with our high-fidelity curriculum, structured masterclasses, and globally recognized credentials.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
               <button 
                  onClick={() => openPreview('certificate')}
                  className="flex items-center gap-3 px-8 py-4 rounded-full bg-foreground text-background font-black text-[13px] uppercase tracking-widest hover:opacity-90 transition-all shadow-xl"
               >
                  <Eye size={20} /> View Demo Credential
               </button>
               <button 
                  onClick={() => openPreview('lor')}
                  className="flex items-center gap-3 px-8 py-4 rounded-full bg-secondary text-foreground border border-border font-black text-[13px] uppercase tracking-widest hover:bg-muted transition-all"
               >
                  <FileText size={20} className="text-brand-blue" /> Sample LOR
               </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Ticker */}
      <div className="relative -mt-10 py-8 bg-card border border-border overflow-hidden z-10 mx-6 rounded-[2.5rem] shadow-2xl max-w-5xl lg:mx-auto lg:max-w-6xl">
         <div className="flex items-center justify-around opacity-60">
            <div className="flex items-center gap-3 font-heading font-black text-foreground text-[11px] uppercase tracking-[0.2em]">
               <Award size={18} className="text-brand-blue" /> ISO 9001:2015
            </div>
            <div className="flex items-center gap-3 font-heading font-black text-foreground text-[11px] uppercase tracking-[0.2em]">
               <ShieldCheck size={18} className="text-brand-emerald" /> STQC VERIFIED
            </div>
            <div className="hidden sm:flex items-center gap-3 font-heading font-black text-foreground text-[11px] uppercase tracking-[0.2em]">
               <Trophy size={18} className="text-brand-amber" /> TOP-RATED 2024
            </div>
         </div>
      </div>

      {/* Program Grid */}
      <section className="py-32 bg-background">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 mb-20">
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
              <div className="max-w-2xl">
                 <span className="text-brand-blue font-black uppercase tracking-[0.3em] text-[10px]">Certification Paths</span>
                 <h2 className="mt-4 font-heading text-4xl sm:text-6xl font-black text-foreground tracking-tighter leading-none">
                   Master your next <br /> <span className="bg-gradient-to-r from-brand-blue to-foreground bg-clip-text text-transparent italic">Specialization.</span>
                 </h2>
              </div>
              <p className="text-muted-foreground font-medium max-w-sm">Every program is architected by industry leads to ensure you're learning production-ready standards.</p>
           </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
           {isLoading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {[1, 2].map(i => <div key={i} className="h-[600px] rounded-[4rem] bg-muted animate-pulse border border-border" />)}
             </div>
           ) : certifications?.length ? (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
                {certifications.map(cert => (
                   <CertificationCard key={cert._id} cert={cert} />
                ))}
             </div>
           ) : (
             <div className="text-center py-32 bg-muted rounded-[4rem] border-2 border-dashed border-border max-w-2xl mx-auto">
                <div className="h-20 w-20 rounded-3xl bg-secondary flex items-center justify-center text-muted-foreground mx-auto mb-8 shadow-sm">
                   <Award size={40} />
                </div>
                <h3 className="text-2xl font-black text-foreground tracking-tighter">Curating Excellence</h3>
                <p className="text-muted-foreground mt-4 px-8 max-w-md mx-auto font-medium">We are currently architecting new premium certification paths. Join the waitlist to be synchronized on new releases.</p>
             </div>
           )}
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-32 bg-secondary/30 text-foreground overflow-hidden relative border-t border-border">
         <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
               <div>
                  <span className="text-brand-blue font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">The SatByte Standard</span>
                  <h2 className="text-4xl sm:text-6xl font-heading font-black tracking-tighter leading-[0.9] mb-12 text-foreground">
                     More than just a <br /> <span className="text-brand-blue">piece of paper.</span>
                  </h2>
                  <div className="space-y-10">
                     {[
                        { icon: <ShieldCheck />, color: "var(--brand-blue)", title: 'Globally Verifiable', desc: 'Each certificate carries a unique cryptographic ID for instant verification.' },
                        { icon: <Zap />, color: "var(--brand-emerald)", title: 'MERN & FullStack Pro', desc: 'Includes a digital portfolio link showcasing all the production-grade projects you built.' },
                        { icon: <Star />, color: "var(--brand-amber)", title: 'Career Acceleration', desc: 'Get access to our internal job board and referral network for 6 months post-completion.' }
                     ].map((item, idx) => (
                        <div key={idx} className="flex gap-8 group">
                           <div className="h-14 w-14 rounded-2xl bg-card border border-border flex items-center justify-center transition-all shadow-sm" style={{ color: item.color }}>
                              {item.icon}
                           </div>
                           <div>
                              <h4 className="text-xl font-black text-foreground tracking-tight mb-2 group-hover:text-brand-blue transition-colors">{item.title}</h4>
                              <p className="text-muted-foreground text-[14px] font-medium leading-relaxed">{item.desc}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
               <div className="relative pt-12">
                  <motion.div 
                     initial={{ rotate: 10, y: 100 }}
                     whileInView={{ rotate: -5, y: 0 }}
                     className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border border-border bg-card"
                  >
                     <img src="/0d309038-484e-4251-b777-2debc82a90ae/demo_certificate_mockup_1775907983466.png" alt="Certificate" className="w-full h-auto opacity-90" />
                  </motion.div>
                  <motion.div 
                     initial={{ rotate: -10, y: 50 }}
                     whileInView={{ rotate: 5, y: -50 }}
                     className="absolute -top-12 -left-12 z-0 w-2/3 rounded-[3rem] overflow-hidden shadow-2xl border border-border opacity-40 blur-[2px] bg-card"
                  >
                     <img src="/0d309038-484e-4251-b777-2debc82a90ae/lor_mockup_illustration_1775908009926.png" alt="LOR" className="w-full h-auto opacity-70" />
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

function CertificationCard({ cert }: { cert: Certification }) {
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
      alert('Could not start enrollment. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-card border border-border rounded-[3.5rem] overflow-hidden shadow-2xl hover:border-brand-blue/30 transition-all duration-500"
    >
       <div className="p-10 sm:p-14 flex flex-col h-full relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/5 blur-[60px] rounded-full group-hover:bg-brand-blue/10 transition-colors" />

          <div className="flex justify-between items-start mb-14">
             <div className="h-20 w-20 rounded-3xl bg-foreground text-background flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
                <BookOpen size={36} />
             </div>
             <div className="text-right">
                <span className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">Standard Access</span>
                <div className="flex items-center justify-end gap-1 font-heading font-black text-4xl text-foreground tracking-tighter">
                   <IndianRupee size={24} className="text-brand-blue" /> {cert.price.toLocaleString()}
                </div>
             </div>
          </div>

          <h3 className="font-heading text-4xl sm:text-5xl font-black text-foreground mb-6 tracking-tighter leading-none group-hover:text-brand-blue transition-colors">
            {cert.title}
          </h3>
          <p className="text-muted-foreground text-lg font-medium leading-relaxed mb-12 flex-1 max-w-lg">
            {cert.description}
          </p>

          <div className="grid grid-cols-2 gap-8 mb-14 border-y border-border py-10">
             <div className="space-y-3">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block">Duration</span>
                <div className="flex items-center gap-2.5 font-black text-foreground uppercase tracking-tight text-sm">
                   <Clock size={16} className="text-brand-blue" /> {cert.duration}
                </div>
             </div>
             <div className="space-y-3 text-right">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block">Trust Rating</span>
                <div className="flex items-center justify-end gap-2 font-black text-foreground text-sm uppercase tracking-tight">
                   <Star size={16} className="text-brand-amber fill-brand-amber" /> 4.9/5 Precision
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 mb-16">
             <div>
                <h4 className="text-[10px] font-black text-foreground uppercase tracking-widest mb-6 px-4 py-2 bg-secondary rounded-xl border border-border inline-block">Key Takeaways</h4>
                <ul className="space-y-5">
                   {cert.features.map((f, i) => (
                      <li key={i} className="flex gap-4 text-[15px] text-muted-foreground font-medium leading-tight">
                         <CheckCircle2 size={18} className="text-brand-blue mt-0.5 shrink-0" />
                         {f}
                      </li>
                   ))}
                </ul>
             </div>
             <div>
                <h4 className="text-[10px] font-black text-foreground uppercase tracking-widest mb-6 px-4 py-2 bg-secondary rounded-xl border border-border inline-block">Syllabus Grid</h4>
                <ul className="space-y-5">
                   {cert.syllabus.slice(0, 4).map((s, i) => (
                      <li key={i} className="flex items-start gap-4 text-[15px] text-muted-foreground font-medium leading-tight group/item">
                         <div className="h-2 w-2 rounded-full bg-brand-blue/30 mt-2 shrink-0 group-hover/item:bg-brand-blue transition-colors" />
                         {s}
                      </li>
                   ))}
                </ul>
             </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-auto">
             <button
                onClick={handleEnroll}
                disabled={isProcessing}
                className="h-20 flex items-center justify-center gap-4 rounded-full bg-foreground text-background font-black text-lg uppercase tracking-widest shadow-2xl hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
             >
                {isProcessing ? <Loader2 className="animate-spin" size={24} /> : <>Enroll Mission <ArrowRight size={22} /></>}
             </button>
             <button
                className="h-20 flex items-center justify-center rounded-full bg-secondary border border-border text-foreground font-black text-lg uppercase tracking-widest hover:bg-muted transition-all"
             >
                Specification
             </button>
          </div>
       </div>
    </motion.div>
  )
}
