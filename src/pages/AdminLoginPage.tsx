import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { api, getStoredToken, saveToken } from '@/lib/apiClient'
import { SITE } from '@/lib/constants'

type FormValues = { email: string; password: string }

/** Admin JWT login — token stored in localStorage for dashboard API calls. */
export default function AdminLoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from || '/admin'

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormValues>({ defaultValues: { email: '', password: '' } })

  if (getStoredToken()) {
    return <Navigate to="/admin" replace />
  }

  const onSubmit = async (values: FormValues) => {
    try {
      const { data } = await api.post<{ token: string }>('/auth/login', values)
      saveToken(data.token)
      navigate(from, { replace: true })
    } catch {
      setError('root', { message: 'Invalid email or password' })
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#020617] px-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <p className="mb-6 text-center font-heading text-xl font-semibold text-white">{SITE.name}</p>
        <Card className="border-white/10 bg-white/5 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-white">Admin sign in</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-200">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="username"
                  className="border-white/10 bg-white/5 text-white"
                  {...register('email', { required: 'Required' })}
                />
                {errors.email ? <p className="text-xs text-red-400">{errors.email.message}</p> : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-200">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  className="border-white/10 bg-white/5 text-white"
                  {...register('password', { required: 'Required' })}
                />
                {errors.password ? (
                  <p className="text-xs text-red-400">{errors.password.message}</p>
                ) : null}
              </div>
              {errors.root ? <p className="text-sm text-red-400">{errors.root.message}</p> : null}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Signing in…' : 'Sign in'}
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-slate-400">
              <Link to="/" className="text-accent hover:underline">
                ← Back to site
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
