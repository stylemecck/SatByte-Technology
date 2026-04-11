import { type ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { getStoredToken } from '@/lib/apiClient'

export function RequireAdmin({ children }: { children: ReactNode }) {
  const location = useLocation()
  const token = getStoredToken()

  if (!token) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    if (payload.role !== 'admin') {
      return <Navigate to="/portal" replace />
    }
  } catch (e) {
    // If token is malformed, force a relogin
    return <Navigate to="/admin/login" replace />
  }

  return children
}
