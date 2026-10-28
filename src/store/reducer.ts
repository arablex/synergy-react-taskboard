import type { AppState, Member, Sprint, Status, Task } from '../types'
import { createSeedState } from '../data/seed'
import { todayISO } from '../utils/date'

export type Action =
  | { type: 'addTask'; task: Task }
  | { type: 'addSprint'; sprint: Sprint }
  | { type: 'addMember'; member: Member }
  | { type: 'moveTask'; taskId: string; status: Status }
  | { type: 'deleteTask'; taskId: string }
  | { type: 'assignToSprint'; taskId: string; sprintId: string | null }
  | { type: 'selectSprint'; sprintId: string | null }
  | { type: 'reset' }

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'addTask':
      return { ...state, tasks: [...state.tasks, action.task] }
    case 'addSprint':
      return { ...state, sprints: [...state.sprints, action.sprint] }
    case 'addMember':
      return { ...state, members: [...state.members, action.member] }
    case 'moveTask':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.taskId
            ? { ...t, status: action.status, doneAt: action.status === 'done' ? t.doneAt ?? todayISO() : null }
            : t,
        ),
      }
    case 'deleteTask':
      return { ...state, tasks: state.tasks.filter((t) => t.id !== action.taskId) }
    case 'assignToSprint':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.taskId ? { ...t, sprintId: action.sprintId, status: 'todo', doneAt: null } : t,
        ),
      }
    case 'selectSprint':
      return { ...state, selectedSprintId: action.sprintId }
    case 'reset':
      return createSeedState()
  }
}

const STORAGE_KEY = 'taskboard-state-v1'

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as AppState
      if (Array.isArray(parsed.tasks) && Array.isArray(parsed.sprints) && Array.isArray(parsed.members)) {
        return parsed
      }
    }
  } catch {
    // localStorage недоступен или данные повреждены — берём демо-данные
  }
  return createSeedState()
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // не страшно: приложение работает и без сохранения
  }
}
