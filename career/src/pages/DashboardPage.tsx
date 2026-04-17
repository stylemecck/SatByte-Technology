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
    <div className="bg-background min-h-screen pb-32 selection:bg-brand-blue/30">
      <SEO title="Dashboard" />

      {/* Premium Dashboard Header */}
      <section className="relative pt-32 pb-24 mesh-gradient overflow-hidden border-b border-border">
        <div className="absolute inset-0 opacity-30 dark:opacity-20 pointer-events-none">
           <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-blue/20 blur-[120px] rounded-full translate-x-1/2" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
           <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12">
              <div className="flex items-center gap-10">
                 <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="h-32 w-32 rounded-[2.5rem] bg-card border-2 border-border p-1 shadow-2xl relative group"
                 >
                    <div className="h-full w-full rounded-[2.2rem] bg-foreground text-background flex items-center justify-center text-4xl font-black group-hover:bg-brand-blue transition-colors duration-500">
                      {user?.name?.[0] || 'U'}
                    </div>
                    <div className="absolute -bottom-2 -right-2 h-10 w-10 bg-brand-emerald rounded-2xl flex items-center justify-center text-white shadow-xl border-4 border-card">
                       <ShieldCheck size={20} />
                    </div>
                 </motion.div>
                 <div>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                       <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary text-foreground border border-border font-black text-[10px] uppercase tracking-[0.2em] mb-4 shadow-sm">
                          <CheckCircle2 size={14} className="text-brand-emerald" /> Verified Identity
                       </span>
                       <h1 className="font-heading text-4xl sm:text-6xl font-black text-foreground tracking-tighter leading-none mb-4">
                         Salutations, <br /> <span className="bg-gradient-to-r from-brand-blue to-foreground bg-clip-text text-transparent italic">{user?.name?.split(' ')[0] || 'Member'}!</span>
                       </h1>
                       <p className="text-muted-foreground font-medium text-lg flex items-center gap-2">
                         Managing your <span className="text-foreground font-black uppercase tracking-widest text-xs">career command center</span>
                       </p>
                    </motion.div>
                 </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                 <button className="h-16 px-8 rounded-full bg-secondary border border-border text-foreground font-black text-xs uppercase tracking-widest hover:bg-muted transition-all shadow-sm flex items-center gap-3">
                    <Settings size={20} /> Preferences
                 </button>
                 <button 
                   onClick={logout}
                   className="h-16 px-8 rounded-full bg-secondary border border-border text-red-500 font-black text-xs uppercase tracking-widest hover:bg-red-500/5 hover:border-red-500/20 transition-all flex items-center gap-3"
                 >
                    <LogOut size={20} /> Terminate Session
                 </button>
              </div>
           </div>
        </div>
      </section>

      {/* Quick Stats Overview */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 -mt-12 relative z-20">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatCard 
              label="Learning Orbit" 
              value={enrollments?.length || 0} 
              icon={<TrendingUp className="text-brand-blue" />} 
              sub="Active Credentials"
              color="var(--brand-blue)"
            />
            <StatCard 
              label="Career Reach" 
              value={applications?.length || 0} 
              icon={<Briefcase className="text-brand-emerald" />} 
              sub="Active Submissions"
              color="var(--brand-emerald)"
            />
            <StatCard 
              label="Member Status" 
              value="Platinum" 
              icon={<Trophy className="text-brand-amber" />} 
              sub="Achievement Tier"
              color="var(--brand-amber)"
            />
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 mt-20">
         {/* Verification Alert */}
         <AnimatePresence>
            {(verifying || verifyStatus !== 'idle') && (
               <motion.div 
                  initial={{ height: 0, opacity: 0, marginBottom: 0 }}
                  animate={{ height: 'auto', opacity: 1, marginBottom: 40 }}
                  exit={{ height: 0, opacity: 0, marginBottom: 0 }}
                  className="overflow-hidden"
               >
                  <div className={cn(
                     "p-10 rounded-[3.5rem] flex items-center justify-between border-2 shadow-2xl transition-all",
                     verifying ? "bg-brand-blue/5 border-brand-blue/20" :
                     verifyStatus === 'success' ? "bg-brand-emerald/5 border-brand-emerald/20" :
                     "bg-red-500/5 border-red-500/20"
                  )}>
                     <div className="flex items-center gap-10">
                        <div className={cn(
                           "h-20 w-20 rounded-[2rem] flex items-center justify-center text-white shadow-2xl",
                           verifying ? "bg-brand-blue" :
                           verifyStatus === 'success' ? "bg-brand-emerald" :
                           "bg-red-500 shadow-red-200"
                        )}>
                           {verifying ? <Loader2 className="animate-spin" size={32} /> : 
                            verifyStatus === 'success' ? <Sparkles size={32} /> :
                            <AlertCircle size={32} />}
                        </div>
                        <div>
                           <h4 className={cn(
                              "font-heading text-3xl font-black tracking-tight",
                              verifying ? "text-foreground" :
                              verifyStatus === 'success' ? "text-foreground" :
                              "text-foreground"
                           )}>
                              {verifying ? 'Verifying secure identity...' : 
                               verifyStatus === 'success' ? 'Credential Transmission Successful!' :
                               'System Handshake Verification Failed'}
                           </h4>
                           <p className="text-muted-foreground font-bold text-sm mt-2 uppercase tracking-widest">
                              {verifying ? 'Please remain active while we verify your secure enrollment hash.' : 
                               verifyStatus === 'success' ? 'Deployment complete. You now have full access to your premium certification orbit.' :
                               errorMsg || 'We could not verify your session. Our engineers have been synchronized with this failure.'}
                           </p>
                        </div>
                     </div>
                     <button onClick={() => { setVerifyStatus('idle'); setParams({}, { replace: true }) }} className="h-14 w-14 rounded-2xl bg-secondary text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center border border-border">
                        <X size={24} />
                     </button>
                  </div>
               </motion.div>
            )}
         </AnimatePresence>

         <div className="flex flex-col lg:flex-row gap-20">
            
            {/* Elegant Sidebar Navigation */}
            <div className="lg:w-[360px] space-y-8">
               <div className="p-4 rounded-[3rem] bg-card border border-border shadow-2xl">
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
               <div className="p-12 rounded-[3rem] bg-foreground text-background shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/20 blur-[60px] rounded-full group-hover:bg-brand-blue/30 transition-colors" />
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="h-16 w-16 rounded-2xl bg-background flex items-center justify-center text-foreground mb-8 shadow-xl">
                       <Star size={32} className="fill-brand-amber stroke-brand-amber" />
                    </div>
                    <h4 className="font-heading font-black text-2xl tracking-tighter mb-4 leading-none">Global Verifiability</h4>
                    <p className="text-background/60 text-sm font-bold uppercase tracking-widest mb-10 leading-relaxed">Cryptographically signed credentials for your portfolio.</p>
                    <button onClick={() => setPreviewOpen(true)} className="w-full h-14 rounded-full bg-brand-blue text-white font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all">
                       <Eye size={18} /> View Demo Credential
                    </button>
                  </div>
               </div>
            </div>

            {/* Content Hub Area */}
            <div className="flex-1 min-h-[600px]">
               <AnimatePresence mode="wait">
                  {activeTab === 'applications' && (
                     <motion.div 
                        key="apps"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-12"
                     >
                        <header className="flex items-center justify-between">
                           <h2 className="font-heading text-4xl font-black text-foreground tracking-tighter">Active Missions</h2>
                           <div className="h-1.5 w-24 bg-foreground rounded-full" />
                        </header>
                        
                        {loadingApps ? (
                           <div className="space-y-8">
                              {[1, 2].map(i => <div key={i} className="h-40 rounded-[3rem] bg-muted animate-pulse border border-border" />)}
                           </div>
                        ) : applications?.length ? (
                           <div className="grid grid-cols-1 gap-10">
                              {applications.map(app => (
                                 <ApplicationCard key={app._id} application={app} />
                              ))}
                           </div>
                        ) : (
                           <EmptyState 
                              icon={<FileText size={48} />} 
                              title="No missions detected." 
                              desc="Your dream specialization is waiting. Browse our open positions and synchronize your profile." 
                              btnText="Explore Open Positions"
                              btnLink="/internships"
                           />
                        )}
                     </motion.div>
                  )}

                  {activeTab === 'certifications' && (
                     <motion.div 
                        key="certs"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-12"
                     >
                        <header className="flex items-center justify-between">
                           <h2 className="font-heading text-4xl font-black text-foreground tracking-tighter">Learning Journey</h2>
                           <div className="h-1.5 w-24 bg-brand-blue rounded-full" />
                        </header>
                        
                        {loadingCerts ? (
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                              {[1, 2].map(i => <div key={i} className="h-[450px] rounded-[3.5rem] bg-muted animate-pulse border border-border" />)}
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
                              title="No active credentials." 
                              desc="Upskill with industry masterclasses architected by veteran engineers." 
                              btnText="Browse Specializations"
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

function StatCard({ label, value, icon, sub, color }: any) {
   return (
      <motion.div 
         whileHover={{ y: -5 }}
         className="p-10 rounded-[3rem] bg-card border border-border shadow-2xl flex items-center gap-8 group"
      >
         <div className="h-20 w-20 rounded-[2rem] bg-secondary flex items-center justify-center text-3xl shadow-inner border border-border group-hover:scale-110 transition-transform">
            {icon}
         </div>
         <div>
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">{label}</span>
            <div className="flex items-baseline gap-2.5">
               <h4 className="text-4xl font-heading font-black text-foreground tracking-tighter" style={{ color }}>{value}</h4>
               <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest leading-none">{sub}</span>
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
        'w-full flex items-center justify-between px-8 py-6 rounded-[2.5rem] font-black text-[13px] uppercase tracking-widest transition-all mb-3 last:mb-0',
        active 
          ? 'bg-foreground text-background shadow-2xl' 
          : 'bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground'
      )}
    >
      <div className="flex items-center gap-5">
         <div className={cn('h-1.5 w-1.5 rounded-full', active ? 'bg-brand-blue animate-pulse' : 'bg-muted-foreground/30')} />
         <Icon size={22} className={active ? 'text-brand-blue' : ''} /> {label}
      </div>
      {count !== undefined && (
        <span className={cn(
          'px-4 py-1.5 rounded-xl text-[10px] font-black tracking-normal',
          active ? 'bg-background/20 text-background' : 'bg-muted text-muted-foreground'
        )}>{count}</span>
      )}
    </button>
  )
}

function ApplicationCard({ application }: { application: Application }) {
  const statusStyles: any = {
    Pending: 'bg-brand-amber text-white border-brand-amber/20',
    Reviewed: 'bg-brand-blue text-white border-brand-blue/20',
    Hired: 'bg-brand-emerald text-white border-brand-emerald/20',
    Rejected: 'bg-red-500 text-white border-red-500/20',
  }

  const item: any = application.job || application.internship

  return (
    <div className="group p-10 rounded-[3.5rem] bg-card border border-border shadow-2xl hover:border-brand-blue/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-10 relative overflow-hidden">
       <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/5 blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />

       <div className="relative">
          <div className="flex items-center gap-5 mb-6 flex-wrap">
             <span className={cn('px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-lg', statusStyles[application.status])}>
                {application.status}
             </span>
             <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest bg-secondary px-3 py-1.5 rounded-lg border border-border">
                <Clock size={14} /> Applied on {new Date(application.createdAt).toLocaleDateString()}
             </div>
             <div className="h-1.5 w-1.5 rounded-full bg-border" />
             <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{application.type} Track</span>
          </div>
          <h4 className="font-heading text-3xl font-black text-foreground tracking-tighter group-hover:text-brand-blue transition-colors leading-none">{item?.title || 'Professional Position'}</h4>
          <p className="mt-4 text-muted-foreground font-bold text-xs uppercase tracking-[0.2em]">{application.college || application.course || 'SatByte Engineering Labs'}</p>
       </div>

       <div className="flex flex-wrap items-center gap-4 relative">
          <a 
            href={application.resumeUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="h-16 px-8 rounded-full bg-secondary text-foreground font-black text-xs uppercase tracking-widest border border-border hover:bg-muted transition-all flex items-center gap-3"
          >
             <FileText size={20} className="text-brand-blue" /> View CV
          </a>
          <button className="h-16 px-10 rounded-full bg-foreground text-background font-black text-xs uppercase tracking-widest shadow-xl hover:opacity-90 transition-all">
             Track Status
          </button>
       </div>
    </div>
  )
}

function EnrollmentCard({ enrollment }: { enrollment: Enrollment }) {
  const cert: any = enrollment.certification

  return (
    <div className="group rounded-[3.5rem] bg-card border border-border shadow-2xl overflow-hidden hover:border-brand-blue/30 transition-all flex flex-col h-full relative">
       <div className="h-44 bg-foreground relative overflow-hidden">
          {/* Animated Background Items */}
          <div className="absolute inset-0 mesh-gradient opacity-20" />
          <div className="absolute bottom-10 left-10 flex flex-col gap-3">
             <div className="h-14 w-14 rounded-2xl bg-background flex items-center justify-center text-brand-blue shadow-2xl border border-border">
                <Award size={28} />
             </div>
             <span className="text-[10px] font-black text-background/50 uppercase tracking-[0.4em]">Masterclass Orbit</span>
          </div>
       </div>

       <div className="p-12 flex-1 flex flex-col">
          <div className="flex-1">
             <h4 className="font-heading text-3xl font-black text-foreground mb-4 tracking-tighter group-hover:text-brand-blue transition-colors leading-none">
               {cert?.title || 'Specialization Program'}
             </h4>
             <p className="text-muted-foreground text-[15px] font-medium leading-relaxed mb-10 line-clamp-2">{cert?.description}</p>
             
             <div className="space-y-4 mb-12">
                <div className="flex items-center justify-between text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                   <span>Curriculum Deployment</span>
                   <span className="text-foreground">0% SYNC</span>
                </div>
                <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden border border-border">
                   <motion.div initial={{ width: 0 }} animate={{ width: '5%' }} className="h-full bg-brand-blue shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                </div>
             </div>
          </div>
          
          <div className="flex items-center justify-between pt-10 border-t border-border">
             <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-brand-emerald/10 text-[10px] font-black text-brand-emerald uppercase tracking-[0.2em] border border-brand-emerald/20">
                <ShieldCheck size={16} /> Official {enrollment.status}
             </div>
             <button className="h-16 px-10 rounded-full bg-foreground text-background font-black text-xs uppercase tracking-widest shadow-xl hover:opacity-90 transition-all flex items-center gap-3 group/btn">
                Launch LMS <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
             </button>
          </div>
       </div>
    </div>
  )
}

function EmptyState({ icon, title, desc, btnText, btnLink }: any) {
   return (
      <div className="p-24 text-center bg-card rounded-[4rem] border-2 border-dashed border-border shadow-2xl relative overflow-hidden">
         <div className="absolute inset-0 bg-brand-blue/5 opacity-0 group-hover:opacity-100 transition-opacity" />
         <div className="h-28 w-28 rounded-[2.5rem] bg-secondary flex items-center justify-center text-muted-foreground/30 mx-auto mb-10 shadow-inner border border-border">
            {icon}
         </div>
         <h3 className="text-4xl font-black text-foreground tracking-tighter mb-4 leading-none">{title}</h3>
         <p className="text-muted-foreground font-medium text-lg mt-4 max-w-sm mx-auto leading-relaxed">{desc}</p>
         <Link to={btnLink} className="inline-flex items-center gap-4 mt-12 h-20 px-12 rounded-full bg-foreground text-background font-black text-lg uppercase tracking-widest shadow-xl hover:opacity-90 transition-all active:scale-[0.98]">
            {btnText} <ArrowRight size={24} />
         </Link>
      </div>
   )
}
