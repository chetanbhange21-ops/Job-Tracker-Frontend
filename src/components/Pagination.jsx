import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ page, pageSize, total, onChange }) {
  const pages = Math.max(1, Math.ceil(total / pageSize))
  if (total <= pageSize) return null
  const from = (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  const btn = 'flex h-8 w-8 items-center justify-center rounded-lg border border-ink-200 bg-white text-ink-600 transition hover:bg-ink-50 disabled:cursor-not-allowed disabled:opacity-40'
  return (
    <div className="flex items-center justify-between border-t border-ink-200 px-4 py-3 text-sm text-ink-500">
      <p>
        Showing <span className="font-medium text-ink-800">{from}–{to}</span> of <span className="font-medium text-ink-800">{total}</span>
      </p>
      <div className="flex items-center gap-2">
        <button className={btn} disabled={page <= 1} onClick={() => onChange(page - 1)} aria-label="Previous page">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="min-w-[4.5rem] text-center text-[13px]">Page {page} / {pages}</span>
        <button className={btn} disabled={page >= pages} onClick={() => onChange(page + 1)} aria-label="Next page">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
