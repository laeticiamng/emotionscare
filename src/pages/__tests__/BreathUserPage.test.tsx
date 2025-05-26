import { screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { render } from '@/tests/utils';
import { GlobalInterceptor } from '@/utils/globalInterceptor';
import BreathUserPage from '../BreathUserPage';

const mockRows = [
  { week: '2024-01', hrv_stress_idx: 1, coherence_avg: 2, mvpa_minutes: 3, relax_pct: 4, mindfulness_pct: 5, mood_avg: 6 },
];

vi.mock('@/utils/globalInterceptor');

describe('BreathUserPage', () => {
  it('renders 6 KPI cards with data', async () => {
    vi.mocked(GlobalInterceptor.secureFetch).mockResolvedValue({
      ok: true,
      json: async () => ({ data: mockRows }),
    } as any);

    render(<BreathUserPage />);
    expect(await screen.findByText(/HRV-Stress/i)).toBeVisible();
    expect(screen.getAllByRole('article')).toHaveLength(6);
  });
});
