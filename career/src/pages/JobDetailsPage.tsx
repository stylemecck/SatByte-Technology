import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, Briefcase, Clock, Calendar, CheckCircle2, Send, Upload, FileText, Loader2, User, ChevronRight, X, ShieldCheck, Zap, Star } from 'lucide-react'
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-primary mb-4" size={48} />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Retrieving role specification...</p>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center px-4">
        <div className="h-20 w-20 rounded-[2rem] bg-red-50 text-red-500 flex items-center justify-center mb-8">
           <X size={40} />
        </div>
        <h2 className="text-3xl font-black text-secondary tracking-tight">Access Restricted.</h2>
        <p className="text-slate-400 mt-2 font-medium">This role may have been closed or the link is invalid.</p>
        <Link to="/careers" className="mt-10 px-8 py-4 rounded-2xl bg-secondary text-white font-black text-xs uppercase tracking-widest shadow-2xl shadow-secondary/20">
           Browse Active Roles
        </Link>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#FDFDFF] flex items-center justify-center py-20 px-4">
        <motion.div 
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="max-w-xl w-full text-center p-12 sm:p-20 rounded-[4rem] bg-white border border-slate-100 shadow-[0_40px_100px_rgba(0,0,0,0.05)]"
        >
          <div className="h-24 w-24 bg-emerald-50 text-emerald-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-inner">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="font-heading text-4xl font-extrabold text-secondary tracking-tight mb-4">Transmission Successful.</h2>
          <p className="text-slate-500 font-medium leading-relaxed mb-12">
            Your application for <strong>{job.title}</strong> has been prioritized. Our engineering squad will review your submission shortly.
          </p>
          <div className="flex flex-col gap-4">
            <Link to="/dashboard" className="px-10 py-5 rounded-[2rem] bg-secondary text-white font-black text-xs uppercase tracking-widest shadow-2xl shadow-secondary/20 hover:scale-105 transition-all">
               Track Journey status
            </Link>
            <Link to="/careers" className="px-10 py-5 rounded-[2rem] text-slate-400 font-black text-xs uppercase tracking-widest hover:text-secondary transition-colors">
               Explore more orbits
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FDFDFF] pb-40">
      <SEO title={job.title} description={job.description.slice(0, 160)} />

      {/* Cinematic Detail Header */}
      <section className="relative pt-32 pb-20 mesh-gradient text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
           <div className="absolute top-0 right-0 w-1/2 h-full bg-accent/20 blur-[120px] rounded-full translate-x-1/2" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/careers" className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-white/10 backdrop-blur border border-white/10 text-white font-black text-[10px] uppercase tracking-widest mb-12 hover:bg-white/20 transition-all">
            <ArrowLeft size={16} /> All Opportunities
          </Link>
          
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="px-3.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-black text-[9px] uppercase tracking-[0.2em] border border-emerald-500/20">
               {job.type} Track
            </span>
            <span className="px-3.5 py-1 rounded-lg bg-white/10 text-white/60 font-black text-[9px] uppercase tracking-[0.2em] border border-white/10">
               {job.category}
            </span>
          </div>
          
          <h1 className="font-heading text-5xl sm:text-7xl font-black text-white tracking-tighter leading-[0.95] max-w-4xl">
            {job.title}
          </h1>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
          
          {/* Detailed Specifications */}
          <div className="lg:col-span-2 space-y-16">
            <div>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 p-10 rounded-[3rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/40">
                  <DetailStat icon={<MapPin size={18} />} label="Deployment" value={job.location} />
                  <DetailStat icon={<Zap size={18} />} label="Experience" value={job.experience} />
                  <DetailStat icon={<Clock size={18} />} label="Commitment" value={job.type} />
                  <DetailStat icon={<Calendar size={18} />} label="Discovery" value={new Date(job.createdAt).toLocaleDateString()} />
               </div>

               <div className="prose prose-slate max-w-none">
                  <div className="flex items-center gap-4 mb-8">
                     <div className="h-10 w-0.5 bg-primary" />
                     <h3 className="font-heading text-3xl font-black text-secondary tracking-tight m-0">Role Mission</h3>
                  </div>
                  <p className="text-slate-500 font-medium text-lg leading-[1.8] whitespace-pre-line mb-16">
                    {job.description}
                  </p>

                  {job.requirements?.length > 0 && (
                    <div className="mb-16">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="h-10 w-0.5 bg-emerald-500" />
                        <h3 className="font-heading text-3xl font-black text-secondary tracking-tight m-0">Requirements</h3>
                      </div>
                      <ul className="space-y-6 list-none p-0">
                        {job.requirements.map((req, i) => (
                          <li key={i} className="flex gap-6 items-start">
                             <div className="h-8 w-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0 shadow-sm border border-emerald-100">
                               <ShieldCheck size={18} />
                             </div>
                             <span className="text-slate-500 font-semibold text-base pt-1">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {job.responsibilities?.length > 0 && (
                    <div>
                      <div className="flex items-center gap-4 mb-8">
                        <div className="h-10 w-0.5 bg-accent" />
                        <h3 className="font-heading text-3xl font-black text-secondary tracking-tight m-0">Operating Loop</h3>
                      </div>
                      <ul className="space-y-6 list-none p-0">
                        {job.responsibilities.map((resp, i) => (
                          <li key={i} className="flex gap-6 items-start">
                             <div className="h-8 w-8 rounded-xl bg-slate-50 flex items-center justify-center text-accent/50 shrink-0 border border-slate-100">
                               <Star size={16} className="fill-accent/20" />
                             </div>
                             <span className="text-slate-500 font-semibold text-base pt-1">{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
               </div>
            </div>
          </div>

          {/* Persistent Action Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 p-10 rounded-[3.5rem] bg-white border border-slate-100 shadow-2xl shadow-slate-200/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 blur-[40px] rounded-full translate-x-1/2 -translate-y-1/2" />
              
              <h3 className="font-heading text-2xl font-black text-secondary tracking-tight mb-8 relative z-10">Application Hub</h3>
              
              {!user ? (
                <div className="relative z-10 text-center py-6">
                  <div className="h-20 w-20 rounded-[2rem] bg-slate-50 flex items-center justify-center mx-auto mb-6 text-slate-300 border border-slate-100 shadow-inner">
                     <User size={32} />
                  </div>
                  <p className="text-slate-400 font-semibold text-sm mb-10 leading-relaxed">Identity verification required to initiate job transmission.</p>
                  <Link 
                    to="/login"
                    state={{ from: window.location.pathname }}
                    className="flex items-center justify-center gap-3 w-full py-5 rounded-2xl bg-secondary text-white font-black text-xs uppercase tracking-widest shadow-2xl shadow-secondary/20 hover:bg-primary hover:scale-[1.02] transition-all"
                  >
                    Authenticate Securely
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleApply} className="relative z-10 space-y-8">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-4">Master Resume (PDF)</label>
                    <label className={cn(
                      'flex flex-col items-center justify-center w-full min-h-[160px] border-2 border-dashed rounded-[2.5rem] cursor-pointer transition-all duration-300 group/upload',
                      resume ? 'border-primary bg-primary/5' : 'border-slate-100 bg-slate-50 hover:bg-white hover:border-primary/50'
                    )}>
                      {resume ? (
                        <div className="flex flex-col items-center text-primary">
                           <div className="h-16 w-16 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-3">
                              <FileText size={32} />
                           </div>
                           <span className="text-[11px] font-black max-w-[180px] break-all px-4">{resume.name}</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center text-slate-300">
                           <div className="h-16 w-16 rounded-2xl flex items-center justify-center mb-3 group-hover/upload:scale-110 transition-transform">
                              <Upload size={32} />
                           </div>
                           <span className="text-[10px] font-black uppercase tracking-[0.1em]">Select PDF Object</span>
                        </div>
                      )}
                      <input 
                        type="file" 
                        accept=".pdf" 
                        className="hidden" 
                        onChange={(e) => setResume(e.target.files?.[0] || null)}
                        disabled={isUploading}
                      />
                    </label>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-4">Career Context (Optional)</label>
                    <textarea 
                      rows={4}
                      placeholder="Why is your orbit aligned with SatByte?"
                      className="w-full p-6 rounded-2xl bg-slate-50 border border-slate-100 text-secondary placeholder-slate-300 focus:bg-white focus:border-primary outline-none transition-all text-sm font-semibold"
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      disabled={isUploading}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isUploading || applyMutation.isPending}
                    className="flex items-center justify-center gap-3 w-full py-5 rounded-2xl bg-secondary text-white font-black text-xs uppercase tracking-widest shadow-2xl shadow-secondary/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 group"
                  >
                    {isUploading ? <Loader2 className="animate-spin" size={20} /> : <><Send size={18} className="group-hover:translate-x-1 transition-transform" /> Commit Application</>}
                  </button>
                  
                  <div className="pt-6 border-t border-slate-50">
                    <div className="flex items-center gap-2 mb-2">
                       <ShieldCheck size={14} className="text-emerald-500" />
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Secure Verification</span>
                    </div>
                    <p className="text-[9px] text-slate-300 leading-relaxed font-bold">
                      Your data is encrypted. Submission creates a permanent hash on our recruitment ledger.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DetailStat({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
   return (
      <div className="flex flex-col gap-2">
         <div className="flex items-center gap-2 text-primary/40">
            {icon}
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{label}</span>
         </div>
         <p className="text-sm font-black text-secondary uppercase tracking-tight truncate">{value}</p>
      </div>
   )
}

