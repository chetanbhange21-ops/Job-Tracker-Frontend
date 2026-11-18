import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Briefcase, CalendarClock, CheckCircle2, Gift, Plus, Send, TrendingUp, XCircle } from 'lucide-react'
import Button from '../components/Button'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'
import { Skeleton } from '../components/Spinner'
import { useAuth } from '../context/AuthContext'
import useDocumentTitle from '../hooks/useDocumentTitle'
import { applicationService } from '../services/applicationService'
import { STATUSES } from '../utils/constants'
import { getErrorMessage } from '../utils/errors'
import { formatDate } from '../utils/format'

// Maps each status to the matching field in the backend's StatsResponse.
const STAT_FIELD = {
  APPLIED: 'applied',
  INTERVIEW_SCHEDULED: 'interviewScheduled',
  INTERVIEW_DONE: 'interviewDone',
  OFFER_RECEIVED: 'offerReceived',
  REJECTED: 'rejected',
  WITHDRAWN: 'withdrawn',
}

export default function Dashboard() {
  useDocumentTitle('Dashboard')
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [s, list] = await Promise.all([applicationService.getStats(), applicationService.getAll()])
      setStats(s)
      setRecent(list.slice(0, 5))
    } catch (err) {
      if (err.code !== 'SESSION_EXPIRED') setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const cards = [
    { label: 'Total Applications', value: stats?.totalApplications, icon: Briefcase, tone: 'brand' },
    { label: 'Applied', value: stats?.applied, icon: Send, tone: 'blue' },
    { label: 'Interview Scheduled', value: stats?.interviewScheduled, icon: CalendarClock, tone: 'amber' },
    { label: 'Interview Done', value: stats?.interviewDone, icon: CheckCircle2, tone: 'violet' },
    { label: 'Offers Received', value: stats?.offerReceived, icon: Gift, tone: 'emerald' },
    { label: 'Rejected', value: stats?.rejected, icon: XCircle, tone: 'red' },
  ]

  const total = stats?.totalApplications || 0
  const firstName = user?.name?.split(' ')[0]

  return (
    <>
      <PageHeader
        title={`Hello${firstName ? `, ${firstName}` : ''} 👋`}
        description="Here’s where your job search stands today."
        actions={<Link to="/applications/new"><Button icon={Plus}>Add application</Button></Link>}
      />

      {error ? (
        <ErrorState message={error} onRetry={load} />
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {cards.map((c, i) => (
              <StatCard key={c.label} {...c} loading={loading} delay={i * 40} />
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-5">
            {/* Pipeline breakdown */}
            <section className="card animate-fade-up p-6 lg:col-span-2" style={{ animationDelay: '280ms' }}>
              <div className="flex items-center justify-between">
                <h2 className="text-[15px] font-semibold text-ink-900">Pipeline</h2>
                {!loading && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                    <TrendingUp className="h-3 w-3" />
                    {(stats?.successRate ?? 0).toFixed(1)}% offer rate
                  </span>
                )}
              </div>
              <div className="mt-5 space-y-4">
                {loading
                  ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-5 w-full" />)
                  : STATUSES.map((s) => {
                      const count = stats?.[STAT_FIELD[s.value]] ?? 0
                      const pct = total ? (count / total) * 100 : 0
                      return (
                        <div key={s.value}>
                          <div className="mb-1.5 flex items-center justify-between text-[13px]">
                            <span className="text-ink-600">{s.label}</span>
                            <span className="font-medium tabular-nums text-ink-900">{count}</span>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-ink-100">
                            <div className={`h-full rounded-full transition-all duration-700 ${s.bar}`} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      )
                    })}
              </div>
            </section>

            {/* Recent applications */}
            <section className="card animate-fade-up overflow-hidden lg:col-span-3" style={{ animationDelay: '320ms' }}>
              <div className="flex items-center justify-between px-6 pb-3 pt-5">
                <h2 className="text-[15px] font-semibold text-ink-900">Recent applications</h2>
                <Link to="/applications" className="group inline-flex items-center gap-1 text-[13px] font-medium text-brand-600 hover:text-brand-700">
                  View all <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                </Link>
              </div>
              {loading ? (
                <div className="space-y-3 px-6 pb-6">
                  {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                </div>
              ) : recent.length === 0 ? (
                <EmptyState
                  icon={Briefcase}
                  title="No applications yet"
                  description="Add your first application to start building your pipeline."
                  action={<Link to="/applications/new"><Button icon={Plus}>Add application</Button></Link>}
                />
              ) : (
                <ul className="divide-y divide-ink-100">
                  {recent.map((app) => (
                    <li key={app.id}>
                      <Link to={`/applications/${app.id}`} className="flex items-center justify-between gap-4 px-6 py-3.5 transition hover:bg-ink-50">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-ink-900">{app.companyName}</p>
                          <p className="truncate text-[13px] text-ink-500">{app.jobRole} · {formatDate(app.appliedDate)}</p>
                        </div>
                        <StatusBadge status={app.status} />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </div>
      )}
    </>
  )
}
