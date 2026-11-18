import api from './api'

export const authService = {
  // -> { token, name, email }
  async login({ email, password }) {
    try {
      const { data } = await api.post('/api/auth/login', { email, password })
      return data
    } catch (err) {
      // Spring's AuthenticationManager throws BadCredentialsException, which the backend
      // surfaces as an empty 401/403 instead of a JSON message.
      const status = err.response?.status
      if (status === 401 || status === 403) {
        err.response.data = { error: 'Invalid email or password.' }
      }
      throw err
    }
  },

  // -> { token, name, email } (the token is ignored: the UI sends the user to the login page)
  async register({ name, email, password }) {
    const { data } = await api.post('/api/auth/register', { name, email, password })
    return data
  },
}
