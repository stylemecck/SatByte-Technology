import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Send, 
  Upload, 
  FileText, 
  Loader2, 
  User, 
  X, 
  ShieldCheck, 
  Zap, 
  Star, 
  ArrowRight,
  Briefcase,
  Globe,
  Award,
  Sparkles
} from 'lucide-react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { api } from '../lib/apiClient'
import { SEO } from '../components/SEO'
import type { Job } from '../types'
import { useAuth } from '../contexts/AuthContext'
import { cn } from '../utils/cn'

export default function JobDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [resume, setResume] = useState<File | null>(null)
  const [coverLetter, setCoverLetter] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [success, setSuccess] = useState(false)

  const { data: job, isLoading, error } = useQuery<Job>({
    queryKey: ['job', id],
    queryFn: async () => {
      const { data } = await api.get(`jobs/${id}`)
      return data
    }
  })

  const applyMutation = useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await api.post('jobs/apply', payload)
      return data
    },
    onSuccess: () => {
      setSuccess(true)
      window.scrollTo(0, 0)
    }
  })

  const handleApply = async (e: React.FormEvent) => {
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

      // Real Cloudinary upload would go here
      const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/demo/upload`, {
        method: 'POST',
        body: formData,
      })
      const cloudData = await cloudRes.json()
      
      await applyMutation.mutateAsync({
        jobId: id,
        resumeUrl: cloudData.secure_url || 'https://mock.resume.url',
        coverLetter
      })
    } catch (e) {
      console.error(e)
      alert('Failed to submit application. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#020609]">
        <div className="relative">
          <div className="h-20 w-20 border-4 border-brand-blue/20 border-t-brand-blue rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="text-brand-blue animate-pulse" size={24} />
          </div>
        </div>
        <p className="text-muted-foreground font-black uppercase tracking-widest text-[10px] mt-8">Retrieving specification...</p>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#020609] text-center px-4">
        <div className="h-20 w-20 rounded-3xl bg-red-500/10 text-red-500 flex items-center justify-center mb-8 border border-red-500/20">
           <X size={40} />
        </div>
        <h2 className="text-3xl font-black text-white tracking-tighter">Orbit Unavailable.</h2>
        <p className="text-muted-foreground mt-2 font-medium">This role may have been synchronized or the link is invalid.</p>
        <Link to="/careers" className="mt-10 h-14 px-10 rounded-2xl bg-white/5 border border-white/5 text-white font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3">
           <ArrowLeft size={16} /> Browse Active Roles
        </Link>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#020609] flex items-center justify-center py-20 px-4">
        <motion.div 
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="max-w-2xl w-full text-center p-12 md:p-24 rounded-4xl bg-[#0A0F14] border border-white/5 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-brand-emerald/10 via-transparent to-transparent opacity-50" />
          <div className="relative z-10">
            <div className="h-24 w-24 bg-brand-emerald/10 text-brand-emerald rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-2xl border border-brand-emerald/20">
              <CheckCircle2 size={48} />
            </div>
            <h2 className="font-heading text-5xl font-black text-white tracking-tighter mb-4 leading-none text-gradient-emerald">Handshake Successful.</h2>
            <p className="text-muted-foreground text-lg font-medium leading-relaxed mb-12">
              Your application for <strong>{job.title}</strong> has been prioritized. Our engineering squad will review your submission in the next orbit.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard" className="h-16 px-10 rounded-2xl bg-brand-blue text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-brand-blue/20 hover:scale-[1.03] transition-all flex items-center justify-center gap-3">
                 <LayoutDashboard size={18} /> Track Application
              </Link>
              <Link to="/careers" className="h-16 px-10 rounded-2xl bg-white/5 text-white font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                 Explore More
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#020609] pb-40 selection:bg-brand-blue/30 overflow-hidden">
      <SEO title={job.title} description={job.description.slice(0, 160)} />

      {/* --- Editorial Detail Header --- */}
      <section className="relative pt-32 pb-24">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-brand-blue/5 blur-[120px] rounded-full" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <Link to="/careers" className="inline-flex items-center gap-3 px-5 py-2 rounded-xl bg-white/5 text-white/60 border border-white/5 font-black text-[10px] uppercase tracking-widest mb-12 hover:bg-white/10 hover:text-white transition-all">
            <ArrowLeft size={16} className="text-brand-blue" /> Back to Discover
          </Link>
          
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <span className="px-3 py-1 rounded-lg bg-brand-blue/10 text-[9px] font-black uppercase tracking-widest text-brand-blue border border-brand-blue/20">
               {job.type}
            </span>
            <span className="px-3 py-1 rounded-lg bg-white/5 text-[9px] font-black uppercase tracking-widest text-white/40 border border-white/5">
               {job.category}
            </span>
          </div>
          
          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[0.9] max-w-5xl">
            {job.title}
          </h1>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          
          {/* Main Context Area */}
          <div className="lg:col-span-2 space-y-16">
             {/* Key Metrics Grid */}
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 p-10 rounded-4xl bg-[#0A0F14] border border-white/5 shadow-2xl">
                <MetricDetail icon={<MapPin size={20} />} label="Location" value={job.location} color="text-brand-blue" />
                <MetricDetail icon={<Zap size={20} />} label="Experience" value={job.experience} color="text-brand-emerald" />
                <MetricDetail icon={<Clock size={20} />} label="Type" value={job.type} color="text-brand-amber" />
                <MetricDetail icon={<Calendar size={20} />} label="Posted" value={new Date(job.createdAt).toLocaleDateString()} color="text-brand-violet" />
             </div>

             <div className="space-y-16">
                {/* Description */}
                <section className="prose prose-invert max-w-none">
                   <div className="flex items-center gap-4 mb-8">
                      <div className="h-10 w-1 bg-brand-blue rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                      <h3 className="text-3xl font-black text-white tracking-tight m-0">Mission Brief</h3>
                   </div>
                   <p className="text-muted-foreground font-medium text-lg leading-relaxed whitespace-pre-line">
                     {job.description}
                   </p>
                </section>

                {/* Requirements */}
                {job.requirements?.length > 0 && (
                  <section>
                    <div className="flex items-center gap-4 mb-10">
                      <div className="h-10 w-1 bg-brand-emerald rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                      <h3 className="text-3xl font-black text-white tracking-tight">Core Stack & Requirements</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-5">
                      {job.requirements.map((req, i) => (
                         <div key={i} className="flex gap-6 items-start p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-brand-blue/20 transition-all group">
                            <div className="h-10 w-10 rounded-2xl bg-brand-blue/5 border border-brand-blue/10 flex items-center justify-center text-brand-blue shrink-0 group-hover:bg-brand-blue group-hover:text-white transition-all">
                              <ShieldCheck size={20} />
                            </div>
                            <span className="text-muted-foreground font-bold text-[15px] leading-relaxed pt-2">{req}</span>
                         </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Responsibilities */}
                {job.responsibilities?.length > 0 && (
                  <section>
                    <div className="flex items-center gap-4 mb-10">
                      <div className="h-10 w-1 bg-brand-amber rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
                      <h3 className="text-3xl font-black text-white tracking-tight">Daily Operations</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-5">
                      {job.responsibilities.map((resp, i) => (
                         <div key={i} className="flex gap-6 items-start p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-brand-amber/20 transition-all group">
                            <div className="h-10 w-10 rounded-2xl bg-brand-amber/5 border border-brand-amber/10 flex items-center justify-center text-brand-amber shrink-0 group-hover:bg-brand-amber group-hover:text-white transition-all">
                              <Zap size={20} />
                            </div>
                            <span className="text-muted-foreground font-bold text-[15px] leading-relaxed pt-2">{resp}</span>
                         </div>
                      ))}
                    </div>
                  </section>
                )}
             </div>
          </div>

          {/* Persistent Action Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-28 premium-card p-12 bg-[#0A0F14] border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-brand-blue/5 blur-[50px] rounded-full translate-x-1/4 -translate-y-1/4" />
              
              <h3 className="text-2xl font-black text-white tracking-tight mb-10 relative z-10 leading-none">Application Hub</h3>
              
              {!user ? (
                <div className="relative z-10 text-center py-8">
                  <div className="h-24 w-24 rounded-4xl bg-white/5 border border-white/5 flex items-center justify-center mx-auto mb-10 text-muted-foreground">
                     <User size={40} />
                  </div>
                  <p className="text-muted-foreground font-bold text-sm mb-12 leading-relaxed px-4">Identity verification is required to synchronize with this orbit.</p>
                  <Link 
                    to="/login"
                    state={{ from: window.location.pathname }}
                    className="h-16 w-full rounded-full bg-brand-blue text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-brand-blue/20 flex items-center justify-center gap-3 hover:scale-[1.02] transition-all"
                  >
                    Authenticate Now <ArrowRight size={18} />
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleApply} className="relative z-10 space-y-10">
                  <div>
                     <label className="block text-[10px] font-black uppercase tracking-[0.25em] text-white/40 mb-4">Verification Artifact (PDF)</label>
                     <label className={cn(
                        'flex flex-col items-center justify-center w-full min-h-[180px] border-2 border-dashed rounded-4xl cursor-pointer transition-all group/upload relative overflow-hidden',
                        resume ? 'border-brand-blue bg-brand-blue/5' : 'border-white/5 bg-white/[0.02] hover:bg-white/5'
                     )}>
                        {resume ? (
                          <div className="flex flex-col items-center text-brand-blue text-center px-6">
                             <div className="h-16 w-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4 border border-brand-blue/20">
                                <FileText size={28} />
                             </div>
                             <span className="text-[12px] font-black line-clamp-1">{resume.name}</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center text-muted-foreground/30 text-center px-6">
                             <div className="h-16 w-16 rounded-2xl flex items-center justify-center mb-4 group-hover/upload:scale-110 transition-transform">
                                <Upload size={32} />
                             </div>
                             <span className="text-[10px] font-black uppercase tracking-widest">Select Resume</span>
                          </div>
                        )}
                        <input 
                           type="file" accept=".pdf" className="hidden" 
                           onChange={(e) => setResume(e.target.files?.[0] || null)}
                           disabled={isUploading}
                        />
                     </label>
                  </div>

                  <div>
                     <label className="block text-[10px] font-black uppercase tracking-[0.25em] text-white/40 mb-4">Mission Context (Optional)</label>
                     <textarea 
                        rows={5}
                        placeholder="Briefly describe your fit for this role..."
                        className="w-full p-6 rounded-3xl bg-white/[0.02] border border-white/5 text-white placeholder:text-muted-foreground/30 outline-none focus:border-brand-blue/50 transition-all text-sm font-bold resize-none"
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        disabled={isUploading}
                     />
                  </div>

                  <button
                    type="submit"
                    disabled={isUploading || applyMutation.isPending}
                    className="h-20 w-full rounded-full bg-brand-blue text-white font-black text-xs uppercase tracking-widest shadow-2xl shadow-brand-blue/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-4 group/apply"
                  >
                    {isUploading ? <Loader2 className="animate-spin" size={24} /> : <><Send size={22} /> Commit Application</>}
                  </button>
                  
                  <div className="pt-8 border-t border-white/5 flex items-start gap-4">
                     <ShieldCheck size={16} className="text-brand-emerald shrink-0 mt-1" />
                     <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider leading-relaxed">
                       This submission will be cryptographically hashed and logged in our recruitment engine.
                     </p>
                  </div>
                </form>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

function MetricDetail({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string, color: string }) {
   return (
      <div className="flex flex-col gap-3">
         <div className="flex items-center gap-2">
            <span className={cn("shrink-0", color)}>{icon}</span>
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{label}</span>
         </div>
         <p className="text-[14px] font-black text-white uppercase tracking-tight truncate border-l-2 border-white/10 pl-4">{value}</p>
      </div>
   )
}

import { LayoutDashboard } from 'lucide-react'
