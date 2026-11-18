import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { authService } from '../services/authService'
import { AUTH_EXPIRED_EVENT } from '../utils/constants'
import { isTokenExpired, tokenStorage } from '../utils/token'

const AuthContext = createContext(null)

function readInitialSession() {
  const token = tokenStorage.get()
  if (!token || isTokenExpired(token)) {
    tokenStorage.clear()
    return { token: null, user: null }
  }
  return { token, user: tokenStorage.getUser() }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readInitialSession)
  const [sessionExpired, setSessionExpired] = useState(false)

  const logout = useCallback(() => {
    tokenStorage.clear()
    setSession({ token: null, user: null })
  }, [])

  const login = useCallback(async (credentials) => {
    const { token, name, email } = await authService.login(credentials)
    const user = { name, email }
    tokenStorage.set(token)
    tokenStorage.setUser(user)
    setSessionExpired(false)
    setSession({ token, user })
    return user
  }, [])

  const register = useCallback((details) => authService.register(details), [])

  // Fired by the Axios interceptor when the token is missing, expired or rejected.
  useEffect(() => {
    const onExpired = () => {
      setSession({ token: null, user: null })
      setSessionExpired(true)
    }
    window.addEventListener(AUTH_EXPIRED_EVENT, onExpired)
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, onExpired)
  }, [])

  const value = useMemo(
    () => ({
      user: session.user,
      token: session.token,
      isAuthenticated: Boolean(session.token),
      sessionExpired,
      clearSessionExpired: () => setSessionExpired(false),
      login,
      register,
      logout,
    }),
    [session, sessionExpired, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
