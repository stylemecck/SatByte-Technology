import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  MapPin, 
  GraduationCap, 
  ArrowRight, 
  IndianRupee, 
  Clock, 
  BookOpen, 
  Send, 
  Upload, 
  Loader2, 
  CheckCircle2, 
  User, 
  Zap, 
  X, 
  ShieldCheck, 
  Star, 
  Award, 
  Eye,
  Sparkles,
  ChevronRight
} from 'lucide-react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { api } from '../lib/apiClient'
import { SEO } from '../components/SEO'
import type { Internship } from '../types'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { cn } from '../utils/cn'
import { CertificatePreview } from '../components/CertificatePreview'

export default function InternshipsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [previewOpen, setPreviewOpen] = useState(false)

  const { data: internships, isLoading } = useQuery<Internship[]>({
    queryKey: ['internships'],
    queryFn: async () => {
      const { data } = await api.get('internships')
      return data
    }
  })

  const filtered = internships?.filter(i => 
    i.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    i.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="bg-[#020609] min-h-screen selection:bg-brand-blue/30 overflow-hidden">
      <SEO title="Internships" description="Gain real-world experience with SatByte Internships." />

      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 pt-32 pb-20">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-emerald/10 border border-brand-emerald/20 mb-6">
              <Sparkles size={12} className="text-brand-emerald" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Student Launchpad</span>
            </div>
            <h1 className="font-heading text-5xl md:text-7xl font-black text-white tracking-tighter leading-none mb-6">
              Bridge the <span className="text-brand-emerald italic text-gradient-emerald">Gap.</span>
            </h1>
            <p className="text-lg text-muted-foreground font-medium max-w-xl">
              Work on production codebases, get direct mentorship from senior tech leads, and earn verifiable industry credentials.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
             <div className="premium-card p-1 flex bg-[#0A0F14] border-white/5">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-brand-emerald transition-colors" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search roles..."
                    className="w-full h-12 pl-12 pr-4 bg-transparent border-none text-xs font-bold text-white focus:outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
             </div>
             <button onClick={() => setPreviewOpen(true)} className="h-14 px-6 rounded-2xl bg-white/5 border border-white/5 text-white font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-white/10 transition-all">
               <Eye size={16} /> View LOR Sample
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
           {/* Listing Area */}
           <div className="xl:col-span-2 space-y-10">
              {isLoading ? (
                <div className="space-y-8">
                   {[1, 2].map(i => <div key={i} className="h-80 rounded-4xl bg-[#0A0F14] animate-pulse border border-white/5" />)}
                </div>
              ) : filtered?.length ? (
                <div className="space-y-10">
                   {filtered.map((internship, i) => (
                      <InternshipItem key={internship._id} internship={internship} index={i} />
                   ))}
                </div>
              ) : (
                <div className="py-40 text-center premium-card border-dashed">
                   <GraduationCap size={48} className="mx-auto text-muted-foreground/30 mb-6" />
                   <h3 className="text-2xl font-black text-white mb-2">No internships found</h3>
                   <p className="text-muted-foreground text-sm">We're currently tailoring new cohorts. Stay tuned.</p>
                </div>
              )}
           </div>

           {/* Sidebar - Perks & Process */}
           <aside className="space-y-10">
              <div className="premium-card p-10 bg-[#0A0F14] border-white/5">
                 <h3 className="text-white font-black text-xl mb-8 flex items-center gap-3">
                   <Star size={24} className="text-brand-amber fill-brand-amber" /> Program Perks
                 </h3>
                 <div className="space-y-8">
                    {[
                      { title: "Direct Mentorship", desc: "Work 1-on-1 with senior engineering leads.", icon: Users },
                      { title: "Global Credential", desc: "Earn a cryptographically signed certificate.", icon: Award },
                      { title: "LOR Performance", desc: "Performance-based official letters of recommendation.", icon: FileText },
                      { title: "PPO Potential", desc: "Top performers get full-time offers.", icon: Zap }
                    ].map((perk, i) => (
                      <div key={i} className="flex gap-4">
                         <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-brand-emerald shrink-0">
                            <CheckCircle2 size={18} />
                         </div>
                         <div>
                            <h4 className="text-white font-bold text-sm mb-1">{perk.title}</h4>
                            <p className="text-[11px] text-muted-foreground leading-relaxed">{perk.desc}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="premium-card p-10 bg-gradient-to-br from-brand-emerald/10 to-transparent border-brand-emerald/10">
                 <h3 className="text-white font-black text-xl mb-4">Selection Process</h3>
                 <p className="text-sm text-muted-foreground mb-8">Our selection is rigorous, focusing on potential and core engineering fundamentals.</p>
                 <div className="space-y-4">
                    {['Profile Review', 'Technical Handshake', 'Culture Synchronization', 'Orbit Launch'].map((step, i) => (
                      <div key={i} className="flex items-center gap-4">
                         <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-black text-white/40 border border-white/5">
                            0{i + 1}
                         </div>
                         <span className="text-[11px] font-black text-white uppercase tracking-widest">{step}</span>
                      </div>
                    ))}
                 </div>
              </div>
           </aside>
        </div>
      </div>

      <CertificatePreview 
        isOpen={previewOpen} 
        onClose={() => setPreviewOpen(false)} 
        type="lor"
      />
    </div>
  )
}

function InternshipItem({ internship, index }: { internship: Internship, index: number }) {
  const [showApply, setShowApply] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="premium-card bg-[#0A0F14] group overflow-hidden"
    >
      <div className="p-10 md:p-14 relative">
         <div className="absolute top-0 right-0 w-64 h-64 bg-brand-emerald/5 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />

         <div className="flex flex-col xl:flex-row justify-between gap-12 relative z-10">
            <div className="flex-1">
               <div className="flex items-center gap-3 mb-8 flex-wrap">
                  <span className="px-3 py-1 rounded-lg bg-white/5 text-[9px] font-black uppercase tracking-widest text-white/40">
                    {internship.duration}
                  </span>
                  <div className="h-1.5 w-1.5 rounded-full bg-white/10" />
                  <span className="text-[9px] font-black text-brand-emerald uppercase tracking-widest">Live Cohort</span>
               </div>
               
               <h3 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none mb-8 group-hover:text-brand-emerald transition-colors">
                  {internship.title}
               </h3>

               <div className="flex flex-wrap gap-6 mb-10 pb-8 border-b border-white/5">
                  <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                     <MapPin size={16} className="text-brand-blue" /> {internship.location}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                     <IndianRupee size={16} className="text-brand-emerald" /> {internship.stipend}
                  </div>
               </div>

               <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mb-12 font-medium">
                  {internship.description}
               </p>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                     <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-2">
                        <BookOpen size={16} className="text-brand-blue" /> Core Focus
                     </h4>
                     <ul className="space-y-3">
                        {internship.requirements.slice(0, 3).map((r, i) => (
                           <li key={i} className="flex gap-3 text-sm text-muted-foreground font-medium">
                              <CheckCircle2 size={16} className="text-brand-emerald mt-0.5 shrink-0" />
                              {r}
                           </li>
                        ))}
                     </ul>
                  </div>
                  <div className="space-y-6">
                     <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-2">
                        <Zap size={16} className="text-brand-blue" /> Technology Orbit
                     </h4>
                     <div className="flex flex-wrap gap-2">
                        {internship.skills.map((s, i) => (
                           <span key={i} className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-white/60">
                              {s}
                           </span>
                        ))}
                     </div>
                  </div>
               </div>
            </div>

            <div className="xl:w-64 flex flex-col gap-4">
               <button 
                  onClick={() => setShowApply(true)}
                  className="h-20 w-full rounded-3xl bg-brand-emerald text-white font-black text-lg uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-brand-emerald/20 hover:scale-[1.03] active:scale-[0.98] transition-all"
               >
                  Sync Profile <ArrowRight size={24} />
               </button>
               <div className="p-8 rounded-3xl bg-white/5 border border-white/5 text-center">
                  <div className="text-brand-amber font-black text-[9px] uppercase tracking-widest mb-1">Priority Track</div>
                  <p className="text-white/40 text-[9px] font-bold">Fast-track selection for active masterclass students.</p>
               </div>
            </div>
         </div>
      </div>
      
      {/* Apply Modal */}
      <AnimatePresence mode="wait">
        {showApply && (
           <InternshipApplyModal 
              internship={internship} 
              onClose={() => setShowApply(false)} 
           />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

import { Users, FileText } from 'lucide-react'

function InternshipApplyModal({ internship, onClose }: { internship: Internship, onClose: () => void }) {
   const { user } = useAuth()
   const navigate = useNavigate()
   const [resume, setResume] = useState<File | null>(null)
   const [college, setCollege] = useState('')
   const [course, setCourse] = useState('')
   const [coverLetter, setCoverLetter] = useState('')
   const [isUploading, setIsUploading] = useState(false)
   const [success, setSuccess] = useState(false)

   const applyMutation = useMutation({
     mutationFn: async (payload: any) => {
       const { data } = await api.post('internships/apply', payload)
       return data
     },
     onSuccess: () => {
       setSuccess(true)
     }
   })

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!user) {
         navigate('/login', { state: { from: window.location.pathname } })
         return
      }

      if (!resume) {
         alert('Please upload your resume.')
         return
      }

      setIsUploading(true)
      try {
         const formData = new FormData()
         formData.append('file', resume)
         formData.append('upload_preset', 'ml_default')

         // Mock upload or use real endpoint if available
         const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/demo/upload`, {
            method: 'POST',
            body: formData,
         })
         const cloudData = await cloudRes.json()
         
         await applyMutation.mutateAsync({
            internshipId: internship._id,
            resumeUrl: cloudData.secure_url || 'https://mock.resume.url',
            coverLetter,
            college,
            course
         })
      } catch (e) {
         alert('Failed to submit application.')
      } finally {
         setIsUploading(false)
      }
   }

   return (
      <motion.div 
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         exit={{ opacity: 0 }}
         className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/90 backdrop-blur-xl"
      >
         <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 30 }}
            className="w-full max-w-2xl bg-[#0A0F14] rounded-4xl border border-white/5 shadow-2xl overflow-hidden relative"
         >
            <button 
               onClick={onClose}
               className="absolute top-8 right-8 h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 text-muted-foreground hover:text-white transition-colors z-10"
            >
               <X size={20} />
            </button>

            {success ? (
               <div className="p-20 text-center">
                  <motion.div 
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="h-24 w-24 bg-brand-emerald/10 text-brand-emerald rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-2xl"
                  >
                     <CheckCircle2 size={48} />
                  </motion.div>
                  <h3 className="font-heading text-4xl font-black text-white tracking-tight">Handshake Received!</h3>
                  <p className="mt-6 text-muted-foreground text-lg font-medium">Your profile for <strong>{internship.title}</strong> is now synchronized with our recruitment engine.</p>
                  <button 
                     onClick={onClose}
                     className="mt-12 px-12 py-4 rounded-full bg-brand-emerald text-white font-black text-sm uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-brand-emerald/20"
                  >
                     Done
                  </button>
               </div>
            ) : (
               <div className="p-10 sm:p-14 overflow-y-auto max-h-[90vh] custom-scrollbar">
                  <header className="mb-12">
                     <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-emerald/10 border border-brand-emerald/20 mb-4">
                        <Sparkles size={12} className="text-brand-emerald" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-white">Application Flow</span>
                     </div>
                     <h3 className="font-heading text-4xl font-black text-white tracking-tighter">Enter the Orbit.</h3>
                     <p className="text-muted-foreground mt-2 font-medium">Syncing profile for {internship.title}</p>
                  </header>

                  {!user ? (
                     <div className="py-20 text-center premium-card border-dashed">
                        <p className="text-white mb-8 font-black text-lg tracking-tight">Sign in to start your journey.</p>
                        <Link to="/login" className="h-16 px-10 rounded-2xl bg-brand-blue text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3">
                           <User size={20} /> Sign In
                        </Link>
                     </div>
                  ) : (
                     <form onSubmit={handleSubmit} className="space-y-10">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                           <div className="space-y-4">
                              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Institution Name</label>
                              <input 
                                 required type="text" placeholder="Full University Name"
                                 className="w-full h-14 px-6 rounded-2xl bg-white/5 border border-white/5 focus:border-brand-emerald/50 outline-none transition-all text-sm font-bold text-white"
                                 value={college} onChange={(e) => setCollege(e.target.value)}
                              />
                           </div>
                           <div className="space-y-4">
                              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Course of Study</label>
                              <input 
                                 required type="text" placeholder="e.g. B.Tech Computer Science"
                                 className="w-full h-14 px-6 rounded-2xl bg-white/5 border border-white/5 focus:border-brand-emerald/50 outline-none transition-all text-sm font-bold text-white"
                                 value={course} onChange={(e) => setCourse(e.target.value)}
                              />
                           </div>
                        </div>

                        <div className="space-y-4">
                           <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Resume (PDF)</label>
                           <label className={cn(
                              'flex flex-col items-center justify-center w-full p-12 border-2 border-dashed rounded-4xl cursor-pointer transition-all hover:bg-white/5 group',
                              resume ? 'border-brand-emerald bg-brand-emerald/5' : 'border-white/5'
                           )}>
                              <div className="h-16 w-16 bg-white/5 rounded-2xl flex items-center justify-center text-muted-foreground group-hover:text-brand-emerald transition-colors mb-4 border border-white/5">
                                 <Upload size={28} />
                              </div>
                              <span className="text-sm font-black text-white text-center">
                                 {resume ? resume.name : 'Drop your CV here'}
                              </span>
                              {!resume && <p className="text-[10px] font-bold text-muted-foreground mt-2 uppercase tracking-widest">PDF format • Max 5MB</p>}
                              <input type="file" accept=".pdf" className="hidden" onChange={(e) => setResume(e.target.files?.[0] || null)} />
                           </label>
                        </div>

                        <button 
                           type="submit" disabled={isUploading || applyMutation.isPending}
                           className="w-full h-20 rounded-full bg-brand-emerald text-white font-black text-lg uppercase tracking-widest shadow-2xl shadow-brand-emerald/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                        >
                           {isUploading ? <Loader2 className="animate-spin mx-auto" size={28} /> : <>Sync Profile <Send size={20} className="inline ml-3" /></>}
                        </button>
                     </form>
                  )}
               </div>
            )}
         </motion.div>
      </motion.div>
   )
}
