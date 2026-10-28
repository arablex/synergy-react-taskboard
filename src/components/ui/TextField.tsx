import { useId } from 'react'
import { FieldShell, ariaProps } from './FieldShell'

interface TextFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  error?: string
  hint?: string
  required?: boolean
  placeholder?: string
  maxLength?: number
  /** id списка подсказок <datalist> */
  list?: string
  autoFocus?: boolean
}

/** Переиспользуемое однострочное поле ввода */
export function TextField({ label, value, onChange, onBlur, error, hint, required, placeholder, maxLength, list, autoFocus }: TextFieldProps) {
  const id = useId()
  return (
    <FieldShell id={id} label={label} required={required} hint={hint} error={error}>
      <input
        id={id}
        className="input"
        type="text"
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        list={list}
        autoFocus={autoFocus}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        {...ariaProps(id, error, hint)}
      />
    </FieldShell>
  )
}
