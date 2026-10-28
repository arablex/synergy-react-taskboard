// Общие проверки для форм

export const textLength = (s: string): number => s.trim().length

export function requiredText(value: string, label: string, min = 1, max = 200): string | undefined {
  const len = textLength(value)
  if (len === 0) return `Поле «${label}» обязательно для заполнения`
  if (len < min) return `«${label}»: не менее ${min} симв. (сейчас ${len})`
  if (len > max) return `«${label}»: не более ${max} симв. (сейчас ${len})`
  return undefined
}

/** ФИО: минимум два слова из букв (имя и фамилия), допускаются дефис и апостроф */
export const FULL_NAME_PATTERN = /^[A-Za-zА-Яа-яЁё'’-]{2,}(\s+[A-Za-zА-Яа-яЁё'’-]{2,})+$/
