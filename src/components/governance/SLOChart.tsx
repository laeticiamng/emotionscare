/**
 * SLOChart — petit sparkline pour visualiser une série SLO.
 * @module components/governance/SLOChart
 */
import { LineChart, Line, ResponsiveContainer, Tooltip, YAxis, XAxis } from 'recharts';
import type { ModuleSLOSnapshot } from '@/lib/governance/sloEngine';
import type { SLOMetricType } from '@/lib/governance/types';

interface SLOChartProps {
  series: ModuleSLOSnapshot['series'];
  metric: SLOMetricType;
  color?: string;
  unit?: string;
  height?: number;
}

export function SLOChart({ series, metric, color = 'hsl(var(--primary))', unit, height = 80 }: SLOChartProps) {
  const data = series[metric].map((d) => ({
    ts: new Date(d.ts).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    value: d.value,
  }));

  if (data.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-xs text-muted-foreground"
        style={{ height }}
      >
        Aucune donnée
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
        <XAxis dataKey="ts" hide />
        <YAxis hide domain={['auto', 'auto']} />
        <Tooltip
          contentStyle={{
            background: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            fontSize: 12,
          }}
          formatter={(v: number) => [`${v}${unit ?? ''}`, metric]}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default SLOChart;
