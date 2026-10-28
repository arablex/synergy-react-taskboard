import { useState } from 'react'
import type { Task } from '../../types'
import { useApp } from '../../store/context'
import { useActiveSprint } from '../../store/selectors'
import { useForm, type Errors } from '../../hooks/useForm'
import { requiredText, textLength } from '../../utils/validators'
import { formatEstimate, MAX_ESTIMATE_HOURS, parseEstimate } from '../../utils/time'
import { generateTaskId } from '../../utils/taskId'
import { freeHours } from '../../utils/capacity'
import { todayISO } from '../../utils/date'
import { TextField } from '../ui/TextField'
import { TextArea } from '../ui/TextArea'
import { SelectField } from '../ui/SelectField'
import { CheckboxGroup } from '../ui/CheckboxGroup'
import { ReadOnlyField } from '../ui/ReadOnlyField'

interface TaskFormValues {
  title: string
  subtitle: string
  authorId: string
  assigneeId: string
  estimate: string
  description: string
  comment: string
  watcherIds: string[]
  sprintId: string
}

const MIN_TEXT = 40

/** Форма создания задачи (показывается в модальном окне) */
export function TaskForm({ onCreated, onCancel }: { onCreated: (task: Task) => void; onCancel: () => void }) {
  const { state, dispatch } = useApp()
  const activeSprint = useActiveSprint()
  // ID генерируется автоматически при открытии окна: XX-1234
  const [taskId] = useState(() => generateTaskId(new Set(state.tasks.map((t) => t.id))))

  const memberOptions = state.members.map((m) => ({ value: m.id, label: `${m.fullName} — ${m.position}` }))
  const sprintOptions = state.sprints.map((s) => ({ value: s.id, label: s.name }))

  const initial: TaskFormValues = {
    title: '',
    subtitle: '',
    authorId: '',
    assigneeId: '',
    estimate: '',
    description: '',
    comment: '',
    watcherIds: [],
    sprintId: activeSprint?.id ?? '',
  }

  // Контроль времени: сколько осталось у исполнителя до конца спринта
  const capacityInfo = (v: TaskFormValues) => {
    const sprint = state.sprints.find((s) => s.id === v.sprintId)
    const hours = parseEstimate(v.estimate)
    if (!sprint) return { kind: 'backlog' as const }
    if (!v.assigneeId) return { kind: 'no-assignee' as const }
    const free = freeHours(sprint, state.tasks, v.assigneeId)
    const sprintOver = todayISO() > sprint.endDate
    return { kind: 'sprint' as const, free, hours, sprintOver, left: hours !== null ? free - hours : null }
  }

  const validate = (v: TaskFormValues): Errors<TaskFormValues> => {
    const e: Errors<TaskFormValues> = {}
    const t = requiredText(v.title, 'Заголовок', 3, 80)
    if (t) e.title = t
    const s = requiredText(v.subtitle, 'Подзаголовок', 3, 120)
    if (s) e.subtitle = s
    if (!v.authorId) e.authorId = 'Выберите автора задачи'
    if (!v.assigneeId) e.assigneeId = 'Выберите исполнителя'

    const hours = parseEstimate(v.estimate)
    if (!v.estimate.trim()) e.estimate = 'Укажите время выполнения, например 6ч или 1д.6ч'
    else if (hours === null) e.estimate = 'Неверный формат. Примеры: 6ч, 1д.6ч, 2д или просто число часов'
    else if (hours < 1) e.estimate = 'Время выполнения должно быть не меньше 1 часа'
    else if (hours > MAX_ESTIMATE_HOURS) e.estimate = `Слишком много: максимум ${formatEstimate(MAX_ESTIMATE_HOURS)}`

    if (textLength(v.description) < MIN_TEXT)
      e.description = `Описание обязательно: не менее ${MIN_TEXT} символов (сейчас ${textLength(v.description)})`
    if (v.comment.trim() && textLength(v.comment) < MIN_TEXT)
      e.comment = `Комментарий, если он есть, — не менее ${MIN_TEXT} символов (сейчас ${textLength(v.comment)})`

    // Валидация времени относительно конца спринта (только если время указано верно)
    if (!e.estimate && hours !== null) {
      const info = capacityInfo(v)
      if (info.kind === 'sprint') {
        if (info.sprintOver) e.estimate = 'Спринт уже закончился — выберите другой спринт или бэклог'
        else if (info.left !== null && info.left < 0)
          e.estimate = `Не хватает времени: до конца спринта у исполнителя свободно ${formatEstimate(Math.max(info.free, 0))}, а задача — ${formatEstimate(hours)}`
      }
    }
    return e
  }

  const form = useForm<TaskFormValues>(initial, validate)
  const { values: v } = form

  const info = capacityInfo(v)

  let remainText = 'Задача без спринта (бэклог) — ограничения по времени нет'
  let remainTone: 'neutral' | 'ok' | 'warn' | 'error' = 'neutral'
  if (info.kind === 'no-assignee') {
    remainText = 'Выберите исполнителя, чтобы увидеть остаток времени'
  } else if (info.kind === 'sprint') {
    if (info.sprintOver) {
      remainText = 'Спринт уже закончился'
      remainTone = 'error'
    } else if (info.left === null) {
      remainText = `Свободно у исполнителя: ${formatEstimate(Math.max(info.free, 0))}`
    } else if (info.left < 0) {
      remainText = `Не хватает ${formatEstimate(-info.left)} — задачу создать нельзя`
      remainTone = 'error'
    } else {
      remainText = `Останется в спринте после добавления: ${formatEstimate(info.left)}`
      remainTone = info.left === 0 ? 'warn' : 'ok'
    }
  }

  const submit = form.handleSubmit((vals) => {
    const sprint = state.sprints.find((s) => s.id === vals.sprintId)
    const task: Task = {
      id: taskId,
      title: vals.title.trim(),
      subtitle: vals.subtitle.trim(),
      authorId: vals.authorId,
      assigneeId: vals.assigneeId,
      estimateHours: parseEstimate(vals.estimate) ?? 0,
      description: vals.description.trim(),
      comment: vals.comment.trim(),
      watcherIds: vals.watcherIds,
      sprintId: sprint ? sprint.id : null,
      status: 'todo',
      createdAt: todayISO(),
      doneAt: null,
    }
    dispatch({ type: 'addTask', task })
    onCreated(task)
  })

  const hoursPreview = parseEstimate(v.estimate)

  return (
    <form className="form" onSubmit={submit} noValidate>
      <div className="form__grid">
        <ReadOnlyField label="ID задачи" value={taskId} hint="Генерируется автоматически: две буквы и четыре цифры" />
        <SelectField label="Спринт" value={v.sprintId} options={sprintOptions} placeholder="Бэклог (без спринта)" onChange={(x) => form.setValue('sprintId', x)} />
      </div>
      <TextField label="Заголовок" required value={v.title} maxLength={80} placeholder="Например: Форма входа" onChange={(x) => form.setValue('title', x)} onBlur={() => form.touch('title')} error={form.errorOf('title')} />
      <TextField label="Подзаголовок" required value={v.subtitle} maxLength={120} placeholder="Краткое пояснение к задаче" onChange={(x) => form.setValue('subtitle', x)} onBlur={() => form.touch('subtitle')} error={form.errorOf('subtitle')} />
      <div className="form__grid">
        <SelectField label="Автор" required value={v.authorId} options={memberOptions} placeholder="Выберите автора" onChange={(x) => form.setValue('authorId', x)} onBlur={() => form.touch('authorId')} error={form.errorOf('authorId')} />
        <SelectField label="Исполнитель" required value={v.assigneeId} options={memberOptions} placeholder="Выберите исполнителя" onChange={(x) => form.setValue('assigneeId', x)} onBlur={() => form.touch('assigneeId')} error={form.errorOf('assigneeId')} />
      </div>
      <div className="form__grid">
        <TextField
          label="Время выполнения"
          required
          value={v.estimate}
          placeholder="6ч или 1д.6ч"
          hint={hoursPreview !== null && hoursPreview > 0 ? `Это ${formatEstimate(hoursPreview)} (${hoursPreview} ч; в дне 8 ч)` : 'Часы или дни: 6ч, 1д.6ч, 2д. Больше 8 часов показывается в днях'}
          onChange={(x) => form.setValue('estimate', x)}
          onBlur={() => form.touch('estimate')}
          error={form.errorOf('estimate')}
        />
        <ReadOnlyField label="Время до окончания спринта" optional value={remainText} tone={remainTone} />
      </div>
      <TextArea label="Описание задачи" required minLength={MIN_TEXT} rows={4} value={v.description} placeholder="Что нужно сделать и какой результат ожидается (не менее 40 символов)" onChange={(x) => form.setValue('description', x)} onBlur={() => form.touch('description')} error={form.errorOf('description')} />
      <TextArea label="Дополнительные комментарии" minLength={MIN_TEXT} rows={3} value={v.comment} placeholder="Если комментарий есть — не менее 40 символов" onChange={(x) => form.setValue('comment', x)} onBlur={() => form.touch('comment')} error={form.errorOf('comment')} />
      <CheckboxGroup label="Наблюдатели" options={state.members.map((m) => ({ value: m.id, label: m.fullName }))} values={v.watcherIds} onChange={(x) => form.setValue('watcherIds', x)} hint="Получают уведомления об изменениях задачи" />
      <div className="form__actions">
        <button type="button" className="btn btn--ghost" onClick={onCancel}>Отмена</button>
        <button type="submit" className="btn btn--primary">Создать задачу</button>
      </div>
    </form>
  )
}
