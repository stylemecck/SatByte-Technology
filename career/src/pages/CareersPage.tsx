import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MapPin, Briefcase, ExternalLink } from 'lucide-react'
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
      const { data } = await api.get('/jobs')
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
    <div className="min-h-screen bg-white">
      <SEO title="Careers" description="Explore job opportunities at SatByte Technologies." />

      {/* Header */}
      <div className="bg-slate-50 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center md:text-left">
            <h1 className="font-heading text-4xl sm:text-5xl font-extrabold text-secondary">
              Find your next <span className="text-primary">career challenge</span>
            </h1>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl leading-relaxed">
              We're looking for passionate individuals to help us build software that matters.
              Join a team where ownership is given, and excellence is celebrated.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="mt-12 flex flex-col md:flex-row gap-4 items-center">
            <div className="relative w-full md:flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input 
                type="text" 
                placeholder="Search jobs by title or keyword..." 
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={cn(
                    'px-6 py-4 rounded-2xl font-bold text-sm whitespace-nowrap transition-all shadow-sm',
                    categoryFilter === cat 
                      ? 'bg-secondary text-white shadow-secondary/20' 
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Jobs Listing */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-64 rounded-3xl bg-slate-100 animate-pulse" />
              ))}
            </div>
          ) : filteredJobs?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {filteredJobs.map(job => (
                  <JobCard key={job._id} job={job} />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
               <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-4">
                 <Briefcase size={32} />
               </div>
               <h3 className="font-heading text-xl font-bold text-secondary">No matching jobs found</h3>
               <p className="mt-2 text-slate-500">Try adjusting your filters or search terms.</p>
               <button 
                 onClick={() => { setSearchTerm(''); setCategoryFilter('All'); }}
                 className="mt-6 font-bold text-primary hover:underline"
               >
                 Clear all filters
               </button>
            </div>
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
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="group p-8 rounded-[2.5rem] bg-white border border-slate-200 shadow-xl shadow-slate-200/50 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 flex flex-col items-start"
    >
      <div className="flex w-full justify-between items-start mb-6">
        <div className="px-3 py-1 rounded-lg bg-primary/5 text-primary text-[10px] font-extrabold uppercase tracking-widest border border-primary/10">
          {job.type}
        </div>
        <span className="text-xs text-slate-400 font-medium">{new Date(job.createdAt).toLocaleDateString()}</span>
      </div>

      <h3 className="font-heading text-xl font-extrabold text-secondary group-hover:text-primary transition-colors line-clamp-2">
        {job.title}
      </h3>
      
      <div className="mt-4 flex flex-wrap gap-4 text-xs font-bold text-slate-500">
        <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-full">
           <MapPin size={14} className="text-slate-400" /> {job.location}
        </div>
        <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-full">
           <Briefcase size={14} className="text-slate-400" /> {job.experience}
        </div>
      </div>

      <p className="mt-6 text-slate-600 text-sm line-clamp-3 leading-relaxed">
        {job.description}
      </p>

      <div className="mt-8 pt-6 border-t border-slate-100 w-full flex items-center justify-between">
         <span className="text-xs font-bold text-secondary/70">{job.category}</span>
         <Link 
           to={`/careers/${job._id}`}
           className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary text-white font-bold text-xs hover:bg-primary transition-all shadow-lg shadow-secondary/10"
         >
           View Details <ExternalLink size={14} />
         </Link>
      </div>
    </motion.div>
  )
}
