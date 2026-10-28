import { useId } from 'react'
import { FieldShell, ariaProps } from './FieldShell'

export interface Option {
  value: string
  label: string
}

interface SelectFieldProps {
  label: string
  value: string
  options: Option[]
  onChange: (value: string) => void
  onBlur?: () => void
  error?: string
  hint?: string
  required?: boolean
  /** Текст пустого пункта; если не задан — пустого пункта нет */
  placeholder?: string
}

/** Переиспользуемый выпадающий список */
export function SelectField({ label, value, options, onChange, onBlur, error, hint, required, placeholder }: SelectFieldProps) {
  const id = useId()
  return (
    <FieldShell id={id} label={label} required={required} hint={hint} error={error}>
      <select
        id={id}
        className="input input--select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        {...ariaProps(id, error, hint)}
      >
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldShell>
  )
}
