import type { Member, Task } from '../../types'
import { formatEstimate } from '../../utils/time'

/** Нагрузка по участникам: сделанные и оставшиеся часы */
export function WorkloadBars({ members, tasks }: { members: Member[]; tasks: Task[] }) {
  const rows = members
    .map((m) => {
      const mine = tasks.filter((t) => t.assigneeId === m.id)
      const done = mine.filter((t) => t.status === 'done').reduce((s, t) => s + t.estimateHours, 0)
      const left = mine.filter((t) => t.status !== 'done').reduce((s, t) => s + t.estimateHours, 0)
      return { m, done, left }
    })
    .filter((r) => r.done + r.left > 0)
  const max = Math.max(1, ...rows.map((r) => r.done + r.left))

  if (rows.length === 0) return <p className="empty">В этом спринте нет задач с оценкой времени.</p>

  return (
    <div className="workload">
      {rows.map(({ m, done, left }) => (
        <div className="workload__row" key={m.id}>
          <span className="workload__name">{m.fullName}</span>
          <div className="workload__bar" role="img" aria-label={`${m.fullName}: сделано ${formatEstimate(done)}, осталось ${formatEstimate(left)}`}>
            <span className="workload__done" style={{ width: `${(done / max) * 100}%` }} />
            <span className="workload__left" style={{ width: `${(left / max) * 100}%` }} />
          </div>
          <span className="workload__val">{formatEstimate(done + left)}</span>
        </div>
      ))}
      <div className="legend">
        <span className="legend__item"><i className="legend__dot" style={{ background: 'var(--c-done)' }} /> Сделано</span>
        <span className="legend__item"><i className="legend__dot" style={{ background: 'var(--c-progress)' }} /> Осталось</span>
      </div>
    </div>
  )
}
