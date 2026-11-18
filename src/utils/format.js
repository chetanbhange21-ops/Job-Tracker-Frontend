// appliedDate arrives as "yyyy-MM-dd" (LocalDate). Parse as local date to avoid timezone shifts.
export function formatDate(value) {
  if (!value) return '—'
  const [y, m, d] = String(value).slice(0, 10).split('-').map(Number)
  if (!y || !m || !d) return '—'
  return new Date(y, m - 1, d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

// createdAt / updatedAt arrive as LocalDateTime ISO strings without timezone.
export function formatDateTime(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' })
}

export const todayISO = () => {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export const initials = (name = '') =>
  name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('') || '?'

export const isValidUrl = (value) => {
  try {
    const u = new URL(value)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

export const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
