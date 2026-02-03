/**
 * SamSliders Component - Tests
 * Tests unitaires pour les sliders SAM (Self-Assessment Manikin)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { MoodEventDetail } from '@/features/mood/mood-bus';

// Mock du hook useMoodPublisher
vi.mock('@/features/mood/useMoodPublisher', () => ({
  useMoodPublisher: () => vi.fn(),
  toLevel: (value: number) => Math.min(4, Math.floor(value / 25)) as 0 | 1 | 2 | 3 | 4,
}));

// Mock scanAnalytics
vi.mock('@/lib/analytics/scanEvents', () => ({
  scanAnalytics: {
    sliderAdjusted: vi.fn(),
    feedbackShown: vi.fn(),
  },
}));

import SamSliders from '../SamSliders';

describe('SamSliders', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the component with default values', () => {
    render(<SamSliders />);

    expect(screen.getByText('Réglage émotionnel')).toBeInTheDocument();
    expect(screen.getByText('Comment vous sentez-vous ?')).toBeInTheDocument();
    expect(screen.getByText("Quel est votre niveau d'énergie ?")).toBeInTheDocument();
  });

  it('renders valence hints', () => {
    render(<SamSliders />);

    expect(screen.getByText('😔 Négatif')).toBeInTheDocument();
    expect(screen.getByText('🙂 Positif')).toBeInTheDocument();
  });

  it('renders arousal hints', () => {
    render(<SamSliders />);

    expect(screen.getByText('😴 Calme')).toBeInTheDocument();
    expect(screen.getByText('⚡ Énergique')).toBeInTheDocument();
  });

  it('displays neutral state by default', () => {
    render(<SamSliders />);

    expect(screen.getByText('État neutre')).toBeInTheDocument();
    expect(screen.getByText('État modéré')).toBeInTheDocument();
  });

  it('has accessible aria labels for sliders', () => {
    render(<SamSliders />);

    expect(screen.getByLabelText('Ressenti émotionnel')).toBeInTheDocument();
    expect(screen.getByLabelText("Niveau d'énergie")).toBeInTheDocument();
  });

  it('updates when receiving detail prop', () => {
    const detail: MoodEventDetail = {
      source: 'scan_sliders',
      valence: 80,
      arousal: 20,
      valenceLevel: 3,
      arousalLevel: 1,
      quadrant: 'HVAL_LAROUS',
      summary: 'Test',
      ts: new Date().toISOString(),
    };

    render(<SamSliders detail={detail} />);

    // Component should render without errors with the detail
    expect(screen.getByText('Réglage émotionnel')).toBeInTheDocument();
  });

  it('displays summary in live region', () => {
    render(<SamSliders summary="Vous êtes calme et positif" />);

    // The summary is in a sr-only element for screen readers
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});

describe('SamSliders - Accessibility', () => {
  it('has proper aria-describedby for valence hints', () => {
    render(<SamSliders />);

    const valenceSlider = screen.getByLabelText('Ressenti émotionnel');
    expect(valenceSlider).toHaveAttribute('aria-describedby', 'sam-valence-hints');
  });

  it('has proper aria-describedby for arousal hints', () => {
    render(<SamSliders />);

    const arousalSlider = screen.getByLabelText("Niveau d'énergie");
    expect(arousalSlider).toHaveAttribute('aria-describedby', 'sam-arousal-hints');
  });

  it('renders live region for screen reader announcements', () => {
    render(<SamSliders />);

    const liveRegion = screen.getByRole('status');
    expect(liveRegion).toHaveAttribute('aria-live', 'polite');
    expect(liveRegion).toHaveClass('sr-only');
  });
});

describe('SamSliders - Descriptors', () => {
  it('displays correct valence descriptors based on value', () => {
    // Default value is 50% = neutral
    render(<SamSliders />);
    
    expect(screen.getByText('État neutre')).toBeInTheDocument();
    expect(screen.getByText('Ni positif ni négatif')).toBeInTheDocument();
  });

  it('displays correct arousal descriptors based on value', () => {
    // Default value is 50% = moderate
    render(<SamSliders />);
    
    expect(screen.getByText('État modéré')).toBeInTheDocument();
    expect(screen.getByText('Ni tendu ni calme')).toBeInTheDocument();
  });
});

describe('SamSliders - Visual Feedback', () => {
  it('has proper styling classes', () => {
    const { container } = render(<SamSliders />);

    const section = container.querySelector('section');
    expect(section).toHaveClass('rounded-3xl');
    expect(section).toHaveClass('backdrop-blur');
  });
});
