import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, Mail, User } from 'lucide-react'
import Button from '../components/Button'
import Field from '../components/Field'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import useDocumentTitle from '../hooks/useDocumentTitle'
import { getErrorMessage, getFieldErrors } from '../utils/errors'
import { isValidEmail } from '../utils/format'
import AuthShell from './AuthShell'

export default function Register() {
  useDocumentTitle('Create account')
  const { register } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const [values, setValues] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const onChange = (e) => {
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }))
    setErrors((er) => ({ ...er, [e.target.name]: undefined }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const found = {}
    if (!values.name.trim()) found.name = 'Name is required'
    if (!values.email.trim()) found.email = 'Email is required'
    else if (!isValidEmail(values.email.trim())) found.email = 'Enter a valid email address'
    // The backend only requires a non-blank password; 6+ characters is a sensible frontend rule.
    if (!values.password) found.password = 'Password is required'
    else if (values.password.length < 6) found.password = 'Use at least 6 characters'
    setErrors(found)
    if (Object.keys(found).length) return

    setLoading(true)
    try {
      await register({ name: values.name.trim(), email: values.email.trim(), password: values.password })
      toast.success('Account created. Please sign in.')
      navigate('/login', { replace: true })
    } catch (err) {
      setErrors(getFieldErrors(err))
      toast.error(getErrorMessage(err, 'Unable to create your account.'))
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Start organising your job search in a minute."
      footer={<>Already have an account? <Link to="/login" className="font-medium text-brand-600 hover:text-brand-700">Sign in</Link></>}
    >
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <Field label="Full name" name="name" icon={User} autoComplete="name" placeholder="Your name" value={values.name} onChange={onChange} error={errors.name} autoFocus />
        <Field label="Email" name="email" type="email" icon={Mail} autoComplete="email" placeholder="you@example.com" value={values.email} onChange={onChange} error={errors.email} />
        <Field label="Password" name="password" type="password" icon={Lock} autoComplete="new-password" placeholder="At least 6 characters" value={values.password} onChange={onChange} error={errors.password} />
        <Button type="submit" size="lg" className="w-full" loading={loading}>Create account</Button>
      </form>
    </AuthShell>
  )
}
