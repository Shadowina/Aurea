import { useTranslation } from 'react-i18next'
import PromptOfTheDayCard from '../../insights/components/PromptOfTheDayCard.jsx'

export default function LeftInsightsPanel({
  heroCopy,
  insightsSummary,
  insightsLoading = false,
  promptLoading = false,
  promptOfDay = null,
  quickTags = [],
  selectedTags = [],
  onToggleTag,
  onClearFilters,
}) {
  const { t } = useTranslation()
  const summary = insightsSummary ?? {
    currentStreak: 0,
    longestStreak: 0,
    entriesThisWeek: 0,
  }
  const hasActiveFilters = selectedTags.length > 0

  return (
    <aside className="hidden w-72 flex-col gap-6 lg:flex">
      <div className="card border border-white/70 px-6 py-6 shadow-soft dark:border-slate-700/80">
        <p className="text-[11px] uppercase tracking-[0.35em] text-slate-400">{t('insights.yourVibe')}</p>
        <p className="mt-4 text-base text-slate-600 dark:text-slate-400">{heroCopy}</p>
        <div className="mt-6 rounded-2xl border border-white/70 bg-slate-50/90 px-4 py-4 dark:border-slate-700/80 dark:bg-slate-800/50">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">{t('insights.insightsLabel')}</p>
          {insightsLoading ? (
            <div
              className="mt-3 space-y-3"
              role="status"
              aria-busy="true"
              aria-label={t('insights.loadingInsights')}
            >
              <div className="h-4 w-full rounded-md bg-slate-200/90 dark:bg-slate-700/90">
                <div className="h-full w-full animate-pulse rounded-md bg-slate-200/70 dark:bg-slate-700/70" />
              </div>
              <div className="h-4 w-[92%] rounded-md bg-slate-200/90 dark:bg-slate-700/90">
                <div className="h-full w-full animate-pulse rounded-md bg-slate-200/70 dark:bg-slate-700/70" />
              </div>
              <div className="h-4 w-4/5 rounded-md bg-slate-200/90 dark:bg-slate-700/90">
                <div className="h-full w-full animate-pulse rounded-md bg-slate-200/70 dark:bg-slate-700/70" />
              </div>
            </div>
          ) : (
            <div className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center justify-between gap-3">
                <span>{t('insights.currentStreak')}</span>
                <span className="font-semibold text-midnight dark:text-slate-200">
                  {t('insights.day', { count: summary.currentStreak })}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>{t('insights.longestStreak')}</span>
                <span className="font-semibold text-midnight dark:text-slate-200">
                  {t('insights.day', { count: summary.longestStreak })}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>{t('insights.entriesThisWeek')}</span>
                <span className="font-semibold text-midnight dark:text-slate-200">{summary.entriesThisWeek}</span>
              </div>
            </div>
          )}
          <PromptOfTheDayCard loading={insightsLoading || promptLoading} prompt={promptOfDay} />
        </div>
      </div>
      <div className="card border border-white/70 px-6 py-6 shadow-soft dark:border-slate-700/80">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-midnight dark:text-slate-100">{t('insights.quickFilters')}</p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className="text-xs font-medium text-slate-500 transition hover:text-midnight dark:text-slate-400 dark:hover:text-slate-200"
            >
              {t('insights.clear')}
            </button>
          )}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {quickTags.map((tag) => {
            const isActive = selectedTags.includes(tag)
            return (
              <button
                key={tag}
                type="button"
                onClick={() => onToggleTag?.(tag)}
                aria-pressed={isActive}
                aria-label={t('insights.filterByTag', { tag })}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  isActive
                    ? 'bg-teal text-white shadow-soft'
                    : 'bg-slate-100/80 text-slate-600 hover:bg-white hover:text-midnight dark:bg-slate-800/80 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200'
                }`}
              >
                #{tag}
              </button>
            )
          })}
        </div>
      </div>
    </aside>
  )
}
