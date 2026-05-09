import { useMemo } from 'react';
import { signOut } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { auth } from '../../../config/firebase.js';
import { useAuth } from '../../../context/useAuth.js';
import { useMoods } from '../../../context/useMoods.js';
import AppHeader from '../../dashboard/components/AppHeader.jsx';
import { resolveEntryTimestamp } from '../../insights/utils/dateKeys.js';

export default function GalleryPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { entries, loading } = useMoods();

  const imageEntries = useMemo(() => {
    const withImages = entries.filter((e) => Boolean(e.imageData));
    return [...withImages].sort((a, b) => {
      const tb = resolveEntryTimestamp(b);
      const ta = resolveEntryTimestamp(a);
      return new Date(tb || 0) - new Date(ta || 0);
    });
  }, [entries]);

  return (
    <div className="page-shell min-h-screen">
      <AppHeader user={user} totalEntries={entries.length} onSignOut={() => signOut(auth)} />

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-teal transition hover:text-teal/80 dark:text-teal-300 dark:hover:text-teal-200"
        >
          {t('gallery.back')}
        </Link>

        <header className="mt-8">
          <p className="text-[11px] uppercase tracking-[0.35em] text-slate-400 dark:text-slate-500">{t('gallery.eyebrow')}</p>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-midnight dark:text-slate-100">{t('gallery.title')}</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400">{t('gallery.subtitle')}</p>
            </div>
            {!loading && imageEntries.length > 0 && (
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {t('gallery.stat', { count: imageEntries.length })}
              </p>
            )}
          </div>
        </header>

        <section className="mt-10">
          {loading ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('gallery.loading')}</p>
          ) : imageEntries.length === 0 ? (
            <div className="card border border-dashed border-neutral/70 px-8 py-12 text-center dark:border-slate-600">
              <p className="font-medium text-midnight dark:text-slate-100">{t('gallery.emptyTitle')}</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{t('gallery.emptyBody')}</p>
            </div>
          ) : (
            <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
              {imageEntries.map((entry) => (
                <article key={entry.id} className="mb-4 break-inside-avoid">
                  <a
                    href={entry.imageData}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block overflow-hidden rounded-2xl border border-white/70 bg-white/40 shadow-soft ring-teal/0 transition hover:ring-2 hover:ring-teal/40 dark:border-slate-700/80 dark:bg-slate-900/40"
                    aria-label={t('gallery.openAria')}
                  >
                    <img
                      src={entry.imageData}
                      alt=""
                      className="w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                      loading="lazy"
                    />
                  </a>
                  <div className="mt-2 flex flex-wrap items-center gap-2 px-0.5 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-semibold text-midnight dark:text-slate-200">{entry.moodLabel}</span>
                    {entry.tags?.length > 0 && (
                      <span className="truncate">
                        {entry.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="mr-1 text-slate-400">
                            #{tag}
                          </span>
                        ))}
                      </span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
