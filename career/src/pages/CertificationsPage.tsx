import { useState } from 'react'
import { motion } from 'framer-motion'
import { Award, Clock, CheckCircle2, IndianRupee, BookOpen, Star, Sparkles, ArrowRight, Loader2, ShieldCheck, Zap } from 'lucide-react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { api } from '../lib/apiClient'
import { SEO } from '../components/SEO'
import type { Certification } from '../types'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function CertificationsPage() {
  const { data: certifications, isLoading } = useQuery<Certification[]>({
    queryKey: ['certifications'],
    queryFn: async () => {
      const { data } = await api.get('/certifications')
      return data
    }
  })

  return (
    <div className="min-h-screen bg-white">
      <SEO title="Certifications" description="Upskill with industry-recognized certifications from SatByte." />

      {/* Hero */}
      <section className="bg-slate-50 pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-700 font-bold text-xs uppercase tracking-widest mb-6 border border-amber-200">
               <Sparkles size={14} /> Future-Proof Your Skills
            </span>
            <h1 className="font-heading text-4xl sm:text-6xl font-extrabold text-secondary leading-tight">
               Industry-standard <span className="text-secondary italic font-serif">learning programs</span>
            </h1>
            <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
               Master the latest technologies with our structured curriculum, hand-on projects, and verifiable certifications.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Program Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           {isLoading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {[1, 2].map(i => <div key={i} className="h-[500px] rounded-[3rem] bg-slate-50 animate-pulse" />)}
             </div>
           ) : certifications?.length ? (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                {certifications.map(cert => (
                   <CertificationCard key={cert._id} cert={cert} />
                ))}
             </div>
           ) : (
             <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 max-w-2xl mx-auto">
                <Award size={48} className="text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-secondary">Coming Soon</h3>
                <p className="text-slate-500 mt-2">We are crafting new learning paths for you. Stay tuned!</p>
             </div>
           )}
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-20 border-t border-slate-100">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
               <div className="text-center">
                  <div className="h-16 w-16 rounded-2xl bg-primary/5 flex items-center justify-center text-primary mx-auto mb-6">
                     <Award size={32} />
                  </div>
                  <h4 className="font-heading font-bold text-secondary text-lg mb-2">Verified Certificates</h4>
                  <p className="text-slate-500 text-sm">Every completion comes with a unique ID for LinkedIn & Resume verification.</p>
               </div>
               <div className="text-center">
                  <div className="h-16 w-16 rounded-2xl bg-emerald-500/5 flex items-center justify-center text-emerald-600 mx-auto mb-6">
                     <Zap size={32} />
                  </div>
                  <h4 className="font-heading font-bold text-secondary text-lg mb-2">Project-Based</h4>
                  <p className="text-slate-500 text-sm">Don't just watch. Build 3+ production-ready apps during the course.</p>
               </div>
               <div className="text-center">
                  <div className="h-16 w-16 rounded-2xl bg-amber-500/5 flex items-center justify-center text-amber-600 mx-auto mb-6">
                     <ShieldCheck size={32} />
                  </div>
                  <h4 className="font-heading font-bold text-secondary text-lg mb-2">Lifetime Access</h4>
                  <p className="text-slate-500 text-sm">Once enrolled, get lifetime access to curriculum updates and our community.</p>
               </div>
            </div>
         </div>
      </section>
    </div>
  )
}

function CertificationCard({ cert }: { cert: Certification }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [isProcessing, setIsProcessing] = useState(false)

  const enrollMutation = useMutation({
    mutationFn: async () => {
       const { data } = await api.post('/certifications/enroll', { certificationId: cert._id })
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
    <div className="group rounded-[3.5rem] bg-white border border-slate-200 shadow-2xl shadow-slate-200/40 p-1 bg-gradient-to-br from-white to-slate-50 hover:border-primary/30 transition-all duration-500">
       <div className="p-8 sm:p-12 flex flex-col h-full">
          <div className="flex justify-between items-start mb-8">
             <div className="h-16 w-16 rounded-2xl bg-secondary text-white flex items-center justify-center shadow-xl shadow-secondary/20">
                <BookOpen size={28} />
             </div>
             <div className="text-right">
                <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Tuition Fee</span>
                <div className="flex items-center gap-1 font-heading font-extrabold text-2xl text-secondary">
                   <IndianRupee size={20} className="text-primary" /> {cert.price.toLocaleString()}
                </div>
             </div>
          </div>

          <h3 className="font-heading text-3xl sm:text-4xl font-extrabold text-secondary mb-4 group-hover:text-primary transition-colors">
            {cert.title}
          </h3>
          <p className="text-slate-600 leading-relaxed mb-8 flex-1">
            {cert.description}
          </p>

          <div className="space-y-4 mb-10">
             <div className="flex items-center gap-3 text-slate-700 font-bold text-sm">
                <Clock size={18} className="text-primary" /> {cert.duration}
             </div>
             <div className="flex items-center gap-3 text-slate-700 font-bold text-sm">
                <Star size={18} className="text-amber-500" /> Rated 4.9/5 by 120+ Students
             </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
             <div>
                <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-4">What you'll get</h4>
                <ul className="space-y-3">
                   {cert.features.map((f, i) => (
                      <li key={i} className="flex gap-3 text-sm text-slate-600 font-medium">
                         <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
                         {f}
                      </li>
                   ))}
                </ul>
             </div>
             <div>
                <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-4">Syllabus</h4>
                <ul className="space-y-3">
                   {cert.syllabus.slice(0, 4).map((s, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-slate-600 font-medium">
                         <div className="h-1.5 w-1.5 rounded-full bg-slate-300 mt-2 shrink-0" />
                         {s}
                      </li>
                   ))}
                </ul>
             </div>
          </div>

          <button
             onClick={handleEnroll}
             disabled={isProcessing}
             className="mt-auto group/btn flex items-center justify-center gap-3 w-full py-5 rounded-[2rem] bg-secondary text-white font-extrabold text-lg shadow-xl shadow-secondary/20 hover:bg-primary hover:shadow-primary/30 active:scale-[0.98] transition-all"
          >
             {isProcessing ? <Loader2 className="animate-spin" size={24} /> : <><Sparkles size={20} /> Enroll Now <ArrowRight className="group-hover/btn:translate-x-1 transition-transform" /></>}
          </button>
       </div>
    </div>
  )
}
