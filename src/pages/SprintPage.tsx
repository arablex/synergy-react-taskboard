import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Status, Task } from '../types'
import { STATUSES } from '../types'
import { useApp } from '../store/context'
import { useActiveSprint } from '../store/selectors'
import { Board } from '../components/board/Board'
import { TaskDetails } from '../components/board/TaskDetails'
import { MemberFilter } from '../components/MemberFilter'
import { SprintSelect } from '../components/ui/SprintSelect'
import { daysLeft } from '../utils/sprint'
import { formatDate, plural } from '../utils/date'
import { formatEstimate } from '../utils/time'

/** Страница «Активный спринт»: канбан-доска с фильтром по участникам */
export function SprintPage() {
  const { state, dispatch } = useApp()
  const sprint = useActiveSprint()
  const [memberId, setMemberId] = useState('all')
  const [opened, setOpened] = useState<Task | null>(null)
  const [announce, setAnnounce] = useState('')

  const tasks = useMemo(
    () =>
      state.tasks.filter(
        (t) => t.sprintId === sprint?.id && (memberId === 'all' || t.assigneeId === memberId),
      ),
    [state.tasks, sprint?.id, memberId],
  )

  const move = (task: Task, status: Status) => {
    if (task.status === status) return
    dispatch({ type: 'moveTask', taskId: task.id, status })
    setAnnounce(`Задача ${task.id} перемещена в колонку «${STATUSES.find((s) => s.id === status)?.title}»`)
  }

  if (!sprint) {
    return (
      <>
        <h1 className="page__title">Активный спринт</h1>
        <p className="empty">Спринтов пока нет. <Link to="/admin?modal=sprint">Создайте спринт</Link> в панели администратора.</p>
      </>
    )
  }

  const left = daysLeft(sprint)
  const totalHours = tasks.reduce((s, t) => s + t.estimateHours, 0)
  const doneCount = tasks.filter((t) => t.status === 'done').length

  return (
    <>
      <div className="page__head">
        <div>
          <h1 className="page__title">Активный спринт</h1>
          <p className="page__sub">
            {sprint.name} · {formatDate(sprint.startDate)} – {formatDate(sprint.endDate)} ·{' '}
            {left > 0 ? `осталось ${left} ${plural(left, 'день', 'дня', 'дней')}` : 'спринт завершён'}
          </p>
        </div>
        <SprintSelect />
      </div>
      <p className="goal"><b>Цель спринта:</b> {sprint.goal}</p>

      <div className="toolbar">
        <MemberFilter members={state.members} value={memberId} onChange={setMemberId} />
        <p className="toolbar__stat">
          Задач: <b>{tasks.length}</b> · готово: <b>{doneCount}</b> · всего <b>{formatEstimate(totalHours)}</b>
        </p>
      </div>

      <Board tasks={tasks} members={state.members} onMove={move} onOpen={setOpened} />
      <p className="sr-only" role="status" aria-live="polite">{announce}</p>
      {announce && <p className="hint-line" aria-hidden="true">{announce}</p>}

      {opened && (
        <TaskDetails task={opened} members={state.members} sprints={state.sprints} onClose={() => setOpened(null)} />
      )}
    </>
  )
}
