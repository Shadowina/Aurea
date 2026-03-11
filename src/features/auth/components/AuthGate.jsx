import Auth from './Auth.jsx'

function AppLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 flex justify-center">
          <span className="flex h-16 w-16 animate-pulse items-center justify-center rounded-2xl bg-teal/20 text-3xl">
            ✨
          </span>
        </div>
        <p className="text-sm text-slate-500">Loading...</p>
      </div>
    </div>
  )
}

export default function AuthGate({ loading, user, children }) {
  if (loading) return <AppLoading />
  if (!user) return <Auth />
  return children
}
