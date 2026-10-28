import { NavLink, Outlet } from 'react-router-dom'
import { useApp } from '../store/context'
import { Avatar } from './ui/Avatar'

const LINKS = [
  { to: '/', label: 'Рабочий стол', end: true },
  { to: '/sprint', label: 'Активный спринт', end: false },
  { to: '/admin', label: 'Панель администратора', end: false },
]

/** Каркас приложения: шапка с навигацией + содержимое страницы */
export function Layout() {
  const { state } = useApp()
  const me = state.members.find((m) => m.id === state.currentUserId)
  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar__inner">
          <NavLink to="/" className="brand" aria-label="TaskBoard — на рабочий стол">
            <svg width="26" height="26" viewBox="0 0 32 32" aria-hidden="true">
              <rect width="32" height="32" rx="7" fill="currentColor" />
              <rect x="6" y="7" width="5" height="18" rx="1.5" fill="#fff" />
              <rect x="13.5" y="7" width="5" height="12" rx="1.5" fill="#fff" opacity=".85" />
              <rect x="21" y="7" width="5" height="8" rx="1.5" fill="#fff" opacity=".7" />
            </svg>
            <span>TaskBoard</span>
          </NavLink>
          <nav className="nav" aria-label="Основное меню">
            {LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => `nav__link${isActive ? ' nav__link--active' : ''}`}>
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="topbar__user" title="Текущий пользователь">
            <Avatar member={me} size={30} />
            <span className="topbar__name">{me?.fullName}</span>
          </div>
        </div>
      </header>
      <main className="page">
        <Outlet />
      </main>
    </div>
  )
}
