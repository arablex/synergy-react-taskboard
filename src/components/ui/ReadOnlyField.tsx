import { useId } from 'react'

interface ReadOnlyFieldProps {
  label: string
  value: string
  /** Цветовой тон значения: нейтральный / ок / предупреждение / ошибка */
  tone?: 'neutral' | 'ok' | 'warn' | 'error'
  hint?: string
  optional?: boolean
}

/** Вычисляемое поле (ID задачи, длительность спринта, остаток времени) — только для чтения */
export function ReadOnlyField({ label, value, tone = 'neutral', hint, optional }: ReadOnlyFieldProps) {
  const id = useId()
  return (
    <div className="field">
      <span className="field__label" id={id}>
        {label}
        {optional && <span className="field__opt"> (необязательно)</span>}
      </span>
      <output className={`readonly readonly--${tone}`} aria-labelledby={id}>
        {value}
      </output>
      {hint && <p className="field__hint">{hint}</p>}
    </div>
  )
}
