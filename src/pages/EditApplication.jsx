import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import ApplicationForm, { applicationToForm } from '../components/ApplicationForm'
import ErrorState from '../components/ErrorState'
import PageHeader from '../components/PageHeader'
import Spinner from '../components/Spinner'
import { useToast } from '../context/ToastContext'
import useDocumentTitle from '../hooks/useDocumentTitle'
import { applicationService, toRequestPayload } from '../services/applicationService'
import { getErrorMessage } from '../utils/errors'

export default function EditApplication() {
  useDocumentTitle('Edit application')
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const [initial, setInitial] = useState(null)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setError('')
    setInitial(null)
    try {
      setInitial(applicationToForm(await applicationService.getById(id)))
    } catch (err) {
      if (err.code !== 'SESSION_EXPIRED') setError(getErrorMessage(err))
    }
  }, [id])

  useEffect(() => {
    load()
  }, [load])

  const handleSubmit = async (values) => {
    try {
      const updated = await applicationService.update(id, toRequestPayload(values))
      toast.success(`${updated.companyName} updated.`)
      navigate(`/applications/${id}`)
    } catch (err) {
      if (err.code !== 'SESSION_EXPIRED') toast.error(getErrorMessage(err, 'Could not update the application.'))
      throw err
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        back={<Link to={`/applications/${id}`} className="mb-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-500 hover:text-ink-800"><ArrowLeft className="h-3.5 w-3.5" /> Back to details</Link>}
        title="Edit application"
        description="Update the details of this application."
      />
      {error ? <ErrorState message={error} onRetry={load} /> : !initial ? <Spinner label="Loading application…" /> : (
        <ApplicationForm initialValues={initial} onSubmit={handleSubmit} submitLabel="Save changes" onCancelTo={`/applications/${id}`} />
      )}
    </div>
  )
}
