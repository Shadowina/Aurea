import { useTranslation } from 'react-i18next'
import Auth from './Auth.jsx'
import { useAuth } from '../../../context/useAuth.js'

function AppLoading() {
  const { t } = useTranslation()
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div
        className="w-full max-w-sm space-y-4"
        role="status"
        aria-busy="true"
        aria-label="Loading session"
      >
        <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-teal/25 to-teal/5">
          <div className="h-full w-full animate-pulse rounded-2xl bg-teal/15" />
        </div>
        <div className="mx-auto h-3 w-3/4 rounded-full bg-slate-200/90 dark:bg-slate-700/90">
          <div className="h-full w-full animate-pulse rounded-full bg-slate-200/70 dark:bg-slate-600/70" />
        </div>
        <div className="mx-auto h-3 w-1/2 rounded-full bg-slate-200/80 dark:bg-slate-700/80">
          <div className="h-full w-full animate-pulse rounded-full bg-slate-200/60 dark:bg-slate-600/60" />
        </div>
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">{t('common.loading')}</p>
      </div>
    </div>
  )
}

export default function AuthGate({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <AppLoading />
  if (!user) return <Auth />
  return children
}
