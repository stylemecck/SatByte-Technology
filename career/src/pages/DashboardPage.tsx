import { useState } from 'react'
import { Briefcase, Award, Settings, LogOut, ChevronRight, CheckCircle2, FileText } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/apiClient'
import { SEO } from '../components/SEO'
import { useAuth } from '../contexts/AuthContext'
import type { Application, Enrollment } from '../types'
import { cn } from '../utils/cn'

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState<'applications' | 'certifications'>('applications')

  const { data: applications, isLoading: loadingApps } = useQuery<Application[]>({
    queryKey: ['my-applications'],
    queryFn: async () => {
      const { data } = await api.get('jobs/admin/applications') // In a real app, this would be /jobs/my/applications
      // For demo, filtering client side
      return data.filter((a: any) => a.user._id === user?.id || a.user === user?.id)
    },
    enabled: !!user
  })

  const { data: enrollments, isLoading: loadingCerts } = useQuery<Enrollment[]>({
    queryKey: ['my-enrollments'],
    queryFn: async () => {
      const { data } = await api.get('certifications/my')
      return data
    },
    enabled: !!user
  })

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <SEO title="Dashboard" />

      {/* Header */}
      <div className="bg-white border-b border-slate-200 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                 <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary text-3xl font-extrabold">
                   {user?.name?.[0] || 'U'}
                 </div>
                 <div>
                    <h1 className="font-heading text-3xl font-extrabold text-secondary">
                      Welcome back, {user?.name?.split(' ')[0] || 'User'}!
                    </h1>
                    <p className="text-slate-500 font-medium">Manage your professional growth and applications.</p>
                 </div>
              </div>
              <div className="flex items-center gap-3">
                 <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all">
                    <Settings size={18} /> Settings
                 </button>
                 <button 
                   onClick={logout}
                   className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-50 text-red-600 font-bold text-sm hover:bg-red-100 transition-all"
                 >
                    <LogOut size={18} /> Logout
                 </button>
              </div>
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
         <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            
            {/* Sidebar Tabs */}
            <div className="lg:col-span-1 space-y-2">
               <TabButton 
                  active={activeTab === 'applications'} 
                  onClick={() => setActiveTab('applications')}
                  icon={Briefcase}
                  label="My Applications"
                  count={applications?.length}
               />
               <TabButton 
                  active={activeTab === 'certifications'} 
                  onClick={() => setActiveTab('certifications')}
                  icon={Award}
                  label="My Certifications"
                  count={enrollments?.length}
               />
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
               {activeTab === 'applications' && (
                  <div className="space-y-6">
                     <h2 className="font-heading text-2xl font-extrabold text-secondary mb-8">Job & Internship Applications</h2>
                     
                     {loadingApps ? (
                        <div className="space-y-4">
                           {[1, 2].map(i => <div key={i} className="h-32 rounded-3xl bg-white animate-pulse" />)}
                        </div>
                     ) : applications?.length ? (
                        <div className="grid grid-cols-1 gap-6">
                           {applications.map(app => (
                              <ApplicationCard key={app._id} application={app} />
                           ))}
                        </div>
                     ) : (
                        <div className="p-16 text-center bg-white rounded-[2.5rem] border border-slate-200">
                           <FileText size={48} className="text-slate-200 mx-auto mb-4" />
                           <h3 className="text-xl font-bold text-secondary">No applications yet</h3>
                           <p className="text-slate-500 mt-2">Apply for a job or internship to track your status here.</p>
                        </div>
                     )}
                  </div>
               )}

               {activeTab === 'certifications' && (
                  <div className="space-y-6">
                     <h2 className="font-heading text-2xl font-extrabold text-secondary mb-8">Enrolled Programs</h2>
                     
                     {loadingCerts ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                           {[1, 2].map(i => <div key={i} className="h-64 rounded-3xl bg-white animate-pulse" />)}
                        </div>
                     ) : enrollments?.length ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           {enrollments.map(enrollment => (
                              <EnrollmentCard key={enrollment._id} enrollment={enrollment} />
                           ))}
                        </div>
                     ) : (
                        <div className="p-16 text-center bg-white rounded-[2.5rem] border border-slate-200">
                           <Award size={48} className="text-slate-200 mx-auto mb-4" />
                           <h3 className="text-xl font-bold text-secondary">Not enrolled in any program</h3>
                           <p className="text-slate-500 mt-2">Explore our certifications to start learning.</p>
                        </div>
                     )}
                  </div>
               )}
            </div>
         </div>
      </div>
    </div>
  )
}

function TabButton({ active, onClick, icon: Icon, label, count }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center justify-between px-6 py-4 rounded-2xl font-bold transition-all',
        active 
          ? 'bg-secondary text-white shadow-xl shadow-secondary/20' 
          : 'bg-white text-slate-500 hover:bg-slate-100'
      )}
    >
      <div className="flex items-center gap-3">
         <Icon size={20} /> {label}
      </div>
      {count !== undefined && (
        <span className={cn(
          'px-2 py-0.5 rounded-lg text-xs font-black',
          active ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
        )}>{count}</span>
      )}
    </button>
  )
}

function ApplicationCard({ application }: { application: Application }) {
  const statusStyles: any = {
    Pending: 'bg-amber-100 text-amber-700',
    Reviewed: 'bg-blue-100 text-blue-700',
    Hired: 'bg-emerald-100 text-emerald-700',
    Rejected: 'bg-red-100 text-red-700',
  }

  const item: any = application.job || application.internship

  return (
    <div className="p-8 rounded-[2rem] bg-white border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
       <div>
          <div className="flex items-center gap-3 mb-3">
             <span className={cn('px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest', statusStyles[application.status])}>
                {application.status}
             </span>
             <span className="text-xs font-bold text-slate-400">{application.type}</span>
          </div>
          <h4 className="font-heading text-xl font-extrabold text-secondary">{item?.title || 'Unknown Position'}</h4>
          <p className="text-xs text-slate-500 mt-1">Applied on {new Date(application.createdAt).toLocaleDateString()}</p>
       </div>
       <div className="flex items-center gap-4">
          <a 
            href={application.resumeUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 font-bold text-sm text-primary hover:underline"
          >
             <FileText size={16} /> View Resume
          </a>
          <button className="px-5 py-2.5 rounded-xl bg-slate-100 text-secondary font-bold text-sm hover:bg-slate-200 transition-all">
             Details
          </button>
       </div>
    </div>
  )
}

function EnrollmentCard({ enrollment }: { enrollment: Enrollment }) {
  const cert: any = enrollment.certification

  return (
    <div className="rounded-[2.5rem] bg-white border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden group">
       <div className="h-32 bg-secondary relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-6 left-8 flex items-center gap-2">
             <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white">
                <Award size={20} />
             </div>
             <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">Enrolled</span>
          </div>
       </div>
       <div className="p-8">
          <h4 className="font-heading text-lg font-extrabold text-secondary mb-2 group-hover:text-primary transition-colors">
            {cert?.title || 'Certification Program'}
          </h4>
          <p className="text-sm text-slate-500 line-clamp-2 mb-6">{cert?.description}</p>
          
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
                <CheckCircle2 size={16} /> Status: {enrollment.status}
             </div>
             <button className="flex items-center gap-2 font-black text-xs text-primary group-hover:gap-3 transition-all">
                Access Content <ChevronRight size={14} />
             </button>
          </div>
       </div>
    </div>
  )
}
