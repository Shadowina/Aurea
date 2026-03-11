import { useEffect, useMemo, useState } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import './index.css'
import AuthGate from './features/auth/components/AuthGate.jsx'
import DashboardPage from './features/dashboard/pages/DashboardPage.jsx'
import { useMoods } from './context/MoodContext.jsx'
import { auth } from './config/firebase.js'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showComposer, setShowComposer] = useState(false)
  const { entries } = useMoods()
  const totalEntries = entries.length

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const heroCopy = useMemo(() => {
    if (totalEntries === 0) return 'Begin your first entry to paint how today feels.'
    if (totalEntries === 1) return 'Lovely start. Come back tomorrow to spot a pattern.'
    return `You have ${totalEntries} logged days. Keep tracing how you move through the world.`
  }, [totalEntries])

  return (
    <AuthGate loading={loading} user={user}>
      <DashboardPage
        user={user}
        totalEntries={totalEntries}
        heroCopy={heroCopy}
        showComposer={showComposer}
        onOpenComposer={() => setShowComposer(true)}
        onCloseComposer={() => setShowComposer(false)}
        onSignOut={() => signOut(auth)}
      />
    </AuthGate>
  )
}

export default App
