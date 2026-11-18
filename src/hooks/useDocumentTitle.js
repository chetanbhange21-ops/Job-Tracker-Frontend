import { useEffect } from 'react'

export default function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · JobTrack` : 'JobTrack — Application Tracker'
  }, [title])
}
