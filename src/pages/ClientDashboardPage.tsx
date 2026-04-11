import { useQuery } from '@tanstack/react-query'
import { Navigate, useNavigate } from 'react-router-dom'
import { api, getStoredToken, setAuthToken } from '@/lib/apiClient'
import { SEO } from '@/components/SEO'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

function useMyOrdersQuery() {
  return useQuery({
    queryKey: ['my-orders'],
    queryFn: async () => {
      // Safety net: ensure the token header is attached even if hydration
      // ran before React had a chance to mount (StrictMode double-render)
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

  if (!token) {
    return <Navigate to="/client-login" replace />
  }

  const { data, isPending, isError, refetch } = useMyOrdersQuery()

  const logout = () => {
    localStorage.removeItem('satbyte_token')
    navigate('/')
  }

  return (
    <>
      <SEO title="Client Portal" description="Track your SatByte projects" path="/portal" />
      <div className="mx-auto max-w-5xl px-4 py-16 min-h-[70vh]">
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Your Dashboard</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Track and manage your SatByte projects.</p>
          </div>
          <Button variant="outline" onClick={logout}>
            Logout
          </Button>
        </div>

        {isPending ? (
          <div className="grid gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="h-36 w-full animate-pulse rounded-xl bg-slate-100 dark:bg-white/5" />
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <p className="text-red-500 font-medium">Failed to load projects.</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              There was a problem fetching your data. Please try again.
            </p>
            <Button onClick={() => refetch()} variant="outline">
              Retry
            </Button>
          </div>
        ) : data?.length === 0 ? (
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
        )}
      </div>
    </>
  )
}
