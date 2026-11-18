import { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import ProtectedRoute, { PublicOnlyRoute } from './components/ProtectedRoute'
import { useAuth } from './context/AuthContext'
import { useToast } from './context/ToastContext'
import AddApplication from './pages/AddApplication'
import ApplicationDetails from './pages/ApplicationDetails'
import Applications from './pages/Applications'
import Dashboard from './pages/Dashboard'
import EditApplication from './pages/EditApplication'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import Register from './pages/Register'

export default function App() {
  const { sessionExpired, clearSessionExpired } = useAuth()
  const toast = useToast()

  // Shown once when the API layer detects an expired/invalid JWT; ProtectedRoute then redirects to /login.
  useEffect(() => {
    if (sessionExpired) {
      toast.error('Your session has expired. Please sign in again.')
      clearSessionExpired()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionExpired])

  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/applications/new" element={<AddApplication />} />
          <Route path="/applications/:id" element={<ApplicationDetails />} />
          <Route path="/applications/:id/edit" element={<EditApplication />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
