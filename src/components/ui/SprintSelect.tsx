import { useApp } from '../../store/context'
import { useActiveSprint } from '../../store/selectors'
import { formatDate } from '../../utils/date'

/** Переключатель спринта (используется на рабочем столе и на доске) */
export function SprintSelect() {
  const { state, dispatch } = useApp()
  const sprint = useActiveSprint()
  return (
    <label className="toolbar__item">
      <span className="toolbar__label">Спринт</span>
      <select
        className="input input--select input--compact"
        value={sprint?.id ?? ''}
        onChange={(e) => dispatch({ type: 'selectSprint', sprintId: e.target.value })}
      >
        {state.sprints.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name} ({formatDate(s.startDate)} – {formatDate(s.endDate)})
          </option>
        ))}
      </select>
    </label>
  )
}
