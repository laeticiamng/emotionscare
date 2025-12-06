import { test, expect } from '@playwright/test';

/**
 * Tests E2E pour valider la matrice d'accès RBAC
 * Vérifie l'accès par rôle selon les spécifications RouterV2
 */

test.describe('Matrice d\'accès RBAC - Consumer', () => {
  test.beforeEach(async ({ page }) => {
    // Simuler connexion en tant que consumer/b2c
    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'consumer@test.com');
    await page.fill('[data-testid="password"]', 'password');
    await page.click('[data-testid="login-submit"]');
    await page.waitForURL('**/app/home');
  });

  test('Consumer - Dashboard exclusif et redirections', async ({ page }) => {
    // Accès à /app → redirigé vers /app/home
    await page.goto('/app');
    await expect(page).toHaveURL('/app/home');
    
    // Dashboard consumer accessible
    await expect(page.locator('[data-testid="consumer-dashboard"]')).toBeVisible();
    
    // Accès /app/collab → redirigé vers home
    await page.goto('/app/collab');
    await expect(page).toHaveURL('/app/home');
    
    // Accès /app/rh → 403 forbidden
    await page.goto('/app/rh');
    await expect(page).toHaveURL('/403');
  });

  test('Consumer - Modules perso accessibles', async ({ page }) => {
    // Modules fun-first accessibles
    await page.goto('/app/music');
    await expect(page.locator('[data-testid="music-page"]')).toBeVisible();
    
    await page.goto('/app/journal');
    await expect(page.locator('[data-testid="journal-page"]')).toBeVisible();
    
    await page.goto('/app/flash-glow');
    await expect(page.locator('[data-testid="flash-glow-page"]')).toBeVisible();
  });

  test('Consumer - Settings accessibles', async ({ page }) => {
    await page.goto('/settings/general');
    await expect(page.locator('[data-testid="settings-general"]')).toBeVisible();
    
    // Export CSV personnel uniquement
    const exportButton = page.locator('[data-testid="export-personal-data"]');
    await expect(exportButton).toBeVisible();
    await expect(page.locator('[data-testid="export-team-data"]')).not.toBeVisible();
  });
});

test.describe('Matrice d\'accès RBAC - Employee', () => {
  test.beforeEach(async ({ page }) => {
    // Simuler connexion en tant que employee/b2b_user
    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'employee@test.com');
    await page.fill('[data-testid="password"]', 'password');
    await page.click('[data-testid="login-submit"]');
    await page.waitForURL('**/app/collab');
  });

  test('Employee - Dashboard exclusif et redirections', async ({ page }) => {
    // Accès à /app → redirigé vers /app/collab
    await page.goto('/app');
    await expect(page).toHaveURL('/app/collab');
    
    // Dashboard employee accessible
    await expect(page.locator('[data-testid="employee-dashboard"]')).toBeVisible();
    
    // Accès /app/home → redirigé vers collab
    await page.goto('/app/home');
    await expect(page).toHaveURL('/app/collab');
    
    // Accès /app/rh → 403 forbidden
    await page.goto('/app/rh');
    await expect(page).toHaveURL('/403');
  });

  test('Employee - Modules perso accessibles', async ({ page }) => {
    // Modules accessibles depuis l'espace collaborateur
    await page.goto('/app/journal');
    await expect(page.locator('[data-testid="journal-page"]')).toBeVisible();
    
    await page.goto('/app/scan');
    await expect(page.locator('[data-testid="scan-page"]')).toBeVisible();
    
    await page.goto('/app/bubble-beat');
    await expect(page.locator('[data-testid="bubble-beat-page"]')).toBeVisible();
  });

  test('Employee - Heatmap interdite', async ({ page }) => {
    await page.goto('/app/scores');
    await expect(page).toHaveURL('/403');
  });
});

test.describe('Matrice d\'accès RBAC - Manager', () => {
  test.beforeEach(async ({ page }) => {
    // Simuler connexion en tant que manager/b2b_admin
    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'manager@test.com');
    await page.fill('[data-testid="password"]', 'password');
    await page.click('[data-testid="login-submit"]');
    await page.waitForURL('**/app/rh');
  });

  test('Manager - Dashboard RH exclusif', async ({ page }) => {
    // Accès à /app → redirigé vers /app/rh
    await page.goto('/app');
    await expect(page).toHaveURL('/app/rh');
    
    // Dashboard RH accessible
    await expect(page.locator('[data-testid="manager-dashboard"]')).toBeVisible();
    
    // Autres dashboards redirigent vers RH
    await page.goto('/app/collab');
    await expect(page).toHaveURL('/app/rh');
    
    await page.goto('/app/home');
    await expect(page).toHaveURL('/app/rh');
  });

  test('Manager - Modules perso depuis RH', async ({ page }) => {
    // Accès direct aux modules depuis RH
    await page.goto('/app/flash-glow');
    await expect(page.locator('[data-testid="flash-glow-page"]')).toBeVisible();
    
    await page.goto('/app/music');
    await expect(page.locator('[data-testid="music-page"]')).toBeVisible();
  });

  test('Manager - Heatmap accessible avec anonymat', async ({ page }) => {
    await page.goto('/app/scores');
    await expect(page.locator('[data-testid="heatmap-page"]')).toBeVisible();
    
    // Vérifier anonymisation (min 5 personnes)
    const teamData = page.locator('[data-testid="team-analytics"]');
    await expect(teamData).toBeVisible();
    
    // Vérifier absence de données individuelles
    await expect(page.locator('[data-testid="individual-data"]')).not.toBeVisible();
  });
});

test.describe('Aliases et redirections', () => {
  test('Aliases fonctionnels', async ({ page }) => {
    // /music → /app/music
    await page.goto('/music');
    await expect(page).toHaveURL('/app/music');
    
    // /journal → /app/journal  
    await page.goto('/journal');
    await expect(page).toHaveURL('/app/journal');
    
    // /dashboard → /app/home (si consumer)
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/app\/(home|collab|rh)/);
    
    // /settings → /settings/general
    await page.goto('/settings');
    await expect(page).toHaveURL('/settings/general');
  });

  test('B2C aliases redirigent correctement', async ({ page }) => {
    // /b2c/login → /login?segment=b2c
    await page.goto('/b2c/login');
    await expect(page).toHaveURL('/login?segment=b2c');
    
    // /b2c/register → /signup?segment=b2c
    await page.goto('/b2c/register');
    await expect(page).toHaveURL('/signup?segment=b2c');
  });
});