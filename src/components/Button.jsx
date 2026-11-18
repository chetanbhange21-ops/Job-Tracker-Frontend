import { Loader2 } from 'lucide-react'

const VARIANTS = {
  primary: 'bg-brand-600 text-white shadow-sm hover:bg-brand-700 focus-visible:ring-brand-200',
  secondary: 'border border-ink-200 bg-white text-ink-700 shadow-sm hover:bg-ink-50 focus-visible:ring-ink-200',
  ghost: 'text-ink-600 hover:bg-ink-100 focus-visible:ring-ink-200',
  danger: 'bg-red-600 text-white shadow-sm hover:bg-red-700 focus-visible:ring-red-200',
  'danger-soft': 'border border-red-200 bg-white text-red-600 hover:bg-red-50 focus-visible:ring-red-100',
}

const SIZES = { sm: 'h-8 px-3 text-[13px]', md: 'h-9 px-3.5 text-sm', lg: 'h-11 px-5 text-sm' }

export default function Button({ variant = 'primary', size = 'md', loading = false, icon: Icon, className = '', children, disabled, ...props }) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition focus:outline-none focus-visible:ring-4 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : Icon ? <Icon className="h-4 w-4" /> : null}
      {children}
    </button>
  )
}
