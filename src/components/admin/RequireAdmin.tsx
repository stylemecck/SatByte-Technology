import { type ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { getStoredToken } from '@/lib/apiClient'

export function RequireAdmin({ children }: { children: ReactNode }) {
  const location = useLocation()
  if (!getStoredToken()) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  }
  return children
}
