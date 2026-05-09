import { useState, useEffect, useRef } from 'react'
import { 
  Briefcase, 
  Award, 
  Settings, 
  LogOut, 
  ChevronRight, 
  FileText, 
  TrendingUp, 
  Trophy, 
  ShieldCheck, 
  ArrowRight,
  User,
  LayoutDashboard,
  Target,
  Search,
  GraduationCap,
  Zap,
  PieChart,
  AlertCircle
} from 'lucide-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams, Link } from 'react-router-dom'
import { api } from '../lib/apiClient'
import { SEO } from '../components/SEO'
import { useAuth } from '../contexts/AuthContext'
import type { Application, Enrollment } from '../types'
import { cn } from '../utils/cn'

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const [activeView, setActiveView] = useState<'overview' | 'applications' | 'certifications'>('overview')
  const [params, setParams] = useSearchParams()
  const qc = useQueryClient()
  const hasVerified = useRef(false)

  // Enrollment verification state
  const [verifying, setVerifying] = useState(false)
  const [verifyStatus, setVerifyStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const { data: applications, isLoading: loadingApps } = useQuery<Application[]>({
    queryKey: ['my-applications'],
    queryFn: async () => {
      const { data } = await api.get('jobs/my/applications')
      return Array.isArray(data) ? data : []
    },
    enabled: !!user
  })

  const { data: enrollments, isLoading: loadingCerts, refetch: refetchEnrollments } = useQuery<Enrollment[]>({
    queryKey: ['my-enrollments'],
    queryFn: async () => {
      const { data } = await api.get('certifications/my')
      return Array.isArray(data) ? data : []
    },
    enabled: !!user
  })

  useEffect(() => {
    const enrollSuccess = params.get('enroll_success')
    const sessionId = params.get('session_id')

    if (enrollSuccess === 'true' && sessionId && !hasVerified.current) {
      hasVerified.current = true
      setActiveView('certifications')
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
      setVerifyStatus('error')
      setErrorMsg(e.response?.data?.message || e.message || 'Verification failed')
    } finally {
      setVerifying(false)
    }
  }

  return (
    <div className="bg-[#020609] min-h-screen pb-32 selection:bg-brand-blue/30">
      <SEO title="Command Center" />

      {/* --- Dashboard Sidebar + Content --- */}
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 pt-32">
        {/* Verification Status Banner */}
        <AnimatePresence>
          {verifyStatus !== 'idle' && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <div className={cn(
                "p-6 rounded-3xl border flex items-center justify-between gap-6",
                verifyStatus === 'success' ? "bg-brand-emerald/10 border-brand-emerald/20 text-brand-emerald" : "bg-red-500/10 border-red-500/20 text-red-500"
              )}>
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "h-12 w-12 rounded-2xl flex items-center justify-center shadow-2xl",
                    verifyStatus === 'success' ? "bg-brand-emerald/20" : "bg-red-500/20"
                  )}>
                    {verifyStatus === 'success' ? <Award size={24} /> : <AlertCircle size={24} />}
                  </div>
                  <div>
                    <h4 className="font-black text-lg tracking-tight uppercase leading-none mb-1">
                      {verifyStatus === 'success' ? 'Identity Sync Successful' : 'Transmission Error'}
                    </h4>
                    <p className="text-sm font-bold opacity-70">
                      {verifyStatus === 'success' ? 'Your professional credentials have been added to your orbit.' : errorMsg}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setVerifyStatus('idle')}
                  className="h-10 px-6 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          )}
          {verifying && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 p-6 rounded-3xl bg-brand-blue/10 border border-brand-blue/20 text-brand-blue flex items-center gap-4"
            >
              <div className="h-6 w-6 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-black uppercase tracking-widest">Validating Credentials...</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar Command Bar */}
          <aside className="lg:w-80 shrink-0 space-y-8">
            <div className="premium-card p-8 bg-[#0A0F14] border-white/5 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/10 blur-[60px] rounded-full" />
               <div className="relative z-10">
                  <div className="h-20 w-20 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-center text-white text-3xl font-black mb-6 shadow-2xl">
                    {user?.name?.[0] || 'U'}
                  </div>
                  <h3 className="text-white font-black text-2xl tracking-tighter leading-none mb-2">{user?.name || 'Member'}</h3>
                  <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                    <ShieldCheck size={14} className="text-brand-emerald" /> Verified Identity
                  </p>
               </div>
            </div>

            <nav className="space-y-2">
               <NavItem 
                 active={activeView === 'overview'} 
                 onClick={() => setActiveView('overview')}
                 icon={LayoutDashboard}
                 label="Overview Hub"
               />
               <NavItem 
                 active={activeView === 'applications'} 
                 onClick={() => setActiveView('applications')}
                 icon={Briefcase}
                 label="My Applications"
                 count={applications?.length}
               />
               <NavItem 
                 active={activeView === 'certifications'} 
                 onClick={() => setActiveView('certifications')}
                 icon={Award}
                 label="Certifications"
                 count={enrollments?.length}
               />
               <div className="h-px bg-white/5 my-6" />
               <NavItem 
                 icon={Settings}
                 label="Account Settings"
                 as={Link}
                 to="/settings"
               />
               <button 
                 onClick={logout}
                 className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-red-500 font-black text-xs uppercase tracking-widest hover:bg-red-500/5 transition-all"
               >
                 <LogOut size={20} /> Terminate Orbit
               </button>
            </nav>

            {/* Achievement Widget */}
            <div className="p-10 rounded-4xl bg-gradient-to-br from-brand-violet/10 to-transparent border border-brand-violet/10">
               <div className="h-12 w-12 rounded-2xl bg-brand-violet/20 flex items-center justify-center text-brand-violet mb-6">
                 <Trophy size={24} />
               </div>
               <h4 className="text-white font-black text-lg mb-2">Member Tier</h4>
               <p className="text-[11px] text-muted-foreground font-medium mb-6">You are in the top 5% of active applicants this week.</p>
               <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                 <div className="h-full w-4/5 bg-brand-violet shadow-[0_0_15px_rgba(139,92,246,0.5)]" />
               </div>
            </div>
          </aside>

          {/* Main Dashboard Hub */}
          <main className="flex-1 min-h-[800px]">
             <AnimatePresence mode="wait">
                {activeView === 'overview' && (
                  <motion.div 
                    key="overview"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-12"
                  >
                     {/* Welcome Header */}
                     <div>
                        <h1 className="font-heading text-5xl font-black text-white tracking-tighter mb-4 leading-none">
                           Welcome Back, <span className="text-brand-blue italic">{user?.name?.split(' ')[0]}</span>
                        </h1>
                        <p className="text-muted-foreground font-medium text-lg">Your professional orbit is currently stable and synchronized.</p>
                     </div>

                     {/* Grid Stats */}
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <StatWidget label="Active Missions" value={applications?.length || 0} icon={Target} color="text-brand-blue" />
                        <StatWidget label="Credentials" value={enrollments?.length || 0} icon={Award} color="text-brand-emerald" />
                        <StatWidget label="Profile Sync" value="92%" icon={PieChart} color="text-brand-amber" />
                     </div>

                     {/* Recent Activity / Next Steps */}
                     <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                        <section className="premium-card p-10 bg-[#0A0F14] border-white/5">
                           <h3 className="text-white font-black text-xl mb-8 flex items-center gap-3">
                             <TrendingUp size={24} className="text-brand-blue" /> Career Trajectory
                           </h3>
                           <div className="space-y-6">
                              {[
                                { title: "Frontend Specialization", status: "In Progress", date: "Last synced 2h ago" },
                                { title: "System Design Masterclass", status: "Recommended", date: "AI Identified gap" },
                              ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-6 rounded-3xl bg-white/[0.02] border border-white/5">
                                   <div>
                                      <h5 className="text-white font-bold text-sm mb-1">{item.title}</h5>
                                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{item.date}</p>
                                   </div>
                                   <span className="px-3 py-1 rounded-lg bg-white/5 text-[9px] font-black uppercase tracking-widest text-white/40">{item.status}</span>
                                </div>
                              ))}
                           </div>
                           <Link to="/certifications" className="w-full h-14 mt-8 rounded-2xl bg-white/5 flex items-center justify-center text-xs font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all gap-2">
                             Improve Trajectory <ArrowRight size={18} />
                           </Link>
                        </section>

                        <section className="premium-card p-10 bg-[#0A0F14] border-white/5">
                           <h3 className="text-white font-black text-xl mb-8 flex items-center gap-3">
                             <Zap size={24} className="text-brand-emerald" /> Quick Actions
                           </h3>
                           <div className="grid grid-cols-2 gap-4">
                              <QuickAction icon={Search} label="Find Jobs" to="/careers" color="bg-brand-blue" />
                              <QuickAction icon={GraduationCap} label="Learn" to="/certifications" color="bg-brand-emerald" />
                              <QuickAction icon={User} label="My Profile" to="/profile" color="bg-brand-violet" />
                              <QuickAction icon={FileText} label="Manage CV" to="/settings" color="bg-brand-amber" />
                           </div>
                        </section>
                     </div>
                  </motion.div>
                )}

                {activeView === 'applications' && (
                  <motion.div 
                    key="apps"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-12"
                  >
                     <header className="flex items-end justify-between">
                        <div>
                           <h2 className="font-heading text-4xl font-black text-white tracking-tighter">My Missions</h2>
                           <p className="text-muted-foreground mt-2 font-medium">Tracking your path to the next generation.</p>
                        </div>
                        <Link to="/careers" className="h-12 px-6 rounded-xl bg-brand-blue text-white font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                           New Mission <ArrowRight size={14} />
                        </Link>
                     </header>

                     <div className="space-y-6">
                        {loadingApps ? (
                          [1, 2].map(i => <div key={i} className="h-40 rounded-4xl bg-[#0A0F14] animate-pulse" />)
                        ) : applications?.length ? (
                          applications.map(app => <ApplicationItem key={app._id} application={app} />)
                        ) : (
                          <div className="py-40 text-center premium-card border-dashed">
                             <Briefcase size={48} className="mx-auto text-muted-foreground/20 mb-6" />
                             <h3 className="text-2xl font-black text-white mb-2">No active missions</h3>
                             <p className="text-muted-foreground text-sm max-w-xs mx-auto">Your dream role is waiting. Browse our current openings to begin.</p>
                             <Link to="/careers" className="mt-8 inline-flex h-14 px-10 rounded-2xl bg-brand-blue text-white font-black text-xs uppercase tracking-widest items-center gap-3">
                               Explore Orbits <ArrowRight size={18} />
                             </Link>
                          </div>
                        )}
                     </div>
                  </motion.div>
                )}

                {activeView === 'certifications' && (
                  <motion.div 
                    key="certs"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-12"
                  >
                     <header className="flex items-end justify-between">
                        <div>
                           <h2 className="font-heading text-4xl font-black text-white tracking-tighter">Learning Journey</h2>
                           <p className="text-muted-foreground mt-2 font-medium">Masterclass deployments and professional credentials.</p>
                        </div>
                        <Link to="/certifications" className="h-12 px-6 rounded-xl bg-brand-emerald text-white font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                           New Module <ArrowRight size={14} />
                        </Link>
                     </header>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {loadingCerts ? (
                          [1, 2].map(i => <div key={i} className="h-80 rounded-4xl bg-[#0A0F14] animate-pulse" />)
                        ) : enrollments?.length ? (
                          enrollments.map(enroll => <EnrollmentItem key={enroll._id} enrollment={enroll} />)
                        ) : (
                          <div className="md:col-span-2 py-40 text-center premium-card border-dashed">
                             <Award size={48} className="mx-auto text-muted-foreground/20 mb-6" />
                             <h3 className="text-2xl font-black text-white mb-2">No active credentials</h3>
                             <p className="text-muted-foreground text-sm max-w-xs mx-auto">Upskill with industry masterclasses architected by veteran engineers.</p>
                             <Link to="/certifications" className="mt-8 inline-flex h-14 px-10 rounded-2xl bg-brand-emerald text-white font-black text-xs uppercase tracking-widest items-center gap-3">
                               Browse Specializations <ArrowRight size={18} />
                             </Link>
                          </div>
                        )}
                     </div>
                  </motion.div>
                )}
             </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  )
}

function NavItem({ active, onClick, icon: Icon, label, count, as: Component = 'button', ...props }: any) {
  return (
    <Component
      onClick={onClick}
      className={cn(
        'w-full flex items-center justify-between px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all',
        active 
          ? 'bg-brand-blue text-white shadow-xl shadow-brand-blue/20' 
          : 'text-muted-foreground hover:bg-white/5 hover:text-white'
      )}
      {...props}
    >
      <div className="flex items-center gap-4">
         <Icon size={20} /> {label}
      </div>
      {count !== undefined && (
        <span className={cn(
          'px-3 py-1 rounded-lg text-[9px] font-black',
          active ? 'bg-white/20 text-white' : 'bg-white/5 text-muted-foreground'
        )}>{count}</span>
      )}
    </Component>
  )
}

function StatWidget({ label, value, icon: Icon, color }: any) {
   return (
      <div className="premium-card p-8 bg-[#0A0F14] border-white/5 group">
         <div className="flex items-center justify-between mb-6">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{label}</span>
            <div className={cn("h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center transition-all group-hover:scale-110", color)}>
               <Icon size={20} />
            </div>
         </div>
         <h4 className="text-4xl font-black text-white tracking-tighter">{value}</h4>
      </div>
   )
}

function QuickAction({ icon: Icon, label, to, color }: any) {
   return (
      <Link to={to} className="group flex flex-col items-center justify-center p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/5 transition-all gap-4">
         <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-black/20 group-hover:scale-110 transition-all", color)}>
            <Icon size={24} />
         </div>
         <span className="text-[10px] font-black text-white uppercase tracking-widest">{label}</span>
      </Link>
   )
}

function ApplicationItem({ application }: { application: Application }) {
  const item: any = application.job || application.internship
  const statusColors: any = {
    Pending: 'bg-brand-amber text-white shadow-brand-amber/20',
    Reviewed: 'bg-brand-blue text-white shadow-brand-blue/20',
    Hired: 'bg-brand-emerald text-white shadow-brand-emerald/20',
    Rejected: 'bg-red-500 text-white shadow-red-200/20',
  }

  return (
    <div className="premium-card p-10 bg-[#0A0F14] border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-10 hover:border-brand-blue/20 group transition-all">
       <div className="flex-1">
          <div className="flex items-center gap-4 mb-6">
             <span className={cn('px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-xl', statusColors[application.status])}>
                {application.status}
             </span>
             <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest bg-white/5 px-3 py-1 rounded-lg">
                Applied {new Date(application.createdAt).toLocaleDateString()}
             </span>
          </div>
          <h4 className="text-3xl font-black text-white tracking-tight group-hover:text-brand-blue transition-colors leading-none mb-3">
             {item?.title || 'Professional Role'}
          </h4>
          <p className="text-muted-foreground font-bold text-[10px] uppercase tracking-widest">
             {application.type} • {application.college || 'SatByte Ecosystem'}
          </p>
       </div>
       
       <div className="flex items-center gap-4">
          <a href={application.resumeUrl} target="_blank" rel="noreferrer" className="h-14 px-8 rounded-2xl bg-white/5 text-white font-black text-[10px] uppercase tracking-widest flex items-center gap-3 hover:bg-white/10 transition-all border border-white/5">
             <FileText size={18} /> View CV
          </a>
          <button className="h-14 px-8 rounded-2xl bg-white text-black font-black text-[10px] uppercase tracking-widest hover:bg-brand-blue hover:text-white transition-all shadow-xl">
             Details
          </button>
       </div>
    </div>
  )
}

function EnrollmentItem({ enrollment }: { enrollment: Enrollment }) {
   const cert: any = enrollment.certification
   return (
      <div className="premium-card bg-[#0A0F14] border-white/5 overflow-hidden group hover:border-brand-emerald/20 transition-all flex flex-col">
         <div className="h-32 bg-foreground relative p-8 flex items-end">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-emerald/20 via-transparent to-transparent opacity-50" />
            <div className="h-12 w-12 rounded-xl bg-background flex items-center justify-center text-brand-emerald shadow-2xl relative z-10 border border-white/5">
               <Award size={24} />
            </div>
         </div>
         <div className="p-10 flex-1 flex flex-col">
            <h4 className="text-2xl font-black text-white mb-4 tracking-tight group-hover:text-brand-emerald transition-colors leading-none">
               {cert?.title || 'Masterclass Module'}
            </h4>
            <div className="space-y-4 mb-10 mt-auto">
               <div className="flex items-center justify-between text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                  <span>Deployment Sync</span>
                  <span className="text-white">0%</span>
               </div>
               <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full w-1 bg-brand-emerald shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
               </div>
            </div>
            <button className="h-14 w-full rounded-2xl bg-white/5 text-white font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all border border-white/5 flex items-center justify-center gap-3">
               Launch LMS <ChevronRight size={18} />
            </button>
         </div>
      </div>
   )
}
