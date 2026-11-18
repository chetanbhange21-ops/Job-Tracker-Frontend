import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, CalendarDays, Clock, ExternalLink, Link2, MapPin, Pencil, StickyNote, Trash2 } from 'lucide-react'
import Button from '../components/Button'
import ConfirmDialog from '../components/ConfirmDialog'
import ErrorState from '../components/ErrorState'
import Spinner from '../components/Spinner'
import StatusBadge from '../components/StatusBadge'
import { useToast } from '../context/ToastContext'
import useDocumentTitle from '../hooks/useDocumentTitle'
import { applicationService } from '../services/applicationService'
import { getErrorMessage } from '../utils/errors'
import { formatDate, formatDateTime } from '../utils/format'

function Detail({ icon: Icon, label, children }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ink-50 text-ink-500 ring-1 ring-inset ring-ink-200">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-ink-400">{label}</p>
        <div className="mt-0.5 break-words text-sm text-ink-800">{children}</div>
      </div>
    </div>
  )
}

export default function ApplicationDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const [app, setApp] = useState(null)
  const [error, setError] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useDocumentTitle(app ? `${app.companyName} — ${app.jobRole}` : 'Application')

  const load = useCallback(async () => {
    setError('')
    setApp(null)
    try {
      setApp(await applicationService.getById(id))
    } catch (err) {
      if (err.code !== 'SESSION_EXPIRED') setError(getErrorMessage(err))
    }
  }, [id])

  useEffect(() => {
    load()
  }, [load])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await applicationService.remove(id)
      toast.success('Application deleted.')
      navigate('/applications', { replace: true })
    } catch (err) {
      if (err.code !== 'SESSION_EXPIRED') toast.error(getErrorMessage(err, 'Could not delete the application.'))
      setDeleting(false)
      setConfirmOpen(false)
    }
  }

  const back = (
    <Link to="/applications" className="mb-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-500 hover:text-ink-800">
      <ArrowLeft className="h-3.5 w-3.5" /> Applications
    </Link>
  )

  if (error) return <>{back}<ErrorState message={error} onRetry={load} /></>
  if (!app) return <>{back}<Spinner label="Loading application…" /></>

  return (
    <div className="mx-auto max-w-3xl">
      {back}
      <div className="card animate-fade-up overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-ink-100 p-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-lg font-semibold text-brand-700 ring-1 ring-brand-100">
              {app.companyName?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-xl font-semibold tracking-tight text-ink-900">{app.companyName}</h1>
              <p className="truncate text-sm text-ink-500">{app.jobRole}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={app.status} />
          </div>
        </div>

        <div className="grid gap-6 p-6 sm:grid-cols-2">
          <Detail icon={MapPin} label="Location">{app.location || <span className="text-ink-400">Not specified</span>}</Detail>
          <Detail icon={CalendarDays} label="Applied date">{formatDate(app.appliedDate)}</Detail>
          <Detail icon={Link2} label="Job URL">
            {app.jobUrl ? (
              <a href={app.jobUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 break-all font-medium text-brand-600 hover:text-brand-700">
                {app.jobUrl} <ExternalLink className="h-3.5 w-3.5 shrink-0" />
              </a>
            ) : (
              <span className="text-ink-400">Not specified</span>
            )}
          </Detail>
          <Detail icon={Clock} label="Last updated">{formatDateTime(app.updatedAt)}</Detail>
          <div className="sm:col-span-2">
            <Detail icon={StickyNote} label="Notes">
              {app.notes ? <p className="whitespace-pre-wrap leading-relaxed">{app.notes}</p> : <span className="text-ink-400">No notes added</span>}
            </Detail>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 bg-ink-50/60 px-6 py-4">
          <p className="hidden text-xs text-ink-400 sm:block">Created {formatDateTime(app.createdAt)}</p>
          <div className="ml-auto flex gap-2">
            <Button variant="danger-soft" icon={Trash2} onClick={() => setConfirmOpen(true)}>Delete</Button>
            <Link to={`/applications/${app.id}/edit`}><Button icon={Pencil}>Edit</Button></Link>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        loading={deleting}
        title="Delete this application?"
        description={`This will permanently remove your application for ${app.jobRole} at ${app.companyName}. This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  )
}
