import { forwardRef, useId, useMemo } from 'react';
import type { ForwardedRef } from 'react';
import { Area, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import type { MoodVerbalPoint } from './verbalizers';
import { getMoodToneColor } from './verbalizers';
import { useMotionPrefs } from '@/hooks/useMotionPrefs';

export interface Mood30dChartProps {
  series: MoodVerbalPoint[];
  descriptionId: string;
  titleId: string;
}

export const Mood30dChart = forwardRef<HTMLDivElement, Mood30dChartProps>(function Mood30dChart(
  { series, descriptionId, titleId },
  ref: ForwardedRef<HTMLDivElement>,
) {
  const { shouldAnimate } = useMotionPrefs();
  const gradientId = useId();

  const chartData = useMemo<ChartMoodPoint[]>(() => {
    if (!Array.isArray(series)) {
      return [];
    }
    return series.map(point => ({
      ...point,
      color: getMoodToneColor(point.toneId),
    }));
  }, [series]);

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
          <ComposedChart data={chartData} margin={{ top: 12, right: 8, left: 8, bottom: 0 }}>
            <defs>
              <linearGradient id={`${gradientId}-fill`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.45} />
                <stop offset="50%" stopColor="#4ade80" stopOpacity={0.38} />
                <stop offset="100%" stopColor="#fb7185" stopOpacity={0.32} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="dayLabel"
              stroke="currentColor"
              tickLine={false}
              axisLine={false}
              interval={3}
              minTickGap={24}
            />
            <YAxis domain={[0.5, 5.5]} hide allowDataOverflow />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<MoodTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="transparent"
              fill={`url(#${gradientId}-fill)`}
              isAnimationActive={shouldAnimate}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#475569"
              strokeWidth={1.5}
              dot={<MoodDot />}
              activeDot={<MoodActiveDot />}
              isAnimationActive={shouldAnimate}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </figure>
  );
});

interface ChartMoodPoint extends MoodVerbalPoint {
  color: string;
}

interface MoodDotProps {
  cx?: number;
  cy?: number;
  payload?: ChartMoodPoint;
}

function MoodDot({ cx, cy, payload }: MoodDotProps) {
  if (typeof cx !== 'number' || typeof cy !== 'number' || !payload) {
    return null;
  }
  return (
    <circle
      cx={cx}
      cy={cy}
      r={4}
      stroke="#ffffff"
      strokeWidth={1}
      fill={payload.color}
      aria-hidden="true"
    />
  );
}

function MoodActiveDot({ cx, cy, payload }: MoodDotProps) {
  if (typeof cx !== 'number' || typeof cy !== 'number' || !payload) {
    return null;
  }
  return (
    <g aria-hidden="true">
      <circle cx={cx} cy={cy} r={6} fill={payload.color} opacity={0.28} />
      <circle cx={cx} cy={cy} r={4} stroke="#ffffff" strokeWidth={1} fill={payload.color} />
    </g>
  );
}

function MoodTooltip({ active, payload }: any) {
  if (!active || !payload?.length) {
    return null;
  }
  const datum = payload[0]?.payload as ChartMoodPoint | undefined;
  if (!datum) {
    return null;
  }

  return (
    <div className="rounded-md border border-slate-200 bg-white/95 p-3 text-sm text-slate-700 shadow-lg">
      <p className="font-medium">{capitalize(datum.longLabel)}</p>
      <p className="mt-1">
        {capitalize(datum.toneLabel)} · {datum.nuance}
      </p>
    </div>
  );
}

function capitalize(value: string) {
  if (!value) {
    return value;
  }
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default Mood30dChart;
