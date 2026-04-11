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
    <div className="min-h-screen bg-[#FDFDFF]">
      <SEO title="Certifications" description="Upskill with industry-recognized certifications from SatByte." />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-24 mesh-gradient text-white">
        <div className="absolute inset-0 opacity-40">
           <div className="absolute top-0 -left-1/4 w-1/2 h-full bg-primary/20 blur-[120px] rounded-full" />
           <div className="absolute bottom-0 -right-1/4 w-1/2 h-full bg-accent/10 blur-[120px] rounded-full" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white font-extrabold text-[10px] uppercase tracking-[0.2em] mb-8">
               <Sparkles size={14} className="text-accent" /> Platinum Learning Paths
            </span>
            <h1 className="font-heading text-5xl sm:text-7xl font-extrabold leading-tight mb-8">
               Elevate your <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-indigo-400 italic font-serif">professional</span> trajectory
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-indigo-100/80 leading-relaxed mb-12">
               Master cutting-edge technologies with our high-fidelity curriculum, hand-on masterclasses, and globally recognized credentials.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
               <button 
                  onClick={() => openPreview('certificate')}
                  className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-secondary font-extrabold hover:bg-indigo-50 transition-all shadow-xl shadow-black/20"
               >
                  <Eye size={20} className="text-primary" /> View Demo Certificate
               </button>
               <button 
                  onClick={() => openPreview('lor')}
                  className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/10 backdrop-blur border border-white/20 text-white font-extrabold hover:bg-white/20 transition-all"
               >
                  <FileText size={20} className="text-accent" /> Sample LOR
               </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Ticker */}
      <div className="relative -mt-8 py-6 bg-white border-y border-slate-100 overflow-hidden z-10 mx-4 rounded-3xl shadow-xl shadow-slate-200/50 max-w-5xl lg:mx-auto lg:max-w-7xl">
         <div className="flex items-center justify-center gap-12 sm:gap-24 opacity-60">
            <div className="flex items-center gap-3 font-heading font-extrabold text-slate-400">
               <Award /> ISO 9001:2015
            </div>
            <div className="flex items-center gap-3 font-heading font-extrabold text-slate-400">
               <ShieldCheck /> STQC VERIFIED
            </div>
            <div className="hidden sm:flex items-center gap-3 font-heading font-extrabold text-slate-400">
               <Trophy /> TOP-RATED
            </div>
         </div>
      </div>

      {/* Program Grid */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-20">
           <h2 className="font-heading text-3xl font-extrabold text-secondary mb-4">Available Certification Paths</h2>
           <div className="h-1.5 w-24 bg-primary rounded-full mx-auto" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           {isLoading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {[1, 2].map(i => <div key={i} className="h-[600px] rounded-[4rem] bg-slate-100 animate-pulse" />)}
             </div>
           ) : certifications?.length ? (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
                {certifications.map(cert => (
                   <CertificationCard key={cert._id} cert={cert} />
                ))}
             </div>
           ) : (
             <div className="text-center py-32 bg-slate-50 rounded-[4rem] border-2 border-dashed border-slate-200 max-w-2xl mx-auto">
                <div className="h-20 w-20 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-300 mx-auto mb-8">
                   <Award size={40} />
                </div>
                <h3 className="text-2xl font-bold text-secondary">Crafting Excellence</h3>
                <p className="text-slate-500 mt-4 px-8 max-w-md mx-auto">We are currently curating new premium certification paths. Join the waitlist to be the first to know.</p>
             </div>
           )}
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-32 bg-secondary text-white overflow-hidden relative">
         <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 blur-[120px]" />
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
               <div>
                  <span className="text-accent font-extrabold text-xs uppercase tracking-[0.3em] mb-4 block">The SatByte Advantage</span>
                  <h3 className="text-4xl sm:text-5xl font-heading font-extrabold leading-tight mb-8">
                     More than just a piece of paper.
                  </h3>
                  <div className="space-y-8">
                     {[
                        { icon: <ShieldCheck />, title: 'Globally Verifiable', desc: 'Each certificate carries a unique cryptographic ID for instant verification.' },
                        { icon: <Zap />, title: 'Real-World Proof', desc: 'Includes a digital portfolio link showcasing all the projects you built.' },
                        { icon: <Star />, title: 'Career Support', desc: 'Get access to our internal job board and referral network for 6 months.' }
                     ].map((item, idx) => (
                        <div key={idx} className="flex gap-6 group">
                           <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-secondary transition-all">
                              {item.icon}
                           </div>
                           <div>
                              <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                              <p className="text-slate-400 text-sm">{item.desc}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
               <div className="relative pt-12">
                  <motion.div 
                     initial={{ rotate: 10, y: 100 }}
                     whileInView={{ rotate: -5, y: 0 }}
                     className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border border-white/10"
                  >
                     <img src="/0d309038-484e-4251-b777-2debc82a90ae/demo_certificate_mockup_1775907983466.png" alt="Certificate" className="w-full h-auto" />
                  </motion.div>
                  <motion.div 
                     initial={{ rotate: -10, y: 50 }}
                     whileInView={{ rotate: 5, y: -50 }}
                     className="absolute -top-12 -left-12 z-0 w-2/3 rounded-3xl overflow-hidden shadow-2xl border border-white/10 opacity-60 blur-[2px]"
                  >
                     <img src="/0d309038-484e-4251-b777-2debc82a90ae/lor_mockup_illustration_1775908009926.png" alt="LOR" className="w-full h-auto" />
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
      className="group premium-card rounded-[3rem] overflow-hidden"
    >
       <div className="p-10 sm:p-14 flex flex-col h-full relative">
          {/* Subtle Accent Glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[60px] rounded-full group-hover:bg-primary/10 transition-colors" />

          <div className="flex justify-between items-start mb-12">
             <div className="h-20 w-20 rounded-3xl bg-slate-950 text-white flex items-center justify-center shadow-2xl shadow-black/20 group-hover:scale-110 transition-transform duration-500">
                <BookOpen size={36} />
             </div>
             <div className="text-right">
                <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.2em] mb-2">Exclusive Access</span>
                <div className="flex items-center justify-end gap-1 font-heading font-extrabold text-3xl text-secondary">
                   <IndianRupee size={24} className="text-primary" /> {cert.price.toLocaleString()}
                </div>
             </div>
          </div>

          <h3 className="font-heading text-4xl sm:text-5xl font-extrabold text-secondary mb-6 tracking-tight leading-none group-hover:text-primary transition-colors">
            {cert.title}
          </h3>
          <p className="text-slate-500 text-lg leading-relaxed mb-12 flex-1 max-w-lg">
            {cert.description}
          </p>

          <div className="grid grid-cols-2 gap-8 mb-14 border-y border-slate-100 py-10">
             <div className="space-y-2">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Duration</span>
                <div className="flex items-center gap-2 font-bold text-secondary">
                   <Clock size={16} className="text-primary" /> {cert.duration}
                </div>
             </div>
             <div className="space-y-2 text-right">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Rating</span>
                <div className="flex items-center justify-end gap-2 font-bold text-secondary">
                   <Star size={16} className="text-accent fill-accent" /> 4.9/5
                </div>
             </div>
          </div>

          <div className="space-y-12 mb-16">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
                <div>
                   <h4 className="text-[11px] font-extrabold text-slate-900 uppercase tracking-widest mb-6 px-3 py-1 bg-slate-100 rounded-lg inline-block">Key Takeaways</h4>
                   <ul className="space-y-4">
                      {cert.features.map((f, i) => (
                         <li key={i} className="flex gap-4 text-[15px] text-slate-600 font-medium">
                            <CheckCircle2 size={18} className="text-primary mt-0.5 shrink-0" />
                            {f}
                         </li>
                      ))}
                   </ul>
                </div>
                <div>
                   <h4 className="text-[11px] font-extrabold text-slate-900 uppercase tracking-widest mb-6 px-3 py-1 bg-slate-100 rounded-lg inline-block">Syllabus Overview</h4>
                   <ul className="space-y-4">
                      {cert.syllabus.slice(0, 4).map((s, i) => (
                         <li key={i} className="flex items-start gap-4 text-[15px] text-slate-600 font-medium">
                            <div className="h-2 w-2 rounded-full bg-primary/20 mt-2 shrink-0 group-hover:bg-primary/40 transition-colors" />
                            {s}
                         </li>
                      ))}
                   </ul>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <button
                onClick={handleEnroll}
                disabled={isProcessing}
                className="group/btn flex items-center justify-center gap-3 py-6 rounded-[2rem] bg-secondary text-white font-extrabold text-lg shadow-xl shadow-secondary/20 hover:bg-primary hover:shadow-primary/30 active:scale-[0.98] transition-all"
             >
                {isProcessing ? <Loader2 className="animate-spin" size={24} /> : <>Enroll Now <ArrowRight className="group-hover/btn:translate-x-1 transition-transform" /></>}
             </button>
             <button
                className="flex items-center justify-center gap-3 py-6 rounded-[2rem] bg-slate-100 text-secondary font-extrabold text-lg hover:bg-slate-200 transition-all"
             >
                Learn More
             </button>
          </div>
       </div>
    </motion.div>
  )
}

