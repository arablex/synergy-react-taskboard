import { useId } from 'react'
import { FieldShell, ariaProps } from './FieldShell'

interface DateFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  error?: string
  hint?: string
  required?: boolean
  min?: string
  max?: string
}

/** Переиспользуемое поле выбора даты */
export function DateField({ label, value, onChange, onBlur, error, hint, required, min, max }: DateFieldProps) {
  const id = useId()
  return (
    <FieldShell id={id} label={label} required={required} hint={hint} error={error}>
      <input
        id={id}
        className="input"
        type="date"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        {...ariaProps(id, error, hint)}
      />
    </FieldShell>
  )
}
