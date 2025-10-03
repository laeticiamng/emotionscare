import { test, expect } from '@playwright/test';
import { OFFICIAL_ROUTES_ARRAY } from '../../src/routesManifest';

const bannedTerms = [/score/i, /dépression/i, /anxi[ée]t[ée]/i, /burnout/i, /%/];

test.describe('Clinical wording guard', () => {
  for (const route of OFFICIAL_ROUTES_ARRAY) {
    test(`route ${route} hides clinical wording`, async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.status()).toBeLessThan(400);

      const bodyText = await page.locator('body').innerText();
      for (const term of bannedTerms) {
        expect(bodyText).not.toMatch(term);
      }
    });
  }
});
