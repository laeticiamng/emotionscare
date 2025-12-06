'use client';

import clsx from 'clsx';
interface HeatmapCardProps {
  instrument: string;
  summary: string;
  tone?: 'calm' | 'energized' | 'fatigue' | 'tense' | 'mixed' | 'watchful' | 'neutral';
  onClick?: () => void;
  describedBy?: string;
}

const TONE_STYLES: Record<NonNullable<HeatmapCardProps['tone']>, { background: string; border: string; text: string; hover: string }> = {
  calm: {
    background: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-900',
    hover: 'hover:bg-emerald-100 focus-visible:bg-emerald-100',
  },
  energized: {
    background: 'bg-sky-50',
    border: 'border-sky-200',
    text: 'text-sky-900',
    hover: 'hover:bg-sky-100 focus-visible:bg-sky-100',
  },
  fatigue: {
    background: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-900',
    hover: 'hover:bg-amber-100 focus-visible:bg-amber-100',
  },
  tense: {
    background: 'bg-rose-50',
    border: 'border-rose-200',
    text: 'text-rose-900',
    hover: 'hover:bg-rose-100 focus-visible:bg-rose-100',
  },
  mixed: {
    background: 'bg-indigo-50',
    border: 'border-indigo-200',
    text: 'text-indigo-900',
    hover: 'hover:bg-indigo-100 focus-visible:bg-indigo-100',
  },
  watchful: {
    background: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-900',
    hover: 'hover:bg-purple-100 focus-visible:bg-purple-100',
  },
  neutral: {
    background: 'bg-slate-50',
    border: 'border-slate-200',
    text: 'text-slate-900',
    hover: 'hover:bg-slate-100 focus-visible:bg-slate-100',
  },
};

export function HeatmapCard({ instrument, summary, tone = 'neutral', onClick, describedBy }: HeatmapCardProps) {
  const styles = TONE_STYLES[tone];

  return (
    <button
      type="button"
      onClick={onClick}
      aria-describedby={describedBy}
      className={clsx(
        'flex h-full w-full flex-col justify-between rounded-xl border p-4 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900',
        styles.background,
        styles.border,
        styles.text,
        styles.hover,
        onClick ? 'cursor-pointer' : 'cursor-default',
      )}
      data-testid="heatmap-card"
      aria-label={`Synthèse ${instrument}`}
    >
      <p className="text-sm font-semibold leading-snug">{summary}</p>
    </button>
  );
}

export default HeatmapCard;
