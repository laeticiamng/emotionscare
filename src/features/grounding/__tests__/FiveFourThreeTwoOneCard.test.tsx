import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import FiveFourThreeTwoOneCard from '@/features/grounding/FiveFourThreeTwoOneCard';

describe('FiveFourThreeTwoOneCard', () => {
  it('walks through steps without exposing digits', () => {
    const onComplete = vi.fn();

    const { container } = render(<FiveFourThreeTwoOneCard onComplete={onComplete} />);

    expect(container.textContent).not.toMatch(/\d/);

    const continueButton = screen.getByRole('button', { name: 'Continuer' });

    fireEvent.click(continueButton);
    fireEvent.click(continueButton);
    fireEvent.click(continueButton);
    fireEvent.click(continueButton);

    fireEvent.click(screen.getByRole('button', { name: 'Terminer' }));

    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('disables animations when prefers-reduced-motion is enabled', () => {
    const listeners: Array<(event: MediaQueryListEvent) => void> = [];

    const mockMatchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      addEventListener: (_: string, listener: (event: MediaQueryListEvent) => void) => {
        listeners.push(listener);
      },
      removeEventListener: (_: string, listener: (event: MediaQueryListEvent) => void) => {
        const index = listeners.indexOf(listener);
        if (index >= 0) {
          listeners.splice(index, 1);
        }
      },
    }));

    const originalMatchMedia = window.matchMedia;
    // @ts-expect-error we intentionally override for the test
    window.matchMedia = mockMatchMedia;

    const { container } = render(<FiveFourThreeTwoOneCard />);

    const card = container.querySelector('.transition');
    expect(card).toBeNull();

    // cleanup
    window.matchMedia = originalMatchMedia;
  });
});
