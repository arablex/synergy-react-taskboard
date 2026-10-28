// Время выполнения задачи: часы <-> формат «6ч» / «1д.6ч»

/** Рабочий день = 8 часов */
export const HOURS_IN_DAY = 8
export const MAX_ESTIMATE_HOURS = 160

/**
 * Форматирует часы: до 8 часов включительно — «6ч»,
 * больше 8 — дни и часы: «1д.6ч», ровно N дней — «2д».
 */
export function formatEstimate(hours: number): string {
  if (hours <= HOURS_IN_DAY) return `${hours}ч`
  const days = Math.floor(hours / HOURS_IN_DAY)
  const rest = hours % HOURS_IN_DAY
  return rest === 0 ? `${days}д` : `${days}д.${rest}ч`
}

/**
 * Разбирает ввод пользователя в количество часов.
 * Понимает: «14» (часы), «6ч», «1д», «1д.6ч», «1д 6ч» (также латиницей d / h).
 * Возвращает null, если формат не распознан.
 */
export function parseEstimate(input: string): number | null {
  const s = input.trim().toLowerCase().replace(/,/g, '.')
  if (!s) return null
  if (/^\d+$/.test(s)) return Number(s)
  const m = s.match(/^(?:(\d+)\s*[дd]\.?)?\s*(?:(\d+)\s*[чh]\.?)?$/)
  if (!m || (m[1] === undefined && m[2] === undefined)) return null
  return Number(m[1] ?? 0) * HOURS_IN_DAY + Number(m[2] ?? 0)
}
