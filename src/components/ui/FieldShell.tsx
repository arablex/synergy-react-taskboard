import type { ReactNode } from 'react'

interface FieldShellProps {
  id: string
  label: string
  required?: boolean
  hint?: string
  error?: string
  children: ReactNode
}

/** Общая обёртка поля: подпись, подсказка, текст ошибки. Все поля ввода строятся на ней. */
export function FieldShell({ id, label, required, hint, error, children }: FieldShellProps) {
  return (
    <div className={`field${error ? ' field--error' : ''}`}>
      <label className="field__label" htmlFor={id}>
        {label}
        {required ? <span className="field__req" aria-hidden="true"> *</span> : <span className="field__opt"> (необязательно)</span>}
      </label>
      {children}
      {error ? (
        <p className="field__error" id={`${id}-err`} role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="field__hint" id={`${id}-hint`}>
          {hint}
        </p>
      ) : null}
    </div>
  )
}

/** aria-атрибуты, общие для всех полей */
export function ariaProps(id: string, error?: string, hint?: string) {
  return {
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? `${id}-err` : hint ? `${id}-hint` : undefined,
  } as const
}
