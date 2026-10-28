// Идентификатор задачи вида XX-1234:
// X — любая буква английского алфавита, 1234 — любая последовательность цифр от 1 до 9.

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

function randomItem(source: string): string {
  return source[Math.floor(Math.random() * source.length)]
}

export function generateTaskId(existing: Set<string> = new Set()): string {
  for (;;) {
    const letters = randomItem(LETTERS) + randomItem(LETTERS)
    const digits = Array.from({ length: 4 }, () => randomItem('123456789')).join('')
    const id = `${letters}-${digits}`
    if (!existing.has(id)) return id
  }
}

export const TASK_ID_PATTERN = /^[A-Za-z]{2}-[1-9]{4}$/
