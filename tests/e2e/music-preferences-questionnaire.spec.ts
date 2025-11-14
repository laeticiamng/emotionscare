/**
 * E2E Tests - Music Preferences Questionnaire
 * Tests du questionnaire de préférences musicales
 */

import { test, expect, type Page } from '@playwright/test';

// Helper function to login
async function loginTestUser(page: Page) {
  await page.goto('/choose-mode');
  
  // Click on Consumer mode
  await page.click('text=Mode Personnel');
  
  // Wait for redirect to auth page
  await page.waitForURL(/\/(login|signup|auth)/);
  
  // Fill login form (adjust selectors based on your actual form)
  await page.fill('input[type="email"]', 'test-music@emotionscare.com');
  await page.fill('input[type="password"]', 'TestPassword123!');
  await page.click('button[type="submit"]:has-text("Se connecter")');
  
  // Wait for successful login
  await page.waitForURL(/\/app/);
}

test.describe('Music Preferences Questionnaire', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to simulate first launch
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('should show preferences modal on first launch', async ({ page }) => {
    // Login
    await loginTestUser(page);
    
    // Navigate to /app/music
    await page.goto('/app/music');
    
    // Wait for modal to appear (800ms delay in code)
    await page.waitForSelector('text=Personnalisons votre expérience musicale', {
      timeout: 2000,
    });
    
    // Verify modal is visible
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();
    
    // Verify step 1 content
    await expect(page.locator('text=Quels genres musicaux préférez-vous')).toBeVisible();
    await expect(page.locator('text=Étape 1 sur 5')).toBeVisible();
  });

  test('should not show modal if preferences already exist', async ({ page }) => {
    // Login
    await loginTestUser(page);
    
    // Set flag to simulate existing preferences
    await page.evaluate(() => {
      localStorage.setItem('music:preferences-completed', 'true');
    });
    
    // Navigate to /app/music
    await page.goto('/app/music');
    
    // Wait a bit to ensure modal wouldn't appear
    await page.waitForTimeout(1500);
    
    // Modal should NOT be visible
    const modal = page.locator('[role="dialog"]');
    await expect(modal).not.toBeVisible();
    
    // But "Modifier mes préférences" button should be visible
    await expect(page.locator('button:has-text("Modifier mes préférences")')).toBeVisible();
  });

  test('should complete all 5 steps successfully', async ({ page }) => {
    await loginTestUser(page);
    await page.goto('/app/music');
    
    // Wait for modal
    await page.waitForSelector('text=Personnalisons votre expérience musicale', {
      timeout: 2000,
    });
    
    // STEP 1: Genres
    await expect(page.locator('text=Quels genres musicaux')).toBeVisible();
    
    // Select 2 genres
    await page.click('text=Ambient');
    await page.click('text=Classique');
    
    // Verify "Suivant" button is enabled
    const nextButton = page.locator('button:has-text("Suivant")');
    await expect(nextButton).toBeEnabled();
    await nextButton.click();
    
    // STEP 2: Tempo
    await expect(page.locator('text=Quel tempo préférez-vous')).toBeVisible();
    
    // Move slider (optional - already has default values)
    // Just proceed to next
    await page.click('button:has-text("Suivant")');
    
    // STEP 3: Moods
    await expect(page.locator('text=Quels moods recherchez-vous')).toBeVisible();
    
    // Select 2 moods
    await page.click('text=Calme');
    await page.click('text=Concentré');
    
    await page.click('button:has-text("Suivant")');
    
    // STEP 4: Contexts
    await expect(page.locator('text=Dans quels contextes écoutez-vous')).toBeVisible();
    
    // Select 2 contexts
    await page.click('text=Travail');
    await page.click('text=Méditation');
    
    await page.click('button:has-text("Suivant")');
    
    // STEP 5: Energy + Instrumental
    await expect(page.locator('text=Niveau d\'énergie préféré')).toBeVisible();
    
    // Select instrumental preference
    await page.click('text=Instrumental uniquement');
    
    // Click "Terminer"
    const finishButton = page.locator('button:has-text("Terminer")');
    await expect(finishButton).toBeEnabled();
    await finishButton.click();
    
    // Wait for success toast
    await expect(page.locator('text=Préférences enregistrées')).toBeVisible({
      timeout: 3000,
    });
    
    // Modal should close
    await expect(page.locator('[role="dialog"]')).not.toBeVisible({
      timeout: 2000,
    });
  });

  test('should validate required fields', async ({ page }) => {
    await loginTestUser(page);
    await page.goto('/app/music');
    
    await page.waitForSelector('text=Personnalisons votre expérience musicale', {
      timeout: 2000,
    });
    
    // STEP 1: Without selecting any genre
    const nextButton = page.locator('button:has-text("Suivant")');
    await expect(nextButton).toBeDisabled();
    
    // Select one genre
    await page.click('text=Jazz');
    await expect(nextButton).toBeEnabled();
    
    // Go to step 3 (moods)
    await nextButton.click(); // Step 2
    await page.click('button:has-text("Suivant")'); // Step 3
    
    // Without selecting any mood
    await expect(page.locator('button:has-text("Suivant")')).toBeDisabled();
    
    // Select one mood
    await page.click('text=Joyeux');
    await expect(page.locator('button:has-text("Suivant")')).toBeEnabled();
  });

  test('should navigate back and forth between steps', async ({ page }) => {
    await loginTestUser(page);
    await page.goto('/app/music');
    
    await page.waitForSelector('text=Personnalisons votre expérience musicale', {
      timeout: 2000,
    });
    
    // Step 1
    await page.click('text=Pop');
    await page.click('button:has-text("Suivant")');
    
    // Step 2
    await expect(page.locator('text=Quel tempo')).toBeVisible();
    
    // Go back to step 1
    await page.click('button:has-text("Précédent")');
    await expect(page.locator('text=Quels genres musicaux')).toBeVisible();
    
    // Verify selection persisted
    const popBadge = page.locator('text=Pop').first();
    await expect(popBadge).toHaveClass(/default/); // Selected badge has "default" variant
    
    // Go forward again
    await page.click('button:has-text("Suivant")');
    await expect(page.locator('text=Quel tempo')).toBeVisible();
  });

  test('should persist preferences in database', async ({ page }) => {
    await loginTestUser(page);
    await page.goto('/app/music');
    
    await page.waitForSelector('text=Personnalisons votre expérience musicale', {
      timeout: 2000,
    });
    
    // Complete all steps quickly
    await page.click('text=Électronique');
    await page.click('button:has-text("Suivant")');
    
    await page.click('button:has-text("Suivant")');
    
    await page.click('text=Énergique');
    await page.click('button:has-text("Suivant")');
    
    await page.click('text=Sport');
    await page.click('button:has-text("Suivant")');
    
    await page.click('text=Avec voix');
    await page.click('button:has-text("Terminer")');
    
    // Wait for success
    await expect(page.locator('text=Préférences enregistrées')).toBeVisible({
      timeout: 3000,
    });
    
    // Refresh page
    await page.reload();
    
    // Modal should NOT appear (preferences exist)
    await page.waitForTimeout(1500);
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
    
    // "Modifier" button should be visible
    await expect(page.locator('button:has-text("Modifier mes préférences")')).toBeVisible();
  });

  test('should reopen modal via "Modifier mes préférences" button', async ({ page }) => {
    await loginTestUser(page);
    
    // Simulate existing preferences
    await page.evaluate(() => {
      localStorage.setItem('music:preferences-completed', 'true');
    });
    
    await page.goto('/app/music');
    
    // Click "Modifier mes préférences" button
    await page.click('button:has-text("Modifier mes préférences")');
    
    // Modal should open
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await expect(page.locator('text=Personnalisons votre expérience musicale')).toBeVisible();
    
    // User can modify and save again
    await page.click('text=Rock');
    await page.click('button:has-text("Suivant")');
    // ... continue through steps if needed
  });

  test('should show progress indicator correctly', async ({ page }) => {
    await loginTestUser(page);
    await page.goto('/app/music');
    
    await page.waitForSelector('text=Personnalisons votre expérience musicale', {
      timeout: 2000,
    });
    
    // Check initial progress (step 1 active)
    const progressBars = page.locator('.h-1\\.5.w-12.rounded-full');
    
    // First bar should be primary color (active)
    await expect(progressBars.nth(0)).toHaveClass(/bg-primary/);
    await expect(progressBars.nth(1)).toHaveClass(/bg-muted/);
    
    // Go to step 2
    await page.click('text=Indie');
    await page.click('button:has-text("Suivant")');
    
    // First 2 bars should be active
    await expect(progressBars.nth(0)).toHaveClass(/bg-primary/);
    await expect(progressBars.nth(1)).toHaveClass(/bg-primary/);
    await expect(progressBars.nth(2)).toHaveClass(/bg-muted/);
  });

  test('should display correct step titles', async ({ page }) => {
    await loginTestUser(page);
    await page.goto('/app/music');
    
    await page.waitForSelector('text=Personnalisons votre expérience musicale', {
      timeout: 2000,
    });
    
    // Step 1
    await expect(page.locator('text=Étape 1 sur 5')).toBeVisible();
    
    await page.click('text=World');
    await page.click('button:has-text("Suivant")');
    
    // Step 2
    await expect(page.locator('text=Étape 2 sur 5')).toBeVisible();
    
    await page.click('button:has-text("Suivant")');
    
    // Step 3
    await expect(page.locator('text=Étape 3 sur 5')).toBeVisible();
    
    await page.click('text=Détendu');
    await page.click('button:has-text("Suivant")');
    
    // Step 4
    await expect(page.locator('text=Étape 4 sur 5')).toBeVisible();
    
    await page.click('text=Créatif');
    await page.click('button:has-text("Suivant")');
    
    // Step 5
    await expect(page.locator('text=Étape 5 sur 5')).toBeVisible();
  });

  test('should handle modal close without completing', async ({ page }) => {
    await loginTestUser(page);
    await page.goto('/app/music');
    
    await page.waitForSelector('text=Personnalisons votre expérience musicale', {
      timeout: 2000,
    });
    
    // Try to close modal (press Escape)
    await page.keyboard.press('Escape');
    
    // Modal should close
    await expect(page.locator('[role="dialog"]')).not.toBeVisible({
      timeout: 1000,
    });
    
    // Page should still be functional
    await expect(page.locator('text=Musicothérapie')).toBeVisible();
  });
});

test.describe('Music Preferences Integration', () => {
  test('should use preferences in recommendations', async ({ page }) => {
    await loginTestUser(page);
    await page.goto('/app/music');
    
    // Complete preferences with specific selections
    await page.waitForSelector('text=Personnalisons votre expérience musicale', {
      timeout: 2000,
    });
    
    // Select specific genres for testing
    await page.click('text=Ambient');
    await page.click('text=Lo-Fi');
    await page.click('button:has-text("Suivant")');
    
    // Complete remaining steps
    await page.click('button:has-text("Suivant")');
    
    await page.click('text=Calme');
    await page.click('text=Relaxed');
    await page.click('button:has-text("Suivant")');
    
    await page.click('text=Méditation');
    await page.click('button:has-text("Suivant")');
    
    await page.click('text=Instrumental uniquement');
    await page.click('button:has-text("Terminer")');
    
    // Wait for success
    await expect(page.locator('text=Préférences enregistrées')).toBeVisible({
      timeout: 3000,
    });
    
    // TODO: Verify that API calls include preferences
    // This would require intercepting network requests
    // and checking that the edge function receives the preferences
  });
});
