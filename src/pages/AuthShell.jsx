import { CheckCircle2 } from 'lucide-react'
import Logo from '../components/Logo'

const POINTS = ['Every application, status and note in one place', 'See your pipeline at a glance on the dashboard', 'Never lose track of an interview or follow-up']

// Two-column auth layout shared by Login and Register.
export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12">
        <div className="mx-auto w-full max-w-sm animate-fade-up">
          <Logo className="mb-10" />
          <h1 className="text-2xl font-semibold tracking-tight text-ink-900">{title}</h1>
          <p className="mt-1.5 text-sm text-ink-500">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <p className="mt-8 text-center text-sm text-ink-500">{footer}</p>
        </div>
      </div>

      <div className="relative hidden overflow-hidden border-l border-ink-200 bg-gradient-to-br from-brand-50 via-white to-brand-100 lg:flex lg:items-center lg:justify-center">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-brand-200/40 blur-3xl" />
        <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-brand-300/30 blur-3xl" />
        <div className="relative max-w-md px-10">
          <h2 className="text-3xl font-semibold leading-tight tracking-tight text-ink-900">Run your job search like a product.</h2>
          <ul className="mt-8 space-y-4">
            {POINTS.map((p) => (
              <li key={p} className="flex items-start gap-3 text-[15px] text-ink-700">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
