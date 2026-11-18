import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import ApplicationForm, { emptyApplication } from '../components/ApplicationForm'
import PageHeader from '../components/PageHeader'
import { useToast } from '../context/ToastContext'
import useDocumentTitle from '../hooks/useDocumentTitle'
import { applicationService, toRequestPayload } from '../services/applicationService'
import { getErrorMessage } from '../utils/errors'

export default function AddApplication() {
  useDocumentTitle('Add application')
  const navigate = useNavigate()
  const toast = useToast()

  const handleSubmit = async (values) => {
    try {
      const created = await applicationService.create(toRequestPayload(values))
      toast.success(`Application for ${created.companyName} added.`)
      navigate(`/applications/${created.id}`)
    } catch (err) {
      if (err.code !== 'SESSION_EXPIRED') toast.error(getErrorMessage(err, 'Could not save the application.'))
      throw err
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        back={<Link to="/applications" className="mb-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-500 hover:text-ink-800"><ArrowLeft className="h-3.5 w-3.5" /> Applications</Link>}
        title="Add application"
        description="Log a new job application."
      />
      <ApplicationForm initialValues={emptyApplication()} onSubmit={handleSubmit} submitLabel="Save application" onCancelTo="/applications" />
    </div>
  )
}
