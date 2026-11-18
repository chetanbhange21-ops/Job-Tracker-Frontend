import { RefreshCw, TriangleAlert } from 'lucide-react'
import Button from './Button'

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="card flex flex-col items-center px-6 py-14 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600 ring-1 ring-red-100">
        <TriangleAlert className="h-6 w-6" />
      </div>
      <h3 className="text-[15px] font-semibold text-ink-900">Couldn’t load data</h3>
      <p className="mt-1 max-w-md text-sm text-ink-500">{message}</p>
      {onRetry && (
        <Button variant="secondary" icon={RefreshCw} className="mt-5" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  )
}
