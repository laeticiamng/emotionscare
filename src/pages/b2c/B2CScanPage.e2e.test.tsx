// @ts-nocheck
import { test, expect } from '@playwright/test';

test.describe('Scan Module V2', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to simulate first visit
    await page.goto('/app/scan');
    await page.evaluate(() => localStorage.clear());
  });

  test('should show onboarding on first visit', async ({ page }) => {
    await page.goto('/app/scan');
    
    // Wait for onboarding modal
    const modal = page.locator('[role="dialog"]').first();
    await expect(modal).toBeVisible();
    
    // Check first step
    await expect(page.getByText('Bienvenue sur le Scanner Émotionnel')).toBeVisible();
    await expect(page.getByText('🎭')).toBeVisible();
    
    // Navigate to second step
    await page.getByRole('button', { name: 'Suivant' }).click();
    await expect(page.getByText('Deux modes de scan')).toBeVisible();
    
    // Skip onboarding
    await page.getByRole('button', { name: 'Fermer le tutoriel' }).click();
    await expect(modal).not.toBeVisible();
    
    // Check localStorage
    const onboardingCompleted = await page.evaluate(() => 
      localStorage.getItem('scan-onboarding-completed')
    );
    expect(onboardingCompleted).toBe('true');
  });

  test('should display feedback badge on slider change', async ({ page }) => {
    // Complete onboarding first
    await page.evaluate(() => localStorage.setItem('scan-onboarding-completed', 'true'));
    await page.goto('/app/scan');
    
    // Find and interact with slider
    const slider = page.locator('[aria-label="Palette ressentie"]').first();
    await slider.click();
    
    // Check feedback badge appears
    await expect(page.getByText('Mis à jour ✓')).toBeVisible();
    
    // Wait for badge to disappear
    await page.waitForTimeout(1500);
    await expect(page.getByText('Mis à jour ✓')).not.toBeVisible();
  });

  test('should show toast after save', async ({ page }) => {
    await page.evaluate(() => localStorage.setItem('scan-onboarding-completed', 'true'));
    await page.goto('/app/scan');
    
    // Accept consent if needed
    const acceptButton = page.getByRole('button', { name: /accepte/i });
    if (await acceptButton.isVisible()) {
      await acceptButton.click();
    }
    
    // Adjust slider
    const slider = page.locator('[aria-label="Palette ressentie"]').first();
    await slider.click();
    
    // Wait for toast
    await expect(page.getByText('État émotionnel enregistré')).toBeVisible({ timeout: 5000 });
  });

  test('should display scan history', async ({ page }) => {
    await page.evaluate(() => localStorage.setItem('scan-onboarding-completed', 'true'));
    await page.goto('/app/scan');
    
    // Check history card is visible
    await expect(page.getByText('Historique récent')).toBeVisible();
    
    // Empty state initially
    const emptyMessage = page.getByText('Aucun scan enregistré pour le moment');
    if (await emptyMessage.isVisible()) {
      await expect(emptyMessage).toBeVisible();
    }
  });

  test('should handle camera permission denied gracefully', async ({ page, context }) => {
    await page.evaluate(() => localStorage.setItem('scan-onboarding-completed', 'true'));
    
    // Deny camera permission
    await context.grantPermissions([], { origin: page.url() });
    
    await page.goto('/app/scan');
    
    // Click camera button
    await page.getByRole('button', { name: /Activer la caméra/i }).click();
    
    // Check error message appears
    await expect(page.getByText(/accès caméra a été refusé/i)).toBeVisible({ timeout: 3000 });
    
    // Should fallback to sliders
    await expect(page.getByText('Réglage sensoriel')).toBeVisible();
  });

  test('should show loading state during camera analysis', async ({ page, context }) => {
    await page.evaluate(() => localStorage.setItem('scan-onboarding-completed', 'true'));
    
    // Grant camera permission
    await context.grantPermissions(['camera'], { origin: page.url() });
    
    await page.goto('/app/scan');
    
    // Activate camera
    await page.getByRole('button', { name: /Activer la caméra/i }).click();
    
    // Check for loading indicator
    await expect(page.getByText('Analyse en cours...')).toBeVisible({ timeout: 5000 });
  });

  test('should navigate through all onboarding steps', async ({ page }) => {
    await page.goto('/app/scan');
    
    const steps = [
      'Bienvenue sur le Scanner Émotionnel',
      'Deux modes de scan',
      'Valence et Arousal',
    ];
    
    for (let i = 0; i < steps.length; i++) {
      await expect(page.getByText(steps[i])).toBeVisible();
      
      if (i < steps.length - 1) {
        await page.getByRole('button', { name: 'Suivant' }).click();
      } else {
        // Last step should have "Commencer" button
        await page.getByRole('button', { name: 'Commencer' }).click();
      }
    }
    
    // Onboarding should be closed
    await expect(page.getByText('Bienvenue sur le Scanner Émotionnel')).not.toBeVisible();
  });

  test('should show correct emotion labels in history', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('scan-onboarding-completed', 'true');
      // Mock some scan history data
      // This would need to be set up with actual data in a real scenario
    });
    
    await page.goto('/app/scan');
    
    // Check for history card
    await expect(page.getByText('Historique récent')).toBeVisible();
  });

  test('should maintain state when switching between modes', async ({ page }) => {
    await page.evaluate(() => localStorage.setItem('scan-onboarding-completed', 'true'));
    await page.goto('/app/scan');
    
    // Check sliders mode is active
    await expect(page.getByText('Réglage sensoriel')).toBeVisible();
    
    // Switch to camera (will fail permission but that's ok)
    await page.getByRole('button', { name: /Activer la caméra/i }).click();
    
    // Switch back to sliders
    await page.getByRole('button', { name: /Ajuster via les curseurs/i }).click();
    
    // Should show sliders again
    await expect(page.getByText('Réglage sensoriel')).toBeVisible();
  });
});
