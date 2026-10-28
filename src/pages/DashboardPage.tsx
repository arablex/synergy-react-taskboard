import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useApp } from '../store/context'
import { useActiveSprint } from '../store/selectors'
import { SprintSelect } from '../components/ui/SprintSelect'
import { Avatar } from '../components/ui/Avatar'
import { EstimateBadge } from '../components/ui/EstimateBadge'
import { BurndownChart } from '../components/charts/BurndownChart'
import { StatusDonut } from '../components/charts/StatusDonut'
import { WorkloadBars } from '../components/charts/WorkloadBars'
import { daysLeft } from '../utils/sprint'
import { formatDate, formatDateLong, plural } from '../utils/date'
import { formatEstimate } from '../utils/time'
import { freeHours } from '../utils/capacity'

/** Главная страница (рабочий стол): статистика спринта, выполненные задачи, бэклог */
export function DashboardPage() {
  const { state, dispatch } = useApp()
  const sprint = useActiveSprint()
  const [params, setParams] = useSearchParams()
  const tab = params.get('tab') === 'backlog' ? 'backlog' : 'product'
  const [memberId, setMemberId] = useState('all')
  const [notice, setNotice] = useState<{ tone: 'ok' | 'error'; text: string } | null>(null)

  const byMember = <T extends { assigneeId: string }>(list: T[]) =>
    memberId === 'all' ? list : list.filter((t) => t.assigneeId === memberId)

  const sprintTasks = byMember(state.tasks.filter((t) => t.sprintId === sprint?.id))
  const backlog = byMember(state.tasks.filter((t) => t.sprintId === null))
  const done = sprintTasks
    .filter((t) => t.status === 'done')
    .sort((a, b) => (b.doneAt ?? '').localeCompare(a.doneAt ?? ''))

  const me = state.members.find((m) => m.id === state.currentUserId)
  const selected = state.members.find((m) => m.id === memberId)
  const nameOf = (id: string) => state.members.find((m) => m.id === id)

  const setTab = (t: 'product' | 'backlog') => setParams(t === 'product' ? {} : { tab: t })

  const addToSprint = (taskId: string) => {
    const task = state.tasks.find((t) => t.id === taskId)
    if (!task || !sprint) return
    const free = freeHours(sprint, state.tasks, task.assigneeId)
    if (task.estimateHours > free) {
      setNotice({
        tone: 'error',
        text: `Задачу ${task.id} нельзя добавить: у исполнителя свободно ${formatEstimate(Math.max(free, 0))}, а нужно ${formatEstimate(task.estimateHours)}`,
      })
      return
    }
    dispatch({ type: 'assignToSprint', taskId, sprintId: sprint.id })
    setNotice({ tone: 'ok', text: `Задача ${task.id} добавлена в «${sprint.name}»` })
  }

  if (!sprint) {
    return (
      <>
        <h1 className="page__title">Рабочий стол</h1>
        <p className="empty">Спринтов пока нет. <Link to="/admin?modal=sprint">Создайте спринт</Link> в панели администратора.</p>
      </>
    )
  }

  const left = daysLeft(sprint)
  const totalHours = sprintTasks.reduce((s, t) => s + t.estimateHours, 0)
  const doneHours = done.reduce((s, t) => s + t.estimateHours, 0)
  const percent = totalHours ? Math.round((doneHours / totalHours) * 100) : 0
  const inWork = sprintTasks.filter((t) => t.status === 'inprogress' || t.status === 'review').length

  return (
    <>
      <div className="page__head">
        <div>
          <h1 className="page__title">Рабочий стол</h1>
          <p className="page__sub">
            {sprint.name} · {formatDateLong(sprint.startDate)} – {formatDateLong(sprint.endDate)}
          </p>
        </div>
        <SprintSelect />
      </div>

      <div className="toolbar">
        <div className="segmented" role="group" aria-label="Чьи задачи показывать">
          <button type="button" className={`segmented__btn${memberId === 'all' ? ' segmented__btn--on' : ''}`} aria-pressed={memberId === 'all'} onClick={() => setMemberId('all')}>
            Вся команда
          </button>
          <button type="button" className={`segmented__btn${memberId === state.currentUserId ? ' segmented__btn--on' : ''}`} aria-pressed={memberId === state.currentUserId} onClick={() => setMemberId(state.currentUserId)}>
            Only my issues
          </button>
        </div>
        <label className="toolbar__item">
          <span className="toolbar__label">Участник</span>
          <select className="input input--select input--compact" value={memberId} onChange={(e) => setMemberId(e.target.value)}>
            <option value="all">Вся команда</option>
            {state.members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.fullName}{m.id === me?.id ? ' (это я)' : ''}
              </option>
            ))}
          </select>
        </label>
        <p className="toolbar__stat">
          Показаны: <b>{selected ? selected.fullName : 'вся команда'}</b>
        </p>
      </div>

      <div className="tabs" role="tablist" aria-label="Разделы рабочего стола">
        <button type="button" role="tab" id="tab-product" aria-selected={tab === 'product'} aria-controls="panel-product" className={`tabs__btn${tab === 'product' ? ' tabs__btn--on' : ''}`} onClick={() => setTab('product')}>
          Product
        </button>
        <button type="button" role="tab" id="tab-backlog" aria-selected={tab === 'backlog'} aria-controls="panel-backlog" className={`tabs__btn${tab === 'backlog' ? ' tabs__btn--on' : ''}`} onClick={() => setTab('backlog')}>
          Backlog <span className="tabs__count">{backlog.length}</span>
        </button>
      </div>

      {tab === 'product' ? (
        <div role="tabpanel" id="panel-product" aria-labelledby="tab-product">
          <section className="stats" aria-label="Сводка по спринту">
            <div className="stat">
              <span className="stat__label">Прогресс по времени</span>
              <span className="stat__value">{percent}%</span>
              <div className="progress" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} aria-label="Прогресс спринта">
                <span style={{ width: `${percent}%` }} />
              </div>
              <span className="stat__note">{formatEstimate(doneHours)} из {formatEstimate(totalHours)}</span>
            </div>
            <div className="stat">
              <span className="stat__label">Выполнено задач</span>
              <span className="stat__value">{done.length}<small> / {sprintTasks.length}</small></span>
              <span className="stat__note">в работе и на проверке: {inWork}</span>
            </div>
            <div className="stat">
              <span className="stat__label">До конца спринта</span>
              <span className="stat__value">{left}<small> {plural(left, 'день', 'дня', 'дней')}</small></span>
              <span className="stat__note">окончание {formatDate(sprint.endDate)} · длительность {sprint.durationDays} дн.</span>
            </div>
            <div className="stat stat--goal">
              <span className="stat__label">Цель спринта</span>
              <span className="stat__text">{sprint.goal}</span>
            </div>
          </section>

          <section className="grid-2">
            <div className="panel">
              <h2 className="panel__title">График сгорания</h2>
              <BurndownChart sprint={sprint} tasks={sprintTasks} />
            </div>
            <div className="panel">
              <h2 className="panel__title">Задачи по статусам</h2>
              <StatusDonut tasks={sprintTasks} />
              <h2 className="panel__title panel__title--spaced">Нагрузка по участникам</h2>
              <WorkloadBars members={state.members} tasks={sprintTasks} />
            </div>
          </section>

          <section className="panel">
            <h2 className="panel__title">Выполненные задачи <span className="panel__count">{done.length}</span></h2>
            {done.length === 0 ? (
              <p className="empty">Пока нет выполненных задач{selected ? ` у участника ${selected.fullName}` : ''}.</p>
            ) : (
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr><th>ID</th><th>Задача</th><th>Исполнитель</th><th>Время</th><th>Завершена</th></tr>
                  </thead>
                  <tbody>
                    {done.map((t) => (
                      <tr key={t.id}>
                        <td className="mono">{t.id}</td>
                        <td><b>{t.title}</b><br /><span className="muted">{t.subtitle}</span></td>
                        <td><span className="who"><Avatar member={nameOf(t.assigneeId)} size={22} />{nameOf(t.assigneeId)?.fullName}</span></td>
                        <td><EstimateBadge hours={t.estimateHours} /></td>
                        <td>{t.doneAt ? formatDate(t.doneAt) : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      ) : (
        <div role="tabpanel" id="panel-backlog" aria-labelledby="tab-backlog">
          <section className="panel">
            <h2 className="panel__title">Бэклог — задачи вне спринта <span className="panel__count">{backlog.length}</span></h2>
            {notice && (
              <p className={`notice notice--${notice.tone}`} role="status">{notice.text}</p>
            )}
            {backlog.length === 0 ? (
              <p className="empty">Бэклог пуст. Новые задачи можно создать в <Link to="/admin?modal=task">панели администратора</Link>.</p>
            ) : (
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr><th>ID</th><th>Задача</th><th>Исполнитель</th><th>Время</th><th><span className="sr-only">Действие</span></th></tr>
                  </thead>
                  <tbody>
                    {backlog.map((t) => (
                      <tr key={t.id}>
                        <td className="mono">{t.id}</td>
                        <td><b>{t.title}</b><br /><span className="muted">{t.subtitle}</span></td>
                        <td><span className="who"><Avatar member={nameOf(t.assigneeId)} size={22} />{nameOf(t.assigneeId)?.fullName}</span></td>
                        <td><EstimateBadge hours={t.estimateHours} /></td>
                        <td className="table__action"><button type="button" className="btn btn--small" onClick={() => addToSprint(t.id)}>В спринт</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      )}
    </>
  )
}
