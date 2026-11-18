import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, ListChecks, LogOut, Menu, PlusCircle, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { initials } from '../utils/format'
import Logo from './Logo'

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/applications', label: 'My Applications', icon: ListChecks, end: true },
  { to: '/applications/new', label: 'Add Application', icon: PlusCircle },
]

function SidebarContent({ onNavigate }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center px-5">
        <Logo />
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        <p className="px-3 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-wider text-ink-400">Workspace</p>
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive ? 'bg-white text-ink-900 shadow-card ring-1 ring-ink-200' : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`h-[18px] w-[18px] transition ${isActive ? 'text-brand-600' : 'text-ink-400 group-hover:text-ink-600'}`} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-ink-200 p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-[13px] font-semibold text-brand-700">
            {initials(user?.name)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-ink-900">{user?.name || 'Account'}</p>
            <p className="truncate text-xs text-ink-500">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            title="Log out"
            aria-label="Log out"
            className="rounded-lg p-2 text-ink-400 transition hover:bg-ink-100 hover:text-red-600"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AppLayout() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => setOpen(false), [pathname])

  return (
    <div className="min-h-screen">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-ink-200 bg-ink-50 lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile top bar + drawer */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-ink-200 bg-white/80 px-4 backdrop-blur lg:hidden">
        <Logo />
        <button onClick={() => setOpen(true)} className="rounded-lg p-2 text-ink-600 hover:bg-ink-100" aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </button>
      </header>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-ink-900/40" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 animate-slide-in border-r border-ink-200 bg-ink-50 shadow-pop">
            <button onClick={() => setOpen(false)} className="absolute right-3 top-4 rounded-lg p-1.5 text-ink-500 hover:bg-ink-100" aria-label="Close menu">
              <X className="h-5 w-5" />
            </button>
            <SidebarContent onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <main className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
