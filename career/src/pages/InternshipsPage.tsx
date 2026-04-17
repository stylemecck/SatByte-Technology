import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MapPin, GraduationCap, ArrowRight, IndianRupee, Clock, BookOpen, Send, Upload, Loader2, CheckCircle2, User, Zap, X, ShieldCheck, Star, Award, Eye } from 'lucide-react'
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
    <div className="bg-background selection:bg-brand-blue/30">
      <SEO title="Internships" description="Gain real-world experience with SatByte Internships." />

      {/* Modern Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-24 mesh-gradient">
        <div className="absolute inset-0 opacity-30 dark:opacity-20 pointer-events-none">
           <div className="absolute top-0 -left-1/4 w-1/2 h-full bg-brand-blue/20 blur-[120px] rounded-full" />
           <div className="absolute bottom-0 -right-1/4 w-1/2 h-full bg-brand-emerald/10 blur-[120px] rounded-full" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-secondary text-foreground border border-border font-extrabold text-[10px] uppercase tracking-[0.2em] mb-8 shadow-sm">
                   <Zap size={14} className="text-brand-blue" /> Career Launchpad
                </span>
                <h1 className="font-heading text-5xl sm:text-7xl font-black text-foreground tracking-tighter leading-none mb-8">
                   Launch your career <br /> 
                   <span className="bg-gradient-to-r from-brand-blue to-foreground bg-clip-text text-transparent italic">with real projects.</span>
                </h1>
                <p className="max-w-xl text-lg text-muted-foreground leading-relaxed mb-10 font-medium">
                   Bridge the gap between college and the high-tech industry. Work on production-level codebases and learn from veteran engineers.
                </p>
                <div className="flex gap-4">
                   <div className="px-6 py-3 rounded-2xl bg-secondary border border-border flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-brand-emerald animate-pulse" />
                      <span className="text-sm font-bold text-foreground">Cohort 2024 Open</span>
                   </div>
                </div>
              </motion.div>

              <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="hidden lg:block relative"
              >
                  <div className="absolute inset-0 bg-brand-blue/10 blur-[100px] rounded-full" />
                  <div className="relative bg-card p-10 rounded-[3rem] border border-border shadow-2xl">
                     <div className="flex items-center gap-4 mb-8">
                        <div className="h-12 w-12 rounded-xl bg-brand-blue text-white flex items-center justify-center shadow-lg shadow-brand-blue/20">
                           <Award size={24} />
                        </div>
                        <div className="flex-1">
                           <h4 className="font-black text-foreground uppercase tracking-widest text-[10px]">Perks included</h4>
                           <p className="text-muted-foreground text-sm font-medium">Verifiable Certification & LOR</p>
                        </div>
                     </div>
                     <div className="p-1 rounded-3xl overflow-hidden bg-muted border border-border mb-8 cursor-pointer group" onClick={() => setPreviewOpen(true)}>
                        <div className="relative overflow-hidden rounded-2xl aspect-[1.414/1]">
                           <img src="/0d309038-484e-4251-b777-2debc82a90ae/lor_mockup_illustration_1775908009926.png" className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" alt="LOR Sample" />
                           <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="px-5 py-2.5 rounded-full bg-foreground text-background font-black text-xs flex items-center gap-2 shadow-xl">
                                <Eye size={14} /> Preview Sample
                              </span>
                           </div>
                        </div>
                     </div>
                     <button className="w-full py-4 rounded-2xl bg-foreground text-background font-black text-[14px] uppercase tracking-widest hover:opacity-90 transition-all shadow-xl">
                        Browse Positions
                     </button>
                  </div>
              </motion.div>
           </div>
        </div>
      </section>

      {/* Dynamic Listing Area */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-24 relative z-20">
         <div className="flex flex-col lg:flex-row gap-16">
            
            {/* Main List */}
            <div className="flex-1 space-y-12">
               <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-brand-blue to-foreground rounded-[2.5rem] blur opacity-10 group-focus-within:opacity-20 transition-opacity" />
                  <div className="relative">
                     <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-brand-blue transition-colors" />
                     <input 
                        type="text" 
                        placeholder="Search for roles (e.g. Frontend, Data Science)..."
                        className="w-full pl-20 pr-8 py-8 rounded-[2.5rem] bg-card border border-border shadow-2xl shadow-black/5 dark:shadow-none outline-none focus:border-brand-blue/50 transition-all text-lg font-medium text-foreground placeholder:text-muted-foreground/60"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                     />
                  </div>
               </div>

               {isLoading ? (
                  <div className="space-y-8">
                     {[1, 2, 3].map(i => (
                        <div key={i} className="h-64 rounded-[3rem] bg-muted animate-pulse border border-border" />
                     ))}
                  </div>
               ) : filtered?.length ? (
                  <div className="grid grid-cols-1 gap-10 pb-20">
                     {filtered.map(internship => (
                        <InternshipCard key={internship._id} internship={internship} />
                     ))}
                  </div>
               ) : (
                  <div className="text-center py-32 bg-muted rounded-[4rem] border-2 border-dashed border-border max-w-2xl mx-auto">
                     <div className="h-20 w-20 rounded-3xl bg-secondary flex items-center justify-center text-muted-foreground mx-auto mb-8">
                        <GraduationCap size={40} />
                     </div>
                     <h3 className="text-2xl font-black text-foreground tracking-tighter">No roles found</h3>
                     <p className="text-muted-foreground mt-4 px-8 font-medium">We are tailoring new internship roles. Drop your resume at <strong>careers@satbyte.in</strong> to stay in our talent pool.</p>
                  </div>
               )}
            </div>

            {/* Sidebar Info */}
            <div className="lg:w-[380px]">
               <div className="sticky top-28 space-y-8">
                  <motion.div 
                     whileHover={{ y: -5 }}
                     className="p-10 rounded-[2.5rem] bg-card border border-border shadow-xl"
                  >
                     <h3 className="font-heading font-black text-foreground text-xl mb-8 flex items-center gap-3 tracking-tight">
                        <Star className="text-brand-blue fill-brand-blue" size={24} /> Program Excellence
                     </h3>
                     <ul className="space-y-6">
                        {[
                           { title: 'Mentorship', desc: '1-on-1 weekly guidance from senior tech leads.' },
                           { title: 'Certification', desc: 'Industry-standard verifiable credential upon exit.' },
                           { title: 'LOR Included', desc: 'Performance-based official Recommendation Letters.' },
                           { title: 'Equity/PPO', desc: 'Exceptional performers are invited for full-time roles.' }
                        ].map((item, id) => (
                           <li key={id} className="flex gap-4">
                              <div className="h-6 w-6 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue shrink-0 mt-1">
                                 <CheckCircle2 size={14} />
                              </div>
                              <div>
                                 <h5 className="font-bold text-foreground text-sm tracking-tight">{item.title}</h5>
                                 <p className="text-muted-foreground text-xs mt-1 leading-relaxed">{item.desc}</p>
                              </div>
                           </li>
                        ))}
                     </ul>
                  </motion.div>
                  
                  <div className="p-10 rounded-[2.5rem] bg-foreground text-background shadow-2xl relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/20 blur-[60px] rounded-full group-hover:bg-brand-blue/30 transition-colors" />
                     <h3 className="font-heading font-black text-2xl mb-4 relative tracking-tight">Ready to Build?</h3>
                     <p className="text-background/60 text-sm mb-8 leading-relaxed relative font-medium">Join a community of 500+ student developers work on real-world engineering challenges.</p>
                     <a href="mailto:careers@satbyte.in" className="inline-flex items-center gap-3 font-black text-xs uppercase tracking-widest text-brand-blue hover:text-background transition-colors group">
                        Contact Admissions <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                     </a>
                  </div>
               </div>
            </div>
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

function InternshipCard({ internship }: { internship: Internship }) {
  const [showApply, setShowApply] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-card rounded-[3.5rem] border border-border shadow-2xl overflow-hidden hover:border-brand-blue/30 transition-all duration-500"
    >
      <div className="p-10 sm:p-14 relative">
         <div className="absolute top-0 right-0 w-48 h-48 bg-brand-blue/5 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />

         <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-12">
            <div className="flex-1">
               <div className="flex items-center gap-4 mb-8 flex-wrap">
                  <span className="px-5 py-2 rounded-xl bg-foreground text-background text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
                     {internship.duration} Track
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-black uppercase tracking-widest bg-secondary px-3 py-1.5 rounded-lg border border-border">
                     <Clock size={12} /> {new Date(internship.createdAt).toLocaleDateString()}
                  </div>
               </div>
               
               <h3 className="font-heading text-4xl sm:text-5xl font-black text-foreground mb-8 leading-none tracking-tighter group-hover:text-brand-blue transition-colors">
                  {internship.title}
               </h3>

               <div className="flex flex-wrap gap-6 text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-10 pb-8 border-b border-border">
                  <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-muted border border-border">
                     <MapPin size={16} className="text-brand-blue" /> {internship.location}
                  </div>
                  <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-muted border border-border">
                     <IndianRupee size={16} className="text-brand-emerald" /> {internship.stipend}
                  </div>
                  <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-muted border border-border">
                     <Award size={16} className="text-brand-amber" /> Full Credential
                  </div>
               </div>

               <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl mb-12 font-medium">
                  {internship.description}
               </p>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-8">
                     <h4 className="text-[10px] font-black text-foreground uppercase tracking-[0.3em] flex items-center gap-2">
                        <BookOpen size={16} className="text-brand-blue" /> Key Requirements
                     </h4>
                     <ul className="space-y-4">
                        {internship.requirements.map((r, i) => (
                           <li key={i} className="flex gap-4 text-[15px] text-muted-foreground font-medium leading-tight">
                              <CheckCircle2 size={18} className="text-brand-blue mt-0.5 shrink-0" />
                              {r}
                           </li>
                        ))}
                     </ul>
                  </div>
                  <div className="space-y-8">
                     <h4 className="text-[10px] font-black text-foreground uppercase tracking-[0.3em] flex items-center gap-2">
                        <Zap size={16} className="text-brand-blue" /> Environment & Stack
                     </h4>
                     <div className="flex flex-wrap gap-3">
                        {internship.skills.map((s, i) => (
                           <span key={i} className="px-5 py-2.5 rounded-2xl bg-secondary border border-border text-xs font-black uppercase tracking-widest text-foreground shadow-sm hover:border-brand-blue/20 transition-colors">
                              {s}
                           </span>
                        ))}
                     </div>
                  </div>
               </div>
            </div>

            <div className="flex flex-col sm:flex-row xl:flex-col gap-5 pt-8 xl:pt-0">
               <button 
                  onClick={() => setShowApply(true)}
                  className="h-20 sm:w-64 px-10 rounded-full bg-brand-blue text-white font-black text-lg uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-brand-blue/20 hover:scale-105 active:scale-95 transition-all"
               >
                  Get Started <ArrowRight size={24} />
               </button>
               <div className="flex-1 flex items-center justify-center p-8 rounded-[2rem] bg-brand-emerald/10 border border-brand-emerald/20">
                  <div className="text-center">
                     <div className="text-brand-emerald font-black text-[10px] uppercase tracking-[0.2em] mb-1 flex items-center justify-center gap-2">
                        <ShieldCheck size={14} /> Priority PPO
                     </div>
                     <p className="text-brand-emerald/60 text-[10px] font-bold">Standard performance basis</p>
                  </div>
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
         className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md"
      >
         <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 30 }}
            className="w-full max-w-2xl bg-card rounded-[3.5rem] border border-border shadow-2xl overflow-hidden relative"
         >
            <button 
               onClick={onClose}
               className="absolute top-8 right-8 h-10 w-10 flex items-center justify-center rounded-xl bg-secondary text-muted-foreground hover:text-foreground transition-colors z-10"
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
                  <h3 className="font-heading text-4xl font-black text-foreground tracking-tight">Application Sent!</h3>
                  <p className="mt-6 text-muted-foreground text-lg font-medium">We've received your profile for <strong>{internship.title}</strong>. Our team will review it shortly.</p>
                  <button 
                     onClick={onClose}
                     className="mt-12 px-12 py-4 rounded-full bg-foreground text-background font-black text-sm uppercase tracking-widest hover:opacity-90 transition-all shadow-xl"
                  >
                     Close Window
                  </button>
               </div>
            ) : (
               <div className="p-10 sm:p-14 overflow-y-auto max-h-[90vh] custom-scrollbar">
                  <header className="mb-12">
                     <span className="text-brand-blue font-black text-[10px] uppercase tracking-[0.3em] mb-4 block">Official Application</span>
                     <h3 className="font-heading text-4xl font-black text-foreground tracking-tighter">Enter Selection Pool</h3>
                     <p className="text-muted-foreground mt-2 font-medium">{internship.title} — SatByte Eng. Labs</p>
                  </header>

                  {!user ? (
                     <div className="py-20 text-center bg-secondary/50 rounded-[2.5rem] border border-border">
                        <p className="text-foreground mb-8 font-black text-lg tracking-tight">Sign in to start your application.</p>
                        <Link to="/login" className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-foreground text-background font-black text-xs uppercase tracking-widest shadow-xl">
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
                                 className="w-full px-6 py-4 rounded-2xl bg-secondary border border-border focus:border-brand-blue/50 outline-none transition-all text-[15px] font-bold text-foreground"
                                 value={college} onChange={(e) => setCollege(e.target.value)}
                              />
                           </div>
                           <div className="space-y-4">
                              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Pursuing Course</label>
                              <input 
                                 required type="text" placeholder="e.g. B.Tech CS"
                                 className="w-full px-6 py-4 rounded-2xl bg-secondary border border-border focus:border-brand-blue/50 outline-none transition-all text-[15px] font-bold text-foreground"
                                 value={course} onChange={(e) => setCourse(e.target.value)}
                              />
                           </div>
                        </div>

                        <div className="space-y-4">
                           <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Latest Resume (PDF)</label>
                           <label className={cn(
                              'flex flex-col items-center justify-center w-full p-12 border-2 border-dashed rounded-[3rem] cursor-pointer transition-all hover:bg-muted group',
                              resume ? 'border-brand-blue bg-brand-blue/5' : 'border-border'
                           )}>
                              <div className="h-16 w-16 bg-secondary rounded-2xl flex items-center justify-center text-muted-foreground group-hover:bg-brand-blue group-hover:text-white transition-colors mb-4 shadow-sm">
                                 <Upload size={28} />
                              </div>
                              <span className="text-[15px] font-black text-foreground text-center">
                                 {resume ? resume.name : 'Upload your CV'}
                              </span>
                              {!resume && <p className="text-[10px] font-bold text-muted-foreground mt-2 uppercase tracking-widest">PDF format only • Max 5MB</p>}
                              <input type="file" accept=".pdf" className="hidden" onChange={(e) => setResume(e.target.files?.[0] || null)} />
                           </label>
                        </div>

                        <div className="space-y-4">
                           <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Short Pitch (Optional)</label>
                           <textarea 
                              rows={4} placeholder="Why are you the best fit for this role?"
                              className="w-full px-6 py-4 rounded-2xl bg-secondary border border-border focus:border-brand-blue/50 outline-none transition-all text-[15px] font-medium text-foreground resize-none"
                              value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)}
                           />
                        </div>

                        <button 
                           type="submit" disabled={isUploading || applyMutation.isPending}
                           className="w-full py-6 rounded-full bg-foreground text-background font-black text-lg uppercase tracking-widest shadow-2xl hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                           {isUploading ? <Loader2 className="animate-spin mx-auto" size={28} /> : <>Send Application <Send size={20} className="inline ml-3" /></>}
                        </button>
                     </form>
                  )}
               </div>
            )}
         </motion.div>
      </motion.div>
   )
}
