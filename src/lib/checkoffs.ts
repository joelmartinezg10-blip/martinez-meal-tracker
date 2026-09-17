const PREFIX = 'martinez-meals:'

function load(key: string): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return {}
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return {}
    return parsed as Record<string, boolean>
  } catch {
    return {}
  }
}

export function storageKey(weekOf: string): string {
  return `${PREFIX}${weekOf}`
}

export function readCheckoffs(weekOf: string): Record<string, boolean> {
  return load(storageKey(weekOf))
}

export function writeCheckoffs(
  weekOf: string,
  checked: Record<string, boolean>,
): void {
  localStorage.setItem(storageKey(weekOf), JSON.stringify(checked))
}

export function toggleId(
  checked: Record<string, boolean>,
  id: string,
): Record<string, boolean> {
  const next = { ...checked }
  if (next[id]) delete next[id]
  else next[id] = true
  return next
}
