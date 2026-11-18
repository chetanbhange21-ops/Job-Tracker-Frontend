import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, Link2, MapPin, Save } from 'lucide-react'
import Button from './Button'
import Field from './Field'
import { STATUSES } from '../utils/constants'
import { isValidUrl, todayISO } from '../utils/format'
import { getFieldErrors } from '../utils/errors'

export const emptyApplication = () => ({
  companyName: '',
  jobRole: '',
  location: '',
  jobUrl: '',
  status: 'APPLIED',
  appliedDate: todayISO(),
  notes: '',
})

// Maps an API response onto form values (nulls -> empty strings).
export const applicationToForm = (app) => ({
  companyName: app.companyName ?? '',
  jobRole: app.jobRole ?? '',
  location: app.location ?? '',
  jobUrl: app.jobUrl ?? '',
  status: app.status ?? 'APPLIED',
  appliedDate: app.appliedDate ? String(app.appliedDate).slice(0, 10) : '',
  notes: app.notes ?? '',
})

function validate(v) {
  const e = {}
  if (!v.companyName.trim()) e.companyName = 'Company name is required'
  if (!v.jobRole.trim()) e.jobRole = 'Job role is required'
  if (!v.status) e.status = 'Status is required'
  if (v.jobUrl.trim() && !isValidUrl(v.jobUrl.trim())) e.jobUrl = 'Enter a valid URL starting with http:// or https://'
  return e
}

// onSubmit(values) must return a promise; rejections are shown as field errors when the backend sends them.
export default function ApplicationForm({ initialValues, onSubmit, submitLabel, onCancelTo }) {
  const navigate = useNavigate()
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const set = (e) => {
    const { name, value } = e.target
    setValues((v) => ({ ...v, [name]: value }))
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length) return

    setSubmitting(true)
    try {
      await onSubmit(values)
    } catch (err) {
      setErrors(getFieldErrors(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="card divide-y divide-ink-100">
      <div className="grid gap-5 p-6 sm:grid-cols-2">
        <Field label="Company name" name="companyName" required icon={Building2} placeholder="e.g. Google" value={values.companyName} onChange={set} error={errors.companyName} autoFocus />
        <Field label="Job role" name="jobRole" required placeholder="e.g. Backend Developer" value={values.jobRole} onChange={set} error={errors.jobRole} />
        <Field label="Location" name="location" icon={MapPin} placeholder="e.g. Bangalore" value={values.location} onChange={set} error={errors.location} />
        <Field label="Job URL" name="jobUrl" type="url" icon={Link2} placeholder="https://careers.example.com/job/123" value={values.jobUrl} onChange={set} error={errors.jobUrl} />
        <Field label="Application status" name="status" as="select" required value={values.status} onChange={set} error={errors.status}>
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </Field>
        <Field label="Applied date" name="appliedDate" type="date" max={todayISO()} value={values.appliedDate} onChange={set} error={errors.appliedDate} />
        <Field className="sm:col-span-2" label="Notes" name="notes" as="textarea" rows={5} placeholder="Referral, recruiter name, interview prep, salary range…" value={values.notes} onChange={set} error={errors.notes} />
      </div>
      <div className="flex items-center justify-end gap-2 bg-ink-50/60 px-6 py-4">
        <Button type="button" variant="secondary" onClick={() => navigate(onCancelTo)} disabled={submitting}>Cancel</Button>
        <Button type="submit" icon={Save} loading={submitting}>{submitLabel}</Button>
      </div>
    </form>
  )
}
