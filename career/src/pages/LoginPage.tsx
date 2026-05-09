import { useState } from 'react'
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Mail, 
  Lock, 
  LogIn, 
  ArrowRight, 
  Loader2, 
  ChevronLeft, 
  X, 
  Rocket,
  Sparkles,
  ShieldCheck,
  Zap,
  Award
} from 'lucide-react'
import { api, getStoredToken, saveToken } from '../lib/apiClient'
import { SEO } from '../components/SEO'
import { useAuth } from '../contexts/AuthContext'

export default function LoginPage() {
  if (getStoredToken()) {
    return <Navigate to="/dashboard" replace />
  }
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const from = location.state?.from || '/dashboard'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      const { data } = await api.post('auth/client-password-login', { email, password })
      saveToken(data.token)
      login(data.token, data.user || { email, role: data.role, id: data.id })
      navigate(from, { replace: true })
    } catch (err: any) {
      console.error('Login error:', err)
      const msg = err.response?.data?.message || err.message || 'Identity verification failed.'
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#020609] flex flex-col lg:flex-row overflow-hidden selection:bg-brand-blue/30">
      <SEO title="Member Access" />
      
      {/* --- Left Column: Benefits & Ecosystem Visual --- */}
      <div className="hidden lg:flex lg:w-[45%] bg-[#0A0F14] relative flex-col justify-between p-16 overflow-hidden border-r border-white/5">
         <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-brand-blue/10 via-transparent to-brand-emerald/5 opacity-50" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
         </div>

         <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-3 group">
               <div className="h-12 w-12 rounded-2xl bg-white text-black flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all duration-500">
                  <Rocket size={24} />
               </div>
               <span className="text-white font-black text-xl tracking-tighter uppercase">SatByte Career</span>
            </Link>
         </div>

         <div className="relative z-10">
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8 }}
            >
               <h2 className="font-heading text-6xl font-black text-white tracking-tighter leading-none mb-8">
                  Synchronize with the <br /> <span className="text-brand-blue italic">Next Orbit.</span>
               </h2>
               <div className="space-y-8">
                  <BenefitItem 
                    icon={ShieldCheck} 
                    title="Direct Referrals" 
                    desc="Skip the line with verified ecosystem status." 
                  />
                  <BenefitItem 
                    icon={Zap} 
                    title="Real Engineering" 
                    desc="Work on products serving international audiences." 
                  />
                  <BenefitItem 
                    icon={Award} 
                    title="Certified Impact" 
                    desc="Get cryptographically signed experience credentials." 
                  />
               </div>
            </motion.div>
         </div>

         <div className="relative z-10 flex items-center justify-between border-t border-white/5 pt-8">
            <div className="flex -space-x-4">
               {[1, 2, 3, 4].map(i => (
                 <div key={i} className="h-10 w-10 rounded-full bg-white/5 border-2 border-[#0A0F14] flex items-center justify-center text-[10px] font-black text-white">
                   {String.fromCharCode(64 + i)}
                 </div>
               ))}
            </div>
            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Joined by 2k+ Students</p>
         </div>
      </div>

      {/* --- Right Column: Auth Form --- */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 lg:p-24 relative">
         <div className="absolute inset-0 lg:hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-blue/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
         </div>

         <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full max-w-md"
         >
            <header className="mb-12">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6">
                  <Sparkles size={12} className="text-brand-blue" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-white">Secure Access</span>
               </div>
               <h1 className="font-heading text-5xl font-black text-white tracking-tighter mb-4 leading-none">Member Login</h1>
               <p className="text-muted-foreground font-medium text-lg">Enter your credentials to enter the hub.</p>
            </header>

            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 overflow-hidden"
              >
                <X size={16} /> {error}
              </motion.div>
            )}

            <form className="space-y-8" onSubmit={handleSubmit}>
               <div className="space-y-3">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-2">Secure Email</label>
                  <div className="relative group">
                     <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-brand-blue transition-colors" size={20} />
                     <input
                        required type="email" placeholder="name@orbit.com"
                        className="w-full h-16 pl-16 pr-8 rounded-2xl bg-white/[0.02] border border-white/10 text-white placeholder-white/20 focus:border-brand-blue/50 outline-none transition-all font-bold text-sm"
                        value={email} onChange={(e) => setEmail(e.target.value)}
                     />
                  </div>
               </div>

               <div className="space-y-3">
                  <div className="flex items-center justify-between ml-2">
                     <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Private Key</label>
                     <Link to="/" className="text-[10px] font-black text-brand-blue uppercase tracking-widest hover:underline underline-offset-4">Reset</Link>
                  </div>
                  <div className="relative group">
                     <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-brand-blue transition-colors" size={20} />
                     <input
                        required type="password" placeholder="••••••••"
                        className="w-full h-16 pl-16 pr-8 rounded-2xl bg-white/[0.02] border border-white/10 text-white placeholder-white/20 focus:border-brand-blue/50 outline-none transition-all font-bold text-sm"
                        value={password} onChange={(e) => setPassword(e.target.value)}
                     />
                  </div>
               </div>

               <button
                  type="submit" disabled={isLoading}
                  className="h-20 w-full rounded-full bg-white text-black font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-brand-blue hover:text-white transition-all disabled:opacity-50 flex items-center justify-center gap-4 group/btn shadow-brand-blue/10"
               >
                  {isLoading ? <Loader2 className="animate-spin" size={24} /> : <><LogIn size={22} className="group-hover/btn:-translate-x-1 transition-transform" /> Initiate Session</>}
               </button>
            </form>

            <footer className="mt-12 text-center">
               <p className="text-sm font-bold text-muted-foreground">
                  New to the hub?{' '}
                  <Link to="/register" className="font-black text-brand-blue hover:underline underline-offset-4 uppercase tracking-widest text-[11px] ml-2 flex items-center justify-center gap-2 mt-4">
                    Create Member Profile <ArrowRight size={14} />
                  </Link>
               </p>
               
               <Link to="/" className="mt-12 inline-flex items-center gap-3 text-[10px] font-black text-white/20 hover:text-white uppercase tracking-[0.4em] transition-colors">
                  <ChevronLeft size={16} /> Hub Terminal
               </Link>
            </footer>
         </motion.div>
      </div>
    </div>
  )
}

function BenefitItem({ icon: Icon, title, desc }: any) {
  return (
    <div className="flex gap-5">
       <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-brand-blue shrink-0">
          <Icon size={20} />
       </div>
       <div>
          <h4 className="text-white font-bold text-sm mb-1">{title}</h4>
          <p className="text-[11px] text-muted-foreground leading-relaxed">{desc}</p>
       </div>
    </div>
  )
}
