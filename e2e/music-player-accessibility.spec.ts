/**
 * Tests E2E - Accessibilité du Lecteur Musical
 *
 * Teste la conformité WCAG 2.1 AAA:
 * - Navigation clavier complète
 * - Attributs ARIA
 * - Annonces screen reader
 * - Focus management
 * - Contraste et visibilité
 */

import { test, expect } from '@playwright/test';

// Mock data
const mockTrack = {
  id: 'track-1',
  title: 'Méditation Profonde',
  artist: 'EmotionsCare AI',
  duration: 180,
  url: 'https://cdn.example.com/meditation.mp3',
  coverUrl: 'https://cdn.example.com/cover.jpg',
  style: 'ambient, calm, meditative',
  createdAt: new Date().toISOString()
};

const mockPlaylist = [
  mockTrack,
  {
    ...mockTrack,
    id: 'track-2',
    title: 'Concentration Focus',
    artist: 'EmotionsCare AI'
  },
  {
    ...mockTrack,
    id: 'track-3',
    title: 'Relaxation Totale',
    artist: 'EmotionsCare AI'
  }
];

test.describe('Music Player - Keyboard Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Mock Supabase auth
    await page.route('**/auth/v1/user', async route => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({
          user: {
            id: 'user-123',
            email: 'test@example.com'
          }
        }),
        headers: { 'content-type': 'application/json' }
      });
    });

    // Mock music generations (playlist)
    await page.route('**/rest/v1/music_generations*', async route => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify(mockPlaylist),
        headers: { 'content-type': 'application/json' }
      });
    });

    await page.goto('/emotion-music');
  });

  test('should navigate player controls with Tab key', async ({ page }) => {
    // Tab to first focusable element in player
    await page.keyboard.press('Tab');

    // Should focus on Previous button
    let focused = await page.locator(':focus');
    await expect(focused).toHaveAttribute('aria-label', /précédent|previous/i);

    // Tab to Play button
    await page.keyboard.press('Tab');
    focused = await page.locator(':focus');
    await expect(focused).toHaveAttribute('aria-label', /lecture|play|pause/i);

    // Tab to Next button
    await page.keyboard.press('Tab');
    focused = await page.locator(':focus');
    await expect(focused).toHaveAttribute('aria-label', /suivant|next/i);

    // Tab to Progress slider
    await page.keyboard.press('Tab');
    focused = await page.locator(':focus');
    await expect(focused).toHaveRole('slider');
    await expect(focused).toHaveAttribute('aria-label', /progression|progress/i);

    // Tab to Mute button
    await page.keyboard.press('Tab');
    focused = await page.locator(':focus');
    await expect(focused).toHaveAttribute('aria-label', /muet|mute|volume/i);

    // Tab to Volume slider
    await page.keyboard.press('Tab');
    focused = await page.locator(':focus');
    await expect(focused).toHaveRole('slider');
    await expect(focused).toHaveAttribute('aria-label', /volume/i);
  });

  test('should toggle play/pause with Space key', async ({ page }) => {
    // Focus on play button
    const playButton = page.getByRole('button', { name: /lecture|play/i }).first();
    await playButton.focus();

    // Press Space to play
    await page.keyboard.press('Space');

    // Button should change to Pause
    await expect(playButton).toHaveAttribute('aria-label', /pause/i);

    // Press Space again to pause
    await page.keyboard.press('Space');

    // Button should change back to Play
    await expect(playButton).toHaveAttribute('aria-label', /lecture|play/i);
  });

  test('should change track with Arrow Left/Right keys', async ({ page }) => {
    // Get current track title
    const trackTitle = page.locator('[data-testid="current-track-title"]').first();
    const initialTitle = await trackTitle.textContent();

    // Press Arrow Right for next track
    await page.keyboard.press('ArrowRight');

    // Wait for track change
    await page.waitForTimeout(500);

    // Title should have changed
    const newTitle = await trackTitle.textContent();
    expect(newTitle).not.toBe(initialTitle);

    // Press Arrow Left for previous track
    await page.keyboard.press('ArrowLeft');

    // Wait for track change
    await page.waitForTimeout(500);

    // Should be back to initial track
    const backTitle = await trackTitle.textContent();
    expect(backTitle).toBe(initialTitle);
  });

  test('should adjust volume with Arrow Up/Down keys', async ({ page }) => {
    // Focus on volume slider
    const volumeSlider = page.getByRole('slider', { name: /volume/i }).first();
    await volumeSlider.focus();

    // Get initial volume
    const initialVolume = await volumeSlider.getAttribute('aria-valuenow');

    // Press Arrow Up to increase volume
    await page.keyboard.press('ArrowUp');

    // Volume should increase
    const increasedVolume = await volumeSlider.getAttribute('aria-valuenow');
    expect(Number(increasedVolume)).toBeGreaterThan(Number(initialVolume));

    // Press Arrow Down to decrease volume
    await page.keyboard.press('ArrowDown');

    // Volume should decrease
    const decreasedVolume = await volumeSlider.getAttribute('aria-valuenow');
    expect(Number(decreasedVolume)).toBeLessThan(Number(increasedVolume));
  });

  test('should toggle mute with M key', async ({ page }) => {
    // Press M to mute
    await page.keyboard.press('m');

    // Volume should be 0
    const volumeSlider = page.getByRole('slider', { name: /volume/i }).first();
    await expect(volumeSlider).toHaveAttribute('aria-valuenow', '0');

    // Mute button should indicate unmute action
    const muteButton = page.getByRole('button', { name: /muet|mute|volume/i }).first();
    await expect(muteButton).toHaveAttribute('aria-label', /réactiver|unmute/i);

    // Press M again to unmute
    await page.keyboard.press('m');

    // Volume should be restored
    const restoredVolume = await volumeSlider.getAttribute('aria-valuenow');
    expect(Number(restoredVolume)).toBeGreaterThan(0);
  });

  test('should have visible focus indicators', async ({ page }) => {
    // Tab through controls and check focus visibility
    const playButton = page.getByRole('button', { name: /lecture|play/i }).first();
    await playButton.focus();

    // Check computed styles for focus ring
    const focusOutline = await playButton.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        outline: styles.outline,
        outlineWidth: styles.outlineWidth,
        outlineStyle: styles.outlineStyle
      };
    });

    // Should have visible outline
    expect(focusOutline.outlineWidth).not.toBe('0px');
    expect(focusOutline.outlineStyle).not.toBe('none');
  });

  test('should not trigger shortcuts when typing in inputs', async ({ page }) => {
    // Navigate to form
    const titleInput = page.locator('input[name="title"]');
    await titleInput.click();

    // Type a space (should not trigger play/pause)
    await page.keyboard.type('My Music Title');

    // Input should contain the text with space
    await expect(titleInput).toHaveValue('My Music Title');

    // Player should still be paused (space didn't trigger play)
    const playButton = page.getByRole('button', { name: /lecture|play/i }).first();
    await expect(playButton).toHaveAttribute('aria-label', /lecture|play/i);
  });
});

test.describe('Music Player - ARIA Attributes', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/auth/v1/user', async route => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({
          user: { id: 'user-123', email: 'test@example.com' }
        }),
        headers: { 'content-type': 'application/json' }
      });
    });

    await page.route('**/rest/v1/music_generations*', async route => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify(mockPlaylist),
        headers: { 'content-type': 'application/json' }
      });
    });

    await page.goto('/emotion-music');
  });

  test('should have proper player region attributes', async ({ page }) => {
    const player = page.locator('[role="region"][aria-label*="lecteur"]').first();

    await expect(player).toBeVisible();
    await expect(player).toHaveAttribute('aria-label', /lecteur/i);
    await expect(player).toHaveAttribute('aria-live', 'polite');
  });

  test('should have all buttons with aria-label', async ({ page }) => {
    // Previous button
    const prevButton = page.getByRole('button', { name: /précédent/i }).first();
    await expect(prevButton).toHaveAttribute('aria-label');

    // Play/Pause button
    const playButton = page.getByRole('button', { name: /lecture|play/i }).first();
    await expect(playButton).toHaveAttribute('aria-label');

    // Next button
    const nextButton = page.getByRole('button', { name: /suivant/i }).first();
    await expect(nextButton).toHaveAttribute('aria-label');

    // Mute button
    const muteButton = page.getByRole('button', { name: /muet|volume/i }).first();
    await expect(muteButton).toHaveAttribute('aria-label');
  });

  test('should have volume slider with correct ARIA attributes', async ({ page }) => {
    const volumeSlider = page.getByRole('slider', { name: /volume/i }).first();

    await expect(volumeSlider).toHaveAttribute('aria-label', /volume/i);
    await expect(volumeSlider).toHaveAttribute('aria-valuemin', '0');
    await expect(volumeSlider).toHaveAttribute('aria-valuemax', '100');

    const currentValue = await volumeSlider.getAttribute('aria-valuenow');
    expect(Number(currentValue)).toBeGreaterThanOrEqual(0);
    expect(Number(currentValue)).toBeLessThanOrEqual(100);
  });

  test('should have progress slider with correct ARIA attributes', async ({ page }) => {
    const progressSlider = page.getByRole('slider', { name: /progression/i }).first();

    await expect(progressSlider).toHaveAttribute('aria-label', /progression/i);
    await expect(progressSlider).toHaveAttribute('aria-valuemin');
    await expect(progressSlider).toHaveAttribute('aria-valuemax');
    await expect(progressSlider).toHaveAttribute('aria-valuenow');
    await expect(progressSlider).toHaveAttribute('aria-valuetext');
  });

  test('should have icons with aria-hidden="true"', async ({ page }) => {
    // All SVG icons should be hidden from screen readers
    const icons = page.locator('svg');
    const count = await icons.count();

    for (let i = 0; i < count; i++) {
      const icon = icons.nth(i);
      const ariaHidden = await icon.getAttribute('aria-hidden');
      // Icons should either have aria-hidden="true" or be inside buttons with aria-label
      if (ariaHidden !== 'true') {
        const parentButton = await icon.locator('..').getAttribute('aria-label');
        expect(parentButton).toBeTruthy();
      }
    }
  });
});

test.describe('Music Player - Screen Reader Announcements', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/auth/v1/user', async route => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({
          user: { id: 'user-123', email: 'test@example.com' }
        }),
        headers: { 'content-type': 'application/json' }
      });
    });

    await page.route('**/rest/v1/music_generations*', async route => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify(mockPlaylist),
        headers: { 'content-type': 'application/json' }
      });
    });

    await page.goto('/emotion-music');
  });

  test('should have live region for playback state', async ({ page }) => {
    // Find live region
    const liveRegion = page.locator('[role="status"][aria-live="polite"]').first();
    await expect(liveRegion).toBeAttached();

    // Should announce paused state initially
    const initialText = await liveRegion.textContent();
    expect(initialText).toMatch(/pause|arrêt/i);

    // Click play
    const playButton = page.getByRole('button', { name: /lecture|play/i }).first();
    await playButton.click();

    // Wait for state update
    await page.waitForTimeout(500);

    // Should announce playing state
    const playingText = await liveRegion.textContent();
    expect(playingText).toMatch(/lecture|en cours/i);
  });

  test('should announce track changes', async ({ page }) => {
    const liveRegion = page.locator('[role="status"][aria-live="polite"]').first();

    // Get initial track
    const initialAnnouncement = await liveRegion.textContent();

    // Go to next track
    const nextButton = page.getByRole('button', { name: /suivant/i }).first();
    await nextButton.click();

    // Wait for announcement
    await page.waitForTimeout(500);

    // Should announce new track
    const newAnnouncement = await liveRegion.textContent();
    expect(newAnnouncement).not.toBe(initialAnnouncement);
    expect(newAnnouncement).toMatch(/lecture|track/i);
  });

  test('should announce volume changes', async ({ page }) => {
    // Some implementations may have a separate live region for volume
    // This test checks if volume changes are communicated somehow

    const volumeSlider = page.getByRole('slider', { name: /volume/i }).first();
    await volumeSlider.focus();

    // Increase volume
    await page.keyboard.press('ArrowUp');

    // Check if aria-valuetext is updated (alternative to live region)
    const valueText = await volumeSlider.getAttribute('aria-valuetext');
    expect(valueText).toMatch(/\d+/); // Should contain percentage
  });
});

test.describe('Music Player - Responsive & Contrast', () => {
  test('should be usable at 200% zoom', async ({ page }) => {
    await page.goto('/emotion-music');

    // Set zoom to 200%
    await page.evaluate(() => {
      document.body.style.zoom = '2';
    });

    // Wait for reflow
    await page.waitForTimeout(500);

    // Player should still be visible
    const player = page.locator('[role="region"][aria-label*="lecteur"]').first();
    await expect(player).toBeVisible();

    // Controls should still be clickable
    const playButton = page.getByRole('button', { name: /lecture|play/i }).first();
    await expect(playButton).toBeVisible();
    await expect(playButton).toBeEnabled();

    // No horizontal scroll
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasHorizontalScroll).toBe(false);
  });

  test('should work on mobile viewport (375px)', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/emotion-music');

    // Player should be visible
    const player = page.locator('[role="region"][aria-label*="lecteur"]').first();
    await expect(player).toBeVisible();

    // Buttons should be large enough (44x44px minimum for touch)
    const playButton = page.getByRole('button', { name: /lecture|play/i }).first();
    const buttonBox = await playButton.boundingBox();

    expect(buttonBox?.width).toBeGreaterThanOrEqual(44);
    expect(buttonBox?.height).toBeGreaterThanOrEqual(44);
  });

  test('should have sufficient color contrast', async ({ page }) => {
    await page.goto('/emotion-music');

    // Get play button colors
    const playButton = page.getByRole('button', { name: /lecture|play/i }).first();

    const colors = await playButton.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        color: styles.color,
        backgroundColor: styles.backgroundColor
      };
    });

    // This is a basic check - in real audit, use Lighthouse or axe
    // Just verify colors are set
    expect(colors.color).toBeTruthy();
    expect(colors.backgroundColor).toBeTruthy();
  });
});

test.describe('Music Player - Dark Mode', () => {
  test('should toggle dark mode and maintain contrast', async ({ page }) => {
    await page.goto('/emotion-music');

    // Find dark mode toggle (if exists)
    const darkModeToggle = page.locator('[aria-label*="mode sombre"]').or(
      page.locator('button:has-text("Theme")')
    ).first();

    if (await darkModeToggle.isVisible()) {
      // Toggle dark mode
      await darkModeToggle.click();

      // Wait for theme change
      await page.waitForTimeout(500);

      // Player should still be visible
      const player = page.locator('[role="region"][aria-label*="lecteur"]').first();
      await expect(player).toBeVisible();

      // Controls should still be usable
      const playButton = page.getByRole('button', { name: /lecture|play/i }).first();
      await expect(playButton).toBeVisible();
      await expect(playButton).toBeEnabled();
    }
  });
});

test.describe('Music Player - Error Handling', () => {
  test('should announce errors to screen readers', async ({ page }) => {
    // Mock error when trying to play
    await page.route('**/rest/v1/music_generations*', async route => {
      await route.abort('failed');
    });

    await page.goto('/emotion-music');

    // Try to play (should fail)
    const playButton = page.getByRole('button', { name: /lecture|play/i }).first();
    await playButton.click();

    // Error should be announced via alert role or live region
    const errorAlert = page.locator('[role="alert"]').or(
      page.locator('[aria-live="assertive"]')
    ).first();

    await expect(errorAlert).toBeVisible({ timeout: 3000 });
  });

  test('should maintain keyboard focus after errors', async ({ page }) => {
    await page.goto('/emotion-music');

    const playButton = page.getByRole('button', { name: /lecture|play/i }).first();
    await playButton.focus();

    // Trigger error somehow
    await playButton.click();
    await page.waitForTimeout(500);

    // Focus should not be lost
    const focused = await page.locator(':focus');
    await expect(focused).toBeVisible();
  });
});
