// The backend returns errors in two shapes (see GlobalExceptionHandler):
//   validation: { "companyName": "Company name is required", ... }
//   business:   { "error": "Application not found with id: 5" }
// Security failures (bad credentials / missing token) come back as 401/403 with an empty body.
export function getErrorMessage(err, fallback = 'Something went wrong. Please try again.') {
  if (!err) return fallback
  if (err.code === 'SESSION_EXPIRED') return 'Your session has expired. Please sign in again.'
  if (!err.response) return 'Cannot reach the server. Check that the backend is running on port 8080.'

  const { data, status } = err.response
  if (typeof data === 'string' && data.trim()) return data
  if (data && typeof data === 'object') {
    if (typeof data.error === 'string') return data.error
    if (typeof data.message === 'string' && data.message) return data.message
    const messages = Object.values(data).filter((v) => typeof v === 'string')
    if (messages.length) return messages.join('. ')
  }
  if (status === 401 || status === 403) return 'You are not authorised to perform this action.'
  if (status >= 500) return 'The server ran into a problem. Please try again shortly.'
  return fallback
}

// Field-level errors for forms: returns { fieldName: message } when the backend sent a validation map.
export function getFieldErrors(err) {
  const data = err?.response?.data
  if (err?.response?.status === 400 && data && typeof data === 'object' && !data.error) {
    return Object.fromEntries(Object.entries(data).filter(([, v]) => typeof v === 'string'))
  }
  return {}
}
