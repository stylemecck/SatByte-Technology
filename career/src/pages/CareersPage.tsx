import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MapPin, Briefcase, Zap, Clock, ShieldCheck, ArrowRight } from 'lucide-react'
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
    <div className="bg-background selection:bg-brand-blue/30">
      <SEO title="Careers" description="Explore job opportunities at SatByte Technologies." />

      {/* Premium Cinematic Header */}
      <section className="relative pt-32 pb-24 mesh-gradient overflow-hidden">
        <div className="absolute inset-0 opacity-30 dark:opacity-20 pointer-events-none">
           <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-blue/20 blur-[120px] rounded-full translate-x-1/2" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-secondary text-foreground border border-border font-extrabold text-[10px] uppercase tracking-[0.2em] mb-8 shadow-sm">
                <ShieldCheck size={14} className="text-brand-blue" /> Excellence Guaranteed
              </span>
              <h1 className="font-heading text-5xl sm:text-7xl font-black text-foreground tracking-tighter leading-none mb-8">
                Build the <br /> <span className="bg-gradient-to-r from-brand-blue to-foreground bg-clip-text text-transparent italic">future infrastructure.</span>
              </h1>
              <p className="text-xl text-muted-foreground font-medium leading-relaxed max-w-2xl">
                Join our elite squads to architect legacy-defining software. 
                Ownership is binary here — you own it, or you don't.
              </p>
            </motion.div>
          </div>

          {/* Premium Search & Filter Bar */}
          <div className="mt-16 relative z-30">
             <div className="p-3 rounded-[3.5rem] bg-card border border-border shadow-2xl flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1 group">
                   <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-brand-blue transition-colors" size={20} />
                   <input 
                     type="text" 
                     placeholder="Search specialized roles..." 
                     className="w-full pl-20 pr-8 py-5 rounded-[2.5rem] bg-secondary border border-border text-foreground placeholder:text-muted-foreground/60 focus:border-brand-blue/50 outline-none transition-all font-bold text-[15px]"
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                   />
                </div>
                <div className="flex gap-2.5 p-1 overflow-x-auto custom-scrollbar shrink-0 no-scrollbar">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={cn(
                        'px-8 py-4 rounded-[2rem] font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap',
                        categoryFilter === cat 
                          ? 'bg-foreground text-background shadow-xl' 
                          : 'bg-secondary text-muted-foreground hover:bg-muted hover:text-foreground border border-border'
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
      <section className="py-24 relative z-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
               {[1, 2, 3, 4, 5, 6].map(i => (
                 <div key={i} className="h-80 rounded-[3.5rem] bg-muted animate-pulse border border-border" />
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
               className="text-center py-32 bg-muted rounded-[4rem] border-2 border-dashed border-border max-w-2xl mx-auto"
             >
                <div className="h-24 w-24 rounded-[2.5rem] bg-secondary flex items-center justify-center text-muted-foreground mx-auto mb-8 shadow-sm">
                  <Briefcase size={48} />
                </div>
                <h3 className="font-heading text-3xl font-black text-foreground tracking-tighter">No match detected.</h3>
                <p className="mt-4 text-muted-foreground font-medium max-w-sm mx-auto leading-relaxed">
                  The role you seek may be classified or unlisted. Try using broader terms.
                </p>
                <button 
                  onClick={() => { setSearchTerm(''); setCategoryFilter('All'); }}
                  className="mt-10 px-10 py-4 rounded-full bg-foreground text-background font-black text-xs uppercase tracking-widest shadow-xl hover:opacity-90 transition-all"
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
      className="group p-12 rounded-[3.5rem] bg-card border border-border shadow-2xl hover:border-brand-blue/30 transition-all duration-500 flex flex-col relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/5 blur-[50px] rounded-full group-hover:bg-brand-blue/10 transition-colors" />

      <div className="flex w-full justify-between items-start mb-12 relative">
        <div className="px-5 py-2 rounded-xl bg-foreground text-background text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
          {job.type} Track
        </div>
        <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest bg-secondary px-3 py-1.5 rounded-lg border border-border">
           <Clock size={14} /> {new Date(job.createdAt).toLocaleDateString()}
        </div>
      </div>

      <div className="flex-1">
         <h3 className="font-heading text-3xl font-black text-foreground leading-none tracking-tighter group-hover:text-brand-blue transition-colors mb-6">
           {job.title}
         </h3>
         
         <div className="flex flex-wrap gap-4 mb-10">
           <Badge icon={<MapPin size={14} />} label={job.location} color="var(--brand-blue)" />
           <Badge icon={<Zap size={14} />} label={job.experience} color="var(--brand-emerald)" />
         </div>

         <p className="text-muted-foreground font-medium text-[15px] leading-relaxed line-clamp-3 mb-12 opacity-80 group-hover:opacity-100 transition-opacity">
           {job.description}
         </p>
      </div>

      <div className="pt-10 border-t border-border w-full flex items-center justify-between mt-auto">
         <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-secondary flex items-center justify-center text-[11px] font-black text-brand-blue uppercase border border-border">
               {job.category[0]}
            </div>
            <span className="text-[10px] font-black text-foreground uppercase tracking-[0.2em]">{job.category}</span>
         </div>
         <Link 
           to={`/careers/${job._id}`}
           className="h-14 w-14 rounded-2xl bg-foreground text-background flex items-center justify-center hover:bg-brand-blue hover:text-white transition-all shadow-xl group/btn"
         >
           <ArrowRight size={22} className="group-hover/btn:translate-x-1 transition-transform" />
         </Link>
      </div>
    </motion.div>
  )
}

function Badge({ icon, label, color }: { icon: React.ReactNode, label: string, color: string }) {
   return (
      <div className="flex items-center gap-2.5 bg-secondary border border-border px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest text-foreground">
         <span style={{ color }}>{icon}</span>
         {label}
      </div>
   )
}
