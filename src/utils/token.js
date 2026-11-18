import { TOKEN_KEY, USER_KEY } from './constants'

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  },
  getUser: () => {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY))
    } catch {
      return null
    }
  },
  setUser: (user) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
}

// Reads the "exp" claim (seconds) from a JWT without verifying it.
// The backend is the real authority; this only lets us log out early and
// avoids a confusing server error for an already-expired token.
export function isTokenExpired(token, skewSeconds = 10) {
  if (!token) return true
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
    if (!payload.exp) return false
    return payload.exp * 1000 <= Date.now() + skewSeconds * 1000
  } catch {
    return true
  }
}
