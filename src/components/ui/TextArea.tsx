import { useId } from 'react'
import { FieldShell, ariaProps } from './FieldShell'

interface TextAreaProps {
  label: string
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  error?: string
  hint?: string
  required?: boolean
  placeholder?: string
  rows?: number
  /** Минимальная длина — показываем счётчик символов */
  minLength?: number
}

/** Переиспользуемое многострочное поле со счётчиком символов */
export function TextArea({ label, value, onChange, onBlur, error, hint, required, placeholder, rows = 4, minLength }: TextAreaProps) {
  const id = useId()
  const len = value.trim().length
  const counter = minLength ? (
    <span className={`field__counter${len >= minLength ? ' field__counter--ok' : ''}`}>
      {len} / {minLength}
    </span>
  ) : null
  return (
    <FieldShell id={id} label={label} required={required} hint={hint} error={error}>
      <textarea
        id={id}
        className="input input--area"
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        {...ariaProps(id, error, hint)}
      />
      {counter}
    </FieldShell>
  )
}
