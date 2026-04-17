import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, Clock, Calendar, CheckCircle2, Send, Upload, FileText, Loader2, User, X, ShieldCheck, Zap, Star, ArrowRight } from 'lucide-react'
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="animate-spin text-brand-blue mb-4" size={48} />
        <p className="text-muted-foreground font-black uppercase tracking-widest text-[10px]">Retrieving specification...</p>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center px-4">
        <div className="h-20 w-20 rounded-[2rem] bg-secondary text-red-500 flex items-center justify-center mb-8 border border-border">
           <X size={40} />
        </div>
        <h2 className="text-3xl font-black text-foreground tracking-tighter">Access Restricted.</h2>
        <p className="text-muted-foreground mt-2 font-medium">This role may have been closed or the link is invalid.</p>
        <Link to="/careers" className="mt-10 px-8 py-4 rounded-full bg-foreground text-background font-black text-xs uppercase tracking-widest shadow-xl">
           Browse Active Roles
        </Link>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center py-20 px-4">
        <motion.div 
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="max-w-xl w-full text-center p-12 sm:p-20 rounded-[4rem] bg-card border border-border shadow-2xl"
        >
          <div className="h-24 w-24 bg-brand-emerald/10 text-brand-emerald rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-lg">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="font-heading text-4xl font-black text-foreground tracking-tighter mb-4 leading-none">Transmission Successful.</h2>
          <p className="text-muted-foreground font-medium leading-relaxed mb-12">
            Your application for <strong>{job.title}</strong> has been prioritized. Our engineering squad will review your submission shortly.
          </p>
          <div className="flex flex-col gap-4">
            <Link to="/dashboard" className="px-10 py-5 rounded-full bg-foreground text-background font-black text-xs uppercase tracking-widest shadow-xl hover:opacity-90 transition-all">
               Track Journey status
            </Link>
            <Link to="/careers" className="px-10 py-5 rounded-full text-muted-foreground font-black text-xs uppercase tracking-widest hover:text-foreground transition-colors">
               Explore more orbits
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-40 selection:bg-brand-blue/30">
      <SEO title={job.title} description={job.description.slice(0, 160)} />

      {/* Cinematic Detail Header */}
      <section className="relative pt-32 pb-20 mesh-gradient overflow-hidden">
        <div className="absolute inset-0 opacity-30 dark:opacity-20 pointer-events-none">
           <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-blue/20 blur-[120px] rounded-full translate-x-1/2" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <Link to="/careers" className="inline-flex items-center gap-3 px-5 py-2 rounded-xl bg-secondary text-foreground border border-border font-black text-[10px] uppercase tracking-widest mb-12 hover:bg-muted transition-all">
            <ArrowLeft size={16} className="text-brand-blue" /> Back to Orbits
          </Link>
          
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <span className="px-4 py-1.5 rounded-lg bg-foreground text-background font-black text-[9px] uppercase tracking-[0.2em] shadow-lg">
               {job.type} Track
            </span>
            <span className="px-4 py-1.5 rounded-lg bg-secondary text-brand-blue border border-border font-black text-[9px] uppercase tracking-[0.2em]">
               {job.category}
            </span>
          </div>
          
          <h1 className="font-heading text-5xl sm:text-7xl lg:text-[7rem] font-black text-foreground tracking-tighter leading-[0.85] max-w-4xl">
            {job.title}
          </h1>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
          
          {/* Detailed Specifications */}
          <div className="lg:col-span-2 space-y-20">
            <div>
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-20 p-12 rounded-[3rem] bg-card border border-border shadow-2xl">
                  <DetailStat icon={<MapPin size={22} />} label="Deployment" value={job.location} color="var(--brand-blue)" />
                  <DetailStat icon={<Zap size={22} />} label="Experience" value={job.experience} color="var(--brand-emerald)" />
                  <DetailStat icon={<Clock size={22} />} label="Commitment" value={job.type} color="var(--brand-amber)" />
                  <DetailStat icon={<Calendar size={22} />} label="Discovery" value={new Date(job.createdAt).toLocaleDateString()} color="var(--brand-cyan)" />
               </div>

               <div className="space-y-20">
                  <section>
                    <div className="flex items-center gap-5 mb-8">
                       <div className="h-12 w-1.5 bg-foreground rounded-full" />
                       <h3 className="font-heading text-4xl font-black text-foreground tracking-tighter">Role Mission</h3>
                    </div>
                    <p className="text-muted-foreground font-medium text-lg leading-[1.8] whitespace-pre-line">
                      {job.description}
                    </p>
                  </section>

                  {job.requirements?.length > 0 && (
                    <section>
                      <div className="flex items-center gap-5 mb-10">
                        <div className="h-12 w-1.5 bg-brand-blue rounded-full" />
                        <h3 className="font-heading text-4xl font-black text-foreground tracking-tighter">Requirements</h3>
                      </div>
                      <div className="grid grid-cols-1 gap-6">
                        {job.requirements.map((req, i) => (
                           <motion.div 
                             key={i} 
                             whileHover={{ x: 5 }}
                             className="flex gap-6 items-start p-6 rounded-[2rem] bg-secondary/50 border border-border"
                           >
                              <div className="h-10 w-10 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue shrink-0 shadow-sm">
                                <ShieldCheck size={20} />
                              </div>
                              <span className="text-foreground font-bold text-[15px] leading-relaxed pt-2">{req}</span>
                           </motion.div>
                        ))}
                      </div>
                    </section>
                  )}

                  {job.responsibilities?.length > 0 && (
                    <section>
                      <div className="flex items-center gap-5 mb-10">
                        <div className="h-12 w-1.5 bg-brand-emerald rounded-full" />
                        <h3 className="font-heading text-4xl font-black text-foreground tracking-tighter">Operating Loop</h3>
                      </div>
                      <div className="grid grid-cols-1 gap-6">
                        {job.responsibilities.map((resp, i) => (
                           <motion.div 
                             key={i} 
                             whileHover={{ x: 5 }}
                             className="flex gap-6 items-start p-6 rounded-[2rem] bg-secondary/50 border border-border"
                           >
                              <div className="h-10 w-10 rounded-xl bg-brand-emerald/10 flex items-center justify-center text-brand-emerald shrink-0">
                                <Star size={20} className="fill-brand-emerald/30" />
                              </div>
                              <span className="text-foreground font-bold text-[15px] leading-relaxed pt-2">{resp}</span>
                           </motion.div>
                        ))}
                      </div>
                    </section>
                  )}
               </div>
            </div>
          </div>

          {/* Persistent Action Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 p-12 rounded-[3.5rem] bg-card border border-border shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-brand-blue/5 blur-[40px] rounded-full translate-x-1/2 -translate-y-1/2" />
              
              <h3 className="font-heading text-2xl font-black text-foreground tracking-tighter mb-10 relative z-10 leading-none">Application Hub</h3>
              
              {!user ? (
                <div className="relative z-10 text-center py-8">
                  <div className="h-24 w-24 rounded-[2.5rem] bg-secondary flex items-center justify-center mx-auto mb-8 text-muted-foreground border border-border shadow-inner">
                     <User size={40} />
                  </div>
                  <p className="text-muted-foreground font-bold text-sm mb-10 leading-relaxed px-4 text-center">Identity verification required to initiate job transmission.</p>
                  <Link 
                    to="/login"
                    state={{ from: window.location.pathname }}
                    className="flex items-center justify-center gap-3 w-full py-6 rounded-full bg-foreground text-background font-black text-xs uppercase tracking-widest shadow-xl hover:opacity-90 transition-all group/btn"
                  >
                    Authenticate Now <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleApply} className="relative z-10 space-y-10">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground mb-4">Verification Artifact (PDF)</label>
                    <label className={cn(
                      'flex flex-col items-center justify-center w-full min-h-[180px] border-2 border-dashed rounded-[3rem] cursor-pointer transition-all duration-300 group/upload',
                      resume ? 'border-brand-blue bg-brand-blue/5' : 'border-border bg-secondary hover:bg-muted'
                    )}>
                      {resume ? (
                        <div className="flex flex-col items-center text-brand-blue text-center px-6">
                           <div className="h-20 w-20 bg-card rounded-2xl shadow-xl flex items-center justify-center mb-4 border border-brand-blue/20">
                              <FileText size={36} />
                           </div>
                           <span className="text-[12px] font-black max-w-full break-all line-clamp-1">{resume.name}</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center text-muted-foreground/40 text-center px-6">
                           <div className="h-20 w-20 rounded-2xl flex items-center justify-center mb-4 group-hover/upload:scale-110 transition-transform">
                              <Upload size={36} className="text-muted-foreground/20" />
                           </div>
                           <span className="text-[10px] font-black uppercase tracking-widest leading-none">Select Resume Object</span>
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
                    <label className="block text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground mb-4">Mission Context (Optional)</label>
                    <textarea 
                      rows={5}
                      placeholder="Why is your orbit aligned with SatByte?"
                      className="w-full p-6 rounded-2xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-brand-blue/50 transition-all text-sm font-bold resize-none"
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      disabled={isUploading}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isUploading || applyMutation.isPending}
                    className="h-20 w-full rounded-full bg-foreground text-background font-black text-[14px] uppercase tracking-widest shadow-2xl hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-4 group/apply"
                  >
                    {isUploading ? <Loader2 className="animate-spin" size={24} /> : <><Send size={22} className="group-hover/apply:translate-x-1 group-hover/apply:-translate-y-1 transition-transform" /> Commit Application</>}
                  </button>
                  
                  <div className="pt-8 border-t border-border">
                    <div className="flex items-center gap-3 mb-3">
                       <ShieldCheck size={16} className="text-brand-emerald" />
                       <span className="text-[10px] font-black text-foreground uppercase tracking-widest">Recruitment Ledger</span>
                    </div>
                    <p className="text-[9px] text-muted-foreground leading-relaxed font-bold uppercase tracking-wider">
                      Transmission is cryptographically hashed. Your submission is permanent and verified.
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

function DetailStat({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string, color: string }) {
   return (
      <div className="flex flex-col gap-3">
         <div className="flex items-center gap-2.5">
            <div className="shrink-0" style={{ color }}>{icon}</div>
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{label}</span>
         </div>
         <p className="text-[15px] font-black text-foreground uppercase tracking-tight truncate border-l-2 border-border pl-4">{value}</p>
      </div>
   )
}
