import api from './api'

const BASE = '/api/applications'

// The backend accepts either ?status or ?company (status wins when both are sent), so callers
// should pass at most one and combine filters client-side if needed.
export const applicationService = {
  async getAll({ status, company } = {}) {
    const params = {}
    if (status) params.status = status
    else if (company) params.company = company
    const { data } = await api.get(BASE, { params })
    return data
  },

  async getById(id) {
    const { data } = await api.get(`${BASE}/${id}`)
    return data
  },

  async create(payload) {
    const { data } = await api.post(BASE, payload)
    return data
  },

  async update(id, payload) {
    const { data } = await api.put(`${BASE}/${id}`, payload)
    return data
  },

  // The backend replies with plain text: "Application deleted successfully"
  async remove(id) {
    const { data } = await api.delete(`${BASE}/${id}`)
    return data
  },

  async getStats() {
    const { data } = await api.get(`${BASE}/stats`)
    return data
  },
}

// Shape the form values into the backend's JobApplicationDTO.Request.
// PUT replaces every field, so we always send the full object; blanks become null
// (an empty string would fail LocalDate parsing for appliedDate).
export function toRequestPayload(values) {
  const clean = (v) => {
    const t = (v ?? '').trim()
    return t === '' ? null : t
  }
  return {
    companyName: values.companyName.trim(),
    jobRole: values.jobRole.trim(),
    status: values.status,
    location: clean(values.location),
    jobUrl: clean(values.jobUrl),
    notes: clean(values.notes),
    appliedDate: values.appliedDate || null,
  }
}
