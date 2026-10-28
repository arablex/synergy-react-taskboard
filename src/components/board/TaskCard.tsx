import type { DragEvent } from 'react'
import type { Member, Status, Task } from '../../types'
import { STATUSES } from '../../types'
import { Avatar } from '../ui/Avatar'
import { EstimateBadge } from '../ui/EstimateBadge'

interface TaskCardProps {
  task: Task
  assignee?: Member
  dragging: boolean
  onDragStart: (e: DragEvent<HTMLElement>, task: Task) => void
  onDragEnd: () => void
  onOpen: (task: Task) => void
  onMove: (task: Task, status: Status) => void
}

/** Карточка задачи на доске. Перетаскивается мышью (HTML5 drag-and-drop); для сенсорных экранов есть выбор статуса. */
export function TaskCard({ task, assignee, dragging, onDragStart, onDragEnd, onOpen, onMove }: TaskCardProps) {
  return (
    <article
      className={`card${dragging ? ' card--dragging' : ''}${task.status === 'done' ? ' card--done' : ''}`}
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      onDragEnd={onDragEnd}
      data-task-id={task.id}
    >
      <div className="card__top">
        <span className="card__id">{task.id}</span>
        <EstimateBadge hours={task.estimateHours} />
      </div>
      <h3 className="card__title">
        <button type="button" className="link-btn" onClick={() => onOpen(task)}>
          {task.title}
        </button>
      </h3>
      <p className="card__sub">{task.subtitle}</p>
      <div className="card__bottom">
        <span className="card__who">
          <Avatar member={assignee} size={24} />
          <span className="card__name">{assignee?.fullName ?? 'Не назначен'}</span>
        </span>
        <label className="card__move">
          <span className="sr-only">Переместить задачу {task.id} в колонку</span>
          <select
            className="input input--select input--tiny"
            value={task.status}
            onChange={(e) => onMove(task, e.target.value as Status)}
          >
            {STATUSES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
        </label>
      </div>
    </article>
  )
}
