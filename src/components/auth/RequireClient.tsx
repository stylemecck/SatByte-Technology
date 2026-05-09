import { type ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { getStoredToken } from '@/lib/apiClient'

export function RequireClient({ children }: { children: ReactNode }) {
  const location = useLocation()
  const token = getStoredToken()

  if (!token) {
    return <Navigate to="/client-login" replace state={{ from: location.pathname }} />
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    // If an admin tries to access client portal, send them to admin dashboard
    if (payload.role === 'admin') {
      return <Navigate to="/admin" replace />
    }
    
    // Any other role check can go here (e.g. if we have specific 'client' role)
    // Currently assume if not admin, it's a client or user.
  } catch (e) {
    return <Navigate to="/client-login" replace />
  }

  return children
}
