import type { Sprint } from '../types'
import { todayISO, daysInclusive, addDays } from './date'

/** Текущий спринт: тот, в диапазон которого попадает сегодняшняя дата, иначе — самый свежий */
export function findCurrentSprint(sprints: Sprint[], today: string = todayISO()): Sprint | undefined {
  const current = sprints.find((s) => s.startDate <= today && today <= s.endDate)
  if (current) return current
  return [...sprints].sort((a, b) => b.startDate.localeCompare(a.startDate))[0]
}

/** Сколько календарных дней осталось до конца спринта (0 — если закончился) */
export function daysLeft(sprint: Sprint, today: string = todayISO()): number {
  if (today > sprint.endDate) return 0
  return daysInclusive(today < sprint.startDate ? sprint.startDate : today, sprint.endDate)
}

/** Список дней спринта от начала до конца */
export function sprintDays(sprint: Sprint): string[] {
  return Array.from({ length: sprint.durationDays }, (_, i) => addDays(sprint.startDate, i))
}
