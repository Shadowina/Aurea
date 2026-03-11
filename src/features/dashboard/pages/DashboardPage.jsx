import { useMemo, useState } from 'react'
import FavoritesGallery from '../../moods/components/FavoritesGallery.jsx'
import MoodTimeline from '../../moods/components/MoodTimeline.jsx'
import { useMoods } from '../../../context/MoodContext.jsx'
import AppHeader from '../components/AppHeader.jsx'
import ComposerLauncherCard from '../components/ComposerLauncherCard.jsx'
import ComposerModal from '../components/ComposerModal.jsx'
import LeftInsightsPanel from '../components/LeftInsightsPanel.jsx'

export default function DashboardPage({
  user,
  totalEntries,
  heroCopy,
  showComposer,
  onOpenComposer,
  onCloseComposer,
  onSignOut,
}) {
  const { entries } = useMoods()
  const [searchQuery, setSearchQuery] = useState('')
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [selectedTags, setSelectedTags] = useState([])

  const quickTags = useMemo(() => {
    const defaults = ['gratitude', 'family', 'creative', 'calm']
    const tagCounts = new Map()
    entries.forEach((entry) => {
      ;(entry.tags ?? []).forEach((tag) => {
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
    <div className="min-h-screen bg-surface/95">
      <AppHeader user={user} totalEntries={totalEntries} onSignOut={onSignOut} />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 sm:px-8 lg:flex-row">
        <LeftInsightsPanel
          heroCopy={heroCopy}
          quickTags={quickTags}
          selectedTags={selectedTags}
          onToggleTag={toggleTag}
          onClearFilters={clearFilters}
        />

        <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-10">
          <ComposerLauncherCard onOpenComposer={onOpenComposer} />
          <MoodTimeline
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            showFavoritesOnly={showFavoritesOnly}
            onShowFavoritesOnlyChange={setShowFavoritesOnly}
            selectedTags={selectedTags}
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
        onClick={onOpenComposer}
        className="btn btn-primary fixed bottom-6 right-6 z-40 shadow-soft sm:hidden"
      >
        Log mood
      </button>

      <ComposerModal isOpen={showComposer} onClose={onCloseComposer} />
    </div>
  )
}
