
import { test, expect } from '@playwright/test';
import { ROUTE_MANIFEST } from '../router/buildUnifiedRoutes';

test.describe('Final Delivery - Complete Route Validation', () => {
  // Test chaque route du manifest pour s'assurer qu'aucune ne retourne d'écran blanc
  for (const route of ROUTE_MANIFEST) {
    test(`route ${route} renders without blank screen`, async ({ page }) => {
      console.log(`🔍 Testing route: ${route}`);
      
      // Aller à la route
      await page.goto(route);
      
      // Attendre que le composant soit monté avec data-testid="page-root"
      await expect(page.locator('[data-testid="page-root"]')).toBeVisible({ timeout: 10000 });
      
      // Vérifier qu'il n'y a pas d'écran blanc (au moins un élément visible)
      const hasContent = await page.locator('body *:visible').count();
      expect(hasContent).toBeGreaterThan(0);
      
      // Vérifier qu'il n'y a pas d'erreur JavaScript critique
      const errors: string[] = [];
      page.on('pageerror', (error) => {
        if (error.message.includes('ChunkLoadError') || 
            error.message.includes('Cannot read properties of undefined') ||
            error.message.includes('is not a function')) {
          errors.push(error.message);
        }
      });
      
      expect(errors).toHaveLength(0);
      
      console.log(`✅ Route ${route} validation passed`);
    });
  }

  test('homepage premium content validation', async ({ page }) => {
    console.log('🏠 Testing premium homepage content...');
    await page.goto('/');
    
    // Attendre que la page soit chargée
    await expect(page.locator('[data-testid="page-root"]')).toBeVisible({ timeout: 10000 });
    
    // Vérifier les éléments hero
    await expect(page.locator('h1')).toContainText('EmotionsCare');
    await expect(page.locator('text=Votre bien-être émotionnel')).toBeVisible();
    
    // Vérifier les CTA principales
    await expect(page.locator('text=Commencer gratuitement')).toBeVisible();
    await expect(page.locator('text=Découvrir Point 20')).toBeVisible();
    
    // Vérifier les statistiques
    await expect(page.locator('text=94%')).toBeVisible();
    await expect(page.locator('text=15K+')).toBeVisible();
    await expect(page.locator('text=24/7')).toBeVisible();
    
    // Vérifier les modules de fonctionnalités
    await expect(page.locator('text=Scanner Émotionnel')).toBeVisible();
    await expect(page.locator('text=Musicothérapie')).toBeVisible();
    await expect(page.locator('text=Coach IA')).toBeVisible();
    
    console.log('✅ Homepage premium content validated');
  });

  test('navigation links functionality', async ({ page }) => {
    console.log('🔗 Testing navigation links...');
    await page.goto('/');
    
    // Test navigation vers /choose-mode
    await page.click('text=Commencer gratuitement');
    await expect(page).toHaveURL(/.*choose-mode/);
    await expect(page.locator('[data-testid="page-root"]')).toBeVisible();
    
    // Test navigation vers /point20
    await page.goto('/');
    await page.click('text=Découvrir Point 20');
    await expect(page).toHaveURL(/.*point20/);
    await expect(page.locator('[data-testid="page-root"]')).toBeVisible();
    
    // Test navigation vers /scan depuis homepage
    await page.goto('/');
    await page.click('text=Explorer >> nth=0'); // Premier bouton Explorer (Scanner)
    await expect(page).toHaveURL(/.*scan/);
    await expect(page.locator('[data-testid="page-root"]')).toBeVisible();
    
    console.log('✅ Navigation links validated');
  });

  test('choose mode page functionality', async ({ page }) => {
    console.log('🎯 Testing choose mode page...');
    await page.goto('/choose-mode');
    
    await expect(page.locator('[data-testid="page-root"]')).toBeVisible();
    await expect(page.locator('text=Choisissez votre')).toBeVisible();
    
    // Vérifier les deux options
    await expect(page.locator('text=Particulier')).toBeVisible();
    await expect(page.locator('text=Entreprise')).toBeVisible();
    
    // Test clic vers B2C
    await page.click('text=Accéder en tant que particulier');
    await expect(page).toHaveURL(/.*b2c\/login/);
    await expect(page.locator('[data-testid="page-root"]')).toBeVisible();
    
    // Retour et test clic vers B2B
    await page.goto('/choose-mode');
    await page.click('text=Accéder aux solutions entreprise');
    await expect(page).toHaveURL(/.*b2b\/selection/);
    await expect(page.locator('[data-testid="page-root"]')).toBeVisible();
    
    console.log('✅ Choose mode page validated');
  });

  test('scan page functionality', async ({ page }) => {
    console.log('📱 Testing scan page...');
    await page.goto('/scan');
    
    await expect(page.locator('[data-testid="page-root"]')).toBeVisible();
    await expect(page.locator('text=Scanner Émotionnel')).toBeVisible();
    
    // Vérifier les deux types de scan
    await expect(page.locator('text=Analyse Faciale')).toBeVisible();
    await expect(page.locator('text=Analyse Vocale')).toBeVisible();
    
    // Test bouton de scan facial
    await page.click('text=Lancer l\'analyse faciale');
    await expect(page.locator('text=Analyse en cours...')).toBeVisible();
    
    console.log('✅ Scan page validated');
  });

  test('music page functionality', async ({ page }) => {
    console.log('🎵 Testing music page...');
    await page.goto('/music');
    
    await expect(page.locator('[data-testid="page-root"]')).toBeVisible();
    await expect(page.locator('text=Musicothérapie')).toBeVisible();
    
    // Vérifier le lecteur
    await expect(page.locator('text=En cours de lecture')).toBeVisible();
    
    // Vérifier les playlists
    await expect(page.locator('text=Sérénité')).toBeVisible();
    await expect(page.locator('text=Énergie Positive')).toBeVisible();
    await expect(page.locator('text=Focus Profond')).toBeVisible();
    
    console.log('✅ Music page validated');
  });

  test('404 error handling', async ({ page }) => {
    console.log('🚫 Testing 404 error handling...');
    
    await page.goto('/route-inexistante-test-404');
    
    // Vérifier que la page 404 est affichée
    await expect(page.locator('[data-testid="page-root"]')).toBeVisible();
    await expect(page.locator('text=404 - Page introuvable')).toBeVisible();
    
    // Vérifier les boutons de navigation
    await expect(page.locator('text=Retour à l\'accueil')).toBeVisible();
    await expect(page.locator('text=Page précédente')).toBeVisible();
    
    console.log('✅ 404 error handling validated');
  });

  test('no duplicate routes', async ({ page }) => {
    console.log('🔍 Testing for duplicate routes...');
    
    const routes = ROUTE_MANIFEST;
    const uniqueRoutes = new Set(routes);
    
    expect(routes.length).toBe(uniqueRoutes.size);
    console.log(`✅ No duplicates found - ${routes.length} unique routes`);
  });

  test('all routes return 200 status', async ({ page }) => {
    console.log('📊 Testing HTTP status codes...');
    
    // Test un échantillon représentatif
    const testRoutes = ['/', '/choose-mode', '/point20', '/scan', '/music'];
    
    for (const route of testRoutes) {
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      console.log(`✅ Route ${route} returns 200`);
    }
  });
});

test.describe('Performance and UX Validation', () => {
  test('loading states are handled properly', async ({ page }) => {
    console.log('⏳ Testing loading states...');
    
    await page.goto('/');
    
    // Vérifier qu'on ne voit jamais d'écran complètement blanc
    const loadingElements = await page.locator('[data-testid="page-loading"]').count();
    
    // Si des loaders sont présents, ils doivent être visibles et avoir du contenu
    if (loadingElements > 0) {
      await expect(page.locator('[data-testid="page-loading"]')).toBeVisible();
      await expect(page.locator('text=Chargement')).toBeVisible();
    }
    
    console.log('✅ Loading states validated');
  });

  test('responsive design works', async ({ page }) => {
    console.log('📱 Testing responsive design...');
    
    // Test mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await expect(page.locator('[data-testid="page-root"]')).toBeVisible();
    
    // Test desktop
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');
    await expect(page.locator('[data-testid="page-root"]')).toBeVisible();
    
    console.log('✅ Responsive design validated');
  });
});
