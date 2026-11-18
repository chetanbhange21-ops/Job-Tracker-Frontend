import { Skeleton } from './Spinner'

export default function StatCard({ label, value, icon: Icon, tone = 'brand', loading, delay = 0 }) {
  const tones = {
    brand: 'bg-brand-50 text-brand-600 ring-brand-100',
    blue: 'bg-blue-50 text-blue-600 ring-blue-100',
    amber: 'bg-amber-50 text-amber-600 ring-amber-100',
    violet: 'bg-violet-50 text-violet-600 ring-violet-100',
    emerald: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
    red: 'bg-red-50 text-red-600 ring-red-100',
  }
  return (
    <div
      className="card group animate-fade-up p-5 transition duration-200 hover:-translate-y-0.5 hover:border-ink-300 hover:shadow-pop"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-medium text-ink-500">{label}</p>
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ring-1 ring-inset transition group-hover:scale-110 ${tones[tone]}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      {loading ? <Skeleton className="mt-3 h-8 w-16" /> : <p className="mt-3 text-3xl font-semibold tracking-tight text-ink-900">{value ?? 0}</p>}
    </div>
  )
}
