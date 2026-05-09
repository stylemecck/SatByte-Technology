import { useState } from 'react'
import { Navigate, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, ShieldCheck, Lock, Globe, Layers, LayoutDashboard, FileText, Users, MessageSquare, HelpCircle } from 'lucide-react'
import { api, getStoredToken, saveToken } from '@/lib/apiClient'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SEO } from '@/components/SEO'
import { Logo } from '@/components/Logo'
import { cn } from '@/lib/utils'

const PORTAL_FEATURES = [
  { icon: LayoutDashboard, title: 'Project Dashboard', desc: 'Real-time project tracking & updates.' },
  { icon: FileText, title: 'Invoices & Reports', desc: 'Centralized billing and progress data.' },
  { icon: Layers, title: 'Asset Management', desc: 'Secure storage for all project files.' },
  { icon: Users, title: 'Team Collaboration', desc: 'Direct channel to your project leads.' }
]

const SECURITY_BADGES = [
  { icon: ShieldCheck, text: 'AES-256 Encryption' },
  { icon: Lock, text: 'Secure Authentication' },
  { icon: Globe, text: 'Private Infrastructure' }
]

export default function ClientLoginPage() {
  if (getStoredToken()) {
    return <Navigate to="/portal" replace />
  }

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password')
  const [showPassword, setShowPassword] = useState(false)
  
  // Form states
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<1 | 2>(1)
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await api.post('auth/client-password-login', { email, password })
      saveToken(res.data.token)
      navigate('/portal')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const res = await api.post('auth/client-register', { email, password })
      saveToken(res.data.token)
      setSuccess('Account created successfully! Redirecting...')
      setTimeout(() => navigate('/portal'), 1500)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await api.post('auth/client-login', { email })
      setStep(2)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await api.post('auth/client-verify', { email, otp })
      saveToken(res.data.token)
      navigate('/portal')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid code')
    } finally {
      setLoading(false)
    }
  }

  const resetForms = (mode: 'login' | 'register') => {
    setAuthMode(mode)
    setError('')
    setSuccess('')
    setStep(1)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      <SEO title="Secure Access" description="Access your SatByte workspace securely." path="/client-login" />
      
      {/* Left Column: Context & Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-secondary/5 border-r border-border p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,rgba(var(--primary-rgb),0.05),transparent_50%)]" />
        <div className="relative z-10">
          <Link to="/" className="inline-block mb-16">
            <Logo variant="full" />
          </Link>
          <div className="max-w-md">
            <h1 className="text-5xl font-black tracking-tight leading-[1.1] mb-6">
              Secure Access to Your <br />
              <span className="text-primary">SatByte Workspace.</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-12">
              Access your project dashboards, development reports, invoices, and collaboration tools in one secure location.
            </p>

            <div className="grid grid-cols-1 gap-6 mb-16">
              {PORTAL_FEATURES.map(f => (
                <div key={f.title} className="flex gap-4 p-4 rounded-2xl bg-background/50 border border-border backdrop-blur-sm">
                   <div className="h-10 w-10 rounded-xl bg-secondary border border-border flex items-center justify-center text-primary">
                      <f.icon className="h-5 w-5" />
                   </div>
                   <div>
                      <h4 className="font-bold text-sm mb-1">{f.title}</h4>
                      <p className="text-xs text-muted-foreground">{f.desc}</p>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-10 flex flex-wrap gap-8 opacity-50">
           {SECURITY_BADGES.map(b => (
             <div key={b.text} className="flex items-center gap-2">
                <b.icon className="h-4 w-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">{b.text}</span>
             </div>
           ))}
        </div>
      </div>

      {/* Right Column: Auth Forms */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 relative">
        <div className="lg:hidden mb-12">
           <Logo variant="full" />
        </div>
        
        <div className="w-full max-w-[440px]">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black mb-2">{authMode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
            <p className="text-muted-foreground">
              {authMode === 'login' ? 'Enter your credentials to access your portal.' : 'Register to track your studio projects.'}
            </p>
          </div>

          <Card className="border-border bg-card shadow-2xl rounded-[2.5rem] overflow-hidden">
            <div className="flex border-b border-border bg-muted/50 p-1">
               <button 
                 onClick={() => resetForms('login')}
                 className={cn(
                   "flex-1 py-3 text-sm font-bold rounded-2xl transition-all",
                   authMode === 'login' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                 )}
               >
                 Log In
               </button>
               <button 
                 onClick={() => resetForms('register')}
                 className={cn(
                   "flex-1 py-3 text-sm font-bold rounded-2xl transition-all",
                   authMode === 'register' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                 )}
               >
                 Sign Up
               </button>
            </div>

            <CardContent className="p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={authMode}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {error && <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-bold text-red-500 text-center">{error}</div>}
                  {success && <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-xs font-bold text-green-500 text-center">{success}</div>}

                  {authMode === 'login' && (
                    <div className="space-y-6">
                      <div className="flex p-1 bg-muted rounded-xl mb-2">
                        <button 
                          onClick={() => setLoginMethod('password')}
                          className={cn("flex-1 py-2 text-[10px] font-bold rounded-lg transition-all", loginMethod === 'password' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground')}
                        >
                          PASSWORD
                        </button>
                        <button 
                          onClick={() => setLoginMethod('otp')}
                          className={cn("flex-1 py-2 text-[10px] font-bold rounded-lg transition-all", loginMethod === 'otp' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground')}
                        >
                          ACCESS CODE
                        </button>
                      </div>

                      {loginMethod === 'password' ? (
                        <form onSubmit={handlePasswordLogin} className="space-y-5">
                          <div className="space-y-2">
                             <Input
                               type="email"
                               placeholder="name@company.com"
                               value={email}
                               onChange={(e) => setEmail(e.target.value)}
                               required
                               className="h-12 rounded-xl bg-secondary/30"
                             />
                          </div>
                          <div className="space-y-2 relative">
                             <Input
                               type={showPassword ? "text" : "password"}
                               placeholder="••••••••"
                               value={password}
                               onChange={(e) => setPassword(e.target.value)}
                               required
                               className="h-12 rounded-xl bg-secondary/30 pr-12"
                             />
                             <button 
                               type="button" 
                               onClick={() => setShowPassword(!showPassword)}
                               className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                             >
                               {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                             </button>
                          </div>
                          
                          <div className="flex items-center justify-between px-1">
                             <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                                <input type="checkbox" className="rounded border-border bg-secondary" />
                                <span>Remember me</span>
                             </label>
                             <button type="button" className="text-xs font-bold text-primary hover:underline">Forgot password?</button>
                          </div>

                          <Button type="submit" className="w-full h-12 rounded-xl font-bold bg-primary text-primary-foreground shadow-lg shadow-primary/20" disabled={loading}>
                            {loading ? 'Authenticating...' : 'Enter Workspace'}
                          </Button>
                        </form>
                      ) : step === 1 ? (
                        <form onSubmit={handleRequestOtp} className="space-y-5">
                          <Input
                            type="email"
                            placeholder="name@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="h-12 rounded-xl bg-secondary/30"
                          />
                          <Button type="submit" className="w-full h-12 rounded-xl font-bold" disabled={loading}>
                            {loading ? 'Sending Code...' : 'Send Access Code'}
                          </Button>
                        </form>
                      ) : (
                        <form onSubmit={handleVerifyOtp} className="space-y-5 text-center">
                          <p className="text-sm text-muted-foreground mb-4">Verification code sent to <strong>{email}</strong></p>
                          <Input
                            type="text"
                            placeholder="••••••"
                            maxLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            className="text-center text-2xl tracking-[0.5em] font-mono h-14 rounded-xl bg-secondary/30"
                          />
                          <Button type="submit" className="w-full h-12 rounded-xl font-bold" disabled={loading || otp.length < 6}>
                            {loading ? 'Verifying...' : 'Continue Securely'}
                          </Button>
                          <button type="button" onClick={() => setStep(1)} className="text-xs text-muted-foreground hover:text-primary underline">Change Email</button>
                        </form>
                      )}
                    </div>
                  )}

                  {authMode === 'register' && (
                    <form onSubmit={handleRegister} className="space-y-5">
                      <Input
                        type="email"
                        placeholder="name@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-12 rounded-xl bg-secondary/30"
                      />
                      <Input
                        type="password"
                        placeholder="Create Secure Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="h-12 rounded-xl bg-secondary/30"
                      />
                      <Button type="submit" className="w-full h-12 rounded-xl font-bold" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Continue Securely'}
                      </Button>
                      <p className="text-[10px] text-center text-muted-foreground px-4">
                        By signing up, you agree to our terms and will receive access to your private project portal.
                      </p>
                    </form>
                  )}
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>

          <div className="mt-12 grid grid-cols-2 gap-4">
             <div className="flex items-center gap-3 p-4 rounded-2xl border border-border bg-secondary/10">
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Support Center</span>
             </div>
             <div className="flex items-center gap-3 p-4 rounded-2xl border border-border bg-secondary/10">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Contact Ops</span>
             </div>
          </div>
          
          <div className="mt-8 text-center">
             <p className="text-xs text-muted-foreground">
                Protected by SatByte Cloud Security. <br />
                <span className="font-bold">Privacy First Architecture.</span>
             </p>
          </div>
        </div>
      </div>
    </div>
  )
}

