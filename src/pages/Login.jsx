import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import Button from '../components/Button'
import Field from '../components/Field'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import useDocumentTitle from '../hooks/useDocumentTitle'
import { getErrorMessage, getFieldErrors } from '../utils/errors'
import { isValidEmail } from '../utils/format'
import AuthShell from './AuthShell'

export default function Login() {
  useDocumentTitle('Sign in')
  const { login } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from?.pathname || '/dashboard'

  const [values, setValues] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const onChange = (e) => {
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }))
    setErrors((er) => ({ ...er, [e.target.name]: undefined }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const found = {}
    if (!values.email.trim()) found.email = 'Email is required'
    else if (!isValidEmail(values.email.trim())) found.email = 'Enter a valid email address'
    if (!values.password) found.password = 'Password is required'
    setErrors(found)
    if (Object.keys(found).length) return

    setLoading(true)
    try {
      const user = await login({ email: values.email.trim(), password: values.password })
      toast.success(`Welcome back, ${user.name?.split(' ')[0] || 'there'}!`)
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setErrors(getFieldErrors(err))
      toast.error(getErrorMessage(err, 'Unable to sign in.'))
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue tracking your applications."
      footer={<>Don’t have an account? <Link to="/register" className="font-medium text-brand-600 hover:text-brand-700">Create one</Link></>}
    >
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <Field label="Email" name="email" type="email" icon={Mail} autoComplete="email" placeholder="you@example.com" value={values.email} onChange={onChange} error={errors.email} autoFocus />
        <div>
          <Field label="Password" name="password" type={showPassword ? 'text' : 'password'} icon={Lock} autoComplete="current-password" placeholder="••••••••" value={values.password} onChange={onChange} error={errors.password} />
          <button type="button" onClick={() => setShowPassword((s) => !s)} className="mt-2 flex items-center gap-1.5 text-xs text-ink-500 transition hover:text-ink-800">
            {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            {showPassword ? 'Hide password' : 'Show password'}
          </button>
        </div>
        <Button type="submit" size="lg" className="w-full" loading={loading}>Sign in</Button>
      </form>
    </AuthShell>
  )
}
