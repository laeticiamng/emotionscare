// @ts-nocheck
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ScanOnboarding, shouldShowOnboarding } from '../ScanOnboarding';

// Mock logger
vi.mock('@/lib/logger', () => ({
  logger: {
    info: vi.fn(),
  },
}));

// Mock analytics
vi.mock('@/lib/analytics/scanEvents', () => ({
  scanAnalytics: {
    onboardingStarted: vi.fn(),
    onboardingCompleted: vi.fn(),
    onboardingSkipped: vi.fn(),
  },
}));

import { scanAnalytics } from '@/lib/analytics/scanEvents';

const ONBOARDING_STORAGE_KEY = 'scan-onboarding-completed';

describe('ScanOnboarding', () => {
  let mockOnComplete: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockOnComplete = vi.fn();
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should render first step on mount', () => {
    render(<ScanOnboarding onComplete={mockOnComplete} />);

    expect(screen.getByText('Bienvenue sur le Scanner Émotionnel')).toBeInTheDocument();
    expect(screen.getByText(/Mesurez votre état émotionnel/)).toBeInTheDocument();
    expect(screen.getByText('🎭')).toBeInTheDocument();
  });

  it('should call analytics on mount', () => {
    render(<ScanOnboarding onComplete={mockOnComplete} />);

    expect(scanAnalytics.onboardingStarted).toHaveBeenCalledTimes(1);
  });

  it('should navigate to next step', () => {
    render(<ScanOnboarding onComplete={mockOnComplete} />);

    const nextButton = screen.getByText('Suivant');
    fireEvent.click(nextButton);

    expect(screen.getByText('Valence et Arousal')).toBeInTheDocument();
  });

  it('should navigate to previous step', () => {
    render(<ScanOnboarding onComplete={mockOnComplete} />);

    // Go to step 2
    fireEvent.click(screen.getByText('Suivant'));
    expect(screen.getByText('Valence et Arousal')).toBeInTheDocument();

    // Go back to step 1
    fireEvent.click(screen.getByText('Précédent'));
    expect(screen.getByText('Bienvenue sur le Scanner Émotionnel')).toBeInTheDocument();
  });

  it('should disable previous button on first step', () => {
    render(<ScanOnboarding onComplete={mockOnComplete} />);

    const prevButton = screen.getByText('Précédent');
    expect(prevButton).toBeDisabled();
  });

  it('should show "Commencer" button on last step', () => {
    render(<ScanOnboarding onComplete={mockOnComplete} />);

    // Navigate to last step
    fireEvent.click(screen.getByText('Suivant'));
    fireEvent.click(screen.getByText('Suivant'));

    expect(screen.getByText('Commencer')).toBeInTheDocument();
    expect(screen.queryByText('Suivant')).not.toBeInTheDocument();
  });

  it('should complete onboarding on last step', () => {
    render(<ScanOnboarding onComplete={mockOnComplete} />);

    // Navigate to last step
    fireEvent.click(screen.getByText('Suivant'));
    fireEvent.click(screen.getByText('Suivant'));

    // Complete
    fireEvent.click(screen.getByText('Commencer'));

    expect(localStorage.getItem(ONBOARDING_STORAGE_KEY)).toBe('true');
    expect(scanAnalytics.onboardingCompleted).toHaveBeenCalledWith(3);
    expect(mockOnComplete).toHaveBeenCalledTimes(1);
  });

  it('should skip onboarding', () => {
    render(<ScanOnboarding onComplete={mockOnComplete} />);

    const skipButton = screen.getByLabelText('Fermer le tutoriel');
    fireEvent.click(skipButton);

    expect(localStorage.getItem(ONBOARDING_STORAGE_KEY)).toBe('true');
    expect(scanAnalytics.onboardingSkipped).toHaveBeenCalledWith(1, 3);
    expect(mockOnComplete).toHaveBeenCalledTimes(1);
  });

  it('should display all 3 steps', () => {
    render(<ScanOnboarding onComplete={mockOnComplete} />);

    const dots = screen.getAllByRole('generic').filter(el => 
      el.className.includes('rounded-full') && el.className.includes('h-2 w-2')
    );
    
    expect(dots.length).toBe(3);
  });

  it('should highlight current step dot', () => {
    const { container } = render(<ScanOnboarding onComplete={mockOnComplete} />);

    const dots = container.querySelectorAll('.h-2.w-2.rounded-full');
    expect(dots[0].className).toContain('bg-primary');
    expect(dots[1].className).toContain('bg-muted');
    expect(dots[2].className).toContain('bg-muted');
  });

  it('should show correct illustrations for each step', () => {
    render(<ScanOnboarding onComplete={mockOnComplete} />);

    // Step 1
    expect(screen.getByText('🎭')).toBeInTheDocument();

    // Step 2
    fireEvent.click(screen.getByText('Suivant'));
    expect(screen.getByText('📊')).toBeInTheDocument();

    // Step 3
    fireEvent.click(screen.getByText('Suivant'));
    expect(screen.getByText('🔒')).toBeInTheDocument();
  });
});

describe('shouldShowOnboarding', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should return true when not completed', () => {
    expect(shouldShowOnboarding()).toBe(true);
  });

  it('should return false when completed', () => {
    localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
    expect(shouldShowOnboarding()).toBe(false);
  });

  it('should return true after clearing storage', () => {
    localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
    expect(shouldShowOnboarding()).toBe(false);

    localStorage.removeItem(ONBOARDING_STORAGE_KEY);
    expect(shouldShowOnboarding()).toBe(true);
  });
});
