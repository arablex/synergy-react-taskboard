import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useApp } from '../store/context'
import { Modal } from '../components/ui/Modal'
import { Avatar } from '../components/ui/Avatar'
import { EstimateBadge } from '../components/ui/EstimateBadge'
import { TaskForm } from '../components/forms/TaskForm'
import { SprintForm } from '../components/forms/SprintForm'
import { MemberForm } from '../components/forms/MemberForm'
import { STATUSES } from '../types'
import { formatDate, plural } from '../utils/date'

type ModalKind = 'task' | 'sprint' | 'member' | null

/** Панель администратора: создание задач, спринтов и участников (формы в модальных окнах) */
export function AdminPage() {
  const { state, dispatch } = useApp()
  const [params, setParams] = useSearchParams()
  // Окно можно открыть и по ссылке: /admin?modal=task|sprint|member
  const fromUrl = params.get('modal')
  const [modal, setModalState] = useState<ModalKind>(
    fromUrl === 'task' || fromUrl === 'sprint' || fromUrl === 'member' ? fromUrl : null,
  )
  const [notice, setNotice] = useState('')
  const setModal = (kind: ModalKind) => {
    setModalState(kind)
    setParams(kind ? { modal: kind } : {}, { replace: true })
  }
  const close = () => setModal(null)
  const done = (text: string) => {
    setNotice(text)
    close()
  }

  const nameOf = (id: string) => state.members.find((m) => m.id === id)
  const sprintName = (id: string | null) => state.sprints.find((s) => s.id === id)?.name ?? 'Бэклог'

  return (
    <>
      <div className="page__head">
        <div>
          <h1 className="page__title">Панель администратора</h1>
          <p className="page__sub">Создание задач и спринтов, управление командой</p>
        </div>
        <div className="actions">
          <button type="button" className="btn btn--primary" onClick={() => setModal('task')}>+ Создать задачу</button>
          <button type="button" className="btn" onClick={() => setModal('sprint')}>+ Создать спринт</button>
          <button type="button" className="btn" onClick={() => setModal('member')}>+ Добавить участника</button>
        </div>
      </div>

      {notice && <p className="notice notice--ok" role="status">{notice}</p>}

      <section className="panel">
        <h2 className="panel__title">Задачи <span className="panel__count">{state.tasks.length}</span></h2>
        <div className="table-wrap">
          <table className="table table--wide">
            <thead>
              <tr><th>ID</th><th>Задача</th><th>Спринт</th><th>Исполнитель</th><th>Статус</th><th>Время</th><th><span className="sr-only">Действия</span></th></tr>
            </thead>
            <tbody>
              {[...state.tasks].reverse().map((t) => (
                <tr key={t.id}>
                  <td className="mono">{t.id}</td>
                  <td><b>{t.title}</b><br /><span className="muted">{t.subtitle}</span></td>
                  <td>{sprintName(t.sprintId)}</td>
                  <td><span className="who"><Avatar member={nameOf(t.assigneeId)} size={22} />{nameOf(t.assigneeId)?.fullName}</span></td>
                  <td>{STATUSES.find((s) => s.id === t.status)?.title}</td>
                  <td><EstimateBadge hours={t.estimateHours} /></td>
                  <td className="table__action">
                    <button type="button" className="btn btn--small btn--danger" onClick={() => dispatch({ type: 'deleteTask', taskId: t.id })} aria-label={`Удалить задачу ${t.id}`}>Удалить</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid-2">
        <section className="panel">
          <h2 className="panel__title">Спринты <span className="panel__count">{state.sprints.length}</span></h2>
          <ul className="list">
            {state.sprints.map((s) => (
              <li key={s.id} className="list__item">
                <b>{s.name}</b>
                <span className="muted">{formatDate(s.startDate)} – {formatDate(s.endDate)} · {s.durationDays} {plural(s.durationDays, 'день', 'дня', 'дней')}</span>
                <span className="muted">{s.goal}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="panel">
          <h2 className="panel__title">Команда <span className="panel__count">{state.members.length}</span></h2>
          <ul className="list">
            {state.members.map((m) => (
              <li key={m.id} className="list__item list__item--row">
                <Avatar member={m} size={32} />
                <span>
                  <b>{m.fullName}</b>
                  <br />
                  <span className="muted">{m.position} · {m.department}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <p className="reset">
        <button type="button" className="btn btn--ghost btn--small" onClick={() => { dispatch({ type: 'reset' }); setNotice('Демо-данные восстановлены') }}>
          Сбросить демо-данные
        </button>
      </p>

      {modal === 'task' && (
        <Modal title="Новая задача" size="lg" onClose={close}>
          <TaskForm onCancel={close} onCreated={(t) => done(`Задача ${t.id} «${t.title}» создана`)} />
        </Modal>
      )}
      {modal === 'sprint' && (
        <Modal title="Новый спринт" onClose={close}>
          <SprintForm onCancel={close} onCreated={(s) => done(`Спринт «${s.name}» создан (${s.durationDays} ${plural(s.durationDays, 'день', 'дня', 'дней')})`)} />
        </Modal>
      )}
      {modal === 'member' && (
        <Modal title="Новый участник" onClose={close}>
          <MemberForm onCancel={close} onCreated={(m) => done(`Участник ${m.fullName} добавлен в команду`)} />
        </Modal>
      )}
    </>
  )
}
