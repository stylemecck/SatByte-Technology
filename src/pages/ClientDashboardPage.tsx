import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Navigate, useNavigate } from 'react-router-dom'
import { api, getStoredToken, setAuthToken } from '@/lib/apiClient'
import { SEO } from '@/components/SEO'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function useMyOrdersQuery() {
  return useQuery({
    queryKey: ['my-orders'],
    queryFn: async () => {
      const stored = getStoredToken()
      if (stored) setAuthToken(stored)
      const { data } = await api.get('/checkout/my-orders')
      return data as any[]
    },
    retry: 2,
    retryDelay: 800,
    staleTime: 30_000,
  })
}

export default function ClientDashboardPage() {
  const token = localStorage.getItem('satbyte_token')
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState<'projects' | 'billing' | 'settings'>('projects')
  const [newPassword, setNewPassword] = useState('')
  const [passLoading, setPassLoading] = useState(false)
  const [passMsg, setPassMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null)

  if (!token) {
    return <Navigate to="/client-login" replace />
  }

  const { data, isPending, isError, refetch } = useMyOrdersQuery()

  const logout = () => {
    localStorage.removeItem('satbyte_token')
    navigate('/')
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword.length < 8) {
      setPassMsg({ type: 'error', text: 'Password must be at least 8 characters long.' })
      return
    }
    setPassLoading(true)
    setPassMsg(null)
    try {
      await api.post('/auth/client-set-password', { password: newPassword })
      setPassMsg({ type: 'success', text: 'Password successfully updated!' })
      setNewPassword('')
    } catch (err: any) {
      setPassMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update password' })
    } finally {
      setPassLoading(false)
    }
  }

  return (
    <>
      <SEO title="Client Portal" description="Track your SatByte projects" path="/portal" />
      <div className="mx-auto max-w-5xl px-4 py-16 min-h-[70vh]">
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Your Dashboard</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Track projects, manage billing, and update settings.</p>
          </div>
          <Button variant="outline" onClick={logout}>
            Logout
          </Button>
        </div>

        {/* Custom Tabs Navigation */}
        <div className="flex space-x-1 border-b border-slate-200 dark:border-white/10 mb-8 overflow-x-auto hide-scrollbar">
          {(['projects', 'billing', 'settings'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? 'border-primary text-primary dark:border-accent dark:text-accent'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Shared Loading/Error States */}
        {isPending ? (
          <div className="grid gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="h-36 w-full animate-pulse rounded-xl bg-slate-100 dark:bg-white/5" />
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <p className="text-red-500 font-medium">Failed to load data.</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              There was a problem communicating with the server.
            </p>
            <Button onClick={() => refetch()} variant="outline">
              Retry
            </Button>
          </div>
        ) : null}

        {/* Tab 1: Projects */}
        {!isPending && !isError && activeTab === 'projects' && (
          data?.length === 0 ? (
            <Card className="p-10 text-center border-dashed">
              <p className="text-slate-500">No active projects found.</p>
            </Card>
          ) : (
            <div className="grid gap-6">
              {data?.map((order) => (
                <Card key={order._id} className="overflow-hidden border-slate-200/80 bg-white shadow-sm dark:border-white/10 dark:bg-[#0f172a]">
                  <CardHeader className="bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/10">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <CardTitle className="text-xl text-primary dark:text-accent">{order.planName}</CardTitle>
                        <p className="mt-1 text-sm text-slate-500 font-mono">Ref: {order.emailReferenceId}</p>
                      </div>
                      <div className="self-start sm:self-center whitespace-nowrap rounded-full bg-slate-200/50 dark:bg-slate-800 px-4 py-1.5 text-sm font-medium text-slate-800 dark:text-slate-200 shadow-sm">
                        Status: <span className="text-primary dark:text-accent font-semibold">{order.projectStatus || 'Pending'}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 sm:p-8">
                    <div className="mb-3 flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-600 dark:text-slate-400">Project Progress</span>
                      <span className="font-bold text-slate-900 dark:text-white">{order.progress || 0}%</span>
                    </div>
                    <div className="h-4 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/5 shadow-inner">
                      <div
                        className="h-full bg-primary transition-all duration-500 dark:bg-accent rounded-full"
                        style={{ width: `${order.progress || 0}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )
        )}

        {/* Tab 2: Billing */}
        {!isPending && !isError && activeTab === 'billing' && (
          <Card className="border-slate-200/80 dark:border-white/10 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/10">
              <CardTitle>Order History</CardTitle>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
                <thead className="bg-slate-100 dark:bg-slate-800/50 text-slate-900 dark:text-slate-200 uppercase text-xs">
                  <tr>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium">Reference</th>
                    <th className="px-6 py-4 font-medium">Plan</th>
                    <th className="px-6 py-4 font-medium">Amount</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {data?.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                        No billing history available.
                      </td>
                    </tr>
                  ) : (
                    data?.map((order) => (
                      <tr key={order._id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 font-mono text-xs">{order.emailReferenceId}</td>
                        <td className="px-6 py-4">{order.planName}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {order.amountPaid ? `₹${(order.amountPaid / 100).toLocaleString()}` : '—'}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            {order.status || 'Paid'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Tab 3: Settings */}
        {!isPending && !isError && activeTab === 'settings' && (
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-slate-200/80 dark:border-white/10 shadow-sm h-fit">
              <CardHeader>
                <CardTitle>Set Permanent Password</CardTitle>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Tired of waiting for email codes? Set a permanent password to log in instantly next time.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdatePassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="At least 8 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  {passMsg && (
                    <div className={`p-3 rounded-md text-sm font-medium ${
                      passMsg.type === 'success' ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                      {passMsg.text}
                    </div>
                  )}

                  <Button type="submit" disabled={passLoading}>
                    {passLoading ? 'Saving...' : 'Save Password'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="border-slate-200/80 dark:border-white/10 shadow-sm h-fit bg-slate-50 dark:bg-white/5">
              <CardHeader>
                <CardTitle>Account Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-slate-500">Connected Email</Label>
                  <div className="mt-1 font-medium text-slate-900 dark:text-slate-200">
                    {data?.[0]?.email || 'Loading...'}
                  </div>
                </div>
                <div>
                  <Label className="text-slate-500">Account Status</Label>
                  <div className="mt-1 inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                    Active Client
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </>
  )
}
