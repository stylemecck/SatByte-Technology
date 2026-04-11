import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, Briefcase, Clock, Calendar, CheckCircle2, Send, Upload, FileText, Loader2, User } from 'lucide-react'
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
      const { data } = await api.get(`/jobs/${id}`)
      return data
    }
  })

  const applyMutation = useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await api.post('/jobs/apply', payload)
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
      // 1. Upload to Cloudinary (Mocking logic or using a signed upload)
      // For this demo, we'll assume a direct upload or preset
      const formData = new FormData()
      formData.append('file', resume)
      formData.append('upload_preset', 'ml_default') // Replace with actual preset

      const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/demo/upload`, {
        method: 'POST',
        body: formData,
      })
      const cloudData = await cloudRes.json()
      
      // 2. Submit Application
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

  if (isLoading) return <div className="p-40 text-center text-slate-400">Loading job details...</div>
  if (error || !job) return <div className="p-40 text-center"><p>Job not found.</p><Link to="/careers" className="text-primary mt-4 inline-block">Back to jobs</Link></div>

  if (success) {
    return (
      <div className="max-w-3xl mx-auto py-32 px-4 text-center">
        <div className="h-24 w-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="font-heading text-4xl font-extrabold text-secondary">Application Submitted!</h2>
        <p className="mt-4 text-lg text-slate-600">
          Good luck, {user?.name || 'Applicant'}! We've received your application for the <strong>{job.title}</strong> position. Our team will review it and get back to you and the provided email address soon.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/dashboard" className="px-8 py-3 rounded-full bg-secondary text-white font-bold">Track Application</Link>
          <Link to="/careers" className="px-8 py-3 rounded-full border border-slate-200 font-bold hover:bg-slate-50 transition-colors">Browse More Jobs</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-12 pb-32">
      <SEO title={job.title} description={job.description.slice(0, 160)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/careers" className="inline-flex items-center gap-2 font-bold text-slate-500 hover:text-primary transition-colors mb-8">
          <ArrowLeft size={18} /> Back to Listings
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <div className="p-8 sm:p-12 rounded-[2.5rem] bg-white shadow-xl shadow-slate-200/50 border border-slate-100">
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-extrabold uppercase tracking-widest">{job.type}</span>
                <span className="px-3 py-1 rounded-lg bg-secondary/10 text-secondary text-xs font-extrabold uppercase tracking-widest">{job.category}</span>
              </div>
              <h1 className="font-heading text-4xl sm:text-5xl font-extrabold text-secondary leading-tight">{job.title}</h1>
              
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-6 py-8 border-y border-slate-100">
                 <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Location</span>
                    <div className="flex items-center gap-2 font-bold text-secondary text-sm">
                      <MapPin size={16} className="text-primary" /> {job.location}
                    </div>
                 </div>
                 <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Experience</span>
                    <div className="flex items-center gap-2 font-bold text-secondary text-sm">
                      <Briefcase size={16} className="text-primary" /> {job.experience}
                    </div>
                 </div>
                 <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Work Type</span>
                    <div className="flex items-center gap-2 font-bold text-secondary text-sm">
                      <Clock size={16} className="text-primary" /> {job.type}
                    </div>
                 </div>
                 <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Posted</span>
                    <div className="flex items-center gap-2 font-bold text-secondary text-sm">
                      <Calendar size={16} className="text-primary" /> {new Date(job.createdAt).toLocaleDateString()}
                    </div>
                 </div>
              </div>

              <div className="mt-12">
                <h3 className="font-heading text-2xl font-bold text-secondary mb-6">About the Role</h3>
                <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-line">
                  {job.description}
                </p>

                {job.requirements?.length > 0 && (
                  <>
                    <h3 className="font-heading text-2xl font-bold text-secondary mt-12 mb-6">Requirements</h3>
                    <ul className="space-y-4">
                      {job.requirements.map((req, i) => (
                        <li key={i} className="flex gap-4 items-start text-slate-600">
                          <CheckCircle2 size={20} className="text-emerald-500 shrink-0 mt-1" />
                          <span className="text-[17px]">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {job.responsibilities?.length > 0 && (
                  <>
                    <h3 className="font-heading text-2xl font-bold text-secondary mt-12 mb-6">Responsibilities</h3>
                    <ul className="space-y-4">
                      {job.responsibilities.map((resp, i) => (
                        <li key={i} className="flex gap-4 items-start text-slate-600">
                          <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-2.5" />
                          <span className="text-[17px]">{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Application Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 p-8 rounded-[2.5rem] bg-secondary text-white shadow-2xl border border-white/10 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              
              <h3 className="font-heading text-2xl font-bold mb-6 relative z-10">Apply for this position</h3>
              
              {!user ? (
                <div className="relative z-10 text-center py-6">
                  <p className="text-slate-300 text-sm mb-6">You must be logged in to apply for this job.</p>
                  <Link 
                    to="/login"
                    state={{ from: window.location.pathname }}
                    className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-primary text-white font-bold hover:bg-primary-dark transition-all"
                  >
                    <User size={18} /> Sign In to Apply
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleApply} className="relative z-10 space-y-6">
                  <div>
                    <label className="block text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-400 mb-2">Resume / CV (PDF)</label>
                    <label className={cn(
                      'flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-2xl cursor-pointer transition-all hover:bg-white/5',
                      resume ? 'border-primary bg-primary/5' : 'border-white/20'
                    )}>
                      {resume ? (
                        <div className="flex flex-col items-center text-primary font-bold">
                           <FileText size={32} className="mb-2" />
                           <span className="text-xs truncate max-w-[200px]">{resume.name}</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center text-slate-400">
                           <Upload size={32} className="mb-2" />
                           <span className="text-xs">Drag or Select PDF</span>
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
                    <label className="block text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-400 mb-2">Cover Letter (Optional)</label>
                    <textarea 
                      rows={4}
                      placeholder="Tell us why you're a great fit..."
                      className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:border-primary outline-none transition-all text-sm"
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      disabled={isUploading}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isUploading || applyMutation.isPending}
                    className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-primary text-white font-extrabold text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    {isUploading ? <Loader2 className="animate-spin" size={24} /> : <><Send size={20} /> Submit Application</>}
                  </button>
                  
                  <p className="text-center text-[10px] text-slate-500 leading-relaxed">
                    By submitting, you agree to our privacy policy and terms for candidates.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
