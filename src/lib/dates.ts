import type { MealSlot } from '../types'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

export function todayIso(now = new Date()): string {
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function parseIsoDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function formatDayHeading(iso: string): { weekday: string; monthDay: string } {
  const date = parseIsoDate(iso)
  return {
    weekday: WEEKDAYS[date.getDay()],
    monthDay: `${MONTHS[date.getMonth()]} ${date.getDate()}`,
  }
}

export function formatRange(start: string, end: string): string {
  const a = parseIsoDate(start)
  const b = parseIsoDate(end)
  const sameMonth = a.getMonth() === b.getMonth()
  if (sameMonth) {
    return `${MONTHS[a.getMonth()]} ${a.getDate()}–${b.getDate()}`
  }
  return `${MONTHS[a.getMonth()]} ${a.getDate()} – ${MONTHS[b.getMonth()]} ${b.getDate()}`
}

export function slotLabel(slot: MealSlot): string {
  if (slot === 'breakfast') return 'Breakfast'
  if (slot === 'lunch') return 'Lunch'
  return 'Dinner'
}

