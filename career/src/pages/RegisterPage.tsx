import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Mail, Lock, ArrowRight, ShieldCheck, Loader2, Sparkles, ChevronLeft, Rocket } from 'lucide-react'
import { api, getStoredToken, saveToken } from '../lib/apiClient'
import { SEO } from '../components/SEO'
import { useAuth } from '../contexts/AuthContext'

export default function RegisterPage() {
  if (getStoredToken()) {
    return <Navigate to="/dashboard" replace />
  }
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      const { data } = await api.post('auth/client-register', { name, email, password })
      saveToken(data.token)
      login(data.token, data.user)
      navigate('/dashboard')
    } catch (err: any) {
      console.error('Registration error:', err)
      const msg = err.response?.data?.message || err.message || 'Registration sequence aborted.'
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden selection:bg-brand-blue/30">
      <SEO title="Register" />

      {/* Cinematic Background */}
      <div className="absolute inset-0 mesh-gradient opacity-30 pointer-events-none" />
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand-emerald/10 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand-blue/20 blur-[120px] rounded-full translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full relative z-10"
      >
        <div className="text-center mb-12">
          <Link to="/" className="inline-flex flex-col items-center group">
             <div className="h-16 w-16 rounded-[1.8rem] bg-foreground text-background flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500 mb-6">
                <Rocket className="h-8 w-8" />
             </div>
             <h2 className="text-4xl font-black text-foreground tracking-tighter mb-2 leading-none uppercase">Create Orbit</h2>
             <p className="text-muted-foreground font-bold text-xs uppercase tracking-[0.3em]">Initialize your profile.</p>
          </Link>
        </div>

        <div className="glass p-12 rounded-[3.5rem] border border-border shadow-2xl relative">
          {error && (
            <motion.div 
               initial={{ opacity: 0, x: -10 }}
               animate={{ opacity: 1, x: 0 }}
               className="mb-8 p-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-3"
            >
              <ShieldCheck size={16} /> {error}
            </motion.div>
          )}

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">Full Legal Identity</label>
              <div className="relative group">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-brand-blue transition-colors" size={20} />
                <input
                  required type="text" placeholder="Satya Nadella"
                  className="w-full pl-16 pr-8 py-5 rounded-2xl bg-secondary border border-border text-foreground placeholder-muted-foreground/30 focus:border-brand-blue/50 outline-none transition-all font-bold text-[15px]"
                  value={name} onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">Secure Mail Relay</label>
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-brand-blue transition-colors" size={20} />
                <input
                  required type="email" placeholder="identity@satbyte.in"
                  className="w-full pl-16 pr-8 py-5 rounded-2xl bg-secondary border border-border text-foreground placeholder-muted-foreground/30 focus:border-brand-blue/50 outline-none transition-all font-bold text-[15px]"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">Security Hash (Password)</label>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-brand-blue transition-colors" size={20} />
                <input
                  required type="password" placeholder="••••••••"
                  className="w-full pl-16 pr-8 py-5 rounded-2xl bg-secondary border border-border text-foreground placeholder-muted-foreground/30 focus:border-brand-blue/50 outline-none transition-all font-bold text-[15px]"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit" disabled={isLoading}
              className="h-20 flex items-center justify-center gap-4 w-full rounded-full bg-foreground text-background font-black text-xs uppercase tracking-widest shadow-2xl hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 group/btn"
            >
              {isLoading ? <Loader2 className="animate-spin" size={24} /> : <><Sparkles size={24} className="group-hover/btn:rotate-12 transition-transform" /> Activate Account</>}
            </button>
          </form>

          <div className="mt-12 pt-10 border-t border-border text-center">
            <p className="text-sm font-bold text-muted-foreground">
              Already have an identity?{' '}
              <Link to="/login" className="font-black text-brand-blue hover:underline decoration-2 underline-offset-4 inline-flex items-center gap-2 uppercase tracking-widest text-[11px] ml-2">
                Sign In <ArrowRight size={14} />
              </Link>
            </p>
          </div>
        </div>
        
        <Link to="/" className="mt-12 flex items-center justify-center gap-3 text-[10px] font-black text-muted-foreground hover:text-foreground uppercase tracking-[0.4em] transition-colors">
           <ChevronLeft size={16} /> Return to Home
        </Link>
      </motion.div>
    </div>
  )
}
