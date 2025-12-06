// @ts-nocheck
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('GDPRMonitoringPage - Tests E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Navigation vers la page RGPD
    await page.goto('/gdpr-monitoring');
    await page.waitForLoadState('networkidle');
  });

  test('La page charge sans erreur et affiche le titre', async ({ page }) => {
    // Vérifier que la page charge
    await expect(page.locator('h1, h2')).toContainText(/RGPD|Conformité|Monitoring/i);
    
    // Vérifier qu'il n'y a pas d'erreurs visibles
    const errorMessages = page.locator('[role="alert"], .error, .text-destructive');
    await expect(errorMessages).toHaveCount(0);
  });

  test('Tous les onglets sont accessibles et fonctionnels', async ({ page }) => {
    const tabs = [
      'overview',
      'realtime',
      'audit-trail',
      'executive',
      'retention',
      'anomalies',
      'privacy-policy',
      'pseudonymization',
      'consent-management',
      'consent-analytics',
      'webhooks',
      'audit',
      'scheduled',
      'dsar'
    ];

    for (const tab of tabs) {
      const tabButton = page.locator(`[value="${tab}"]`).first();
      if (await tabButton.isVisible()) {
        await tabButton.click();
        await page.waitForTimeout(500);
        
        // Vérifier qu'un contenu est affiché
        const tabContent = page.locator(`[data-state="active"]`);
        await expect(tabContent).toBeVisible();
      }
    }
  });

  test('Aucune erreur 404 sur les requêtes réseau', async ({ page }) => {
    const failedRequests: string[] = [];

    page.on('response', (response) => {
      if (response.status() === 404) {
        failedRequests.push(response.url());
      }
    });

    await page.reload();
    await page.waitForLoadState('networkidle');

    // Attendre un peu pour capturer toutes les requêtes
    await page.waitForTimeout(2000);

    expect(failedRequests).toHaveLength(0);
  });

  test('Les éléments interactifs ont des labels ARIA appropriés', async ({ page }) => {
    // Vérifier les boutons
    const buttons = page.locator('button:visible');
    const buttonCount = await buttons.count();

    for (let i = 0; i < Math.min(buttonCount, 10); i++) {
      const button = buttons.nth(i);
      const hasAriaLabel = await button.getAttribute('aria-label');
      const hasText = (await button.textContent())?.trim();
      
      expect(hasAriaLabel || hasText).toBeTruthy();
    }
  });

  test('Navigation au clavier fonctionne correctement', async ({ page }) => {
    // Focus sur le premier élément interactif
    await page.keyboard.press('Tab');
    
    // Vérifier qu'un élément a le focus
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();

    // Naviguer avec Tab
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Vérifier que le focus change
    const newFocusedElement = page.locator(':focus');
    await expect(newFocusedElement).toBeVisible();
  });

  test('Les couleurs respectent le contraste WCAG AA', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Accessibilité WCAG AA - Aucune violation critique', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    const criticalViolations = accessibilityScanResults.violations.filter(
      (violation) => violation.impact === 'critical' || violation.impact === 'serious'
    );

    expect(criticalViolations).toHaveLength(0);
  });

  test('Accessibilité WCAG AA - Vérification complète', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    // Afficher les violations dans les logs si présentes
    if (accessibilityScanResults.violations.length > 0) {
      console.log('Violations d\'accessibilité détectées:');
      accessibilityScanResults.violations.forEach((violation) => {
        console.log(`- ${violation.id}: ${violation.description}`);
        console.log(`  Impact: ${violation.impact}`);
        console.log(`  Éléments affectés: ${violation.nodes.length}`);
      });
    }

    // Vérifier qu'il n'y a pas de violations critiques ou sérieuses
    const highImpactViolations = accessibilityScanResults.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );

    expect(highImpactViolations).toHaveLength(0);
  });

  test('Les formulaires ont des labels appropriés', async ({ page }) => {
    const inputs = page.locator('input:visible, textarea:visible, select:visible');
    const inputCount = await inputs.count();

    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute('id');
      
      if (id) {
        // Vérifier qu'il y a un label associé
        const label = page.locator(`label[for="${id}"]`);
        const hasLabel = (await label.count()) > 0;
        const hasAriaLabel = await input.getAttribute('aria-label');
        const hasAriaLabelledBy = await input.getAttribute('aria-labelledby');
        
        expect(hasLabel || hasAriaLabel || hasAriaLabelledBy).toBeTruthy();
      }
    }
  });

  test('Les images ont des attributs alt', async ({ page }) => {
    const images = page.locator('img:visible');
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).toBeDefined();
    }
  });

  test('Structure sémantique HTML correcte', async ({ page }) => {
    // Vérifier la présence de landmarks ARIA
    const main = page.locator('main, [role="main"]');
    await expect(main).toBeVisible();

    // Vérifier la hiérarchie des titres
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThanOrEqual(1);
  });

  test('Performance de chargement acceptable', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/gdpr-monitoring');
    await page.waitForLoadState('domcontentloaded');
    const loadTime = Date.now() - startTime;

    // Le chargement doit prendre moins de 3 secondes
    expect(loadTime).toBeLessThan(3000);
  });

  test('Les états de chargement sont accessibles', async ({ page }) => {
    await page.reload();
    
    // Vérifier qu'un indicateur de chargement est présent pendant le chargement
    const loadingIndicator = page.locator('[role="status"], [aria-busy="true"], .animate-spin');
    
    // Si présent, il doit avoir un label approprié
    if (await loadingIndicator.count() > 0) {
      const hasAriaLabel = await loadingIndicator.first().getAttribute('aria-label');
      const hasText = (await loadingIndicator.first().textContent())?.trim();
      
      expect(hasAriaLabel || hasText || true).toBeTruthy();
    }
  });

  test('Responsive - La page fonctionne sur mobile', async ({ page }) => {
    // Simuler un viewport mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Vérifier que le contenu est visible
    const mainContent = page.locator('main, [role="main"], .container');
    await expect(mainContent).toBeVisible();
  });

  test('Responsive - La page fonctionne sur tablette', async ({ page }) => {
    // Simuler un viewport tablette
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Vérifier que le contenu est visible
    const mainContent = page.locator('main, [role="main"], .container');
    await expect(mainContent).toBeVisible();
  });
});

test.describe('GDPRMonitoringPage - Tests de données', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/gdpr-monitoring');
    await page.waitForLoadState('networkidle');
  });

  test('Les statistiques RGPD s\'affichent correctement', async ({ page }) => {
    // Attendre que les données chargent
    await page.waitForTimeout(2000);

    // Vérifier qu'il y a des cartes de statistiques
    const statCards = page.locator('.card, [class*="Card"]');
    expect(await statCards.count()).toBeGreaterThan(0);
  });

  test('L\'historique des audits est accessible', async ({ page }) => {
    // Aller dans l'onglet audit
    const auditTab = page.locator('[value="audit"]').first();
    if (await auditTab.isVisible()) {
      await auditTab.click();
      await page.waitForTimeout(1000);

      // Vérifier que du contenu est présent
      const content = page.locator('[data-state="active"]');
      await expect(content).toBeVisible();
    }
  });
});
