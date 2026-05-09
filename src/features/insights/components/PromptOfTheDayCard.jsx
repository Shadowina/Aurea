import { getMoodById } from '../../../constants/moods.js';

/**
 * @param {{ loading?: boolean, prompt?: { id: string, text: string, source: 'generic' | 'mood', moodIdUsed: string | null } | null }} props
 */
export default function PromptOfTheDayCard({ loading = false, prompt = null }) {
  if (loading) {
    return (
      <div className="mt-4 border-t border-white/60 pt-4 dark:border-slate-600/50">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Today&apos;s reflection</p>
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Finding a prompt for your day...</p>
      </div>
    );
  }

  if (!prompt) return null;

  const moodLabel = prompt.moodIdUsed ? getMoodById(prompt.moodIdUsed)?.label : null;

  return (
    <div className="mt-4 border-t border-white/60 pt-4 dark:border-slate-600/50">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Today&apos;s reflection</p>
      <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">{prompt.text}</p>
      {moodLabel && (
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          Based on your latest mood: <span className="font-medium text-midnight dark:text-slate-200">{moodLabel}</span>
        </p>
      )}
    </div>
  );
}
