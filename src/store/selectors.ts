import { useMemo } from 'react'
import type { Sprint } from '../types'
import { findCurrentSprint } from '../utils/sprint'
import { useApp } from './context'

/** Выбранный спринт (или текущий по датам, если пользователь ничего не выбирал) */
export function useActiveSprint(): Sprint | undefined {
  const { state } = useApp()
  return useMemo(
    () => state.sprints.find((s) => s.id === state.selectedSprintId) ?? findCurrentSprint(state.sprints),
    [state.sprints, state.selectedSprintId],
  )
}
