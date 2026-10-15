import { useMemo, useState } from 'react'

export function usePagination(items, perPage = 10) {
  const [page, setPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(items.length / perPage))

  const paginated = useMemo(() => {
    const start = (page - 1) * perPage
    return items.slice(start, start + perPage)
  }, [items, page, perPage])

  const goTo = (p) => setPage(Math.min(Math.max(1, p), totalPages))

  return { page, setPage: goTo, totalPages, paginated, perPage }
}
