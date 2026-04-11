import { useState, useEffect, useRef } from 'react'
import { Briefcase, Award, Settings, LogOut, ChevronRight, CheckCircle2, FileText, Loader2, Sparkles, AlertCircle, TrendingUp, Trophy, Eye, Clock, ShieldCheck, X, Star, ArrowRight } from 'lucide-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams, Link } from 'react-router-dom'
import { api } from '../lib/apiClient'
import { SEO } from '../components/SEO'
import { useAuth } from '../contexts/AuthContext'
import type { Application, Enrollment } from '../types'
import { cn } from '../utils/cn'
import { CertificatePreview } from '../components/CertificatePreview'

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState<'applications' | 'certifications'>('applications')
  const [params, setParams] = useSearchParams()
  const qc = useQueryClient()
  const [previewOpen, setPreviewOpen] = useState(false)

  // Enrollment verification state
  const [verifying, setVerifying] = useState(false)
  const [verifyStatus, setVerifyStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const hasVerified = useRef(false)

  const { data: applications, isLoading: loadingApps } = useQuery<Application[]>({
    queryKey: ['my-applications'],
    queryFn: async () => {
      const { data } = await api.get('jobs/my/applications')
      if (!Array.isArray(data)) return []
      return data
    },
    enabled: !!user
  })

  const { data: enrollments, isLoading: loadingCerts, refetch: refetchEnrollments } = useQuery<Enrollment[]>({
    queryKey: ['my-enrollments'],
    queryFn: async () => {
      const { data } = await api.get('certifications/my')
      if (!Array.isArray(data)) return []
      return data
    },
    enabled: !!user
  })

  useEffect(() => {
    const enrollSuccess = params.get('enroll_success')
    const sessionId = params.get('session_id')

    if (enrollSuccess === 'true' && sessionId && !hasVerified.current) {
      hasVerified.current = true
      setActiveTab('certifications')
      handleVerifyEnrollment(sessionId)
    }
  }, [params])

  const handleVerifyEnrollment = async (sessionId: string) => {
    setVerifying(true)
    setErrorMsg('')
    try {
      await api.post('certifications/verify', { session_id: sessionId })
      setVerifyStatus('success')
      refetchEnrollments()
      qc.invalidateQueries({ queryKey: ['my-enrollments'] })
      setTimeout(() => {
        setParams({}, { replace: true })
        setVerifyStatus('idle')
      }, 10000)
    } catch (e: any) {
      console.error('Verification failed', e)
      setVerifyStatus('error')
      setErrorMsg(e.response?.data?.message || e.message || 'Unknown error occurred')
    } finally {
      setVerifying(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FDFDFF] pb-32">
      <SEO title="Dashboard" />

      {/* Premium Dashboard Header */}
      <section className="relative pt-32 pb-24 mesh-gradient text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
           <div className="absolute top-0 right-0 w-1/2 h-full bg-accent/20 blur-[120px] rounded-full translate-x-1/2" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12">
              <div className="flex items-center gap-8">
                 <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="h-28 w-28 rounded-[2.5rem] bg-white/10 backdrop-blur border border-white/20 p-1 shadow-2xl"
                 >
                    <div className="h-full w-full rounded-[2.2rem] bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white text-4xl font-black">
                      {user?.name?.[0] || 'U'}
                    </div>
                 </motion.div>
                 <div>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                       <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-extrabold text-[10px] uppercase tracking-widest mb-3 border border-emerald-500/20">
                          <CheckCircle2 size={12} /> Active Account
                       </span>
                       <h1 className="font-heading text-4xl sm:text-5xl font-extrabold tracking-tight">
                         Salutation, {user?.name?.split(' ')[0] || 'Member'}!
                       </h1>
                       <p className="mt-2 text-indigo-100/60 font-medium">Your career command center.</p>
                    </motion.div>
                 </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                 <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/10 backdrop-blur border border-white/10 text-white font-extrabold text-sm hover:bg-white/20 transition-all">
                    <Settings size={18} /> Account Settings
                 </button>
                 <button 
                   onClick={logout}
                   className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-red-500/10 backdrop-blur border border-red-500/20 text-red-200 font-extrabold text-sm hover:bg-red-500/20 transition-all"
                 >
                    <LogOut size={18} /> Secure Logout
                 </button>
              </div>
           </div>
        </div>
      </section>

      {/* Quick Stats Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard 
              label="Learning Progress" 
              value={enrollments?.length || 0} 
              icon={<TrendingUp className="text-primary" />} 
              sub="Active Certifications"
            />
            <StatCard 
              label="Career Reach" 
              value={applications?.length || 0} 
              icon={<Briefcase className="text-accent" />} 
              sub="Total Applications"
            />
            <StatCard 
              label="Achievements" 
              value="Platinum" 
              icon={<Trophy className="text-amber-500" />} 
              sub="Member Status"
            />
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
         {/* Verification Alert */}
         <AnimatePresence>
            {(verifying || verifyStatus !== 'idle') && (
               <motion.div 
                  initial={{ height: 0, opacity: 0, marginBottom: 0 }}
                  animate={{ height: 'auto', opacity: 1, marginBottom: 32 }}
                  exit={{ height: 0, opacity: 0, marginBottom: 0 }}
                  className="overflow-hidden"
               >
                  <div className={cn(
                     "p-8 rounded-[3rem] flex items-center justify-between border-2 shadow-2xl transition-all",
                     verifying ? "bg-indigo-50 border-indigo-100" :
                     verifyStatus === 'success' ? "bg-emerald-50 border-emerald-100" :
                     "bg-red-50 border-red-100"
                  )}>
                     <div className="flex items-center gap-6">
                        <div className={cn(
                           "h-16 w-16 rounded-3xl flex items-center justify-center text-white shadow-2xl",
                           verifying ? "bg-indigo-600 shadow-indigo-200" :
                           verifyStatus === 'success' ? "bg-emerald-600 shadow-emerald-200" :
                           "bg-red-600 shadow-red-200"
                        )}>
                           {verifying ? <Loader2 className="animate-spin" size={32} /> : 
                            verifyStatus === 'success' ? <Sparkles size={32} /> :
                            <AlertCircle size={32} />}
                        </div>
                        <div>
                           <h4 className={cn(
                              "font-heading text-2xl font-extrabold",
                              verifying ? "text-indigo-950" :
                              verifyStatus === 'success' ? "text-emerald-950" :
                              "text-red-950"
                           )}>
                              {verifying ? 'Verifying your achievement...' : 
                               verifyStatus === 'success' ? 'Credential Unlocked!' :
                               'System Handshake Failed'}
                           </h4>
                           <p className={cn(
                              "text-base font-semibold mt-1",
                              verifying ? "text-indigo-600/80" :
                              verifyStatus === 'success' ? "text-emerald-600/80" :
                              "text-red-600/80"
                           )}>
                              {verifying ? 'Please stay on this page while we process your secure enrollment.' : 
                               verifyStatus === 'success' ? 'Congratulations! You now have full access to your premium certification.' :
                               errorMsg || 'We could not verify your session. Our engineers have been notified.'}
                           </p>
                        </div>
                     </div>
                     <button onClick={() => { setVerifyStatus('idle'); setParams({}, { replace: true }) }} className="p-3 text-slate-400 hover:text-slate-600">
                        <X size={24} />
                     </button>
                  </div>
               </motion.div>
            )}
         </AnimatePresence>

         <div className="flex flex-col lg:flex-row gap-16">
            
            {/* Elegant Sidebar Navigation */}
            <div className="lg:w-80 space-y-4">
               <div className="p-4 rounded-[2.5rem] bg-white border border-slate-200 shadow-xl shadow-slate-200/50">
                  <TabButton 
                     active={activeTab === 'applications'} 
                     onClick={() => setActiveTab('applications')}
                     icon={Briefcase}
                     label="Applications"
                     count={applications?.length}
                  />
                  <TabButton 
                     active={activeTab === 'certifications'} 
                     onClick={() => setActiveTab('certifications')}
                     icon={Award}
                     label="Certifications"
                     count={enrollments?.length}
                  />
               </div>

               {/* Upgrade Promo */}
               <div className="p-8 rounded-[2.5rem] bg-indigo-50 border border-indigo-100 flex flex-col items-center text-center">
                  <div className="h-14 w-14 rounded-2xl bg-white flex items-center justify-center text-primary mb-6 shadow-sm">
                     <Star size={24} className="fill-primary" />
                  </div>
                  <h4 className="font-heading font-extrabold text-indigo-950 mb-2">Build Proof</h4>
                  <p className="text-xs text-indigo-600/70 mb-6 leading-relaxed">Showcase your projects and earned certificates on LinkedIn with 1-click sharing.</p>
                  <button onClick={() => setPreviewOpen(true)} className="w-full py-3 rounded-xl bg-white text-primary font-extrabold text-xs shadow-sm flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
                     <Eye size={14} /> View Demo Credential
                  </button>
               </div>
            </div>

            {/* Content Hub Area */}
            <div className="flex-1 min-h-[600px]">
               <AnimatePresence mode="wait">
                  {activeTab === 'applications' && (
                     <motion.div 
                        key="apps"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-8"
                     >
                        <header className="flex items-center justify-between mb-10">
                           <h2 className="font-heading text-3xl font-extrabold text-secondary tracking-tight">Active Applications</h2>
                           <div className="h-0.5 flex-1 bg-slate-100 mx-8" />
                        </header>
                        
                        {loadingApps ? (
                           <div className="space-y-6">
                              {[1, 2].map(i => <div key={i} className="h-32 rounded-[2.5rem] bg-slate-100 animate-pulse" />)}
                           </div>
                        ) : applications?.length ? (
                           <div className="grid grid-cols-1 gap-8">
                              {applications.map(app => (
                                 <ApplicationCard key={app._id} application={app} />
                              ))}
                           </div>
                        ) : (
                           <EmptyState 
                              icon={<FileText size={48} />} 
                              title="No applications discovered" 
                              desc="Your dream role is waiting. Browse our open positions and start applying." 
                              btnText="Explore Open Roles"
                              btnLink="/internships"
                           />
                        )}
                     </motion.div>
                  )}

                  {activeTab === 'certifications' && (
                     <motion.div 
                        key="certs"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-8"
                     >
                        <header className="flex items-center justify-between mb-10">
                           <h2 className="font-heading text-3xl font-extrabold text-secondary tracking-tight">Learning Journey</h2>
                           <div className="h-0.5 flex-1 bg-slate-100 mx-8" />
                        </header>
                        
                        {loadingCerts ? (
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              {[1, 2].map(i => <div key={i} className="h-80 rounded-[3rem] bg-slate-100 animate-pulse" />)}
                           </div>
                        ) : enrollments?.length ? (
                           <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 pb-20">
                              {enrollments.map(enrollment => (
                                 <EnrollmentCard key={enrollment._id} enrollment={enrollment} />
                              ))}
                           </div>
                        ) : (
                           <EmptyState 
                              icon={<Award size={48} />} 
                              title="No active certifications" 
                              desc="Upskill with industry masterclasses designed by engineers for engineers." 
                              btnText="Browse Programs"
                              btnLink="/certifications"
                           />
                        )}
                     </motion.div>
                  )}
               </AnimatePresence>
            </div>
         </div>
      </div>

      <CertificatePreview 
        isOpen={previewOpen} 
        onClose={() => setPreviewOpen(false)} 
        type="certificate"
      />
    </div>
  )
}

function StatCard({ label, value, icon, sub }: any) {
   return (
      <motion.div 
         whileHover={{ y: -5 }}
         className="p-8 rounded-[2.5rem] bg-white border border-slate-200 shadow-2xl shadow-slate-200/50 flex items-center gap-6"
      >
         <div className="h-16 w-16 rounded-2xl bg-slate-50 flex items-center justify-center text-2xl shadow-inner border border-slate-100">
            {icon}
         </div>
         <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{label}</span>
            <div className="flex items-baseline gap-2">
               <h4 className="text-3xl font-heading font-extrabold text-secondary">{value}</h4>
               <span className="text-[10px] text-slate-400 font-bold">{sub}</span>
            </div>
         </div>
      </motion.div>
   )
}

function TabButton({ active, onClick, icon: Icon, label, count }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center justify-between px-6 py-5 rounded-[2rem] font-extrabold text-sm transition-all mb-2 last:mb-0',
        active 
          ? 'bg-secondary text-white shadow-2xl shadow-secondary/30' 
          : 'bg-transparent text-slate-500 hover:bg-slate-50'
      )}
    >
      <div className="flex items-center gap-4">
         <div className={cn('h-2 w-2 rounded-full', active ? 'bg-accent animate-pulse' : 'bg-slate-200')} />
         <Icon size={18} /> {label}
      </div>
      {count !== undefined && (
        <span className={cn(
          'px-3 py-1 rounded-xl text-[10px] font-black',
          active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'
        )}>{count}</span>
      )}
    </button>
  )
}

function ApplicationCard({ application }: { application: Application }) {
  const statusStyles: any = {
    Pending: 'bg-amber-100 text-amber-700 border-amber-200',
    Reviewed: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    Hired: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    Rejected: 'bg-red-100 text-red-700 border-red-200',
  }

  const item: any = application.job || application.internship

  return (
    <div className="group p-8 sm:p-10 rounded-[3rem] bg-white border border-slate-200 shadow-xl shadow-slate-200/40 hover:border-primary/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-8 relative overflow-hidden">
       {/* Background Accent */}
       <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[50px] rounded-full group-hover:bg-primary/10 transition-colors" />

       <div className="relative">
          <div className="flex items-center gap-4 mb-5">
             <span className={cn('px-3.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm', statusStyles[application.status])}>
                {application.status}
             </span>
             <div className="h-1.5 w-1.5 rounded-full bg-slate-300" />
             <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.2em]">{application.type} Track</span>
          </div>
          <h4 className="font-heading text-2xl font-extrabold text-secondary tracking-tight group-hover:text-primary transition-colors">{item?.title || 'Professional Position'}</h4>
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-400 font-bold">
             <Clock size={14} /> Applied on {new Date(application.createdAt).toLocaleDateString()}
          </div>
       </div>

       <div className="flex flex-wrap items-center gap-3 relative">
          <a 
            href={application.resumeUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center h-14 px-6 rounded-2xl bg-slate-50 text-secondary font-extrabold text-sm border border-slate-100 hover:bg-slate-100 transition-all"
          >
             <FileText size={18} className="mr-2 text-primary" /> View Resume
          </a>
          <button className="h-14 px-8 rounded-2xl bg-secondary text-white font-extrabold text-sm shadow-xl shadow-secondary/20 hover:bg-primary transition-all">
             Track Status
          </button>
       </div>
    </div>
  )
}

function EnrollmentCard({ enrollment }: { enrollment: Enrollment }) {
  const cert: any = enrollment.certification

  return (
    <div className="group rounded-[3.5rem] bg-white border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden hover:border-primary/20 transition-all flex flex-col h-full relative">
       <div className="h-40 bg-slate-900 relative overflow-hidden">
          {/* Animated Background Items */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 rounded-full blur-[60px] translate-x-12 -translate-y-12 animate-pulse" />
          <div className="absolute bottom-10 left-10 flex flex-col gap-2">
             <div className="h-12 w-12 rounded-2xl bg-white/10 backdrop-blur border border-white/10 flex items-center justify-center text-accent shadow-2xl">
                <Award size={24} />
             </div>
             <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Masterclass Track</span>
          </div>
       </div>

       <div className="p-10 flex-1 flex flex-col">
          <div className="flex-1">
             <h4 className="font-heading text-2xl font-extrabold text-secondary mb-3 tracking-tight group-hover:text-primary transition-colors leading-tight">
               {cert?.title || 'Academic Program'}
             </h4>
             <p className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-2">{cert?.description}</p>
             
             <div className="space-y-4 mb-10">
                <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">
                   <span>Curriculum Progress</span>
                   <span className="text-secondary">0% Complete</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                   <motion.div initial={{ width: 0 }} animate={{ width: '5%' }} className="h-full bg-primary" />
                </div>
             </div>
          </div>
          
          <div className="flex items-center justify-between pt-8 border-t border-slate-50">
             <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-emerald-50 text-[10px] font-black text-emerald-600 uppercase tracking-widest border border-emerald-100">
                <ShieldCheck size={14} /> Official {enrollment.status}
             </div>
             <button className="h-14 px-8 rounded-2xl bg-secondary text-white font-extrabold text-sm shadow-xl shadow-secondary/10 hover:bg-primary transition-all flex items-center gap-2 group/btn">
                Launch LMS <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
             </button>
          </div>
       </div>
    </div>
  )
}

function EmptyState({ icon, title, desc, btnText, btnLink }: any) {
   return (
      <div className="p-20 text-center bg-white rounded-[4rem] border-2 border-dashed border-slate-100 shadow-xl shadow-slate-200/20">
         <div className="h-24 w-24 rounded-[2.5rem] bg-slate-50 flex items-center justify-center text-slate-200 mx-auto mb-8">
            {icon}
         </div>
         <h3 className="text-2xl font-extrabold text-secondary tracking-tight">{title}</h3>
         <p className="text-slate-400 font-medium mt-4 max-w-sm mx-auto leading-relaxed">{desc}</p>
         <Link to={btnLink} className="inline-flex items-center gap-3 mt-10 px-8 py-4 rounded-2xl bg-secondary text-white font-extrabold shadow-2xl shadow-secondary/20 hover:scale-105 transition-all">
            {btnText} <ArrowRight size={20} />
         </Link>
      </div>
   )
}

