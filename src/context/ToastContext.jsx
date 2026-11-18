import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'

const ToastContext = createContext(null)

const STYLES = {
  success: { icon: CheckCircle2, color: 'text-emerald-600' },
  error: { icon: AlertCircle, color: 'text-red-600' },
  info: { icon: Info, color: 'text-brand-600' },
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const idRef = useRef(0)

  const dismiss = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), [])

  const push = useCallback(
    (type, message) => {
      const id = ++idRef.current
      setToasts((t) => [...t.slice(-3), { id, type, message }])
      setTimeout(() => dismiss(id), type === 'error' ? 6000 : 3500)
    },
    [dismiss],
  )

  const api = useMemo(
    () => ({
      success: (m) => push('success', m),
      error: (m) => push('error', m),
      info: (m) => push('info', m),
    }),
    [push],
  )

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-full max-w-sm flex-col gap-2">
        {toasts.map(({ id, type, message }) => {
          const { icon: Icon, color } = STYLES[type]
          return (
            <div key={id} role="status" className="pointer-events-auto flex animate-slide-in items-start gap-3 rounded-xl border border-ink-200 bg-white p-3.5 shadow-pop">
              <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${color}`} />
              <p className="flex-1 text-sm text-ink-700">{message}</p>
              <button onClick={() => dismiss(id)} className="rounded p-0.5 text-ink-400 transition hover:bg-ink-100 hover:text-ink-700" aria-label="Dismiss">
                <X className="h-4 w-4" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')
  return ctx
}
