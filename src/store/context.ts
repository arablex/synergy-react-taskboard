import { createContext, useContext, type Dispatch } from 'react'
import type { AppState } from '../types'
import type { Action } from './reducer'

export interface AppContextValue {
  state: AppState
  dispatch: Dispatch<Action>
}

export const AppContext = createContext<AppContextValue | null>(null)

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp нужно вызывать внутри <AppProvider>')
  return ctx
}
