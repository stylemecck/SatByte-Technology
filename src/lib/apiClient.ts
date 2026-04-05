import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL?.trim() || '/api'

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
  return localStorage.getItem(TOKEN_KEY)
}

export function saveToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
  setAuthToken(token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
  setAuthToken(null)
}

/** Call once on app load if token exists. */
export function hydrateAuthFromStorage() {
  const t = getStoredToken()
  if (t) setAuthToken(t)
}
