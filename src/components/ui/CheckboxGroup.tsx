import { useId } from 'react'
import type { Option } from './SelectField'

interface CheckboxGroupProps {
  label: string
  options: Option[]
  values: string[]
  onChange: (values: string[]) => void
  hint?: string
  error?: string
  required?: boolean
}

/** Множественный выбор (например, наблюдатели задачи) в виде «чипов» */
export function CheckboxGroup({ label, options, values, onChange, hint, error, required }: CheckboxGroupProps) {
  const id = useId()
  const toggle = (v: string) =>
    onChange(values.includes(v) ? values.filter((x) => x !== v) : [...values, v])
  return (
    <fieldset className={`field chips${error ? ' field--error' : ''}`} aria-describedby={error ? `${id}-err` : undefined}>
      <legend className="field__label">
        {label}
        {required ? <span className="field__req" aria-hidden="true"> *</span> : <span className="field__opt"> (необязательно)</span>}
      </legend>
      <div className="chips__list">
        {options.map((o) => (
          <label key={o.value} className={`chip${values.includes(o.value) ? ' chip--on' : ''}`}>
            <input type="checkbox" checked={values.includes(o.value)} onChange={() => toggle(o.value)} />
            {o.label}
          </label>
        ))}
      </div>
      {error ? (
        <p className="field__error" id={`${id}-err`} role="alert">{error}</p>
      ) : hint ? (
        <p className="field__hint">{hint}</p>
      ) : null}
    </fieldset>
  )
}
