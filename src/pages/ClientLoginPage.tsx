import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, saveToken } from '@/lib/apiClient'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SEO } from '@/components/SEO'
import { SectionHeader } from '@/components/SectionHeader'

export default function ClientLoginPage() {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password')
  
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
      const res = await api.post('/auth/client-password-login', { email, password })
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
      const res = await api.post('/auth/client-register', { email, password })
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
      await api.post('/auth/client-login', { email })
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
      const res = await api.post('/auth/client-verify', { email, otp })
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
    <>
      <SEO title="Client Access" description="Access your SatByte projects" path="/client-login" />
      <div className="mx-auto max-w-md px-4 py-20 min-h-[70vh]">
        <SectionHeader eyebrow="Secure Portal" title={authMode === 'login' ? "Client Login" : "Client Registration"} subtitle="Manage your high-end digital projects." />
        
        <Card className="mt-8 border-slate-200/80 bg-white shadow-2xl dark:border-white/10 dark:bg-[#0f172a] overflow-hidden rounded-3xl">
          
          <div className="flex border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5">
            <button 
              className={`flex-1 py-5 text-sm font-bold transition-all ${authMode === 'login' ? 'bg-white dark:bg-[#0f172a] text-primary dark:text-accent' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
              onClick={() => resetForms('login')}
            >
              Log In
            </button>
            <button 
              className={`flex-1 py-5 text-sm font-bold transition-all ${authMode === 'register' ? 'bg-white dark:bg-[#0f172a] text-primary dark:text-accent' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
              onClick={() => resetForms('register')}
            >
              Sign Up
            </button>
          </div>

          <CardContent className="pt-8">
            {error && <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm font-medium text-red-500 text-center">{error}</div>}
            {success && <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-sm font-medium text-green-500 text-center">{success}</div>}

            {authMode === 'login' && (
              <div className="space-y-6">
                <div className="flex p-1 bg-slate-100 dark:bg-white/5 rounded-2xl mb-2">
                  <button 
                    onClick={() => setLoginMethod('password')}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${loginMethod === 'password' ? 'bg-white dark:bg-slate-800 shadow-sm text-primary dark:text-white' : 'text-slate-500'}`}
                  >
                    Password
                  </button>
                  <button 
                    onClick={() => setLoginMethod('otp')}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${loginMethod === 'otp' ? 'bg-white dark:bg-slate-800 shadow-sm text-primary dark:text-white' : 'text-slate-500'}`}
                  >
                    Code
                  </button>
                </div>

                {loginMethod === 'password' ? (
                  <form onSubmit={handlePasswordLogin} className="space-y-4">
                    <Input
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="rounded-xl h-12"
                    />
                    <Input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="rounded-xl h-12"
                    />
                    <Button type="submit" className="w-full h-12 rounded-xl bg-primary text-white font-bold" disabled={loading}>
                      {loading ? 'Authenticating...' : 'Sign In'}
                    </Button>
                  </form>
                ) : step === 1 ? (
                  <form onSubmit={handleRequestOtp} className="space-y-4">
                    <Input
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="rounded-xl h-12"
                    />
                    <Button type="submit" className="w-full h-12 rounded-xl bg-primary text-white font-bold" disabled={loading}>
                      {loading ? 'Sending Code...' : 'Send Login Code'}
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-4 text-center">
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Code sent to <strong>{email}</strong></p>
                    <Input
                      type="text"
                      placeholder="••••••"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                      className="text-center text-2xl tracking-[0.5em] font-mono h-14 rounded-xl"
                    />
                    <Button type="submit" className="w-full h-12 rounded-xl bg-primary text-white font-bold" disabled={loading || otp.length < 6}>
                      {loading ? 'Verifying...' : 'Finish Login'}
                    </Button>
                    <button type="button" onClick={() => setStep(1)} className="text-xs text-slate-500 hover:text-primary underline">Change Email</button>
                  </form>
                )}
              </div>
            )}

            {authMode === 'register' && (
              <form onSubmit={handleRegister} className="space-y-4">
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="rounded-xl h-12"
                />
                <Input
                  type="password"
                  placeholder="Create Password (min 8 chars)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="rounded-xl h-12"
                />
                <Button type="submit" className="w-full h-12 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/20" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
                <p className="text-[10px] text-center text-slate-500 px-4 mt-4">
                  By registering, you agree to our terms and will be able to access support and track upcoming orders.
                </p>
              </form>
            )}

          </CardContent>
        </Card>
      </div>
    </>
  )
}
