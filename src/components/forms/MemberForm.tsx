import { useApp } from '../../store/context'
import { useForm, type Errors } from '../../hooks/useForm'
import { FULL_NAME_PATTERN, requiredText } from '../../utils/validators'
import type { Member } from '../../types'
import { TextField } from '../ui/TextField'

interface MemberFormValues {
  fullName: string
  position: string
  department: string
}

const DEPARTMENTS = ['Разработка', 'Продукт', 'Дизайн', 'Качество', 'Аналитика', 'Маркетинг', 'Поддержка']

/** Форма добавления участника команды */
export function MemberForm({ onCreated, onCancel }: { onCreated: (m: Member) => void; onCancel: () => void }) {
  const { state, dispatch } = useApp()

  const validate = (v: MemberFormValues): Errors<MemberFormValues> => {
    const e: Errors<MemberFormValues> = {}
    const name = v.fullName.trim().replace(/\s+/g, ' ')
    if (!name) e.fullName = 'Поле «ФИО» обязательно для заполнения'
    else if (!FULL_NAME_PATTERN.test(name)) e.fullName = 'Введите фамилию и имя буквами, например: Иван Петров'
    else if (state.members.some((m) => m.fullName.toLowerCase() === name.toLowerCase()))
      e.fullName = 'Участник с таким ФИО уже есть в команде'
    const p = requiredText(v.position, 'Должность', 2, 60)
    if (p) e.position = p
    const d = requiredText(v.department, 'Подразделение', 2, 60)
    if (d) e.department = d
    return e
  }

  const form = useForm<MemberFormValues>({ fullName: '', position: '', department: '' }, validate)
  const { values: v } = form

  const submit = form.handleSubmit((vals) => {
    const member: Member = {
      id: `m${Date.now()}`,
      fullName: vals.fullName.trim().replace(/\s+/g, ' '),
      position: vals.position.trim(),
      department: vals.department.trim(),
    }
    dispatch({ type: 'addMember', member })
    onCreated(member)
  })

  return (
    <form className="form" onSubmit={submit} noValidate>
      <TextField label="ФИО" required value={v.fullName} placeholder="Иванов Иван Иванович" onChange={(x) => form.setValue('fullName', x)} onBlur={() => form.touch('fullName')} error={form.errorOf('fullName')} />
      <TextField label="Должность" required value={v.position} placeholder="Например: Frontend-разработчик" onChange={(x) => form.setValue('position', x)} onBlur={() => form.touch('position')} error={form.errorOf('position')} />
      <TextField label="Подразделение" required value={v.department} list="departments" placeholder="Выберите или введите" onChange={(x) => form.setValue('department', x)} onBlur={() => form.touch('department')} error={form.errorOf('department')} />
      <datalist id="departments">
        {DEPARTMENTS.map((d) => (
          <option key={d} value={d} />
        ))}
      </datalist>
      <div className="form__actions">
        <button type="button" className="btn btn--ghost" onClick={onCancel}>Отмена</button>
        <button type="submit" className="btn btn--primary">Добавить участника</button>
      </div>
    </form>
  )
}
