import type { Sprint, Task } from '../types'
import { HOURS_IN_DAY } from './time'
import { workingDays, todayISO } from './date'

/**
 * Сколько рабочих часов осталось до конца спринта (у одного человека).
 * Если спринт ещё не начался — считаем с даты начала, если закончился — 0.
 */
export function remainingSprintHours(sprint: Sprint, today: string = todayISO()): number {
  if (today > sprint.endDate) return 0
  const from = today < sprint.startDate ? sprint.startDate : today
  return workingDays(from, sprint.endDate) * HOURS_IN_DAY
}

/** Сколько часов уже запланировано на человека в спринте (невыполненные задачи) */
export function memberLoadHours(tasks: Task[], sprintId: string, memberId: string): number {
  return tasks
    .filter((t) => t.sprintId === sprintId && t.assigneeId === memberId && t.status !== 'done')
    .reduce((sum, t) => sum + t.estimateHours, 0)
}

/** Свободное время исполнителя до конца спринта (может быть отрицательным) */
export function freeHours(sprint: Sprint, tasks: Task[], memberId: string): number {
  return remainingSprintHours(sprint) - memberLoadHours(tasks, sprint.id, memberId)
}
