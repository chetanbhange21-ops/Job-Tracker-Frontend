import { STATUS_MAP } from '../utils/constants'

export default function StatusBadge({ status }) {
  const s = STATUS_MAP[status]
  if (!s) return <span className="text-sm text-ink-500">{status || '—'}</span>
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${s.badge}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  )
}
