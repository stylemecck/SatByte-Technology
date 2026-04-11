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
    <div className="min-h-screen bg-[#FDFDFF]">
      <SEO title="Internships" description="Gain real-world experience with SatByte Internships." />

      {/* Modern Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-32 mesh-gradient text-white">
        <div className="absolute inset-0 opacity-40">
           <div className="absolute top-0 -left-1/4 w-1/2 h-full bg-primary/20 blur-[120px] rounded-full" />
           <div className="absolute bottom-0 -right-1/4 w-1/2 h-full bg-accent/10 blur-[120px] rounded-full" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white font-extrabold text-[10px] uppercase tracking-[0.2em] mb-8">
                   <Zap size={14} className="text-accent" /> Hands-on Industry Experience
                </span>
                <h1 className="font-heading text-5xl sm:text-7xl font-extrabold leading-tight mb-8">
                   Launch your career <br /> 
                   <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-indigo-400 italic font-serif">with real projects.</span>
                </h1>
                <p className="max-w-xl text-lg text-indigo-100/80 leading-relaxed mb-10">
                   Bridge the gap between college and the high-tech industry. Work on production-level codebases and learn from veteran engineers.
                </p>
                <div className="flex gap-4">
                   <div className="px-6 py-3 rounded-2xl bg-white/10 backdrop-blur border border-white/10 flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-sm font-bold">Applications Open</span>
                   </div>
                </div>
              </motion.div>

              <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="hidden lg:block relative"
              >
                  <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />
                  <div className="relative glass-dark p-10 rounded-[4rem] border-white/10 shadow-2xl">
                     <div className="flex items-center gap-4 mb-8">
                        <div className="h-12 w-12 rounded-xl bg-accent text-secondary flex items-center justify-center">
                           <Award size={24} />
                        </div>
                        <div className="flex-1">
                           <h4 className="font-bold text-white uppercase tracking-widest text-[10px]">Perks included</h4>
                           <p className="text-indigo-200 text-sm">Recommendation Letter (LOR)</p>
                        </div>
                     </div>
                     <div className="p-1 rounded-3xl overflow-hidden bg-white/10 border border-white/20 mb-8 cursor-pointer group" onClick={() => setPreviewOpen(true)}>
                        <div className="relative overflow-hidden rounded-2xl">
                           <img src="/0d309038-484e-4251-b777-2debc82a90ae/lor_mockup_illustration_1775908009926.png" className="w-full h-auto opacity-70 group-hover:scale-110 transition-transform duration-700" alt="LOR Sample" />
                           <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="px-4 py-2 rounded-full bg-white text-secondary font-bold text-xs flex items-center gap-2">
                                <Eye size={14} /> Preview Sample
                              </span>
                           </div>
                        </div>
                     </div>
                     <button className="w-full py-4 rounded-2xl bg-white text-secondary font-extrabold hover:bg-slate-100 transition-all">
                        Browse Positions
                     </button>
                  </div>
              </motion.div>
           </div>
        </div>
      </section>

      {/* Dynamic Listing Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 -mt-20 relative z-20">
         <div className="flex flex-col lg:flex-row gap-16">
            
            {/* Main List */}
            <div className="flex-1 space-y-12">
               <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-[2.5rem] blur opacity-20 group-focus-within:opacity-40 transition-opacity" />
                  <div className="relative">
                     <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                     <input 
                        type="text" 
                        placeholder="Search for roles (e.g. Frontend, Data Science)..."
                        className="w-full pl-20 pr-8 py-8 rounded-[2.5rem] bg-white border border-slate-200 shadow-2xl shadow-slate-200/50 outline-none focus:border-primary transition-all text-lg font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                     />
                  </div>
               </div>

               {isLoading ? (
                  <div className="space-y-8">
                     {[1, 2, 3].map(i => (
                        <div key={i} className="h-64 rounded-[3.5rem] bg-slate-100 animate-pulse border border-slate-200/50" />
                     ))}
                  </div>
               ) : filtered?.length ? (
                  <div className="space-y-12 pb-20">
                     {filtered.map(internship => (
                        <InternshipCard key={internship._id} internship={internship} />
                     ))}
                  </div>
               ) : (
                  <div className="text-center py-32 bg-slate-50 rounded-[4rem] border-2 border-dashed border-slate-200 max-w-2xl mx-auto">
                     <div className="h-20 w-20 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-300 mx-auto mb-8">
                        <GraduationCap size={40} />
                     </div>
                     <h3 className="text-2xl font-bold text-secondary">Awaiting New Positions</h3>
                     <p className="text-slate-500 mt-4 px-8">We are tailoring new internship roles for the upcoming quarter. Drop your resume at careers@satbyte.in to stay in our talent pool.</p>
                  </div>
               )}
            </div>

            {/* Sidebar Info */}
            <div className="lg:w-[380px]">
               <div className="sticky top-32 space-y-8">
                  <motion.div 
                     whileHover={{ y: -5 }}
                     className="p-10 rounded-[3rem] bg-white border border-slate-200 shadow-xl shadow-slate-200/50"
                  >
                     <h3 className="font-heading font-extrabold text-secondary text-xl mb-8 flex items-center gap-3">
                        <Star className="text-primary fill-primary" size={24} /> Program Excellence
                     </h3>
                     <ul className="space-y-6">
                        {[
                           { title: 'Mentorship', desc: '1-on-1 weekly guidance from senior tech leads.' },
                           { title: 'Certification', desc: 'Industry-standard verifiable credential upon exit.' },
                           { title: 'LOR Included', desc: 'Performance-based official Recommendation Letters.' },
                           { title: 'Equity/PPO', desc: 'Exceptional performers are invited for full-time roles.' }
                        ].map((item, id) => (
                           <li key={id} className="flex gap-4">
                              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-1">
                                 <CheckCircle2 size={14} />
                              </div>
                              <div>
                                 <h5 className="font-bold text-secondary text-sm">{item.title}</h5>
                                 <p className="text-slate-500 text-xs mt-1">{item.desc}</p>
                              </div>
                           </li>
                        ))}
                     </ul>
                  </motion.div>
                  
                  <div className="p-10 rounded-[3rem] bg-secondary text-white shadow-2xl shadow-indigo-900/40 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full group-hover:bg-primary/40 transition-colors" />
                     <h3 className="font-heading font-bold text-2xl mb-4 relative">Ready to Build?</h3>
                     <p className="text-indigo-200/80 text-sm mb-8 leading-relaxed relative">Join a community of 500+ student developers work on real-world engineering challenges.</p>
                     <a href="mailto:careers@satbyte.in" className="inline-flex items-center gap-3 font-extrabold text-sm text-accent hover:text-white transition-colors">
                        careers@satbyte.in <ArrowRight size={18} />
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
      className="group premium-card rounded-[3.5rem] overflow-hidden"
    >
      <div className="p-10 sm:p-14 relative">
         <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 blur-[80px] rounded-full group-hover:bg-primary/10 transition-colors" />

         <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-10">
            <div className="flex-1">
               <div className="flex items-center gap-4 mb-8 flex-wrap">
                  <span className="px-5 py-2 rounded-xl bg-slate-900 text-white text-[10px] font-extrabold uppercase tracking-[0.2em] shadow-lg">
                     {internship.duration} Role
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                     <Clock size={14} /> Posted {new Date(internship.createdAt).toLocaleDateString()}
                  </div>
               </div>
               
               <h3 className="font-heading text-4xl sm:text-5xl font-extrabold text-secondary mb-6 leading-none tracking-tight group-hover:text-primary transition-colors">
                  {internship.title}
               </h3>

               <div className="flex flex-wrap gap-6 text-sm font-bold text-slate-500 mb-8 pb-8 border-b border-slate-100">
                  <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-50 border border-slate-100">
                     <MapPin size={18} className="text-primary" /> {internship.location}
                  </div>
                  <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-50 border border-slate-100">
                     <IndianRupee size={18} className="text-success" /> {internship.stipend}
                  </div>
                  <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-50 border border-slate-100">
                     <Award size={18} className="text-accent" /> Specialization
                  </div>
               </div>

               <p className="text-slate-500 text-lg leading-relaxed max-w-3xl mb-12">
                  {internship.description}
               </p>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
                  <div className="space-y-6">
                     <h4 className="text-[11px] font-extrabold text-slate-900 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                        <BookOpen size={16} /> Key Requirements
                     </h4>
                     <ul className="space-y-4">
                        {internship.requirements.map((r, i) => (
                           <li key={i} className="flex gap-4 text-[15px] text-slate-600 font-medium">
                              <CheckCircle2 size={18} className="text-primary mt-0.5 shrink-0" />
                              {r}
                           </li>
                        ))}
                     </ul>
                  </div>
                  <div className="space-y-6">
                     <h4 className="text-[11px] font-extrabold text-slate-900 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                        <Zap size={16} /> Stack & Skills
                     </h4>
                     <div className="flex flex-wrap gap-3">
                        {internship.skills.map((s, i) => (
                           <span key={i} className="px-5 py-2.5 rounded-2xl bg-white border border-slate-200 text-sm font-bold text-slate-700 shadow-sm group-hover:border-primary/20 transition-colors">
                              {s}
                           </span>
                        ))}
                     </div>
                  </div>
               </div>
            </div>

            <div className="flex flex-col sm:flex-row xl:flex-col gap-4">
               <button 
                  onClick={() => setShowApply(true)}
                  className="h-20 sm:w-64 px-10 rounded-[2rem] bg-secondary text-white font-extrabold text-lg flex items-center justify-center gap-3 hover:bg-primary transition-all shadow-2xl shadow-secondary/30 hover:shadow-primary/40 active:scale-95"
               >
                  Apply Now <ArrowRight size={24} />
               </button>
               <div className="flex-1 flex items-center justify-center p-6 rounded-[2rem] bg-emerald-50 border border-emerald-100/50">
                  <div className="text-center">
                     <div className="text-emerald-600 font-extrabold text-[10px] uppercase tracking-widest mb-1 flex items-center justify-center gap-2">
                        <ShieldCheck size={14} /> PPO Guaranteed
                     </div>
                     <p className="text-emerald-800/60 text-[10px] leading-tight">Based on performance</p>
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
         // Mock Cloudinary upload
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
         className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-secondary/90 backdrop-blur-md"
      >
         <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 30 }}
            className="w-full max-w-2xl bg-white rounded-[3.5rem] shadow-2xl overflow-hidden relative"
         >
            <button 
               onClick={onClose}
               className="absolute top-8 right-8 h-10 w-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors z-10"
            >
               <X size={20} />
            </button>

            {success ? (
               <div className="p-24 text-center">
                  <motion.div 
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="h-24 w-24 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-emerald-200"
                  >
                     <CheckCircle2 size={48} />
                  </motion.div>
                  <h3 className="font-heading text-4xl font-extrabold text-secondary">Application Sent!</h3>
                  <p className="mt-6 text-slate-500 text-lg">We've received your application for <strong>{internship.title}</strong>. Our team will review it and get back to you shortly.</p>
                  <button 
                     onClick={onClose}
                     className="mt-12 px-10 py-4 rounded-2xl bg-secondary text-white font-extrabold hover:bg-primary transition-all"
                  >
                     Done
                  </button>
               </div>
            ) : (
               <div className="p-10 sm:p-14 overflow-y-auto max-h-[90vh]">
                  <header className="mb-12">
                     <span className="text-primary font-extrabold text-[10px] uppercase tracking-[0.2em] mb-4 block">Official Application</span>
                     <h3 className="font-heading text-4xl font-extrabold text-secondary tracking-tight">Apply for Position</h3>
                     <p className="text-slate-400 mt-2 font-medium">{internship.title} (SatByte Labs)</p>
                  </header>

                  {!user ? (
                     <div className="py-20 text-center glass border-slate-100 rounded-[2.5rem]">
                        <p className="text-slate-600 mb-8 font-bold text-lg">Please sign in to join SatByte.</p>
                        <Link to="/login" className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-secondary text-white font-extrabold shadow-xl shadow-secondary/20">
                           <User size={20} /> Enter Account
                        </Link>
                     </div>
                  ) : (
                     <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                           <div className="space-y-3">
                              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400">College / Institution</label>
                              <input 
                                 required
                                 type="text" 
                                 placeholder="Full University Name"
                                 className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary focus:bg-white outline-none transition-all text-sm font-bold"
                                 value={college}
                                 onChange={(e) => setCollege(e.target.value)}
                              />
                           </div>
                           <div className="space-y-3">
                              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Pursuing Course</label>
                              <input 
                                 required
                                 type="text" 
                                 placeholder="e.g. B.Tech Computer Science"
                                 className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary focus:bg-white outline-none transition-all text-sm font-bold"
                                 value={course}
                                 onChange={(e) => setCourse(e.target.value)}
                              />
                           </div>
                        </div>

                        <div className="space-y-3">
                           <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Professional Resume (PDF)</label>
                           <label className={cn(
                              'flex flex-col items-center justify-center w-full p-10 border-2 border-dashed rounded-[2.5rem] cursor-pointer transition-all hover:bg-slate-50 group',
                              resume ? 'border-primary bg-primary/5' : 'border-slate-200'
                           )}>
                              <div className="h-16 w-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors mb-4">
                                 <Upload size={28} />
                              </div>
                              <span className="text-sm font-extrabold text-slate-500 text-center">
                                 {resume ? resume.name : 'Click to upload your CV'}
                              </span>
                              {!resume && <p className="text-xs text-slate-400 mt-2">Maximum file size: 5MB</p>}
                              <input type="file" accept=".pdf" className="hidden" onChange={(e) => setResume(e.target.files?.[0] || null)} />
                           </label>
                        </div>

                        <div className="space-y-3">
                           <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Profile Pitch (Optional)</label>
                           <textarea 
                              rows={4}
                              placeholder="Tell us why you are the best fit for this role..."
                              className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary focus:bg-white outline-none transition-all text-sm"
                              value={coverLetter}
                              onChange={(e) => setCoverLetter(e.target.value)}
                           />
                        </div>

                        <button 
                           type="submit"
                           disabled={isUploading || applyMutation.isPending}
                           className="w-full py-6 rounded-[2rem] bg-secondary text-white font-extrabold text-xl shadow-2xl shadow-secondary/30 hover:bg-primary transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                           {isUploading ? <Loader2 className="animate-spin mx-auto" size={28} /> : <>Submit Application <Send size={20} className="inline ml-2" /></>}
                        </button>
                     </form>
                  )}
               </div>
            )}
         </motion.div>
      </motion.div>
   )
}

