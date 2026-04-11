import axios from 'axios'
import Cookies from 'js-cookie'

const rawBaseURL = import.meta.env.VITE_API_URL?.trim() || 'https://satbyte-technology.onrender.com/api/'
const baseURL = rawBaseURL.endsWith('/') ? rawBaseURL : `${rawBaseURL}/`

export const api = axios.create({
  baseURL,
})

export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common.Authorization
  }
}

const TOKEN_KEY = 'satbyte_token'

export function getStoredToken(): string | null {
  // Try cookie first (new cross-domain standard)
  const cookieToken = Cookies.get(TOKEN_KEY)
  if (cookieToken) return cookieToken

  // Fallback to localStorage for local dev
  return localStorage.getItem(TOKEN_KEY)
}

export function saveToken(token: string) {
  // Save to cookie on base domain for subdomain sharing
  Cookies.set(TOKEN_KEY, token, { 
    domain: window.location.hostname.includes('satbyte.in') ? '.satbyte.in' : undefined,
    expires: 7, 
    secure: window.location.protocol === 'https:',
    sameSite: 'lax'
  })
  
  localStorage.setItem(TOKEN_KEY, token)
  setAuthToken(token)
}

export function clearToken() {
  Cookies.remove(TOKEN_KEY, { domain: '.satbyte.in' })
  Cookies.remove(TOKEN_KEY)
  localStorage.removeItem(TOKEN_KEY)
  setAuthToken(null)
}

/** Call once on app load if token exists. */
export function hydrateAuthFromStorage() {
  const t = getStoredToken()
  if (t) setAuthToken(t)
}
