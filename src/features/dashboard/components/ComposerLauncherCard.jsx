import { useTranslation } from 'react-i18next'

export default function ComposerLauncherCard({ onOpenComposer }) {
  const { t } = useTranslation()
  return (
    <div className="card flex items-center gap-3 border border-white/70 px-6 py-5 shadow-soft dark:border-slate-700/80">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-teal/15 text-2xl dark:bg-teal/25">🙂</span>
      <button
        type="button"
        onClick={onOpenComposer}
        className="flex-1 rounded-full border border-neutral/60 bg-white/70 px-4 py-3 text-left text-sm text-slate-500 transition hover:border-teal hover:bg-white hover:text-midnight dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
        aria-label={t('composer.openComposerAria')}
      >
        {t('composer.placeholder')}
      </button>
      <button
        type="button"
        onClick={onOpenComposer}
        className="btn btn-primary hidden sm:inline-flex"
        aria-label={t('composer.shareUpdateAria')}
      >
        {t('composer.shareUpdate')}
      </button>
    </div>
  )
}
