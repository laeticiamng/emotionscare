import { test, expect } from '@playwright/test';

test.describe('Navigation avec sidebar', () => {
  test.beforeEach(async ({ page }) => {
    // Mock auth pour simplifier les tests
    await page.goto('/login');
    // Simuler connexion ou utiliser test user
  });

  test('doit afficher la sidebar sur les pages protégées', async ({ page }) => {
    await page.goto('/app/modules');
    
    // Vérifier que la sidebar est visible
    const sidebar = page.locator('[data-sidebar="sidebar"]');
    await expect(sidebar).toBeVisible();
  });

  test('doit permettre de naviguer entre les modules', async ({ page }) => {
    await page.goto('/app/modules');
    
    // Cliquer sur un module dans la sidebar
    await page.getByRole('link', { name: 'Scan Émotionnel' }).click();
    
    // Vérifier navigation
    await expect(page).toHaveURL('/app/scan');
    
    // Vérifier que le lien est actif
    const activeLink = page.getByRole('link', { name: 'Scan Émotionnel' });
    await expect(activeLink).toHaveClass(/bg-primary/);
  });

  test('doit permettre de collapse/expand la sidebar', async ({ page }) => {
    await page.goto('/app/modules');
    
    // Trouver le trigger
    const trigger = page.locator('[data-sidebar="trigger"]');
    await expect(trigger).toBeVisible();
    
    // Cliquer pour collapse
    await trigger.click();
    
    // Vérifier que la sidebar est collapsed
    const sidebar = page.locator('[data-sidebar="sidebar"]');
    await expect(sidebar).toHaveAttribute('data-state', 'closed');
    
    // Cliquer pour expand
    await trigger.click();
    await expect(sidebar).toHaveAttribute('data-state', 'open');
  });

  test('doit afficher toutes les catégories de modules', async ({ page }) => {
    await page.goto('/app/modules');
    
    // Vérifier les catégories
    await expect(page.getByText('Modules Principaux')).toBeVisible();
    await expect(page.getByText('Bien-être')).toBeVisible();
    await expect(page.getByText('Jeux Fun-First')).toBeVisible();
    await expect(page.getByText('Social')).toBeVisible();
    await expect(page.getByText('Analytics')).toBeVisible();
    await expect(page.getByText('Configuration')).toBeVisible();
  });

  test('doit maintenir la sidebar ouverte lors de la navigation', async ({ page }) => {
    await page.goto('/app/modules');
    
    const sidebar = page.locator('[data-sidebar="sidebar"]');
    await expect(sidebar).toHaveAttribute('data-state', 'open');
    
    // Naviguer vers une autre page
    await page.getByRole('link', { name: 'Musique Adaptative' }).click();
    await expect(page).toHaveURL('/app/music');
    
    // Sidebar devrait toujours être ouverte
    await expect(sidebar).toHaveAttribute('data-state', 'open');
  });

  test('mobile: doit afficher le menu hamburger', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/app/modules');
    
    // Sur mobile, la sidebar devrait être cachée
    const sidebar = page.locator('[data-sidebar="sidebar"]');
    await expect(sidebar).toBeHidden();
    
    // Le trigger devrait être visible
    const trigger = page.locator('[data-sidebar="trigger"]');
    await expect(trigger).toBeVisible();
    
    // Ouvrir la sidebar mobile
    await trigger.click();
    await expect(sidebar).toBeVisible();
  });
});

test.describe('Dashboard des modules', () => {
  test('doit afficher tous les modules avec leurs informations', async ({ page }) => {
    await page.goto('/app/modules');
    
    // Vérifier le header
    await expect(page.getByRole('heading', { name: 'Tous les Modules' })).toBeVisible();
    
    // Vérifier les statistiques
    await expect(page.getByText(/modules totaux/i)).toBeVisible();
    await expect(page.getByText(/Modules actifs/i)).toBeVisible();
    
    // Vérifier qu'au moins un module est affiché
    await expect(page.getByText('Scan Émotionnel')).toBeVisible();
    await expect(page.getByText('Musique Adaptative')).toBeVisible();
  });

  test('doit afficher les badges de statut correctement', async ({ page }) => {
    await page.goto('/app/modules');
    
    // Vérifier les badges
    const activeBadges = page.getByText('Actif');
    await expect(activeBadges.first()).toBeVisible();
  });

  test('doit permettre d\'accéder à un module', async ({ page }) => {
    await page.goto('/app/modules');
    
    // Cliquer sur le bouton d'un module
    await page.getByRole('button', { name: 'Accéder au module' }).first().click();
    
    // Vérifier que la navigation a eu lieu
    await expect(page).not.toHaveURL('/app/modules');
  });

  test('doit afficher les catégories de modules', async ({ page }) => {
    await page.goto('/app/modules');
    
    // Vérifier les en-têtes de catégories
    await expect(page.getByRole('heading', { name: 'Core' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Wellness' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Games' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Social' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Analytics' })).toBeVisible();
  });
});

test.describe('Parcours utilisateur B2C', () => {
  test('parcours complet: login → dashboard → modules → scan', async ({ page }) => {
    // 1. Login
    await page.goto('/login');
    // Simuler login (à adapter selon votre méthode d'auth)
    
    // 2. Redirection vers dashboard
    await expect(page).toHaveURL(/\/app/);
    
    // 3. Aller vers modules dashboard
    await page.goto('/app/modules');
    await expect(page.getByRole('heading', { name: 'Tous les Modules' })).toBeVisible();
    
    // 4. Accéder au scan émotionnel
    await page.getByRole('link', { name: 'Scan Émotionnel' }).click();
    await expect(page).toHaveURL('/app/scan');
  });

  test('accessibilité: navigation au clavier', async ({ page }) => {
    await page.goto('/app/modules');
    
    // Tester la navigation au clavier
    await page.keyboard.press('Tab');
    
    // Le premier élément focusable devrait être le trigger
    const trigger = page.locator('[data-sidebar="trigger"]');
    await expect(trigger).toBeFocused();
    
    // Continuer la navigation
    await page.keyboard.press('Tab');
    
    // Le focus devrait aller sur un lien de navigation
    const firstLink = page.getByRole('link').first();
    await expect(firstLink).toBeFocused();
  });
});
