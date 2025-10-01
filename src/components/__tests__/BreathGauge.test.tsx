// @ts-nocheck
import { render, screen } from '@/tests/utils';
import { describe, it, expect } from 'vitest';
import BreathGauge from '../BreathGauge';

describe('BreathGauge', () => {
  it('passe au vert si coherence true', () => {
    render(<BreathGauge coherence={true} />);
    const gauge = screen.getByRole('presentation');
    expect(gauge.className).toContain('border-green-400');
  });
});
