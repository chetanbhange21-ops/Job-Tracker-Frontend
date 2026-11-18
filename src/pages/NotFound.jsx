import { Link } from 'react-router-dom'
import Button from '../components/Button'
import useDocumentTitle from '../hooks/useDocumentTitle'

export default function NotFound() {
  useDocumentTitle('Page not found')
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-semibold text-brand-600">404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink-900">Page not found</h1>
      <p className="mt-2 text-sm text-ink-500">The page you’re looking for doesn’t exist or has moved.</p>
      <Link to="/dashboard" className="mt-6"><Button>Back to dashboard</Button></Link>
    </div>
  )
}
