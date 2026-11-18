import { Briefcase } from 'lucide-react'

export default function Logo({ className = '' }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white shadow-sm">
        <Briefcase className="h-4 w-4" />
      </div>
      <span className="text-[15px] font-semibold tracking-tight text-ink-900">JobTrack</span>
    </div>
  )
}
