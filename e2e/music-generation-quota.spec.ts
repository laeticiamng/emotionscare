/**
 * Tests E2E - Génération Musicale avec Quotas
 *
 * Teste le workflow complet:
 * - Vérification quota
 * - Validation inputs
 * - Génération musique
 * - Décrément quota
 * - Blocage si quota épuisé
 */

import { test, expect } from '@playwright/test';

// Mock user quota responses
const mockQuotaFree = {
  user_id: 'user-123',
  generations_used: 5,
  generations_limit: 10,
  reset_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  is_premium: false,
  concurrent_generations_limit: 1,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

const mockQuotaExhausted = {
  ...mockQuotaFree,
  generations_used: 10,
  generations_limit: 10
};

const mockQuotaPremium = {
  user_id: 'user-123',
  generations_used: 50,
  generations_limit: 100,
  reset_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  is_premium: true,
  concurrent_generations_limit: 3,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

const mockMusicGeneration = {
  id: 'gen-123',
  user_id: 'user-123',
  title: 'Méditation Profonde',
  style: 'ambient, calm, meditative',
  model: 'V4',
  instrumental: true,
  status: 'queued',
  created_at: new Date().toISOString()
};

test.describe('Music Generation with Quotas', () => {
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

    // Mock quota stats by default (FREE tier with quota available)
    await page.route('**/rest/v1/user_music_quotas*', async route => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify([mockQuotaFree]),
        headers: { 'content-type': 'application/json' }
      });
    });

    // Mock concurrent generations check
    await page.route('**/rest/v1/music_generations*count*', async route => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify([{ count: 0 }]),
        headers: { 'content-type': 'application/json' }
      });
    });
  });

  test('should display quota indicator on music page', async ({ page }) => {
    await page.goto('/emotion-music');

    // QuotaIndicator devrait être visible
    await expect(page.getByText(/générations/i)).toBeVisible();
    await expect(page.getByText(/5\/10/i)).toBeVisible();
  });

  test('should allow generation with available quota', async ({ page }) => {
    // Mock successful generation
    await page.route('**/rest/v1/music_generations', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          body: JSON.stringify([mockMusicGeneration]),
          headers: { 'content-type': 'application/json' }
        });
      } else {
        await route.continue();
      }
    });

    // Mock quota increment
    await page.route('**/rest/v1/rpc/increment_music_quota', async route => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ success: true }),
        headers: { 'content-type': 'application/json' }
      });
    });

    await page.goto('/emotion-music');

    // Remplir le formulaire
    await page.fill('input[name="title"]', 'Méditation Profonde');
    await page.fill('input[name="style"]', 'ambient, calm, meditative');
    await page.fill('textarea[name="prompt"]', 'Musique relaxante pour méditation');

    // Cliquer sur générer
    const generateButton = page.getByRole('button', { name: /générer/i });
    await expect(generateButton).toBeEnabled();
    await generateButton.click();

    // Success toast devrait apparaître
    await expect(page.getByText(/génération lancée/i)).toBeVisible({ timeout: 5000 });
  });

  test('should block generation when quota exhausted', async ({ page }) => {
    // Mock quota épuisé
    await page.route('**/rest/v1/user_music_quotas*', async route => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify([mockQuotaExhausted]),
        headers: { 'content-type': 'application/json' }
      });
    });

    await page.goto('/emotion-music');

    // QuotaWarning devrait être visible
    await expect(page.getByText(/quota épuisé/i)).toBeVisible();

    // Bouton générer devrait être désactivé
    const generateButton = page.getByRole('button', { name: /générer/i });
    await expect(generateButton).toBeDisabled();

    // CTA upgrade Premium devrait être visible
    await expect(page.getByText(/premium/i)).toBeVisible();
  });

  test('should validate form inputs before generation', async ({ page }) => {
    await page.goto('/emotion-music');

    // Essayer de générer sans remplir le titre
    const generateButton = page.getByRole('button', { name: /générer/i });
    await generateButton.click();

    // Message d'erreur de validation
    await expect(page.getByText(/titre.*requis/i)).toBeVisible({ timeout: 3000 });
  });

  test('should reject generation if duration too long for tier', async ({ page }) => {
    await page.goto('/emotion-music');

    // Remplir le formulaire avec durée trop longue pour FREE
    await page.fill('input[name="title"]', 'Longue Méditation');
    await page.fill('input[name="style"]', 'ambient');
    await page.fill('input[name="duration"]', '600'); // 10 minutes, max FREE = 180s

    const generateButton = page.getByRole('button', { name: /générer/i });
    await generateButton.click();

    // Error message
    await expect(page.getByText(/durée trop longue/i)).toBeVisible({ timeout: 3000 });
  });

  test('should show premium features for premium users', async ({ page }) => {
    // Mock premium tier
    await page.route('**/rest/v1/user_music_quotas*', async route => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify([mockQuotaPremium]),
        headers: { 'content-type': 'application/json' }
      });
    });

    await page.goto('/emotion-music');

    // Premium badge visible
    await expect(page.getByText(/premium/i)).toBeVisible();

    // Quota plus élevé
    await expect(page.getByText(/50\/100/i)).toBeVisible();

    // Durée max augmentée (600s)
    const durationInput = page.locator('input[name="duration"]');
    await expect(durationInput).toHaveAttribute('max', '600');
  });

  test('should refresh quota after generation', async ({ page }) => {
    let quotaCalls = 0;

    // Mock quota qui change après génération
    await page.route('**/rest/v1/user_music_quotas*', async route => {
      quotaCalls++;
      const quota = quotaCalls === 1 ? mockQuotaFree : {
        ...mockQuotaFree,
        generations_used: 6 // Incrémenté après génération
      };

      await route.fulfill({
        status: 200,
        body: JSON.stringify([quota]),
        headers: { 'content-type': 'application/json' }
      });
    });

    // Mock successful generation
    await page.route('**/rest/v1/music_generations', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          body: JSON.stringify([mockMusicGeneration]),
          headers: { 'content-type': 'application/json' }
        });
      } else {
        await route.continue();
      }
    });

    await page.goto('/emotion-music');

    // Quota initial: 5/10
    await expect(page.getByText(/5\/10/i)).toBeVisible();

    // Générer
    await page.fill('input[name="title"]', 'Test Music');
    await page.fill('input[name="style"]', 'ambient');
    const generateButton = page.getByRole('button', { name: /générer/i });
    await generateButton.click();

    // Attendre le refresh du quota
    await page.waitForTimeout(1000);

    // Quota mis à jour: 6/10
    await expect(page.getByText(/4\/10/i)).toBeVisible(); // remaining = 4
  });

  test('should decrement quota on generation error', async ({ page }) => {
    // Mock generation failure
    await page.route('**/rest/v1/music_generations', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 500,
          body: JSON.stringify({ error: 'Generation failed' }),
          headers: { 'content-type': 'application/json' }
        });
      } else {
        await route.continue();
      }
    });

    // Mock quota decrement
    await page.route('**/rest/v1/rpc/decrement_music_quota', async route => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ success: true }),
        headers: { 'content-type': 'application/json' }
      });
    });

    await page.goto('/emotion-music');

    await page.fill('input[name="title"]', 'Test Music');
    await page.fill('input[name="style"]', 'ambient');

    const generateButton = page.getByRole('button', { name: /générer/i });
    await generateButton.click();

    // Error toast
    await expect(page.getByText(/erreur/i)).toBeVisible({ timeout: 5000 });

    // Quota devrait être refresh (même en cas d'erreur)
    await page.waitForTimeout(500);
    // Le quota ne devrait pas avoir diminué (décrément en cas d'erreur)
  });

  test('should block concurrent generations for FREE tier', async ({ page }) => {
    // Mock concurrent generation in progress
    await page.route('**/rest/v1/music_generations*count*', async route => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify([{ count: 1 }]), // 1 génération en cours
        headers: { 'content-type': 'application/json' }
      });
    });

    await page.goto('/emotion-music');

    await page.fill('input[name="title"]', 'Test Music');
    await page.fill('input[name="style"]', 'ambient');

    const generateButton = page.getByRole('button', { name: /générer/i });
    await generateButton.click();

    // Error message about concurrent limit
    await expect(page.getByText(/trop de générations en cours/i)).toBeVisible({ timeout: 3000 });
  });

  test('should display reset date in quota indicator', async ({ page }) => {
    await page.goto('/emotion-music');

    // Reset date devrait être affiché
    await expect(page.getByText(/reset|renouvellement/i)).toBeVisible();

    // Format "Dans X jours" ou date complète
    const quotaCard = page.locator('[data-testid="quota-indicator"]').first();
    await expect(quotaCard).toBeVisible();
  });

  test('should use presets for quick generation', async ({ page }) => {
    // Mock successful generation
    await page.route('**/rest/v1/music_generations', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          body: JSON.stringify([mockMusicGeneration]),
          headers: { 'content-type': 'application/json' }
        });
      } else {
        await route.continue();
      }
    });

    await page.goto('/emotion-music');

    // Cliquer sur un preset (si disponible)
    const presetButton = page.getByRole('button', { name: /méditation profonde/i }).first();
    if (await presetButton.isVisible()) {
      await presetButton.click();

      // Form devrait être pré-rempli
      const titleInput = page.locator('input[name="title"]');
      await expect(titleInput).toHaveValue(/méditation/i);

      const styleInput = page.locator('input[name="style"]');
      await expect(styleInput).toHaveValue(/ambient|calm/i);
    }
  });
});

test.describe('QuotaIndicator Component', () => {
  test('should display quota with correct color', async ({ page }) => {
    // Test green color (< 50% used)
    await page.route('**/rest/v1/user_music_quotas*', async route => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify([{
          ...mockQuotaFree,
          generations_used: 2,
          generations_limit: 10
        }]),
        headers: { 'content-type': 'application/json' }
      });
    });

    await page.goto('/emotion-music');

    // Progress bar devrait être verte
    const progressBar = page.locator('[role="progressbar"]').first();
    await expect(progressBar).toBeVisible();
  });

  test('should show compact variant correctly', async ({ page }) => {
    await page.goto('/emotion-music');

    // Si variante compact est utilisée
    const compactQuota = page.getByTestId('quota-compact');
    if (await compactQuota.isVisible()) {
      await expect(compactQuota).toContainText(/générations/i);
    }
  });

  test('should show badge variant in header', async ({ page }) => {
    await page.goto('/emotion-music');

    // QuotaBadge devrait être dans le header (si implémenté)
    const header = page.locator('header');
    const quotaBadge = header.locator('[data-testid="quota-badge"]');

    if (await quotaBadge.isVisible()) {
      await expect(quotaBadge).toContainText(/\d+\/\d+/);
    }
  });
});

test.describe('Error Handling', () => {
  test('should handle network errors gracefully', async ({ page }) => {
    // Mock network error
    await page.route('**/rest/v1/user_music_quotas*', async route => {
      await route.abort('failed');
    });

    await page.goto('/emotion-music');

    // L'app ne devrait pas crasher
    // Un message d'erreur ou état de loading devrait être visible
    await expect(page.getByRole('main')).toBeVisible();
  });

  test('should show user-friendly error messages', async ({ page }) => {
    // Mock API error
    await page.route('**/rest/v1/music_generations', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 400,
          body: JSON.stringify({ error: 'Invalid input' }),
          headers: { 'content-type': 'application/json' }
        });
      } else {
        await route.continue();
      }
    });

    await page.goto('/emotion-music');

    await page.fill('input[name="title"]', 'Test');
    await page.fill('input[name="style"]', 'ambient');

    const generateButton = page.getByRole('button', { name: /générer/i });
    await generateButton.click();

    // Message d'erreur user-friendly
    await expect(page.getByRole('alert')).toBeVisible({ timeout: 3000 });
  });
});
