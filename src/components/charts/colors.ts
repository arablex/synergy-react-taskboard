import type { Status } from '../../types'

// Цвета статусов — те же, что и в SCSS (_variables.scss)
export const STATUS_COLORS: Record<Status, string> = {
  todo: '#8590a2',
  inprogress: '#0c66e4',
  review: '#8270db',
  done: '#1f845a',
}
