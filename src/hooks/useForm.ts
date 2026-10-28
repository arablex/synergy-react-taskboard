import { useCallback, useMemo, useState, type FormEvent } from 'react'

export type Errors<T> = Partial<Record<keyof T, string>>

/**
 * Небольшой хук для форм: хранит значения, считает ошибки через validate()
 * и показывает их только для «тронутых» полей (или после попытки отправки).
 */
export function useForm<T extends object>(initial: T, validate: (values: T) => Errors<T>) {
  const [values, setValues] = useState<T>(initial)
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})
  const [submitted, setSubmitted] = useState(false)

  const allErrors = useMemo(() => validate(values), [validate, values])

  const setValue = useCallback(<K extends keyof T>(name: K, value: T[K]) => {
    setValues((prev) => ({ ...prev, [name]: value }))
  }, [])

  const touch = useCallback((name: keyof T) => {
    setTouched((prev) => ({ ...prev, [name]: true }))
  }, [])

  /** Ошибка поля, которую уже нужно показать пользователю */
  const errorOf = (name: keyof T): string | undefined =>
    touched[name] || submitted ? allErrors[name] : undefined

  const handleSubmit = (onValid: (values: T) => void) => (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    if (Object.keys(allErrors).length === 0) onValid(values)
  }

  return { values, setValue, touch, errorOf, allErrors, handleSubmit, submitted }
}
