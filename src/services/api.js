import axios from 'axios'
import { AUTH_EXPIRED_EVENT } from '../utils/constants'
import { isTokenExpired, tokenStorage } from '../utils/token'

// Empty base URL => same-origin requests that Vite proxies to http://localhost:8080 (see vite.config.js).
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

const isAuthEndpoint = (url = '') => url.includes('/api/auth/')

function expireSession() {
  tokenStorage.clear()
  window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT))
}

api.interceptors.request.use((config) => {
  if (isAuthEndpoint(config.url)) return config

  const token = tokenStorage.get()
  if (!token || isTokenExpired(token)) {
    expireSession()
    const error = new axios.AxiosError('Session expired', 'SESSION_EXPIRED', config)
    return Promise.reject(error)
  }
  config.headers.Authorization = `Bearer ${token}`
  return config
})

// The backend answers 403 (not 401) for a missing/invalid token, so both mean "sign in again".
// Auth endpoints are excluded: a failed login also comes back as 403 and must not log anyone out.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    if ((status === 401 || status === 403) && !isAuthEndpoint(error.config?.url)) {
      expireSession()
    }
    return Promise.reject(error)
  },
)

export default api
