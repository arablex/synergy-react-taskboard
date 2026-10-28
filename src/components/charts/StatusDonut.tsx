import type { Task } from '../../types'
import { STATUSES } from '../../types'
import { STATUS_COLORS } from './colors'

/** Круговая диаграмма: сколько задач в каждом статусе */
export function StatusDonut({ tasks }: { tasks: Task[] }) {
  const total = tasks.length
  const R = 52
  const C = 2 * Math.PI * R
  let offset = 0
  const segments = STATUSES.map((s) => {
    const count = tasks.filter((t) => t.status === s.id).length
    const len = total ? (count / total) * C : 0
    const seg = { ...s, count, len, offset }
    offset += len
    return seg
  })

  return (
    <div className="donut">
      <svg viewBox="0 0 140 140" className="donut__svg" role="img" aria-label={`Задачи по статусам, всего ${total}`}>
        <circle cx="70" cy="70" r={R} fill="none" className="donut__track" strokeWidth="18" />
        {total > 0 &&
          segments.map((s) =>
            s.count ? (
              <circle
                key={s.id}
                cx="70"
                cy="70"
                r={R}
                fill="none"
                stroke={STATUS_COLORS[s.id]}
                strokeWidth="18"
                strokeDasharray={`${s.len} ${C - s.len}`}
                strokeDashoffset={-s.offset}
                transform="rotate(-90 70 70)"
              />
            ) : null,
          )}
        <text x="70" y="68" textAnchor="middle" className="donut__num">{total}</text>
        <text x="70" y="86" textAnchor="middle" className="donut__cap">задач</text>
      </svg>
      <ul className="legend legend--col">
        {segments.map((s) => (
          <li key={s.id} className="legend__item">
            <i className="legend__dot" style={{ background: STATUS_COLORS[s.id] }} />
            {s.title}
            <b>{s.count}</b>
          </li>
        ))}
      </ul>
    </div>
  )
}
