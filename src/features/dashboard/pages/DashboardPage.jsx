import { useCallback, useMemo, useState } from 'react'
import { signOut } from 'firebase/auth'
import { useTranslation } from 'react-i18next'
import FavoritesGallery from '../../moods/components/FavoritesGallery.jsx'
import MoodTimeline from '../../moods/components/MoodTimeline.jsx'
import { useAuth } from '../../../context/useAuth.js'
import { useMoods } from '../../../context/useMoods.js'
import { auth } from '../../../config/firebase.js'
import { resolveEntryTimestamp, toLocalDayKey } from '../../insights/utils/dateKeys.js'
import AppHeader from '../components/AppHeader.jsx'
import ComposerLauncherCard from '../components/ComposerLauncherCard.jsx'
import ComposerModal from '../components/ComposerModal.jsx'
import LeftInsightsPanel from '../components/LeftInsightsPanel.jsx'
import { useDailyPrompt } from '../../insights/hooks/useDailyPrompt.js'
import { computeStreaks } from '../../insights/utils/streaks.js'
import { computeWeeklySummary } from '../../insights/utils/weeklySummary.js'

export default function DashboardPage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { entries, loading } = useMoods()
  const [showComposer, setShowComposer] = useState(false)
  const [editingEntry, setEditingEntry] = useState(null)

  const handleCloseComposer = useCallback(() => {
    setShowComposer(false)
    setEditingEntry(null)
  }, [])

  const handleOpenNewComposer = useCallback(() => {
    setEditingEntry(null)
    setShowComposer(true)
  }, [])

  const handleEditEntry = useCallback((entry) => {
    setEditingEntry(entry)
    setShowComposer(true)
  }, [])

  const totalEntries = entries.length

  const loggedDayCount = useMemo(() => {
    const dayKeys = new Set()
    for (const entry of entries) {
      const ts = resolveEntryTimestamp(entry)
      if (ts) dayKeys.add(toLocalDayKey(ts))
    }
    return dayKeys.size
  }, [entries])

  const heroCopy = useMemo(() => {
    if (loggedDayCount === 0) return t('dashboard.hero0')
    if (loggedDayCount === 1) return t('dashboard.hero1')
    return t('dashboard.heroMany', { count: loggedDayCount })
  }, [loggedDayCount, t])
  const { promptOfDay, promptLoading } = useDailyPrompt(user, entries, loading)
  const [searchQuery, setSearchQuery] = useState('')
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [selectedTags, setSelectedTags] = useState([])

  const insightsSummary = useMemo(() => {
    const { currentStreak, longestStreak } = computeStreaks(entries)
    const { entriesThisWeek } = computeWeeklySummary(entries)
    return {
      currentStreak,
      longestStreak,
      entriesThisWeek,
    }
  }, [entries])

  const quickTags = useMemo(() => {
    const defaults = ['gratitude', 'family', 'creative', 'calm']
    const tagCounts = new Map()
    entries.forEach((entry) => {
      (entry.tags ?? []).forEach((tag) => {
        const normalizedTag = String(tag).trim().toLowerCase()
        if (!normalizedTag) return
        tagCounts.set(normalizedTag, (tagCounts.get(normalizedTag) ?? 0) + 1)
      })
    })
    const byUsage = [...tagCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([tag]) => tag)
    const merged = [...new Set([...defaults, ...byUsage])]
    return merged.slice(0, 8)
  }, [entries])

  const toggleTag = (tag) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]))
  }

  const clearFilters = () => {
    setSearchQuery('')
    setShowFavoritesOnly(false)
    setSelectedTags([])
  }

  return (
    <div className="page-shell">
      <AppHeader user={user} totalEntries={totalEntries} onSignOut={() => signOut(auth)} />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 sm:px-8 lg:flex-row">
        <LeftInsightsPanel
          heroCopy={heroCopy}
          insightsSummary={insightsSummary}
          insightsLoading={loading}
          promptLoading={promptLoading}
          promptOfDay={promptOfDay}
          quickTags={quickTags}
          selectedTags={selectedTags}
          onToggleTag={toggleTag}
          onClearFilters={clearFilters}
        />

        <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-10">
          <ComposerLauncherCard onOpenComposer={handleOpenNewComposer} />
          <MoodTimeline
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            showFavoritesOnly={showFavoritesOnly}
            onShowFavoritesOnlyChange={setShowFavoritesOnly}
            selectedTags={selectedTags}
            onEditEntry={handleEditEntry}
          />
          <div className="xl:hidden">
            <FavoritesGallery />
          </div>
        </main>

        <aside className="hidden w-80 flex-col gap-6 xl:flex">
          <FavoritesGallery variant="compact" />
        </aside>
      </div>

      <button
        type="button"
        onClick={handleOpenNewComposer}
        className="btn btn-primary fixed bottom-6 right-6 z-40 shadow-soft sm:hidden"
        aria-label={t('dashboard.logMoodAria')}
      >
        {t('dashboard.logMoodFab')}
      </button>

      <ComposerModal isOpen={showComposer} onClose={handleCloseComposer} editingEntry={editingEntry} />
    </div>
  )
}
