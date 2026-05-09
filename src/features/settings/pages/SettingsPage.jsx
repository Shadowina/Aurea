import { deleteUser, reload, signOut, updateProfile } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import ConfirmDialog from '../../../components/ConfirmDialog.jsx';
import { auth } from '../../../config/firebase.js';
import { useAuth } from '../../../context/useAuth.js';
import { useMoods } from '../../../context/useMoods.js';
import { useTheme } from '../../../context/useTheme.js';
import { useNotificationPrefs } from '../../../hooks/useNotificationPrefs.js';
import AppHeader from '../../dashboard/components/AppHeader.jsx';

export default function SettingsPage() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { entries } = useMoods();
  const { theme, setTheme } = useTheme();
  const { prefs, setPrefs } = useNotificationPrefs();

  const [displayName, setDisplayName] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileFeedback, setProfileFeedback] = useState(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    setDisplayName(user?.displayName ?? '');
  }, [user?.displayName, user?.uid]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!user) return;
    setProfileFeedback(null);
    setProfileSaving(true);
    try {
      await updateProfile(user, { displayName: displayName.trim() });
      await reload(user);
      setProfileFeedback({ type: 'ok', text: t('settings.profileUpdated') });
    } catch {
      setProfileFeedback({ type: 'err', text: t('settings.profileError') });
    } finally {
      setProfileSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!user) return;
    setDeleteError('');
    setDeleteBusy(true);
    try {
      await deleteUser(user);
      setDeleteOpen(false);
    } catch (err) {
      if (err?.code === 'auth/requires-recent-login') {
        setDeleteError(t('settings.deleteReauth'));
      } else {
        setDeleteError(err?.message ?? t('settings.deleteError'));
      }
    } finally {
      setDeleteBusy(false);
    }
  };

  const langBtn = (code, label) => (
    <button
      type="button"
      onClick={() => i18n.changeLanguage(code)}
      className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
        i18n.language === code
          ? 'bg-teal text-white shadow-soft'
          : 'text-slate-600 hover:text-midnight dark:text-slate-400 dark:hover:text-slate-100'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="page-shell">
      <AppHeader user={user} totalEntries={entries.length} onSignOut={() => signOut(auth)} />

      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-teal transition hover:text-teal/80 dark:text-teal-300 dark:hover:text-teal-200"
        >
          {t('settings.back')}
        </Link>

        <h1 className="mt-8 text-2xl font-semibold text-midnight dark:text-slate-100">{t('settings.title')}</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{t('settings.subtitle')}</p>

        <section className="card mt-8 border border-white/70 px-6 py-6 shadow-soft dark:border-slate-700/80">
          <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">{t('settings.language')}</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{t('settings.languageHint')}</p>
          <div className="mt-4 flex flex-wrap gap-2 rounded-full border border-neutral/60 bg-white/70 p-1 dark:border-slate-600 dark:bg-slate-900/80">
            {langBtn('en', t('settings.langEn'))}
            {langBtn('fr', t('settings.langFr'))}
            {langBtn('es', t('settings.langEs'))}
          </div>
        </section>

        <section className="card mt-6 border border-white/70 px-6 py-6 shadow-soft dark:border-slate-700/80">
          <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">{t('settings.appearance')}</h2>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium text-midnight dark:text-slate-100">{t('settings.theme')}</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{t('settings.themeHint')}</p>
            </div>
            <div className="flex rounded-full border border-neutral/60 bg-white/70 p-1 dark:border-slate-600 dark:bg-slate-900/80">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                  theme === 'light'
                    ? 'bg-teal text-white shadow-soft'
                    : 'text-slate-600 hover:text-midnight dark:text-slate-400 dark:hover:text-slate-100'
                }`}
              >
                {t('settings.light')}
              </button>
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                  theme === 'dark'
                    ? 'bg-teal text-white shadow-soft'
                    : 'text-slate-600 hover:text-midnight dark:text-slate-400 dark:hover:text-slate-100'
                }`}
              >
                {t('settings.dark')}
              </button>
            </div>
          </div>
        </section>

        <section className="card mt-6 border border-white/70 px-6 py-6 shadow-soft dark:border-slate-700/80">
          <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">{t('settings.profile')}</h2>
          <form onSubmit={handleSaveProfile} className="mt-4 space-y-4">
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-midnight dark:text-slate-200">
                {t('settings.displayName')}
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                autoComplete="nickname"
                className="mt-2 w-full rounded-xl border border-neutral/60 bg-white/70 px-4 py-3 text-sm text-midnight placeholder:text-slate-400 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20 dark:border-slate-600 dark:bg-slate-900/60 dark:text-slate-100"
                placeholder={user?.email ?? ''}
              />
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">{t('settings.displayNameHint')}</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">{t('settings.signInProviderNote')}</p>
            </div>
            {profileFeedback && (
              <p className={`text-sm ${profileFeedback.type === 'ok' ? 'text-teal dark:text-teal-300' : 'text-peach'}`}>
                {profileFeedback.text}
              </p>
            )}
            <button
              type="submit"
              disabled={profileSaving || !user}
              className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              {profileSaving ? t('settings.saving') : t('settings.saveProfile')}
            </button>
          </form>
        </section>

        <section className="card mt-6 border border-white/70 px-6 py-6 shadow-soft dark:border-slate-700/80">
          <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">{t('settings.notifications')}</h2>
          <div className="mt-4 space-y-4">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border border-neutral text-teal focus:ring-teal/40 dark:border-slate-600"
                checked={prefs.dailyReminder}
                onChange={(e) => setPrefs({ dailyReminder: e.target.checked })}
              />
              <span>
                <span className="font-medium text-midnight dark:text-slate-100">{t('settings.dailyReminder')}</span>
                <span className="mt-1 block text-sm text-slate-600 dark:text-slate-400">{t('settings.dailyReminderHint')}</span>
              </span>
            </label>
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border border-neutral text-teal focus:ring-teal/40 dark:border-slate-600"
                checked={prefs.weeklyDigest}
                onChange={(e) => setPrefs({ weeklyDigest: e.target.checked })}
              />
              <span>
                <span className="font-medium text-midnight dark:text-slate-100">{t('settings.weeklyDigest')}</span>
                <span className="mt-1 block text-sm text-slate-600 dark:text-slate-400">{t('settings.weeklyDigestHint')}</span>
              </span>
            </label>
          </div>
        </section>

        <section className="card mt-6 border border-white/70 px-6 py-6 shadow-soft dark:border-slate-700/80">
          <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">{t('settings.account')}</h2>
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
            <span className="font-medium text-midnight dark:text-slate-100">{t('settings.signedInAs')} </span>
            {user?.email ?? t('common.unknown')}
          </p>
        </section>

        <section className="card mt-6 border border-white/70 px-6 py-6 shadow-soft dark:border-slate-700/80">
          <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">{t('settings.editingEntries')}</h2>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            <Trans
              i18nKey="settings.editingEntriesBody"
              components={{
                1: <strong className="text-midnight dark:text-slate-200" />,
              }}
            />
          </p>
        </section>

        <section className="card mt-6 border border-peach/30 bg-peach/5 px-6 py-6 shadow-soft dark:border-peach/20 dark:bg-peach/10">
          <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">{t('settings.dangerZone')}</h2>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">{t('settings.deleteAccountHint')}</p>
          {deleteError && <p className="mt-3 text-sm text-peach">{deleteError}</p>}
          <button
            type="button"
            onClick={() => {
              setDeleteError('');
              setDeleteOpen(true);
            }}
            className="mt-4 rounded-full border border-peach/60 bg-white/80 px-4 py-2 text-sm font-semibold text-peach transition hover:bg-peach/10 dark:bg-slate-900/80 dark:hover:bg-peach/20"
          >
            {t('settings.deleteAccount')}
          </button>
        </section>
      </main>

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => !deleteBusy && setDeleteOpen(false)}
        title={t('settings.deleteTitle')}
        message={t('settings.deleteMessage')}
        confirmLabel={t('settings.deleteConfirm')}
        cancelLabel={t('settings.deleteCancel')}
        variant="danger"
        confirmBusy={deleteBusy}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
