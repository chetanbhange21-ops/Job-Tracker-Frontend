import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Briefcase, ExternalLink, Pencil, Plus, Search, SearchX, X } from 'lucide-react'
import Button from '../components/Button'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import PageHeader from '../components/PageHeader'
import Pagination from '../components/Pagination'
import StatusBadge from '../components/StatusBadge'
import { Skeleton } from '../components/Spinner'
import useDebounce from '../hooks/useDebounce'
import useDocumentTitle from '../hooks/useDocumentTitle'
import { applicationService } from '../services/applicationService'
import { PAGE_SIZE, STATUSES } from '../utils/constants'
import { getErrorMessage } from '../utils/errors'
import { formatDate } from '../utils/format'

export default function Applications() {
  useDocumentTitle('My Applications')
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const company = useDebounce(search.trim(), 350)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      // The API supports ?status OR ?company, not both: when both are set we ask the server for the
      // status and narrow by company name here (case-insensitive "contains", same as the backend).
      let data = await applicationService.getAll({ status, company: status ? '' : company })
      if (status && company) {
        const q = company.toLowerCase()
        data = data.filter((a) => a.companyName?.toLowerCase().includes(q))
      }
      data = [...data].sort((a, b) => String(b.appliedDate || '').localeCompare(String(a.appliedDate || '')) || b.id - a.id)
      setItems(data)
    } catch (err) {
      if (err.code !== 'SESSION_EXPIRED') setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [status, company])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => setPage(1), [status, company])

  const pageItems = useMemo(() => items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [items, page])
  const filtering = Boolean(status || company)

  const clearFilters = () => {
    setSearch('')
    setStatus('')
  }

  return (
    <>
      <PageHeader
        title="My Applications"
        description="Search, filter and manage every application."
        actions={<Link to="/applications/new"><Button icon={Plus}>Add application</Button></Link>}
      />

      <div className="card overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-ink-200 p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by company name…"
              aria-label="Search by company name"
              className="input pl-9 pr-9"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-ink-400 hover:text-ink-700" aria-label="Clear search">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status" className="input sm:w-56">
            <option value="">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        {error ? (
          <div className="p-4"><ErrorState message={error} onRetry={load} /></div>
        ) : loading ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : items.length === 0 ? (
          filtering ? (
            <EmptyState
              icon={SearchX}
              title="No matching applications"
              description="Try a different company name or status."
              action={<Button variant="secondary" onClick={clearFilters}>Clear filters</Button>}
            />
          ) : (
            <EmptyState
              icon={Briefcase}
              title="No applications yet"
              description="Add your first application to start tracking."
              action={<Link to="/applications/new"><Button icon={Plus}>Add application</Button></Link>}
            />
          )
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead>
                  <tr className="border-b border-ink-200 bg-ink-50/70 text-xs font-medium uppercase tracking-wide text-ink-500">
                    <th className="px-5 py-3">Company</th>
                    <th className="px-5 py-3">Job role</th>
                    <th className="px-5 py-3">Location</th>
                    <th className="px-5 py-3">Applied</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {pageItems.map((app) => (
                    <tr key={app.id} onClick={() => navigate(`/applications/${app.id}`)} className="group cursor-pointer transition hover:bg-brand-50/40">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ink-100 text-[13px] font-semibold text-ink-600 transition group-hover:bg-brand-100 group-hover:text-brand-700">
                            {app.companyName?.[0]?.toUpperCase()}
                          </div>
                          <span className="font-medium text-ink-900">{app.companyName}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-ink-700">{app.jobRole}</td>
                      <td className="px-5 py-3.5 text-ink-500">{app.location || '—'}</td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-ink-500">{formatDate(app.appliedDate)}</td>
                      <td className="px-5 py-3.5"><StatusBadge status={app.status} /></td>
                      <td className="px-5 py-3.5">
                        <div className="flex justify-end gap-1 opacity-0 transition group-hover:opacity-100 focus-within:opacity-100">
                          {app.jobUrl && (
                            <a href={app.jobUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="rounded-lg p-1.5 text-ink-400 transition hover:bg-ink-100 hover:text-ink-700" aria-label="Open job posting">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                          <Link to={`/applications/${app.id}/edit`} onClick={(e) => e.stopPropagation()} className="rounded-lg p-1.5 text-ink-400 transition hover:bg-ink-100 hover:text-ink-700" aria-label="Edit application">
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={page} pageSize={PAGE_SIZE} total={items.length} onChange={setPage} />
          </>
        )}
      </div>
    </>
  )
}
