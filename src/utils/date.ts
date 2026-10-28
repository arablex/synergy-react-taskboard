// Работа с датами в формате YYYY-MM-DD (локальное время, без часовых поясов)

const DAY_MS = 24 * 60 * 60 * 1000

export function toISO(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

export function parseISO(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function todayISO(): string {
  return toISO(new Date())
}

export function addDays(iso: string, n: number): string {
  const d = parseISO(iso)
  d.setDate(d.getDate() + n)
  return toISO(d)
}

/** Корректна ли строка-дата (в т.ч. не 2026-02-31) */
export function isValidISO(iso: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false
  return toISO(parseISO(iso)) === iso
}

/** Количество календарных дней от start до end включительно (0, если end раньше start) */
export function daysInclusive(startISO: string, endISO: string): number {
  const diff = Math.round((parseISO(endISO).getTime() - parseISO(startISO).getTime()) / DAY_MS)
  return diff < 0 ? 0 : diff + 1
}

/** Количество рабочих дней (пн–пт) от from до to включительно */
export function workingDays(fromISO: string, toISOStr: string): number {
  let count = 0
  const end = parseISO(toISOStr)
  for (let d = parseISO(fromISO); d <= end; d.setDate(d.getDate() + 1)) {
    const wd = d.getDay()
    if (wd !== 0 && wd !== 6) count++
  }
  return count
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short' })
    .format(parseISO(iso))
    .replace('.', '')
}

export function formatDateLong(iso: string): string {
  return new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).format(
    parseISO(iso),
  )
}

/** Склонение: plural(5, 'день', 'дня', 'дней') */
export function plural(n: number, one: string, few: string, many: string): string {
  const a = Math.abs(n) % 100
  const b = a % 10
  if (a > 10 && a < 20) return many
  if (b > 1 && b < 5) return few
  if (b === 1) return one
  return many
}
