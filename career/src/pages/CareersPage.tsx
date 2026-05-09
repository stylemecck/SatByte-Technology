import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Zap, 
  Clock, 
  ArrowRight, 
  Filter, 
  ChevronRight,
  DollarSign,
  Sparkles
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { api } from '../lib/apiClient'
import { SEO } from '../components/SEO'
import type { Job } from '../types'
import { cn } from '../utils/cn'

export default function CareersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

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
    <div className="bg-[#020609] min-h-screen selection:bg-brand-blue/30">
      <SEO title="Opportunities" description="Explore job opportunities at SatByte Technologies." />

      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 pt-32 pb-20">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/20 mb-6">
              <Sparkles size={12} className="text-brand-blue" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Live Opportunities</span>
            </div>
            <h1 className="font-heading text-5xl md:text-7xl font-black text-white tracking-tighter leading-none mb-6">
              Find Your <span className="text-brand-blue italic">Orbit.</span>
            </h1>
            <p className="text-lg text-muted-foreground font-medium max-w-xl">
              Discover specialized roles across engineering, design, and product units. Join our elite global squads.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="bg-[#0A0F14] border border-white/5 rounded-2xl p-1 flex">
                <button 
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                    isFilterOpen ? "bg-white/10 text-white" : "text-muted-foreground hover:text-white"
                  )}
                >
                  <Filter size={16} /> Filters
                </button>
             </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
           {/* Sidebar Filters */}
           <AnimatePresence>
             {isFilterOpen && (
               <motion.aside 
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 className="lg:w-80 shrink-0 space-y-10"
               >
                  <div className="space-y-6">
                    <h3 className="text-white font-black text-xs uppercase tracking-widest">Search</h3>
                    <div className="relative group">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-brand-blue transition-colors" size={18} />
                      <input 
                        type="text" 
                        placeholder="Search roles..."
                        className="w-full h-14 pl-12 pr-4 bg-[#0A0F14] border border-white/5 rounded-2xl text-sm font-bold text-white focus:border-brand-blue/50 outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-white font-black text-xs uppercase tracking-widest">Categories</h3>
                    <div className="flex flex-wrap gap-2">
                      {categories.map(cat => (
                        <button
                          key={cat}
                          onClick={() => setCategoryFilter(cat)}
                          className={cn(
                            "px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                            categoryFilter === cat ? "bg-brand-blue text-white" : "bg-[#0A0F14] text-muted-foreground hover:text-white border border-white/5"
                          )}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-8 rounded-3xl bg-brand-blue/5 border border-brand-blue/10">
                     <h4 className="text-white font-black text-sm mb-2">AI Matcher</h4>
                     <p className="text-[11px] text-muted-foreground leading-relaxed mb-6">Log in to see roles personalized for your verified skill set.</p>
                     <Link to="/login" className="text-[10px] font-black uppercase tracking-widest text-brand-blue hover:underline">Get Synchronized</Link>
                  </div>
               </motion.aside>
             )}
           </AnimatePresence>

           {/* Main Feed */}
           <div className="flex-1">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {[1, 2, 3, 4].map(i => (
                     <div key={i} className="h-64 rounded-4xl bg-[#0A0F14] animate-pulse border border-white/5" />
                   ))}
                </div>
              ) : filteredJobs?.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <AnimatePresence mode="popLayout">
                     {filteredJobs.map((job, i) => (
                       <JobItem key={job._id} job={job} index={i} />
                     ))}
                   </AnimatePresence>
                </div>
              ) : (
                <div className="py-40 text-center premium-card border-dashed">
                   <Briefcase size={48} className="mx-auto text-muted-foreground/30 mb-6" />
                   <h3 className="text-2xl font-black text-white mb-2">No roles found</h3>
                   <p className="text-muted-foreground text-sm">Try adjusting your filters or search terms.</p>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  )
}

function JobItem({ job, index }: { job: Job, index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="premium-card p-10 bg-[#0A0F14] hover:bg-[#0F1720] group"
    >
      <div className="flex justify-between items-start mb-10">
        <div className="flex gap-3">
           <span className="px-3 py-1 rounded-lg bg-white/5 text-[9px] font-black uppercase tracking-widest text-white/40">
             {job.category}
           </span>
           <span className="px-3 py-1 rounded-lg bg-brand-blue/10 text-[9px] font-black uppercase tracking-widest text-brand-blue">
             {job.type}
           </span>
        </div>
        <div className="flex items-center gap-1.5 text-[9px] font-black text-muted-foreground uppercase tracking-widest">
           <Clock size={12} /> {new Date(job.createdAt).toLocaleDateString()}
        </div>
      </div>

      <h3 className="text-3xl font-black text-white tracking-tight mb-4 group-hover:text-brand-blue transition-colors leading-none">
        {job.title}
      </h3>
      
      <div className="flex flex-wrap gap-6 mb-10">
         <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
            <MapPin size={14} className="text-brand-blue" /> {job.location}
         </div>
         <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
            <Zap size={14} className="text-brand-emerald" /> {job.experience}
         </div>
         {job.salary && (
           <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
              <DollarSign size={14} className="text-brand-amber" /> {job.salary}
           </div>
         )}
      </div>

      <div className="flex items-center justify-between pt-10 border-t border-white/5">
         <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-brand-emerald/10 border border-brand-emerald/20">
            <div className="h-1.5 w-1.5 rounded-full bg-brand-emerald animate-pulse" />
            <span className="text-[9px] font-black text-brand-emerald uppercase tracking-widest">Matching Now</span>
         </div>
         <Link 
           to={`/careers/${job._id}`}
           className="h-14 px-8 rounded-2xl bg-white/5 border border-white/5 text-white font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-brand-blue hover:border-brand-blue hover:shadow-xl hover:shadow-brand-blue/20 transition-all"
         >
           View Details <ChevronRight size={18} />
         </Link>
      </div>
    </motion.div>
  )
}
