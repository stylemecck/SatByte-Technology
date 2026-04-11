import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MapPin, GraduationCap, ArrowRight, IndianRupee, Clock, BookOpen, Send, Upload, Loader2, CheckCircle2, User, Zap, X } from 'lucide-react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { api } from '../lib/apiClient'
import { SEO } from '../components/SEO'
import type { Internship } from '../types'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { cn } from '../utils/cn'

export default function InternshipsPage() {
  const [searchTerm, setSearchTerm] = useState('')
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
    <div className="min-h-screen bg-white">
      <SEO title="Internships" description="Gain real-world experience with SatByte Internships." />

      {/* Hero */}
      <div className="bg-[#0f172a] text-white pt-24 pb-20 overflow-hidden relative">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <h1 className="font-heading text-4xl sm:text-6xl font-extrabold leading-tight">
               Launch your career <br /> 
               <span className="text-primary">with real projects.</span>
            </h1>
            <p className="mt-6 text-slate-400 text-lg max-w-2xl">
               Our internship program is designed to bridge the gap between college and the industry. 
               Work on high-impact products and learn from senior engineers.
            </p>
         </div>
      </div>

      {/* Listing Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-10 relative z-20">
         <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Main List */}
            <div className="flex-1 space-y-8">
               <div className="relative group">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary" />
                  <input 
                    type="text" 
                    placeholder="Search internships..."
                    className="w-full pl-16 pr-6 py-6 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 outline-none focus:border-primary transition-all text-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
               </div>

               {isLoading ? (
                  <div className="space-y-6">
                     {[1, 2, 3].map(i => (
                        <div key={i} className="h-48 rounded-[2.5rem] bg-slate-50 animate-pulse border border-slate-100" />
                     ))}
                  </div>
               ) : filtered?.length ? (
                  <div className="space-y-8">
                     {filtered.map(internship => (
                        <InternshipCard key={internship._id} internship={internship} />
                     ))}
                  </div>
               ) : (
                  <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                     <GraduationCap size={48} className="text-slate-300 mx-auto mb-4" />
                     <h3 className="text-xl font-bold text-secondary">No openings at the moment</h3>
                     <p className="text-slate-500 mt-2">Check back later or browse our jobs.</p>
                  </div>
               )}
            </div>

            {/* Sticky Sidebar Info */}
            <div className="lg:w-[350px]">
               <div className="sticky top-32 space-y-6">
                  <div className="p-8 rounded-[2rem] bg-slate-100 border border-slate-200/60">
                     <h3 className="font-heading font-extrabold text-secondary mb-4 flex items-center gap-2">
                        <CheckCircle2 className="text-primary" size={20} /> Quick Info
                     </h3>
                     <ul className="space-y-4 text-sm text-slate-600">
                        <li className="flex items-start gap-2">
                           <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                           Regular technical assessments
                        </li>
                        <li className="flex items-start gap-2">
                           <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                           Pre-placement offers for top performers
                        </li>
                        <li className="flex items-start gap-2">
                           <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                           Verified completion certificates
                        </li>
                     </ul>
                  </div>
                  <div className="p-8 rounded-[2rem] bg-gradient-to-br from-primary to-blue-700 text-white shadow-xl shadow-primary/20">
                     <h3 className="font-heading font-bold text-xl mb-3">Questions?</h3>
                     <p className="text-blue-100 text-sm mb-6">Reach out to our university relations team for more details.</p>
                     <a href="mailto:careers@satbyte.in" className="inline-flex items-center gap-2 font-extrabold text-sm border-b-2 border-white/30 pb-1 hover:border-white transition-all">
                        careers@satbyte.in
                     </a>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  )
}

function InternshipCard({ internship }: { internship: Internship }) {
  const [showApply, setShowApply] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group rounded-[2.5rem] bg-white border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden hover:border-primary/30 transition-all duration-500"
    >
      <div className="p-8 sm:p-10">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex-1">
               <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-600 text-[10px] font-extrabold uppercase tracking-widest border border-emerald-200">
                     {internship.duration}
                  </span>
                  <span className="text-xs text-slate-400 font-bold">{new Date(internship.createdAt).toLocaleDateString()}</span>
               </div>
               <h3 className="font-heading text-3xl font-extrabold text-secondary mb-4 leading-tight">
                  {internship.title}
               </h3>
               <div className="flex flex-wrap gap-5 text-sm font-bold text-slate-500 mb-6">
                  <div className="flex items-center gap-1.5"><MapPin size={16} className="text-slate-400" /> {internship.location}</div>
                  <div className="flex items-center gap-1.5"><IndianRupee size={16} className="text-slate-400" /> {internship.stipend}</div>
                  <div className="flex items-center gap-1.5"><Clock size={16} className="text-slate-400" /> {internship.duration}</div>
               </div>
               <p className="text-slate-600 leading-relaxed max-w-2xl line-clamp-3">
                  {internship.description}
               </p>
            </div>
            <button 
               onClick={() => setShowApply(true)}
               className="h-14 px-8 rounded-full bg-secondary text-white font-extrabold flex items-center justify-center gap-2 hover:bg-primary transition-all shadow-lg shadow-secondary/20 hover:shadow-primary/30"
            >
               Apply Now <ArrowRight size={20} />
            </button>
         </div>
         
         <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
               <h4 className="font-heading font-bold text-secondary mb-4 flex items-center gap-2 uppercase tracking-widest text-[11px]"><BookOpen size={16} /> Requirements</h4>
               <ul className="space-y-3">
                  {internship.requirements.map((r, i) => (
                     <li key={i} className="flex gap-3 text-sm text-slate-600 font-medium">
                        <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
                        {r}
                     </li>
                  ))}
               </ul>
            </div>
            <div>
               <h4 className="font-heading font-bold text-secondary mb-4 flex items-center gap-2 uppercase tracking-widest text-[11px]"><Zap size={16} /> Key Skills</h4>
               <div className="flex flex-wrap gap-2">
                  {internship.skills.map((s, i) => (
                     <span key={i} className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600">
                        {s}
                     </span>
                  ))}
               </div>
            </div>
         </div>
      </div>
      
      {/* Apply Modal */}
      <AnimatePresence>
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
       const { data } = await api.post('/internships/apply', payload)
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
         className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-secondary/80 backdrop-blur-sm"
      >
         <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden relative"
         >
            <button 
               onClick={onClose}
               className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors z-10"
            >
               <X size={20} />
            </button>

            {success ? (
               <div className="p-20 text-center">
                  <div className="h-20 w-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                     <CheckCircle2 size={40} />
                  </div>
                  <h3 className="font-heading text-3xl font-extrabold text-secondary">Success!</h3>
                  <p className="mt-4 text-slate-600">Your application for <strong>{internship.title}</strong> has been sent.</p>
                  <button 
                     onClick={onClose}
                     className="mt-10 px-8 py-3 rounded-full bg-secondary text-white font-bold"
                  >
                     Close Window
                  </button>
               </div>
            ) : (
               <div className="p-8 sm:p-12 overflow-y-auto max-h-[90vh]">
                  <h3 className="font-heading text-3xl font-extrabold text-secondary mb-2">Apply for Internship</h3>
                  <p className="text-slate-500 text-sm mb-10">Role: <span className="font-bold text-primary">{internship.title}</span></p>

                  {!user ? (
                     <div className="py-10 text-center">
                        <p className="text-slate-600 mb-6 font-medium">Please sign in to your SatByte account to apply.</p>
                        <Link to="/login" className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-primary text-white font-bold">
                           <User size={18} /> Sign In Now
                        </Link>
                     </div>
                  ) : (
                     <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                           <div>
                              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">College Name</label>
                              <input 
                                 required
                                 type="text" 
                                 className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-primary outline-none transition-all"
                                 value={college}
                                 onChange={(e) => setCollege(e.target.value)}
                              />
                           </div>
                           <div>
                              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">Current Course</label>
                              <input 
                                 required
                                 type="text" 
                                 placeholder="e.g. B.Tech CS"
                                 className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-primary outline-none transition-all"
                                 value={course}
                                 onChange={(e) => setCourse(e.target.value)}
                              />
                           </div>
                        </div>

                        <div>
                           <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">Resume (PDF)</label>
                           <label className={cn(
                              'flex items-center gap-4 w-full p-4 border-2 border-dashed rounded-2xl cursor-pointer transition-all hover:bg-slate-50',
                              resume ? 'border-primary bg-primary/5' : 'border-slate-200'
                           )}>
                              <Upload size={24} className={resume ? 'text-primary' : 'text-slate-400'} />
                              <span className="text-sm font-bold text-slate-500 truncate">
                                 {resume ? resume.name : 'Upload your latest CV/Resume'}
                              </span>
                              <input type="file" accept=".pdf" className="hidden" onChange={(e) => setResume(e.target.files?.[0] || null)} />
                           </label>
                        </div>

                        <div>
                           <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">Why should we select you?</label>
                           <textarea 
                              rows={3}
                              className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-primary outline-none transition-all text-sm"
                              value={coverLetter}
                              onChange={(e) => setCoverLetter(e.target.value)}
                           />
                        </div>

                        <button 
                           type="submit"
                           disabled={isUploading || applyMutation.isPending}
                           className="w-full py-4 rounded-2xl bg-secondary text-white font-extrabold text-lg shadow-xl shadow-secondary/20 hover:scale-[1.01] transition-all disabled:opacity-50"
                        >
                           {isUploading ? <Loader2 className="animate-spin mx-auto" size={24} /> : <><Send size={20} className="inline mr-2" /> Submit Application</>}
                        </button>
                     </form>
                  )}
               </div>
            )}
         </motion.div>
      </motion.div>
   )
}
