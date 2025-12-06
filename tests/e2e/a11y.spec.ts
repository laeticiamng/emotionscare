// @ts-nocheck
import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import manifest from '../../scripts/routes/ROUTES_MANIFEST.json';

const ADDITIONAL_ROUTES = [
  '/app/journal/new',
  '/app/mood-mixer',
  '/app/ambition-arcade',
  '/app/bounce-back',
  '/app/story-synth',
  '/app/boss-grit',
  '/app/mood-presets',
];

const allowedSegments = new Set(['public', 'consumer']);
const manifestRoutes = manifest.routes
  .filter((route) => allowedSegments.has(route.segment) && route.path.startsWith('/'))
  .map((route) => route.path);

const aliasRoutes = manifest.aliases
  .filter((alias) => alias.from.startsWith('/') && manifestRoutes.includes(alias.to))
  .map((alias) => alias.from);

const combinedRoutes = Array.from(
  new Set([...manifestRoutes, ...aliasRoutes, ...ADDITIONAL_ROUTES])
);

if (combinedRoutes.length < 52) {
  throw new Error(`Axe coverage requires 52 routes but only ${combinedRoutes.length} were found.`);
}

const ROUTES_FOR_AXE = combinedRoutes.slice(0, 52);

const shouldRunForProject = (projectName: string | undefined) =>
  projectName?.startsWith('b2c');

test.describe('Accessibilité AA/AAA', () => {
  test('le lien Aller au contenu principal est focusable', async ({ page }, testInfo) => {
    test.skip(!shouldRunForProject(testInfo.project.name), 'Test exécuté uniquement avec le profil B2C.');

    await page.goto('/');
    await page.keyboard.press('Tab');
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toBeVisible();
    await expect(skipLink).toBeFocused();
  });

  test('les champs du formulaire de connexion possèdent un label', async ({ page }, testInfo) => {
    test.skip(!shouldRunForProject(testInfo.project.name), 'Test exécuté uniquement avec le profil B2C.');

    await page.goto('/login');

    const inputs = page.locator('input[type="email"], input[type="password"]');
    const count = await inputs.count();

    for (let index = 0; index < count; index += 1) {
      const input = inputs.nth(index);
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledBy = await input.getAttribute('aria-labelledby');
      const inputId = await input.getAttribute('id');

      const hasAssociatedLabel = await (async () => {
        if (ariaLabel || ariaLabelledBy) {
          return true;
        }

        if (!inputId) {
          return false;
        }

        return (await page.locator(`label[for="${inputId}"]`).count()) > 0;
      })();

      expect(hasAssociatedLabel).toBeTruthy();
    }
  });

  test.describe('Scan axe-core des routes critiques', () => {
    for (const route of ROUTES_FOR_AXE) {
      test(`route ${route} sans violation critique`, async ({ page }, testInfo) => {
        test.skip(!shouldRunForProject(testInfo.project.name), 'Scan axe exécuté uniquement avec le profil B2C.');

        await page.goto(route, { waitUntil: 'networkidle' });
        await expect(page.locator('[data-testid="page-root"]').first()).toBeVisible({ timeout: 15000 });

        const accessibilityScanResults = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
          .analyze();

        const criticalViolations = accessibilityScanResults.violations.filter(
          (violation) => violation.impact === 'critical'
        );

        expect(criticalViolations).toEqual([]);
      });
    }
  });

  test('respect de prefers-reduced-motion sur le Mood Mixer', async ({ page }, testInfo) => {
    test.skip(!shouldRunForProject(testInfo.project.name), 'Test exécuté uniquement avec le profil B2C.');

    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/app/mood-mixer', { waitUntil: 'networkidle' });
    await expect(page.locator('[data-testid="page-root"]').first()).toBeVisible({ timeout: 15000 });

    const rootHasReducedMotionClass = await page.evaluate(() =>
      document.documentElement.classList.contains('reduced-motion')
    );
    expect(rootHasReducedMotionClass).toBeTruthy();

    const transitionDuration = await page
      .locator('[data-testid="mood-mixer-gradient"]')
      .evaluate((element) => getComputedStyle(element).transitionDuration);

    const durations = transitionDuration.split(',').map((value) => value.trim());
    const allDurationsAreZero = durations.every((duration) => duration === '0s');
    expect(allDurationsAreZero).toBeTruthy();
  });
});
