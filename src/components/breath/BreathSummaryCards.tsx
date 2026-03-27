// @ts-nocheck
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BreathRow } from '@/services/breathApi';

interface Props {
  data: BreathRow | null;
  locale?: string;
}

const labels = {
  hrvStress: 'HRV-Stress',
  coherence: 'Coherence',
  mvpa: 'MVPA',
  relax: 'Relax',
  mindfulness: 'Mindfulness',
  mood: 'Mood',
};

const BreathSummaryCards: React.FC<Props> = ({ data, locale = 'en-US' }) => {
  const nf = new Intl.NumberFormat(locale);
  const cards = [
    { key: 'hrv_stress_idx', label: labels.hrvStress },
    { key: 'coherence_avg', label: labels.coherence },
    { key: 'mvpa_minutes', label: labels.mvpa },
    { key: 'relax_pct', label: labels.relax },
    { key: 'mindfulness_pct', label: labels.mindfulness },
    { key: 'mood_avg', label: labels.mood },
  ] as const;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {cards.map(c => (
        <Card role="article" key={c.key} className="text-center">
          <CardHeader>
            <CardTitle className="text-sm">{c.label}</CardTitle>
          </CardHeader>
          <CardContent>
            {data && (
              <div className="text-2xl font-bold" data-testid={`value-${c.key}`}>
                {nf.format((data as any)[c.key])}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BreathSummaryCards;
