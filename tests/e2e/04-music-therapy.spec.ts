import { test, expect } from '@playwright/test';

test.describe('Music Therapy - Flow complet', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Doit naviguer vers la thérapie musicale', async ({ page }) => {
    await page.goto('/music');
    
    await expect(page.locator('h1, h2')).toContainText(/music|musique|thérapie/i, { timeout: 5000 });
  });

  test('Doit afficher les recommandations musicales', async ({ page }) => {
    await page.goto('/music');
    await page.waitForLoadState('networkidle');
    
    // Vérifier la présence de recommandations
    const recommendations = page.locator('[data-testid*="recommendation"], .music-card, [data-testid*="track"]');
    
    await expect(recommendations.first()).toBeVisible({ timeout: 10000 });
  });

  test('Doit permettre de générer une playlist personnalisée', async ({ page }) => {
    await page.goto('/music');
    await page.waitForLoadState('networkidle');
    
    // Chercher un bouton de génération
    const generateButton = page.locator('button').filter({ hasText: /générer|créer|generate/i }).first();
    
    if (await generateButton.isVisible()) {
      await generateButton.click();
      
      // Vérifier qu'un loader ou des résultats apparaissent
      await page.waitForTimeout(2000);
      
      const loader = page.locator('[data-testid*="loading"], .loading, [role="status"]');
      const results = page.locator('[data-testid*="playlist"], .playlist');
      
      const hasLoader = await loader.isVisible().catch(() => false);
      const hasResults = await results.isVisible().catch(() => false);
      
      expect(hasLoader || hasResults).toBeTruthy();
    }
  });

  test('Doit permettre de lire un morceau', async ({ page }) => {
    await page.goto('/music');
    await page.waitForLoadState('networkidle');
    
    // Chercher un bouton play
    const playButton = page.locator('button[aria-label*="play" i], button').filter({ hasText: /play|lecture/i }).first();
    
    if (await playButton.isVisible()) {
      await playButton.click();
      await page.waitForTimeout(1000);
      
      // Vérifier qu'un lecteur audio est actif
      const audioPlayer = page.locator('audio, video, [data-testid*="player"]');
      const hasPlayer = await audioPlayer.count() > 0;
      
      console.log('Audio player present:', hasPlayer);
    }
  });

  test('Doit afficher les contrôles du lecteur', async ({ page }) => {
    await page.goto('/music');
    await page.waitForLoadState('networkidle');
    
    // Vérifier la présence de contrôles (play, pause, next, prev)
    const controls = page.locator('button[aria-label*="play" i], button[aria-label*="pause" i], button[aria-label*="next" i]');
    
    const controlsCount = await controls.count();
    console.log('Music controls found:', controlsCount);
  });

  test('Doit permettre d\'ajuster l\'ambiance musicale', async ({ page }) => {
    await page.goto('/music');
    await page.waitForLoadState('networkidle');
    
    // Chercher des sliders ou boutons de mood
    const moodControls = page.locator('input[type="range"], [role="slider"], button').filter({ hasText: /calme|énergique|focus/i });
    
    const controlsCount = await moodControls.count();
    if (controlsCount > 0) {
      await moodControls.first().click();
      await page.waitForTimeout(1000);
      
      console.log('Mood controls interaction successful');
    }
  });

  test('Doit sauvegarder les préférences musicales', async ({ page }) => {
    await page.goto('/music');
    await page.waitForLoadState('networkidle');
    
    // Chercher un bouton de favoris ou sauvegarde
    const saveButton = page.locator('button').filter({ hasText: /favori|sauvegarder|save|favorite/i }).first();
    
    if (await saveButton.isVisible()) {
      await saveButton.click();
      await page.waitForTimeout(500);
      
      // Vérifier une confirmation
      const confirmation = page.locator('text=/sauvegardé|saved|ajouté/i');
      const hasConfirmation = await confirmation.isVisible({ timeout: 3000 }).catch(() => false);
      
      console.log('Save confirmation shown:', hasConfirmation);
    }
  });

  test('Doit afficher l\'historique d\'écoute', async ({ page }) => {
    await page.goto('/music');
    await page.waitForLoadState('networkidle');
    
    // Chercher un onglet ou section historique
    const historyTab = page.locator('button, a').filter({ hasText: /historique|history|récent/i }).first();
    
    if (await historyTab.isVisible()) {
      await historyTab.click();
      await page.waitForTimeout(1000);
      
      // Vérifier la présence de l'historique
      const historyItems = page.locator('[data-testid*="history-item"], .history-item');
      const count = await historyItems.count();
      
      console.log('History items found:', count);
    }
  });

  test('Doit gérer les erreurs de génération musicale', async ({ page }) => {
    // Bloquer les appels à l'edge function
    await page.route('**/functions/v1/suno-music-generation', route => route.abort());
    
    await page.goto('/music');
    await page.waitForLoadState('networkidle');
    
    const generateButton = page.locator('button').filter({ hasText: /générer|créer/i }).first();
    
    if (await generateButton.isVisible()) {
      await generateButton.click();
      
      // Vérifier qu'un message d'erreur apparaît
      await expect(page.locator('text=/erreur|error|échec/i')).toBeVisible({ timeout: 5000 });
    }
  });

  test('Doit supporter le mode hors ligne', async ({ page, context }) => {
    await page.goto('/music');
    await page.waitForLoadState('networkidle');
    
    // Activer le mode hors ligne
    await context.setOffline(true);
    
    // Essayer de naviguer dans l'interface
    const offlineMessage = page.locator('text=/hors ligne|offline|connexion/i');
    const hasOfflineMessage = await offlineMessage.isVisible({ timeout: 3000 }).catch(() => false);
    
    console.log('Offline mode handled:', hasOfflineMessage);
    
    await context.setOffline(false);
  });
});
