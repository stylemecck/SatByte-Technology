import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, LogIn, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react'
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
      const msg = err.response?.data?.message || err.message || 'Login failed. Please check your credentials.'
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <SEO title="Login" />
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-6">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-xl">S</div>
          <span className="font-heading font-extrabold text-2xl text-secondary">SatByte Careers</span>
        </Link>
        <h2 className="text-3xl font-extrabold text-secondary font-heading tracking-tight">Welcome back</h2>
        <p className="mt-2 text-sm text-slate-500">
          Sign in to manage your applications and learning paths.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white py-10 px-6 sm:px-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100"
        >
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-bold flex gap-2">
              <ShieldCheck size={18} /> {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  required
                  type="email"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-primary outline-none transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  required
                  type="password"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-primary outline-none transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="mt-2 text-right">
                <Link to="/" className="text-xs font-bold text-primary hover:underline">Forgot password?</Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-secondary text-white font-extrabold text-lg shadow-xl shadow-secondary/20 hover:bg-primary transition-all disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="animate-spin" size={24} /> : <><LogIn size={20} /> Sign In</>}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              New to SatByte?{' '}
              <Link to="/register" className="font-bold text-primary hover:underline inline-flex items-center gap-1">
                Create an account <ArrowRight size={14} />
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
