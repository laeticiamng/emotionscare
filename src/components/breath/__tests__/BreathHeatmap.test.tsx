// @ts-nocheck
import { screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { render } from '@/tests/utils';
import BreathHeatmap from '../BreathHeatmap';

const data = [
  { week: 'w1', hrv_stress_idx: 0.2, coherence_avg: 0.5, mvpa_minutes: 1, relax_pct: 0.6, mindfulness_pct: 0.7, mood_avg: 0.8, member_count: 3 },
];

describe('BreathHeatmap', () => {
  it('heat-map colors cells by threshold', () => {
    render(<BreathHeatmap data={data} />);
    const cells = screen.getAllByRole('cell');
    expect(cells[1].className).toContain('bg-red-300');
  });
});
