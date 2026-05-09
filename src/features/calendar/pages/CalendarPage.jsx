import { signOut } from 'firebase/auth';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { auth } from '../../../config/firebase.js';
import { useAuth } from '../../../context/useAuth.js';
import { useMoods } from '../../../context/useMoods.js';
import AppHeader from '../../dashboard/components/AppHeader.jsx';
import MoodHeatmap from '../components/MoodHeatmap.jsx';

export default function CalendarPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { entries, loading } = useMoods();

  return (
    <div className="page-shell min-h-screen">
      <AppHeader user={user} totalEntries={entries.length} onSignOut={() => signOut(auth)} />

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-teal transition hover:text-teal/80 dark:text-teal-300 dark:hover:text-teal-200"
        >
          {t('calendar.back')}
        </Link>

        <header className="mt-8">
          <p className="text-[11px] uppercase tracking-[0.35em] text-slate-400 dark:text-slate-500">{t('calendar.eyebrow')}</p>
          <h1 className="mt-2 text-3xl font-semibold text-midnight dark:text-slate-100">{t('calendar.title')}</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400">{t('calendar.subtitle')}</p>
        </header>

        <section className="card mt-10 border border-white/70 px-6 py-8 shadow-soft dark:border-slate-700/80">
          {loading ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('calendar.loading')}</p>
          ) : entries.length === 0 ? (
            <p className="text-sm text-slate-600 dark:text-slate-400">{t('calendar.empty')}</p>
          ) : (
            <MoodHeatmap entries={entries} numWeeks={26} />
          )}
        </section>
      </main>
    </div>
  );
}
