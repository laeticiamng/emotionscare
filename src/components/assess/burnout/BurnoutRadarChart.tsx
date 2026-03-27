// @ts-nocheck
import React from 'react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Legend
} from 'recharts';
import { MBIResult, HEALTHCARE_NORMS, MBI_THRESHOLDS } from './MBIQuestions';

interface Props {
  result: MBIResult;
}

const LEVEL_COLORS = {
  low: 'hsl(142 71% 45%)',
  moderate: 'hsl(45 93% 47%)',
  high: 'hsl(0 84% 60%)',
};

export const BurnoutRadarChart: React.FC<Props> = ({ result }) => {
  // Normalize scores to 0-100 for radar display
  const maxEE = 54; // 9 items × 6
  const maxDP = 30; // 5 items × 6
  const maxPA = 48; // 8 items × 6

  const data = [
    {
      subscale: 'Épuisement\nÉmotionnel',
      score: Math.round((result.EE.score / maxEE) * 100),
      norm: Math.round((HEALTHCARE_NORMS.EE.mean / maxEE) * 100),
      fullMark: 100,
    },
    {
      subscale: 'Dépersonnalisation',
      score: Math.round((result.DP.score / maxDP) * 100),
      norm: Math.round((HEALTHCARE_NORMS.DP.mean / maxDP) * 100),
      fullMark: 100,
    },
    {
      subscale: 'Accomplissement\nPersonnel (inv.)',
      // For PA, invert: high PA = low burnout, so show (max - score) as burnout indicator
      score: Math.round(((maxPA - result.PA.score) / maxPA) * 100),
      norm: Math.round(((maxPA - HEALTHCARE_NORMS.PA.mean) / maxPA) * 100),
      fullMark: 100,
    },
  ];

  return (
    <div className="w-full" role="img" aria-label="Graphique radar des résultats MBI-HSS">
      <ResponsiveContainer width="100%" height={350}>
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
          <PolarGrid stroke="hsl(var(--border))" />
          <PolarAngleAxis
            dataKey="subscale"
            tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
          />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
          <Radar
            name="Vos scores"
            dataKey="score"
            stroke={LEVEL_COLORS[result.overallRisk]}
            fill={LEVEL_COLORS[result.overallRisk]}
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Radar
            name="Norme soignants"
            dataKey="norm"
            stroke="hsl(var(--muted-foreground))"
            fill="hsl(var(--muted-foreground))"
            fillOpacity={0.1}
            strokeDasharray="5 5"
          />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
