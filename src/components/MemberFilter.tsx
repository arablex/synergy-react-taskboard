import type { Member } from '../types'
import { Avatar } from './ui/Avatar'

interface Props {
  members: Member[]
  /** 'all' — вся команда */
  value: string
  onChange: (id: string) => void
}

/** Фильтр по участникам команды: нажали на участника — остались только его задачи */
export function MemberFilter({ members, value, onChange }: Props) {
  return (
    <div className="filter" role="group" aria-label="Фильтр по участникам">
      <button type="button" className={`filter__btn${value === 'all' ? ' filter__btn--on' : ''}`} aria-pressed={value === 'all'} onClick={() => onChange('all')}>
        Вся команда
      </button>
      {members.map((m) => (
        <button
          key={m.id}
          type="button"
          className={`filter__btn${value === m.id ? ' filter__btn--on' : ''}`}
          aria-pressed={value === m.id}
          onClick={() => onChange(value === m.id ? 'all' : m.id)}
          title={`${m.fullName} — ${m.position}`}
        >
          <Avatar member={m} size={22} />
          <span className="filter__name">{m.fullName.split(' ')[0]}</span>
        </button>
      ))}
    </div>
  )
}
