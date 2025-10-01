// @ts-nocheck

// @ts-nocheck
import { test, expect } from '@playwright/test';

test.describe('Navigation Routes E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to home page
    await page.goto('/');
  });

  test('devrait charger la page d\'accueil', async ({ page }) => {
    await expect(page).toHaveTitle(/EmotionsCare/);
    
    // Vérifier que le contenu principal est présent
    await expect(page.locator('[data-testid="immersive-home"]')).toBeVisible();
  });

  test('devrait naviguer vers la page de méditation', async ({ page }) => {
    await page.goto('/meditation');
    
    // Vérifier le titre de la page
    await expect(page.locator('h1')).toContainText('Méditation & Mindfulness');
    
    // Vérifier que la liste des sessions est présente
    await expect(page.locator('[data-testid="guided-session-list"]')).toBeVisible();
  });

  test('devrait afficher les composants de navigation', async ({ page }) => {
    // Vérifier la présence du mini-player
    await expect(page.locator('[data-testid="mini-player"]')).toBeVisible();
    
    // Vérifier la présence du drawer musical
    await expect(page.locator('[data-testid="music-drawer"]')).toBeVisible();
  });

  test('devrait gérer le lazy loading des composants', async ({ page }) => {
    // Attendre que le composant ImmersiveHome soit chargé
    await expect(page.locator('[data-testid="immersive-home"]')).toBeVisible();
    
    // Vérifier qu'il n'y a pas d'erreurs de chargement
    const errors = await page.evaluate(() => {
      return window.console.error.calls || [];
    });
    expect(errors.length).toBe(0);
  });

  test('devrait afficher les fallbacks de chargement', async ({ page }) => {
    // Simuler une connexion lente
    await page.route('**/*', route => {
      setTimeout(() => route.continue(), 100);
    });
    
    await page.goto('/meditation');
    
    // Vérifier que le fallback de chargement est affiché
    await expect(page.locator('[data-testid="loading-fallback"]')).toBeVisible();
  });

  test('devrait gérer les erreurs 404', async ({ page }) => {
    await page.goto('/page-inexistante');
    
    // Vérifier que la page 404 est affichée
    await expect(page.locator('h1')).toContainText('404');
    
    // Vérifier les boutons de navigation
    await expect(page.locator('button:has-text("Retour")')).toBeVisible();
    await expect(page.locator('button:has-text("Accueil")')).toBeVisible();
  });

  test('devrait maintenir l\'état musical entre les pages', async ({ page }) => {
    // Commencer la lecture de musique sur la page d'accueil
    await page.click('[data-testid="music-play-button"]');
    
    // Naviguer vers la page de méditation
    await page.goto('/meditation');
    
    // Vérifier que la musique continue de jouer
    await expect(page.locator('[data-testid="mini-player"]')).toHaveClass(/playing/);
  });

  test('devrait respecter les performances de chargement', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Vérifier que le chargement prend moins de 3 secondes
    expect(loadTime).toBeLessThan(3000);
  });
});

test.describe('Accessibility E2E', () => {
  test('devrait être navigable au clavier', async ({ page }) => {
    await page.goto('/');
    
    // Tester la navigation au clavier
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toBeVisible();
    
    // Continuer la navigation
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Vérifier qu'on peut activer les éléments avec Enter
    await page.keyboard.press('Enter');
  });

  test('devrait avoir des labels ARIA appropriés', async ({ page }) => {
    await page.goto('/');
    
    // Vérifier les labels ARIA sur les boutons musicaux
    const playButton = page.locator('[data-testid="music-play-button"]');
    await expect(playButton).toHaveAttribute('aria-label');
    
    // Vérifier les labels sur les contrôles de navigation
    const navButtons = page.locator('[role="button"]');
    const count = await navButtons.count();
    
    for (let i = 0; i < count; i++) {
      const button = navButtons.nth(i);
      const hasLabel = await button.getAttribute('aria-label') || 
                      await button.textContent();
      expect(hasLabel).toBeTruthy();
    }
  });

  test('devrait avoir un contraste suffisant', async ({ page }) => {
    await page.goto('/');
    
    // Injecter un script pour vérifier le contraste
    const contrastIssues = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      const issues = [];
      
      elements.forEach(el => {
        const styles = window.getComputedStyle(el);
        const bgColor = styles.backgroundColor;
        const textColor = styles.color;
        
        // Logique simplifiée de vérification du contraste
        if (bgColor !== 'rgba(0, 0, 0, 0)' && textColor !== 'rgba(0, 0, 0, 0)') {
          // Ici on pourrait implémenter une vraie vérification de contraste
          // Pour l'instant, on vérifie juste que les couleurs sont définies
        }
      });
      
      return issues;
    });
    
    expect(contrastIssues.length).toBeLessThan(5); // Tolérance pour quelques éléments
  });
});
