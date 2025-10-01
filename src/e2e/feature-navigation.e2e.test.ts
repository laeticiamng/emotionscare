// @ts-nocheck

import { test, expect } from '@playwright/test';
import { routes } from '@/routerV2';

test.describe('Feature Navigation E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Login as B2C user for most tests
    await page.goto(routes.auth.b2cLogin());
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(routes.b2c.dashboard());
  });

  test('emotion scan feature complete flow', async ({ page }) => {
    // Navigate to scan
    await page.click('[data-testid="scan-card"]');
    await expect(page).toHaveURL(routes.b2c.scan());

    // Test camera permission
    await page.click('[data-testid="start-scan-button"]');
    
    // Should show camera interface
    await expect(page.locator('[data-testid="camera-preview"]')).toBeVisible();
    
    // Test voice recording
    await page.click('[data-testid="voice-record-button"]');
    await expect(page.locator('[data-testid="recording-indicator"]')).toBeVisible();
    
    // Stop recording
    await page.click('[data-testid="stop-record-button"]');
    
    // Should show results
    await expect(page.locator('[data-testid="emotion-results"]')).toBeVisible();
    await expect(page.locator('[data-testid="emotion-score"]')).toBeVisible();
  });

  test('music therapy feature flow', async ({ page }) => {
    await page.click('[data-testid="music-card"]');
    await expect(page).toHaveURL(routes.b2c.music());

    // Test music player controls
    await expect(page.locator('[data-testid="music-player"]')).toBeVisible();
    
    // Play music
    await page.click('[data-testid="play-button"]');
    await expect(page.locator('[data-testid="pause-button"]')).toBeVisible();
    
    // Test volume control
    await page.click('[data-testid="volume-slider"]');
    
    // Test playlist navigation
    await page.click('[data-testid="next-track"]');
    await expect(page.locator('[data-testid="track-title"]')).not.toBeEmpty();
  });

  test('AI coach interaction flow', async ({ page }) => {
    await page.click('[data-testid="coach-card"]');
    await expect(page).toHaveURL(routes.b2c.coach());

    // Test chat interface
    await expect(page.locator('[data-testid="coach-chat"]')).toBeVisible();
    
    // Send message
    await page.fill('[data-testid="chat-input"]', 'Je me sens stressé aujourd\'hui');
    await page.click('[data-testid="send-button"]');
    
    // Should receive response
    await expect(page.locator('[data-testid="coach-response"]')).toBeVisible({ timeout: 10000 });
    
    // Test quick suggestions
    await page.click('[data-testid="quick-suggestion"]');
    await expect(page.locator('[data-testid="coach-response"]')).toContainText('');
  });

  test('journal feature flow', async ({ page }) => {
    await page.click('[data-testid="journal-card"]');
    await expect(page).toHaveURL(routes.b2c.journal());

    // Create new entry
    await page.click('[data-testid="new-entry-button"]');
    
    // Fill journal entry
    await page.fill('[data-testid="journal-editor"]', 'Aujourd\'hui a été une journée productive...');
    
    // Select mood
    await page.click('[data-testid="mood-selector"]');
    await page.click('[data-testid="mood-happy"]');
    
    // Save entry
    await page.click('[data-testid="save-entry"]');
    
    // Should appear in entry list
    await expect(page.locator('[data-testid="journal-entries"]')).toContainText('Aujourd\'hui a été');
  });

  test('VR experience navigation', async ({ page }) => {
    await page.click('[data-testid="vr-card"]');
    await expect(page).toHaveURL(routes.b2c.vr());

    // Test VR scene selection
    await expect(page.locator('[data-testid="vr-scenes"]')).toBeVisible();
    
    // Select relaxation scene
    await page.click('[data-testid="relaxation-scene"]');
    
    // Should load VR interface
    await expect(page.locator('[data-testid="vr-viewer"]')).toBeVisible();
    
    // Test VR controls
    await page.click('[data-testid="vr-play"]');
    await expect(page.locator('[data-testid="vr-pause"]')).toBeVisible();
  });

  test('preferences and settings flow', async ({ page }) => {
    await page.click('[data-testid="user-menu"]');
    await page.click('text=Préférences');
    await expect(page).toHaveURL(routes.b2c.settings());

    // Test theme toggle
    await page.click('[data-testid="theme-toggle"]');
    await expect(page.locator('html')).toHaveClass(/dark/);
    
    // Test notification settings
    await page.click('[data-testid="notifications-toggle"]');
    
    // Test language selection
    await page.selectOption('[data-testid="language-select"]', 'en');
    
    // Save preferences
    await page.click('[data-testid="save-preferences"]');
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
  });
});
