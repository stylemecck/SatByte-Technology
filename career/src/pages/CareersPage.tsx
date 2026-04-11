import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MapPin, Briefcase, ExternalLink, ArrowRight, Loader2, Filter, Zap, Clock, ShieldCheck, Star } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { api } from '../lib/apiClient'
import { SEO } from '../components/SEO'
import type { Job } from '../types'
import { cn } from '../utils/cn'

export default function CareersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')

  const { data: jobs, isLoading } = useQuery<Job[]>({
    queryKey: ['jobs'],
    queryFn: async () => {
      const { data } = await api.get('jobs')
      return data
    }
  })

  const filteredJobs = jobs?.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'All' || job.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const categories = ['All', 'Engineering', 'Design', 'Marketing', 'Sales', 'Other']

  return (
    <div className="min-h-screen bg-[#FDFDFF]">
      <SEO title="Careers" description="Explore job opportunities at SatByte Technologies." />

      {/* Premium Cinematic Header */}
      <section className="relative pt-32 pb-24 mesh-gradient text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
           <div className="absolute top-0 right-0 w-1/2 h-full bg-accent/20 blur-[120px] rounded-full translate-x-1/2" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-extrabold text-[10px] uppercase tracking-widest mb-6 border border-emerald-500/20">
                <ShieldCheck size={12} /> Excellence Guaranteed
              </span>
              <h1 className="font-heading text-5xl sm:text-7xl font-black tracking-tight leading-[0.9] mb-8">
                Build the <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-emerald-400">future infrastructure.</span>
              </h1>
              <p className="text-xl text-indigo-100/60 font-medium leading-relaxed">
                Join our elite squads units to architect legacy-defining software. 
                Ownership is binary here — you own it, or you don't.
              </p>
            </motion.div>
          </div>

          {/* Premium Search & Filter Bar */}
          <div className="mt-16 relative z-30">
             <div className="p-2 rounded-[2.5rem] bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1 group">
                   <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-accent transition-colors" size={20} />
                   <input 
                     type="text" 
                     placeholder="Search specialized roles..." 
                     className="w-full pl-16 pr-6 py-5 rounded-[2rem] bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:bg-white/10 focus:border-accent outline-none transition-all font-medium"
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                   />
                </div>
                <div className="flex gap-2 p-1 overflow-x-auto scrollbar-hide shrink-0">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={cn(
                        'px-8 py-4 rounded-[1.8rem] font-black text-[10px] uppercase tracking-widest transition-all',
                        categoryFilter === cat 
                          ? 'bg-accent text-secondary shadow-xl shadow-accent/20' 
                          : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/5'
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Jobs Hub Section */}
      <section className="py-24 relative z-20 -mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
               {[1, 2, 3, 4, 5, 6].map(i => (
                 <div key={i} className="h-80 rounded-[3.5rem] bg-white shadow-xl animate-pulse border border-slate-100" />
               ))}
            </div>
          ) : filteredJobs?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              <AnimatePresence mode="popLayout">
                {filteredJobs.map(job => (
                  <JobCard key={job._id} job={job} />
                ))}
              </AnimatePresence>
            </div>
          ) : (
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="text-center py-32 bg-white rounded-[4rem] border-2 border-dashed border-slate-100 shadow-2xl shadow-slate-200/20"
             >
                <div className="h-24 w-24 rounded-[2.5rem] bg-slate-50 flex items-center justify-center text-slate-200 mx-auto mb-8 shadow-inner">
                  <Briefcase size={48} />
                </div>
                <h3 className="font-heading text-3xl font-black text-secondary tracking-tight">No match detected.</h3>
                <p className="mt-4 text-slate-400 font-medium max-w-sm mx-auto leading-relaxed">
                  The role you seek may be classified or unlisted. Try a broader term.
                </p>
                <button 
                  onClick={() => { setSearchTerm(''); setCategoryFilter('All'); }}
                  className="mt-10 mb-2 px-10 py-4 rounded-2xl bg-secondary text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-secondary/20 hover:scale-105 transition-all"
                >
                  Reset Parameters
                </button>
             </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}

function JobCard({ job }: { job: Job }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -10 }}
      className="group p-10 rounded-[3.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 hover:border-primary/20 hover:shadow-2xl hover:shadow-secondary/5 transition-all duration-500 flex flex-col relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[50px] rounded-full group-hover:bg-primary/10 transition-colors" />

      <div className="flex w-full justify-between items-start mb-10 relative">
        <div className="px-4 py-1.5 rounded-xl bg-primary/5 text-primary text-[9px] font-black uppercase tracking-[0.25em] border border-primary/10 shadow-sm shadow-primary/5">
          {job.type} Space
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
           <Clock size={14} className="text-slate-300" /> {new Date(job.createdAt).toLocaleDateString()}
        </div>
      </div>

      <div className="flex-1">
         <h3 className="font-heading text-3xl font-extrabold text-secondary leading-[1.1] tracking-tighter group-hover:text-primary transition-colors mb-6">
           {job.title}
         </h3>
         
         <div className="flex flex-wrap gap-3 mb-8">
           <Badge icon={<MapPin size={12} />} label={job.location} />
           <Badge icon={<Zap size={12} />} label={job.experience} />
         </div>

         <p className="text-slate-500 font-medium text-sm leading-relaxed line-clamp-3 mb-10 opacity-70 group-hover:opacity-100 transition-opacity">
           {job.description}
         </p>
      </div>

      <div className="pt-10 border-t border-slate-50 w-full flex items-center justify-between mt-auto">
         <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 uppercase">
               {job.category[0]}
            </div>
            <span className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">{job.category}</span>
         </div>
         <Link 
           to={`/careers/${job._id}`}
           className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-secondary text-white font-black text-xs uppercase tracking-widest hover:bg-primary transition-all shadow-2xl shadow-secondary/20 group/btn"
         >
           Access Role <ExternalLink size={16} className="group-hover/btn:translate-y-[-2px] group-hover/btn:translate-x-[2px] transition-transform" />
         </Link>
      </div>
    </motion.div>
  )
}

function Badge({ icon, label }: { icon: React.ReactNode, label: string }) {
   return (
      <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl text-[11px] font-extrabold text-secondary/60">
         <span className="text-primary/50">{icon}</span>
         {label}
      </div>
   )
}

