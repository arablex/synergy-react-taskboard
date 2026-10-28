import { useApp } from '../../store/context'
import { useForm, type Errors } from '../../hooks/useForm'
import { requiredText } from '../../utils/validators'
import { daysInclusive, isValidISO, plural, todayISO, workingDays } from '../../utils/date'
import type { Sprint } from '../../types'
import { TextField } from '../ui/TextField'
import { TextArea } from '../ui/TextArea'
import { DateField } from '../ui/DateField'
import { ReadOnlyField } from '../ui/ReadOnlyField'

interface SprintFormValues {
  name: string
  goal: string
  startDate: string
  endDate: string
}

const MAX_DURATION = 60

/** Форма создания спринта: длительность считается автоматически по датам */
export function SprintForm({ onCreated, onCancel }: { onCreated: (s: Sprint) => void; onCancel: () => void }) {
  const { state, dispatch } = useApp()

  const validate = (v: SprintFormValues): Errors<SprintFormValues> => {
    const e: Errors<SprintFormValues> = {}
    const n = requiredText(v.name, 'Имя спринта', 3, 60)
    if (n) e.name = n
    else if (state.sprints.some((s) => s.name.toLowerCase() === v.name.trim().toLowerCase()))
      e.name = 'Спринт с таким именем уже есть'
    const g = requiredText(v.goal, 'Цель спринта', 10, 200)
    if (g) e.goal = g

    if (!v.startDate) e.startDate = 'Укажите дату начала'
    else if (!isValidISO(v.startDate)) e.startDate = 'Некорректная дата начала'
    if (!v.endDate) e.endDate = 'Укажите дату окончания'
    else if (!isValidISO(v.endDate)) e.endDate = 'Некорректная дата окончания'

    if (!e.startDate && !e.endDate) {
      if (v.endDate < v.startDate) e.endDate = 'Дата окончания не может быть раньше даты начала'
      else if (daysInclusive(v.startDate, v.endDate) > MAX_DURATION)
        e.endDate = `Спринт слишком длинный: максимум ${MAX_DURATION} дней`
    }
    return e
  }

  const form = useForm<SprintFormValues>({ name: '', goal: '', startDate: todayISO(), endDate: '' }, validate)
  const { values: v } = form

  const datesOk = isValidISO(v.startDate) && isValidISO(v.endDate) && v.endDate >= v.startDate
  const duration = datesOk ? daysInclusive(v.startDate, v.endDate) : 0
  const durationText = datesOk
    ? `${duration} ${plural(duration, 'день', 'дня', 'дней')} (рабочих: ${workingDays(v.startDate, v.endDate)})`
    : 'Считается автоматически по датам'

  const submit = form.handleSubmit((vals) => {
    const sprint: Sprint = {
      id: `s${Date.now()}`,
      name: vals.name.trim(),
      goal: vals.goal.trim(),
      startDate: vals.startDate,
      endDate: vals.endDate,
      durationDays: daysInclusive(vals.startDate, vals.endDate),
    }
    dispatch({ type: 'addSprint', sprint })
    onCreated(sprint)
  })

  return (
    <form className="form" onSubmit={submit} noValidate>
      <TextField label="Имя спринта" required value={v.name} maxLength={60} placeholder="Например: Спринт 13 — Оплата" onChange={(x) => form.setValue('name', x)} onBlur={() => form.touch('name')} error={form.errorOf('name')} />
      <TextArea label="Цель спринта" required minLength={10} rows={3} value={v.goal} placeholder="Чего команда хочет достичь за спринт" onChange={(x) => form.setValue('goal', x)} onBlur={() => form.touch('goal')} error={form.errorOf('goal')} />
      <div className="form__grid">
        <DateField label="Дата начала" required value={v.startDate} onChange={(x) => form.setValue('startDate', x)} onBlur={() => form.touch('startDate')} error={form.errorOf('startDate')} />
        <DateField label="Дата окончания" required value={v.endDate} min={v.startDate || undefined} onChange={(x) => form.setValue('endDate', x)} onBlur={() => form.touch('endDate')} error={form.errorOf('endDate')} />
      </div>
      <ReadOnlyField label="Длительность" value={durationText} tone={datesOk ? 'ok' : 'neutral'} />
      <div className="form__actions">
        <button type="button" className="btn btn--ghost" onClick={onCancel}>Отмена</button>
        <button type="submit" className="btn btn--primary">Создать спринт</button>
      </div>
    </form>
  )
}
