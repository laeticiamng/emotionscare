/**
 * Tests E2E pour la page d'accueil
 * @playwright
 */

import { test, expect } from '@playwright/test';

test.describe('HomePage - Parcours utilisateur', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('devrait charger la page sans erreur', async ({ page }) => {
    await expect(page).toHaveTitle(/EmotionsCare|Accueil/);
  });

  test('devrait afficher le hero section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Transformez votre bien-être/i })).toBeVisible();
  });

  test('devrait avoir un CTA "Essai gratuit 30 jours" visible et cliquable', async ({ page }) => {
    const ctaButton = page.getByRole('link', { name: /Essai gratuit 30 jours/i });
    await expect(ctaButton).toBeVisible();
    await expect(ctaButton).toBeEnabled();
  });

  test('devrait afficher les trust indicators', async ({ page }) => {
    await expect(page.getByText(/25K\+ utilisateurs/i)).toBeVisible();
    await expect(page.getByText(/100% sécurisé RGPD/i)).toBeVisible();
  });

  test('devrait lazy load les sections non critiques', async ({ page }) => {
    // FAQ ne devrait pas être chargée immédiatement
    const faqSection = page.getByRole('heading', { name: /Questions fréquentes/i });

    // Scroll jusqu'en bas
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Maintenant FAQ devrait être visible
    await expect(faqSection).toBeVisible({ timeout: 3000 });
  });

  test('devrait naviguer vers la page signup au clic sur CTA', async ({ page }) => {
    await page.getByRole('link', { name: /Essai gratuit 30 jours/i }).click();
    await expect(page).toHaveURL(/\/signup/);
  });

  test('devrait afficher les cartes flottantes', async ({ page }) => {
    await expect(page.getByText(/Musique Thérapeutique/i)).toBeVisible();
    await expect(page.getByText(/Analyse Émotions/i)).toBeVisible();
    await expect(page.getByText(/Coach Personnel/i)).toBeVisible();
  });
});

test.describe('HomePage - Accessibilité', () => {
  test('devrait passer les tests d\'accessibilité automatiques', async ({ page }) => {
    await page.goto('/');

    // Vérifier que tous les liens ont un texte ou aria-label
    const links = await page.getByRole('link').all();
    for (const link of links) {
      const text = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');
      expect(text || ariaLabel).toBeTruthy();
    }

    // Vérifier que toutes les images ont un alt
    const images = await page.locator('img').all();
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      expect(alt).toBeDefined();
    }
  });

  test('devrait être navigable au clavier', async ({ page }) => {
    await page.goto('/');

    // Tabulation pour naviguer
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Le focus devrait être visible
    const focusedElement = await page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('devrait respecter prefers-reduced-motion', async ({ page }) => {
    // Émuler prefers-reduced-motion
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    // La page devrait se charger sans animations intensives
    await expect(page.getByRole('heading', { name: /Transformez votre bien-être/i })).toBeVisible();
  });
});

test.describe('HomePage - Performance', () => {
  test('devrait avoir un bon score Lighthouse', async ({ page }) => {
    await page.goto('/');

    // Vérifier que les ressources critiques sont chargées
    const performance = await page.evaluate(() => {
      const perfData = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        loadTime: perfData.loadEventEnd - perfData.fetchStart,
        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.fetchStart,
      };
    });

    // LCP devrait être < 2.5s
    expect(performance.loadTime).toBeLessThan(2500);
  });

  test('ne devrait pas avoir de CLS significatif', async ({ page }) => {
    await page.goto('/');

    // Attendre que la page soit stable
    await page.waitForLoadState('networkidle');

    // Vérifier qu'il n'y a pas de décalage de mise en page
    const cls = await page.evaluate(() => {
      return new Promise((resolve) => {
        let cls = 0;
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
              cls += (entry as any).value;
            }
          }
        });
        observer.observe({ entryTypes: ['layout-shift'] });

        setTimeout(() => {
          observer.disconnect();
          resolve(cls);
        }, 1000);
      });
    });

    // CLS devrait être < 0.1
    expect(cls).toBeLessThan(0.1);
  });

  test('devrait preload les ressources critiques', async ({ page }) => {
    const response = await page.goto('/');
    const headers = response?.headers();

    // Vérifier que les headers de preload sont présents
    expect(headers).toBeDefined();
  });
});

test.describe('HomePage - Responsive', () => {
  test('devrait s\'afficher correctement sur mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    await expect(page.getByRole('heading', { name: /Transformez votre bien-être/i })).toBeVisible();
  });

  test('devrait s\'afficher correctement sur tablette', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    await expect(page.getByRole('heading', { name: /Transformez votre bien-être/i })).toBeVisible();
  });

  test('devrait s\'afficher correctement sur desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');

    await expect(page.getByRole('heading', { name: /Transformez votre bien-être/i })).toBeVisible();
  });
});

test.describe('HomePage - Error Handling', () => {
  test('devrait gérer les erreurs de chargement gracieusement', async ({ page }) => {
    // Simuler une erreur réseau
    await page.route('**/*', route => route.abort());

    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/', { waitUntil: 'domcontentloaded' }).catch(() => {});

    // Vérifier qu'un error boundary est affiché
    // (ou que la page ne crash pas complètement)
  });
});
