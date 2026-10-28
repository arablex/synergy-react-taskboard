import type { Member, Sprint, Task } from '../../types'
import { STATUSES } from '../../types'
import { Modal } from '../ui/Modal'
import { Avatar } from '../ui/Avatar'
import { EstimateBadge } from '../ui/EstimateBadge'
import { formatDateLong } from '../../utils/date'

interface Props {
  task: Task
  members: Member[]
  sprints: Sprint[]
  onClose: () => void
}

/** Окно просмотра задачи */
export function TaskDetails({ task, members, sprints, onClose }: Props) {
  const find = (id: string) => members.find((m) => m.id === id)
  const author = find(task.authorId)
  const assignee = find(task.assigneeId)
  const sprint = sprints.find((s) => s.id === task.sprintId)
  const status = STATUSES.find((s) => s.id === task.status)?.title
  const watchers = task.watcherIds.map(find).filter((m): m is Member => Boolean(m))

  return (
    <Modal title={`${task.id} · ${task.title}`} onClose={onClose}>
      <p className="details__sub">{task.subtitle}</p>
      <dl className="details">
        <div><dt>Статус</dt><dd>{status}</dd></div>
        <div><dt>Спринт</dt><dd>{sprint ? sprint.name : 'Бэклог'}</dd></div>
        <div><dt>Автор</dt><dd><Avatar member={author} size={22} /> {author?.fullName}</dd></div>
        <div><dt>Исполнитель</dt><dd><Avatar member={assignee} size={22} /> {assignee?.fullName}</dd></div>
        <div><dt>Время выполнения</dt><dd><EstimateBadge hours={task.estimateHours} /></dd></div>
        <div><dt>Создана</dt><dd>{formatDateLong(task.createdAt)}</dd></div>
      </dl>
      <h3 className="details__h">Описание</h3>
      <p className="details__text">{task.description}</p>
      {task.comment && (
        <>
          <h3 className="details__h">Комментарий</h3>
          <p className="details__text">{task.comment}</p>
        </>
      )}
      <h3 className="details__h">Наблюдатели</h3>
      {watchers.length ? (
        <ul className="people">
          {watchers.map((m) => (
            <li key={m.id}><Avatar member={m} size={22} /> {m.fullName}</li>
          ))}
        </ul>
      ) : (
        <p className="empty">Наблюдателей нет</p>
      )}
    </Modal>
  )
}
