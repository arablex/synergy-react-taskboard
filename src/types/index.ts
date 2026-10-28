// Основные типы приложения «TaskBoard»

/** Статус задачи = колонка канбан-доски */
export type Status = 'todo' | 'inprogress' | 'review' | 'done'

export interface Member {
  id: string
  fullName: string
  position: string
  department: string
}

export interface Sprint {
  id: string
  name: string
  goal: string
  /** Даты в формате YYYY-MM-DD */
  startDate: string
  endDate: string
  /** Длительность в календарных днях (считается автоматически по датам) */
  durationDays: number
}

export interface Task {
  /** Идентификатор вида XX-1234 (две латинские буквы + 4 цифры от 1 до 9) */
  id: string
  title: string
  subtitle: string
  authorId: string
  assigneeId: string
  /** Оценка в часах (в интерфейсе показывается как 6ч или 1д.6ч) */
  estimateHours: number
  description: string
  /** Дополнительный комментарий (необязательный) */
  comment: string
  watcherIds: string[]
  /** null — задача лежит в бэклоге */
  sprintId: string | null
  status: Status
  createdAt: string
  /** Дата перевода в «Готово» — нужна для графика сгорания */
  doneAt: string | null
}

export interface AppState {
  members: Member[]
  sprints: Sprint[]
  tasks: Task[]
  /** Выбранный спринт; null — выбирается автоматически (текущий по датам) */
  selectedSprintId: string | null
  /** «Я» — для режима only my issues */
  currentUserId: string
}

export const STATUSES: { id: Status; title: string }[] = [
  { id: 'todo', title: 'К выполнению' },
  { id: 'inprogress', title: 'В работе' },
  { id: 'review', title: 'На проверке' },
  { id: 'done', title: 'Готово' },
]
