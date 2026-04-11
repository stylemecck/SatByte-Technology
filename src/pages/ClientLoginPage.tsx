import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, saveToken } from '@/lib/apiClient'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SEO } from '@/components/SEO'
import { SectionHeader } from '@/components/SectionHeader'

export default function ClientLoginPage() {
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password')
  
  // States for both methods
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  // OTP specific state
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<1 | 2>(1)
  
  // Shared state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/auth/client-password-login', { email, password })
      saveToken(res.data.token) // Updated to use saveToken
      navigate('/portal')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials or no active project found')
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
      setError(err.response?.data?.message || 'Failed to send OTP. Ensure you have made an order.')
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
      saveToken(res.data.token) // Updated to use saveToken
      navigate('/portal')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid or expired OTP')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SEO title="Client Login" description="Access your SatByte projects" path="/client-login" />
      <div className="mx-auto max-w-md px-4 py-20 min-h-[70vh]">
        <SectionHeader eyebrow="Secure Portal" title="Client Login" subtitle="Access your projects and orders." />
        <Card className="mt-8 border-slate-200/80 bg-white shadow-xl dark:border-white/10 dark:bg-[#0f172a]">
          
          <div className="flex border-b border-slate-200 dark:border-white/10">
            <button 
              className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors ${loginMethod === 'password' ? 'border-primary text-primary dark:text-accent dark:border-accent' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
              onClick={() => { setLoginMethod('password'); setError(''); }}
            >
              Password
            </button>
            <button 
              className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors ${loginMethod === 'otp' ? 'border-primary text-primary dark:text-accent dark:border-accent' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
              onClick={() => { setLoginMethod('otp'); setError(''); }}
            >
              Email Code
            </button>
          </div>

          <CardHeader>
            <CardTitle>
              {loginMethod === 'password' 
                ? 'Welcome Back' 
                : step === 1 ? 'Enter your Email' : 'Enter Login Code'}
            </CardTitle>
          </CardHeader>

          <CardContent>
            {error && <p className="mb-4 text-sm font-medium text-red-500">{error}</p>}

            {loginMethod === 'password' && (
              <form onSubmit={handlePasswordLogin} className="space-y-4">
                <Input
                  type="email"
                  placeholder="your-email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
                <div className="text-center mt-4">
                  <p className="text-sm text-slate-500">
                    First time logging in or forgot password?{' '}
                    <button type="button" onClick={() => setLoginMethod('otp')} className="text-primary font-medium hover:underline dark:text-accent">
                      Use Email Code
                    </button>
                  </p>
                </div>
              </form>
            )}

            {loginMethod === 'otp' && step === 1 && (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <Input
                  type="email"
                  placeholder="your-email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Login Code'}
                </Button>
              </form>
            )}

            {loginMethod === 'otp' && step === 2 && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Code sent to <strong>{email}</strong>
                </p>
                <Input
                  type="text"
                  placeholder="123456"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  className="text-center text-2xl tracking-widest font-mono"
                />
                <Button type="submit" className="w-full" disabled={loading || otp.length < 6}>
                  {loading ? 'Verifying...' : 'Login'}
                </Button>
                <Button type="button" variant="ghost" onClick={() => setStep(1)} className="w-full">
                  Use a different email
                </Button>
              </form>
            )}

          </CardContent>
        </Card>
      </div>
    </>
  )
}
