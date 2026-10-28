import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppProvider } from './store/AppProvider'
import { Layout } from './components/Layout'
import { DashboardPage } from './pages/DashboardPage'
import { SprintPage } from './pages/SprintPage'
import { AdminPage } from './pages/AdminPage'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<DashboardPage />} />
            <Route path="sprint" element={<SprintPage />} />
            <Route path="admin" element={<AdminPage />} />
            <Route path="*" element={<DashboardPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
