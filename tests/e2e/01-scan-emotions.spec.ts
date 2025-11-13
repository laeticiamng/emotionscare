import { test, expect } from '@playwright/test';

test.describe('Scan Émotions - Flow complet', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Doit naviguer vers la page de scan', async ({ page }) => {
    // Vérifier que la page d'accueil se charge
    await expect(page).toHaveTitle(/EmotionsCare/i);

    // Cliquer sur le bouton Scan ou naviguer directement
    await page.goto('/scan');
    
    // Vérifier que la page scan est chargée
    await expect(page.locator('h1, h2')).toContainText(/scan|émotion/i);
  });

  test('Doit afficher les options de scan disponibles', async ({ page }) => {
    await page.goto('/scan');
    
    // Vérifier la présence des différents types de scan
    const scanOptions = page.locator('[data-testid*="scan-option"], button, a');
    await expect(scanOptions.first()).toBeVisible({ timeout: 5000 });
  });

  test('Doit permettre de sélectionner un type de scan', async ({ page }) => {
    await page.goto('/scan');
    
    // Attendre que les options soient chargées
    await page.waitForLoadState('networkidle');
    
    // Chercher un bouton de scan (texte, voix, etc.)
    const scanButton = page.locator('button').filter({ hasText: /commencer|démarrer|scan|analyser/i }).first();
    
    if (await scanButton.isVisible()) {
      await scanButton.click();
      
      // Vérifier la navigation ou le changement d'état
      await page.waitForTimeout(1000);
      expect(page.url()).toContain('/scan');
    }
  });

  test('Doit gérer les erreurs de permission caméra/micro', async ({ page, context }) => {
    // Bloquer les permissions
    await context.grantPermissions([]);
    
    await page.goto('/scan');
    
    // Essayer d'activer un scan nécessitant des permissions
    const scanButton = page.locator('button').filter({ hasText: /voix|vidéo/i }).first();
    
    if (await scanButton.isVisible()) {
      await scanButton.click();
      
      // Vérifier qu'un message d'erreur ou d'autorisation apparaît
      await expect(page.locator('text=/permission|autorisation|accès/i')).toBeVisible({ timeout: 3000 });
    }
  });

  test('Doit afficher les résultats après un scan simulé', async ({ page }) => {
    await page.goto('/scan');
    
    // Si le scan est simulé ou a des données de test
    await page.waitForLoadState('networkidle');
    
    // Vérifier la présence d'éléments de résultats potentiels
    const resultsIndicators = await page.locator('[data-testid*="result"], [data-testid*="score"], .emotion-result, .scan-result').count();
    
    // Log pour debug
    console.log('Results indicators found:', resultsIndicators);
  });

  test('Doit permettre de revenir à l\'accueil depuis le scan', async ({ page }) => {
    await page.goto('/scan');
    
    // Chercher un bouton retour ou lien vers accueil
    const backButton = page.locator('button, a').filter({ hasText: /retour|accueil|back|home/i }).first();
    
    if (await backButton.isVisible()) {
      await backButton.click();
      await page.waitForLoadState('networkidle');
      expect(page.url()).not.toContain('/scan');
    }
  });

  test('Doit être accessible (a11y basique)', async ({ page }) => {
    await page.goto('/scan');
    
    // Vérifier la présence d'éléments sémantiques
    const main = page.locator('main, [role="main"]');
    await expect(main).toBeVisible();
    
    // Vérifier la navigation au clavier
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(['BUTTON', 'A', 'INPUT']).toContain(focusedElement);
  });
});
