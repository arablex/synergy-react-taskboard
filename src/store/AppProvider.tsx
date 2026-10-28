import { useEffect, useMemo, useReducer, type ReactNode } from 'react'
import { AppContext } from './context'
import { loadState, reducer, saveState } from './reducer'

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState)

  // Сохраняем состояние при каждом изменении
  useEffect(() => saveState(state), [state])

  const value = useMemo(() => ({ state, dispatch }), [state])
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
