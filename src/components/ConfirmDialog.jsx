import { useEffect } from 'react'
import { TriangleAlert } from 'lucide-react'
import Button from './Button'

export default function ConfirmDialog({ open, title, description, confirmLabel = 'Delete', loading, onConfirm, onCancel }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && !loading && onCancel()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, loading, onCancel])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 animate-fade-up bg-ink-900/40 backdrop-blur-[2px]" onClick={() => !loading && onCancel()} />
      <div className="card relative w-full max-w-md animate-fade-up p-6 shadow-pop">
        <div className="flex gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
            <TriangleAlert className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-ink-900">{title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{description}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={onCancel} disabled={loading}>Cancel</Button>
          <Button variant="danger" onClick={onConfirm} loading={loading}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  )
}
