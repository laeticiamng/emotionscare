import { test, expect } from '@playwright/test';
import manifest from '../../scripts/routes/ROUTES_MANIFEST.json';

test.describe('RouterV2 - Validation Finale Complète', () => {
  test('toutes les routes du manifeste se chargent sans erreur 404', async ({ page }) => {
    console.log(`🔍 Test de ${manifest.routes.length} routes canoniques`);
    
    for (const route of manifest.routes) {
      // Ignorer les routes qui nécessitent une authentification pour ce test
      if (route.guard && route.path.startsWith('/app/')) {
        continue;
      }
      
      console.log(`Testing: ${route.path} (${route.component})`);
      
      const response = await page.goto(route.path);
      
      // Vérifier que la route ne retourne pas 404
      expect(response?.status()).not.toBe(404);
      
      // Vérifier que l'élément page-root est présent
      await expect(page.locator('[data-testid="page-root"]')).toBeVisible({ timeout: 10000 });
      
      // Vérifier qu'il y a du contenu (pas d'écran blanc)
      const hasContent = await page.locator('body *:visible').count();
      expect(hasContent).toBeGreaterThan(0);
      
      console.log(`✅ ${route.path} - OK`);
    }
  });

  test('tous les aliases redirigent correctement', async ({ page }) => {
    console.log(`🔍 Test de ${manifest.aliases.length} aliases`);
    
    for (const alias of manifest.aliases) {
      console.log(`Testing alias: ${alias.from} → ${alias.to}`);
      
      await page.goto(alias.from);
      
      // Attendre la redirection
      await page.waitForURL(alias.to, { timeout: 5000 });
      expect(page.url()).toContain(alias.to);
      
      // Vérifier que la page de destination se charge
      await expect(page.locator('[data-testid="page-root"]')).toBeVisible({ timeout: 5000 });
      
      console.log(`✅ ${alias.from} → ${alias.to} - OK`);
    }
  });

  test('validation de l\'unicité des routes', async () => {
    const paths = manifest.routes.map(r => r.path);
    const uniquePaths = new Set(paths);
    
    expect(paths.length).toBe(uniquePaths.size);
    console.log(`✅ ${paths.length} routes uniques validées`);
  });

  test('validation de l\'unicité des noms', async () => {
    const names = manifest.routes.map(r => r.name);
    const uniqueNames = new Set(names);
    
    expect(names.length).toBe(uniqueNames.size);
    console.log(`✅ ${names.length} noms uniques validés`);
  });

  test('toutes les routes ont les propriétés requises', async () => {
    for (const route of manifest.routes) {
      expect(route.name).toBeTruthy();
      expect(route.path).toBeTruthy();
      expect(route.component).toBeTruthy();
      expect(route.segment).toBeTruthy();
      
      // Vérifier que les segments sont valides
      expect(['public', 'consumer', 'employee', 'manager']).toContain(route.segment);
      
      // Si guard est true, alors role ou allowedRoles doit être défini
      if (route.guard) {
        expect(route.role || route.allowedRoles).toBeTruthy();
      }
    }
    
    console.log(`✅ Validation des propriétés pour ${manifest.routes.length} routes`);
  });

  test('page 404 gère les routes inexistantes', async ({ page }) => {
    const nonExistentRoute = '/route-inexistante-test-final-' + Date.now();
    
    await page.goto(nonExistentRoute);
    
    // Vérifier que l'élément page-root est présent
    await expect(page.locator('[data-testid="page-root"]')).toBeVisible({ timeout: 5000 });
    
    // Vérifier que du contenu 404 est affiché
    await expect(page.locator(':text("404")')).toBeVisible();
    
    console.log(`✅ Gestion 404 validée pour ${nonExistentRoute}`);
  });

  test('pas de boutons morts sur la page d\'accueil', async ({ page }) => {
    await page.goto('/');
    
    // Attendre que la page se charge
    await expect(page.locator('[data-testid="page-root"]')).toBeVisible();
    
    // Trouver tous les liens et boutons
    const links = await page.locator('a[href], button').all();
    console.log(`🔍 Vérification de ${links.length} liens/boutons sur la page d'accueil`);
    
    let deadLinks = 0;
    
    for (const link of links) {
      const href = await link.getAttribute('href');
      const text = await link.textContent();
      
      if (href && href.startsWith('/')) {
        // Vérifier que le lien n'est pas mort
        const response = await page.request.get(href);
        if (response.status() === 404) {
          console.error(`❌ Lien mort: "${text}" → ${href}`);
          deadLinks++;
        }
      }
    }
    
    expect(deadLinks).toBe(0);
    console.log(`✅ Aucun bouton mort détecté sur la page d'accueil`);
  });

  test('RouterV2 est bien monté et fonctionnel', async ({ page }) => {
    // Vérifier que le routeur fonctionne en naviguant entre plusieurs pages
    const testRoutes = ['/', '/about', '/contact', '/help'];
    
    for (const route of testRoutes) {
      await page.goto(route);
      await expect(page.locator('[data-testid="page-root"]')).toBeVisible();
      expect(page.url()).toContain(route);
    }
    
    console.log(`✅ RouterV2 navigation validée sur ${testRoutes.length} routes`);
  });

  test('métriques finales du nettoyage', async () => {
    const totalRoutes = manifest.routes.length;
    const totalAliases = manifest.aliases.length;
    const guardedRoutes = manifest.routes.filter(r => r.guard).length;
    const publicRoutes = manifest.routes.filter(r => r.segment === 'public').length;
    
    console.log(`📊 MÉTRIQUES FINALES:`);
    console.log(`   • Routes totales: ${totalRoutes}`);
    console.log(`   • Aliases: ${totalAliases}`);
    console.log(`   • Routes protégées: ${guardedRoutes}`);
    console.log(`   • Routes publiques: ${publicRoutes}`);
    console.log(`   • Version du manifeste: ${manifest.version}`);
    
    // Vérifications de sanité
    expect(totalRoutes).toBeGreaterThanOrEqual(40); // Au moins 40 routes
    expect(totalAliases).toBeGreaterThanOrEqual(10); // Au moins 10 aliases
    expect(guardedRoutes).toBeGreaterThanOrEqual(15); // Au moins 15 routes protégées
    expect(publicRoutes).toBeGreaterThanOrEqual(10); // Au moins 10 routes publiques
    
    console.log(`✅ RouterV2 COMPLÈTEMENT OPÉRATIONNEL`);
  });
});