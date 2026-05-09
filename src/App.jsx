import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './index.css'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import AuthGate from './features/auth/components/AuthGate.jsx'
import AnalyticsPage from './features/analytics/pages/AnalyticsPage.jsx'
import CalendarPage from './features/calendar/pages/CalendarPage.jsx'
import DashboardPage from './features/dashboard/pages/DashboardPage.jsx'
import GalleryPage from './features/gallery/pages/GalleryPage.jsx'
import SettingsPage from './features/settings/pages/SettingsPage.jsx'

function App() {
  return (
    <AuthGate>
      <BrowserRouter>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </AuthGate>
  )
}

export default App
