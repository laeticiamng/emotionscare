import { forwardRef, useMemo } from 'react';
import type { ForwardedRef } from 'react';
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts';

import { smooth, type MoodPoint } from '@/services/scores/dataApi';
import { useMotionPrefs } from '@/hooks/useMotionPrefs';

const dateFormatter = new Intl.DateTimeFormat('fr-FR', { month: 'short', day: 'numeric' });

export interface Mood30dChartProps {
  points: MoodPoint[];
  descriptionId: string;
  titleId: string;
}

export const Mood30dChart = forwardRef<HTMLDivElement, Mood30dChartProps>(function Mood30dChart(
  { points, descriptionId, titleId },
  ref: ForwardedRef<HTMLDivElement>,
) {
  const { shouldAnimate } = useMotionPrefs();

  const chartData = useMemo(() => {
    if (points.length === 0) {
      return [];
    }
    const valenceSeries = smooth(points.map(point => point.valence));
    const arousalSeries = smooth(points.map(point => point.arousal));
    return points.map((point, index) => ({
      date: dateFormatter.format(new Date(point.date)),
      Valence: Number.isFinite(valenceSeries[index]) ? valenceSeries[index] : undefined,
      Arousal: Number.isFinite(arousalSeries[index]) ? arousalSeries[index] : undefined,
    }));
  }, [points]);

  return (
    <figure
      ref={ref}
      data-testid="scores-mood-chart"
      role="img"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      className="space-y-3"
    >
      <div className="h-72 w-full rounded-lg border border-border bg-card p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 12, right: 16, left: 8, bottom: 0 }}>
            <XAxis dataKey="date" stroke="currentColor" tickLine={false} axisLine={false} interval={4} minTickGap={32} />
            <YAxis domain={[-1, 1]} stroke="currentColor" tickLine={false} width={40} allowDataOverflow />
            <Legend formatter={value => (value === 'Valence' ? 'Valence' : 'Énergie')} />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              formatter={(value: number | undefined) => (typeof value === 'number' ? value.toFixed(2) : '—')}
              labelFormatter={label => `Jour ${label}`}
            />
            <Line
              type="monotone"
              dataKey="Valence"
              stroke="#6366f1"
              strokeWidth={2}
              dot={false}
              isAnimationActive={shouldAnimate}
            />
            <Line
              type="monotone"
              dataKey="Arousal"
              stroke="#f97316"
              strokeWidth={2}
              dot={false}
              isAnimationActive={shouldAnimate}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </figure>
  );
});

export default Mood30dChart;
