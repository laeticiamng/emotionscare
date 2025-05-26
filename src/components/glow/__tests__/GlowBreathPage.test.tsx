
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import GlowBreathPage from '@/pages/GlowBreathPage';

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

describe('GlowBreathPage', () => {
  it('renders KPIs after fetch', async () => {
    renderWithRouter(<GlowBreathPage />);
    
    expect(screen.getByText(/mon souffle/i)).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText(/décompression/i)).toBeVisible();
      expect(screen.getByText(/breathe sync/i)).toBeVisible();
      expect(screen.getByText(/move/i)).toBeVisible();
      expect(screen.getByText(/zen drop/i)).toBeVisible();
    });
  });

  it('shows call to action button', async () => {
    renderWithRouter(<GlowBreathPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/nouvelle pause glow/i)).toBeVisible();
    });
  });
});
