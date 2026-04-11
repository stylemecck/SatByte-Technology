import { createContext, useContext, useEffect, useState } from 'react'
import type { User } from '../types'
import { api, getStoredToken, clearToken } from '../lib/apiClient'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (token: string, userData: User) => void
  logout: () => void
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshProfile = async () => {
    try {
      const { data } = await api.get('auth/profile')
      setUser(data)
    } catch (e) {
      console.error('Failed to fetch profile', e)
      clearToken()
      setUser(null)
    }
  }

  useEffect(() => {
    const initAuth = async () => {
      const token = getStoredToken()
      if (token) {
        api.defaults.headers.common.Authorization = `Bearer ${token}`
        await refreshProfile()
      }
      setIsLoading(false)
    }
    initAuth()
  }, [])

  const login = (token: string, userData: User) => {
    api.defaults.headers.common.Authorization = `Bearer ${token}`
    setUser(userData)
  }

  const logout = () => {
    clearToken()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
