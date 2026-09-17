import { useEffect, useState } from 'react'
import type { MealData } from '../types'

export function useMealData() {
  const [data, setData] = useState<MealData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const url = `${import.meta.env.BASE_URL}data.json`
    fetch(url, { cache: 'no-store' })
      .then(async (res) => {
        if (!res.ok) throw new Error(`Could not load ${url}`)
        return (await res.json()) as MealData
      })
      .then((json) => {
        setData(json)
        setError(null)
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Failed to load meals')
      })
      .finally(() => setLoading(false))
  }, [])

  return { data, error, loading }
}
