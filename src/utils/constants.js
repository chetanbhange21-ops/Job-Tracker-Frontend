// Mirrors JobApplication.ApplicationStatus in the Spring Boot backend.
export const STATUSES = [
  { value: 'APPLIED', label: 'Applied', badge: 'bg-blue-50 text-blue-700 ring-blue-600/15', dot: 'bg-blue-500', bar: 'bg-blue-500' },
  { value: 'INTERVIEW_SCHEDULED', label: 'Interview Scheduled', badge: 'bg-amber-50 text-amber-700 ring-amber-600/20', dot: 'bg-amber-500', bar: 'bg-amber-500' },
  { value: 'INTERVIEW_DONE', label: 'Interview Done', badge: 'bg-violet-50 text-violet-700 ring-violet-600/15', dot: 'bg-violet-500', bar: 'bg-violet-500' },
  { value: 'OFFER_RECEIVED', label: 'Offer Received', badge: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20', dot: 'bg-emerald-500', bar: 'bg-emerald-500' },
  { value: 'REJECTED', label: 'Rejected', badge: 'bg-red-50 text-red-700 ring-red-600/15', dot: 'bg-red-500', bar: 'bg-red-500' },
  { value: 'WITHDRAWN', label: 'Withdrawn', badge: 'bg-ink-100 text-ink-600 ring-ink-500/15', dot: 'bg-ink-400', bar: 'bg-ink-400' },
]

export const STATUS_MAP = Object.fromEntries(STATUSES.map((s) => [s.value, s]))

export const TOKEN_KEY = 'jobtrack.token'
export const USER_KEY = 'jobtrack.user'
export const AUTH_EXPIRED_EVENT = 'jobtrack:auth-expired'
export const PAGE_SIZE = 8
