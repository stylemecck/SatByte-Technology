import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, LogIn, ArrowRight, Loader2, ChevronLeft, X } from 'lucide-react'
import { api, saveToken } from '../lib/apiClient'
import { SEO } from '../components/SEO'
import { useAuth } from '../contexts/AuthContext'

export default function LoginPage() {
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
    <div className="min-h-screen mesh-gradient flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <SEO title="Login" />
      
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/20 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full relative z-10"
      >
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-3 mb-8 group">
             <div className="h-12 w-12 rounded-[1.2rem] bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white font-black text-2xl shadow-2xl group-hover:bg-accent group-hover:text-secondary transition-all duration-500">
               S
             </div>
             <span className="font-heading font-black text-3xl text-white tracking-tighter">SatByte <span className="text-accent">Careers</span></span>
          </Link>
          <h2 className="text-4xl font-black text-white tracking-tight mb-2">Member Access</h2>
          <p className="text-indigo-100/40 font-medium">Synchronize your career trajectory.</p>
        </div>

        <div className="bg-white/[0.03] backdrop-blur-3xl p-10 rounded-[3.5rem] border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.3)]">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-200 text-xs font-black uppercase tracking-widest flex items-center gap-3"
            >
              <X size={16} className="text-red-400" /> {error}
            </motion.div>
          )}

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="space-y-3">
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-white/30 ml-2">Secure Email</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent transition-colors" size={20} />
                <input
                  required
                  type="email"
                  placeholder="name@company.com"
                  className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/10 focus:bg-white/10 focus:border-accent outline-none transition-all font-semibold"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between ml-2">
                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Private Key</label>
                <Link to="/" className="text-[10px] font-black text-accent uppercase tracking-widest hover:underline">Reset</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent transition-colors" size={20} />
                <input
                  required
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/10 focus:bg-white/10 focus:border-accent outline-none transition-all font-semibold"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center gap-3 w-full py-5 rounded-2xl bg-accent text-secondary font-black text-xs uppercase tracking-widest shadow-2xl shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 group"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : <><LogIn size={20} /> Initiate Session</>}
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-white/5 text-center">
            <p className="text-sm font-medium text-indigo-100/30">
              New to the ecosystem?{' '}
              <Link to="/register" className="font-black text-accent hover:underline inline-flex items-center gap-2 uppercase tracking-widest text-[11px]">
                Register Orbit <ArrowRight size={14} />
              </Link>
            </p>
          </div>
        </div>
        
        <Link to="/" className="mt-8 flex items-center justify-center gap-2 text-[10px] font-black text-white/20 uppercase tracking-[0.3em] hover:text-white transition-colors">
           <ChevronLeft size={16} /> Return to Home
        </Link>
      </motion.div>
    </div>
  )
}

