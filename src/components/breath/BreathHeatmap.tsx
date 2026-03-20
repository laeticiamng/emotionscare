import React from 'react';
import { BreathOrgRow } from '@/services/breathApi';

interface Props {
  data: BreathOrgRow[];
}

const colorFor = (v: number) => {
  if (v > 0.7) return 'bg-green-300';
  if (v > 0.4) return 'bg-yellow-300';
  return 'bg-red-300';
};

const BreathHeatmap: React.FC<Props> = ({ data }) => {
  const kpis = ['hrv_stress_idx','coherence_avg','mvpa_minutes','relax_pct','mindfulness_pct','mood_avg'] as const;
  return (
    <table className="min-w-full text-center text-xs" role="grid">
      <thead>
        <tr>
          <th></th>
          {data.map(row => (
            <th key={row.week}>{row.week}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {kpis.map(k => (
          <tr key={k}>
            <td className="font-medium">{k}</td>
            {data.map(row => (
              <td key={row.week + k} className={colorFor((row as any)[k])}>
                {(row as any)[k].toFixed(1)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BreathHeatmap;
