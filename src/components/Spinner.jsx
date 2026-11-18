import { Loader2 } from 'lucide-react'

export default function Spinner({ label = 'Loading…', className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 py-20 text-ink-500 ${className}`}>
      <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
      <p className="text-sm">{label}</p>
    </div>
  )
}

export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-md bg-ink-100 ${className}`} />
}
