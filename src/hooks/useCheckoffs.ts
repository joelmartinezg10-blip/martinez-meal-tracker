import { useCallback, useState } from 'react'
import { readCheckoffs, toggleId, writeCheckoffs } from '../lib/checkoffs'

export function useCheckoffs(weekOf: string) {
  const [checked, setChecked] = useState<Record<string, boolean>>(() =>
    readCheckoffs(weekOf),
  )

  const isChecked = useCallback((id: string) => Boolean(checked[id]), [checked])

  const toggle = useCallback(
    (id: string) => {
      setChecked((prev) => {
        const next = toggleId(prev, id)
        writeCheckoffs(weekOf, next)
        return next
      })
    },
    [weekOf],
  )

  const clearIds = useCallback(
    (ids: string[]) => {
      setChecked((prev) => {
        const next = { ...prev }
        for (const id of ids) delete next[id]
        writeCheckoffs(weekOf, next)
        return next
      })
    },
    [weekOf],
  )

  return { isChecked, toggle, clearIds }
}
