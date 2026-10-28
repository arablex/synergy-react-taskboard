import { useState, type DragEvent } from 'react'
import type { Member, Status, Task } from '../../types'
import { STATUSES } from '../../types'
import { formatEstimate } from '../../utils/time'
import { STATUS_COLORS } from '../charts/colors'
import { TaskCard } from './TaskCard'

interface BoardProps {
  tasks: Task[]
  members: Member[]
  onMove: (task: Task, status: Status) => void
  onOpen: (task: Task) => void
}

/** Канбан-доска: 4 колонки, карточки переносятся между ними drag-and-drop */
export function Board({ tasks, members, onMove, onOpen }: BoardProps) {
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [overColumn, setOverColumn] = useState<Status | null>(null)

  const handleDragStart = (e: DragEvent<HTMLElement>, task: Task) => {
    e.dataTransfer.setData('text/plain', task.id)
    e.dataTransfer.effectAllowed = 'move'
    setDraggingId(task.id)
  }
  const handleDragEnd = () => {
    setDraggingId(null)
    setOverColumn(null)
  }
  const handleDrop = (e: DragEvent<HTMLElement>, status: Status) => {
    e.preventDefault()
    const id = e.dataTransfer.getData('text/plain') || draggingId
    const task = tasks.find((t) => t.id === id)
    if (task && task.status !== status) onMove(task, status)
    handleDragEnd()
  }

  return (
    <div className="board">
      {STATUSES.map((col) => {
        const items = tasks.filter((t) => t.status === col.id)
        const hours = items.reduce((s, t) => s + t.estimateHours, 0)
        return (
          <section
            key={col.id}
            className={`column${overColumn === col.id ? ' column--over' : ''}`}
            aria-label={col.title}
            data-status={col.id}
            onDragOver={(e) => {
              e.preventDefault()
              e.dataTransfer.dropEffect = 'move'
              if (overColumn !== col.id) setOverColumn(col.id)
            }}
            onDragLeave={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOverColumn(null)
            }}
            onDrop={(e) => handleDrop(e, col.id)}
          >
            <header className="column__head">
              <i className="column__dot" style={{ background: STATUS_COLORS[col.id] }} />
              <h2 className="column__title">{col.title}</h2>
              <span className="column__count">{items.length}</span>
              <span className="column__hours">{formatEstimate(hours)}</span>
            </header>
            <div className="column__list">
              {items.map((t) => (
                <TaskCard
                  key={t.id}
                  task={t}
                  assignee={members.find((m) => m.id === t.assigneeId)}
                  dragging={draggingId === t.id}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onOpen={onOpen}
                  onMove={onMove}
                />
              ))}
              {items.length === 0 && <p className="column__empty">Перетащите задачу сюда</p>}
            </div>
          </section>
        )
      })}
    </div>
  )
}
