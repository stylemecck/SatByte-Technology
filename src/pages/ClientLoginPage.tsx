import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '@/lib/apiClient'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SEO } from '@/components/SEO'
import { SectionHeader } from '@/components/SectionHeader'

export default function ClientLoginPage() {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<1 | 2>(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

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
      localStorage.setItem('satbyte_token', res.data.token)
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
          <CardHeader>
            <CardTitle>{step === 1 ? 'Enter your Email' : 'Enter Login Code'}</CardTitle>
          </CardHeader>
          <CardContent>
            {error && <p className="mb-4 text-sm font-medium text-red-500">{error}</p>}
            {step === 1 ? (
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
            ) : (
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
