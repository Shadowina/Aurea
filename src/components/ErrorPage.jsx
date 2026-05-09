import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function ErrorPage({ error, onReset }) {
  const { t } = useTranslation();
  const showDetails = import.meta.env.DEV && error?.message;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-white px-4 py-16 dark:from-slate-950 dark:to-slate-900">
      <div className="card w-full max-w-lg border border-peach/30 bg-white/95 px-8 py-10 text-center shadow-xl dark:border-peach/20 dark:bg-slate-900/95">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-peach/15 text-3xl dark:bg-peach/10">
          <span aria-hidden="true">⚠️</span>
        </div>
        <h1 className="text-2xl font-semibold text-midnight dark:text-slate-100">{t('errorPage.title')}</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{t('errorPage.description')}</p>

        {showDetails && (
          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-xs font-medium text-slate-500 dark:text-slate-400">{t('errorPage.details')}</summary>
            <pre className="mt-2 max-h-32 overflow-auto rounded-lg bg-slate-100 p-3 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {error.message}
            </pre>
          </details>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button type="button" onClick={onReset} className="btn btn-primary">
            {t('errorPage.retry')}
          </button>
          <Link to="/" className="btn border border-neutral/60 bg-white/80 text-midnight hover:bg-white dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700">
            {t('errorPage.goHome')}
          </Link>
        </div>
      </div>
    </div>
  );
}
