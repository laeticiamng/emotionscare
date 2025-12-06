
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import B2CFlashGlowPage from '@/pages/B2CFlashGlowPage';

// Mock the store
vi.mock('@/store/useGlowBreathStore', () => ({
  useGlowBreathStore: () => ({
    weeks: [
      {
        week_start: "2025-06-02",
        glowScore: 22,
        coherence: 68,
        moveMinutes: 42,
        calmIndex: 5.3,
        mindfulScore: 2.1,
        moodScore: 0.6
      }
    ],
    loading: false,
    error: undefined,
    fetchWeeks: vi.fn()
  })
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('B2CFlashGlowPage', () => {
  it('renders KPIs after fetch', async () => {
    renderWithRouter(<B2CFlashGlowPage />);
    
    expect(screen.getByText(/mon souffle/i)).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByTestId('kpi-card-decompression')).toBeVisible();
      expect(screen.getByTestId('kpi-card-breathe-sync')).toBeVisible();
      expect(screen.getByTestId('kpi-card-move')).toBeVisible();
      expect(screen.getByTestId('kpi-card-zen-drop')).toBeVisible();
    });
  });

  it('shows call to action button', async () => {
    renderWithRouter(<B2CFlashGlowPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/nouvelle pause glow/i)).toBeVisible();
    });
  });
});
