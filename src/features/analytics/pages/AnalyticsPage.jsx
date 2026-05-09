import { useMemo } from 'react';
import { signOut } from 'firebase/auth';
import { useTranslation } from 'react-i18next';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { auth } from '../../../config/firebase.js';
import { useAuth } from '../../../context/useAuth.js';
import { useMoods } from '../../../context/useMoods.js';
import AppHeader from '../../dashboard/components/AppHeader.jsx';
import { computeWeeklySummary } from '../../insights/utils/weeklySummary.js';
import { buildDailyEntryCounts, buildMoodDistribution } from '../utils/chartAggregates.js';

export default function AnalyticsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { entries, loading } = useMoods();

  const pieData = useMemo(() => buildMoodDistribution(entries), [entries]);
  const barData = useMemo(() => buildDailyEntryCounts(entries, 14), [entries]);
  const weekly = useMemo(() => computeWeeklySummary(entries), [entries]);

  const empty = !loading && entries.length === 0;

  return (
    <div className="page-shell">
      <AppHeader user={user} totalEntries={entries.length} onSignOut={() => signOut(auth)} />

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-8">
        <header className="mb-10">
          <p className="text-[11px] uppercase tracking-[0.35em] text-slate-400 dark:text-slate-500">{t('analytics.insightsEyebrow')}</p>
          <h1 className="mt-2 text-3xl font-semibold text-midnight dark:text-slate-100">{t('analytics.title')}</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400">{t('analytics.subtitle')}</p>
        </header>

        {loading ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">{t('analytics.loading')}</p>
        ) : empty ? (
          <div className="card border border-dashed border-neutral/70 px-8 py-12 text-center text-slate-600 dark:border-slate-600 dark:text-slate-400">
            <p className="font-medium text-midnight dark:text-slate-100">{t('analytics.emptyTitle')}</p>
            <p className="mt-2 text-sm">{t('analytics.emptyBody')}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            <section className="grid gap-4 sm:grid-cols-3">
              <div className="card border border-white/70 px-5 py-4 shadow-soft dark:border-slate-700/80">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
                  {t('analytics.totalEntries')}
                </p>
                <p className="mt-2 text-3xl font-semibold text-midnight dark:text-slate-100">{entries.length}</p>
              </div>
              <div className="card border border-white/70 px-5 py-4 shadow-soft dark:border-slate-700/80">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
                  {t('analytics.thisWeek')}
                </p>
                <p className="mt-2 text-3xl font-semibold text-midnight dark:text-slate-100">{weekly.entriesThisWeek}</p>
              </div>
              <div className="card border border-white/70 px-5 py-4 shadow-soft dark:border-slate-700/80">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
                  {t('analytics.moodTypesLogged')}
                </p>
                <p className="mt-2 text-3xl font-semibold text-midnight dark:text-slate-100">{pieData.length}</p>
              </div>
            </section>

            <section className="card border border-white/70 px-6 py-8 shadow-soft dark:border-slate-700/80">
              <h2 className="text-lg font-semibold text-midnight dark:text-slate-100">{t('analytics.moodMix')}</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{t('analytics.moodMixHint')}</p>
              <div className="mt-6 h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      paddingAngle={2}
                      label={false}
                    >
                      {pieData.map((entry) => (
                        <Cell key={entry.moodId} fill={entry.color} stroke="#fff" strokeWidth={1} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [t('analytics.tooltipEntries', { value }), name]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="card border border-white/70 px-6 py-8 shadow-soft dark:border-slate-700/80">
              <h2 className="text-lg font-semibold text-midnight dark:text-slate-100">{t('analytics.entriesPerDay')}</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{t('analytics.entriesPerDayHint')}</p>
              <div className="mt-6 h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 11 }}
                      interval="preserveStartEnd"
                      angle={-35}
                      textAnchor="end"
                      height={70}
                    />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={32} />
                    <Tooltip
                      formatter={(value) => [t('analytics.tooltipEntries', { value }), t('analytics.tooltipCount')]}
                      labelFormatter={(_, payload) => payload?.[0]?.payload?.dayKey ?? ''}
                    />
                    <Bar dataKey="count" fill="#5ea89a" radius={[6, 6, 0, 0]} name={t('analytics.barName')} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
