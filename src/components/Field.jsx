import { forwardRef } from 'react'

// Label + control + error wrapper. `as` lets us render input, textarea or select.
const Field = forwardRef(function Field({ label, error, hint, as: Tag = 'input', icon: Icon, className = '', children, ...props }, ref) {
  const id = props.id || props.name
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="label">
          {label}
          {props.required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />}
        <Tag
          ref={ref}
          id={id}
          aria-invalid={Boolean(error)}
          className={`input ${Icon ? 'pl-9' : ''} ${error ? 'input-error' : ''}`}
          {...props}
        >
          {children}
        </Tag>
      </div>
      {error ? <p className="mt-1.5 text-xs text-red-600">{error}</p> : hint ? <p className="mt-1.5 text-xs text-ink-500">{hint}</p> : null}
    </div>
  )
})

export default Field
