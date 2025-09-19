import { forwardRef, useMemo } from 'react';
import type { ForwardedRef } from 'react';
import { BarChart, Bar, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import type { WeeklySessionPoint } from '@/services/scores/dataApi';
import { useMotionPrefs } from '@/hooks/useMotionPrefs';

const palette = ['#818cf8', '#34d399', '#fbbf24', '#f472b6', '#38bdf8', '#fb7185'];

export interface SessionsWeeklyChartProps {
  rows: WeeklySessionPoint[];
  descriptionId: string;
  titleId: string;
}

export const SessionsWeeklyChart = forwardRef<HTMLDivElement, SessionsWeeklyChartProps>(
  function SessionsWeeklyChart({ rows, descriptionId, titleId }, ref: ForwardedRef<HTMLDivElement>) {
    const { shouldAnimate } = useMotionPrefs();

    const keys = useMemo(() => {
      if (!rows?.length) {
        return [] as string[];
      }
      const unique = new Set<string>();
      rows.forEach(row => {
        Object.keys(row).forEach(key => {
          if (key !== 'week' && typeof row[key] === 'number') {
            unique.add(key);
          }
        });
      });
      return Array.from(unique).sort();
    }, [rows]);

    const chartData = useMemo(() => {
      return rows.map(row => ({
        ...row,
        weekLabel: row.week.replace('W', 'S'),
      }));
    }, [rows]);

    return (
      <figure
        ref={ref}
        data-testid="scores-sessions-chart"
        role="img"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="space-y-3"
      >
        <div className="h-64 w-full rounded-lg border border-border bg-card p-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 12, right: 16, left: 8, bottom: 0 }}>
              <XAxis dataKey="weekLabel" stroke="currentColor" tickLine={false} axisLine={false} interval={0} />
              <YAxis allowDecimals={false} stroke="currentColor" tickLine={false} width={32} />
              <Tooltip cursor={{ fill: 'rgba(148, 163, 184, 0.18)' }} />
              <Legend wrapperStyle={{ fontSize: '0.75rem' }} />
              {keys.map((key, index) => (
                <Bar
                  key={key}
                  dataKey={key}
                  stackId="sessions"
                  fill={palette[index % palette.length]}
                  isAnimationActive={shouldAnimate}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </figure>
    );
  },
);

export default SessionsWeeklyChart;
