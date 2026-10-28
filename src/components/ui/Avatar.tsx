import type { Member } from '../../types'

const COLORS = ['#0c66e4', '#1f845a', '#c25100', '#8270db', '#c9372c', '#206a83']

function colorOf(id: string): string {
  let h = 0
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) % COLORS.length
  return COLORS[h]
}

export function initials(fullName: string): string {
  return fullName
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
}

/** Круглый аватар с инициалами */
export function Avatar({ member, size = 28 }: { member?: Member; size?: number }) {
  if (!member) return <span className="avatar avatar--empty" style={{ width: size, height: size }} aria-hidden="true">?</span>
  return (
    <span
      className="avatar"
      style={{ width: size, height: size, background: colorOf(member.id), fontSize: size * 0.4 }}
      title={member.fullName}
      aria-hidden="true"
    >
      {initials(member.fullName)}
    </span>
  )
}
