import { useMemo, useState } from 'react';
import { getMoodById } from '../../../constants/moods.js';
import { buildHeatmapMatrix } from '../utils/heatmapData.js';

const LEVEL_CLASS = [
  'bg-slate-200/90 dark:bg-slate-800',
  'bg-teal/25 dark:bg-teal/35',
  'bg-teal/45 dark:bg-teal/55',
  'bg-teal/65 dark:bg-teal/75',
  'bg-teal dark:bg-teal',
];

function cellClass(cell) {
  if (cell.isFuture) return 'bg-slate-100/50 dark:bg-slate-900/40';
  if (cell.count <= 0) return LEVEL_CLASS[0];
  return LEVEL_CLASS[Math.min(cell.level, 4)] ?? LEVEL_CLASS[0];
}

export default function MoodHeatmap({ entries, numWeeks = 26 }) {
  const { weeks, maxCount, rowLabels } = useMemo(
    () => buildHeatmapMatrix(entries, numWeeks),
    [entries, numWeeks],
  );

  const [tip, setTip] = useState(null);

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex min-w-max gap-3">
        <div className="flex flex-col justify-around pt-6 text-[10px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
          {rowLabels.map((label) => (
            <div key={label} className="flex h-3 items-center">
              {label}
            </div>
          ))}
        </div>

        <div
          className="grid gap-1"
          style={{
            gridTemplateColumns: `repeat(${weeks.length}, minmax(0.65rem, 0.85rem))`,
            gridTemplateRows: 'repeat(7, minmax(0.65rem, 0.85rem))',
          }}
          onMouseLeave={() => setTip(null)}
        >
          {weeks.flatMap((week, colIdx) =>
            week.cells.map((cell, rowIdx) => {
              const formatted = cell.date.toLocaleDateString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              });
              const moodLabel = cell.dominantMoodId ? getMoodById(cell.dominantMoodId)?.label : null;

              return (
                <button
                  key={`${cell.dayKey}-${colIdx}-${rowIdx}`}
                  type="button"
                  disabled={cell.isFuture}
                  aria-label={
                    cell.isFuture
                      ? 'Future day'
                      : `${formatted}, ${cell.count} ${cell.count === 1 ? 'entry' : 'entries'}`
                  }
                  style={{
                    gridColumn: colIdx + 1,
                    gridRow: rowIdx + 1,
                  }}
                  className={`rounded-sm outline-none ring-teal/40 transition hover:ring-2 focus-visible:ring-2 disabled:cursor-default ${cellClass(cell)}`}
                  onMouseEnter={() =>
                    !cell.isFuture &&
                    setTip({
                      label: formatted,
                      count: cell.count,
                      moodLabel,
                    })
                  }
                  onFocus={() =>
                    !cell.isFuture &&
                    setTip({
                      label: formatted,
                      count: cell.count,
                      moodLabel,
                    })
                  }
                />
              );
            }),
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
        <span>
          Max in range:{' '}
          <strong className="text-midnight dark:text-slate-200">{maxCount}</strong> entries in one day
        </span>
        <div className="flex items-center gap-2">
          <span>Less</span>
          <div className="flex gap-0.5">
            {LEVEL_CLASS.map((cls, i) => (
              <span key={i} className={`h-3 w-3 rounded-sm ${cls}`} aria-hidden />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>

      {tip && (
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300" role="status">
          <span className="font-medium text-midnight dark:text-slate-100">{tip.label}</span>
          {' — '}
          {tip.count === 0 ? 'No entries' : `${tip.count} ${tip.count === 1 ? 'entry' : 'entries'}`}
          {tip.moodLabel ? ` · ${tip.moodLabel}` : ''}
        </p>
      )}
    </div>
  );
}
