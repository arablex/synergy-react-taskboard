import { useMemo } from 'react'
import type { Sprint, Task } from '../../types'
import { formatDate, todayISO } from '../../utils/date'
import { sprintDays } from '../../utils/sprint'

interface Props {
  sprint: Sprint
  tasks: Task[]
}

const W = 640
const H = 280
const PAD = { top: 16, right: 20, bottom: 36, left: 44 }

/**
 * График сгорания (burndown): серая линия — идеальный план,
 * синяя — реальный остаток часов по дням спринта.
 */
export function BurndownChart({ sprint, tasks }: Props) {
  const data = useMemo(() => {
    const days = sprintDays(sprint)
    const total = tasks.reduce((s, t) => s + t.estimateHours, 0)
    const today = todayISO()
    const last = days.length - 1
    return days.map((day, i) => {
      const doneHours = tasks
        .filter((t) => t.status === 'done' && t.doneAt !== null && t.doneAt <= day)
        .reduce((s, t) => s + t.estimateHours, 0)
      return {
        day,
        ideal: last === 0 ? 0 : total * (1 - i / last),
        // «Факт» рисуем только до сегодняшнего дня
        actual: day <= today ? total - doneHours : null,
      }
    })
  }, [sprint, tasks])

  const total = data.length ? Math.max(data[0].ideal, 1) : 1
  const yMax = Math.ceil(total / 10) * 10 || 10
  const innerW = W - PAD.left - PAD.right
  const innerH = H - PAD.top - PAD.bottom
  const x = (i: number) => PAD.left + (data.length <= 1 ? 0 : (i / (data.length - 1)) * innerW)
  const y = (v: number) => PAD.top + innerH - (v / yMax) * innerH

  const idealPath = data.map((d, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(d.ideal).toFixed(1)}`).join(' ')
  const actualPoints = data.map((d, i) => ({ i, v: d.actual })).filter((p): p is { i: number; v: number } => p.v !== null)
  const actualPath = actualPoints.map((p, k) => `${k ? 'L' : 'M'}${x(p.i).toFixed(1)},${y(p.v).toFixed(1)}`).join(' ')
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(yMax * f))
  const step = Math.max(1, Math.ceil(data.length / 7))

  return (
    <figure className="chart">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="График сгорания спринта: оставшиеся часы по дням" className="chart__svg">
        {ticks.map((t) => (
          <g key={t}>
            <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} className="chart__grid" />
            <text x={PAD.left - 8} y={y(t) + 4} textAnchor="end" className="chart__tick">{t}ч</text>
          </g>
        ))}
        {data.map((d, i) =>
          i % step === 0 || i === data.length - 1 ? (
            <text key={d.day} x={x(i)} y={H - 12} textAnchor="middle" className="chart__tick">{formatDate(d.day)}</text>
          ) : null,
        )}
        <path d={idealPath} className="chart__line chart__line--ideal" />
        <path d={actualPath} className="chart__line chart__line--actual" />
        {actualPoints.map((p) => (
          <circle key={p.i} cx={x(p.i)} cy={y(p.v)} r={3.5} className="chart__dot">
            <title>{`${formatDate(data[p.i].day)}: осталось ${p.v} ч`}</title>
          </circle>
        ))}
      </svg>
      <figcaption className="legend">
        <span className="legend__item"><i className="legend__line legend__line--actual" /> Остаток (факт)</span>
        <span className="legend__item"><i className="legend__line legend__line--ideal" /> Идеальный план</span>
      </figcaption>
    </figure>
  )
}
