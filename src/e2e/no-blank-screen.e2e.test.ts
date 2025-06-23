import { test, expect } from '@playwright/test';
import fs from 'fs';

const routerSource = fs.readFileSync('src/router.tsx', 'utf8');
const paths = Array.from(routerSource.matchAll(/path:\s*['"]([^'":]+)['"]/g)).map(m => m[1]);
const uniquePaths = Array.from(new Set(paths)).filter(p => !p.includes(':'));

test.describe('no blank screens', () => {
  for (const route of uniquePaths) {
    test(`route ${route} renders content`, async ({ page }) => {
      const errors: any[] = [];
      page.on('pageerror', err => errors.push(err.message));
      page.on('console', msg => {
        if (msg.type() === 'error') errors.push(msg.text());
      });
      const response = await page.goto(route);
      expect(response?.ok()).toBeTruthy();
      const hasContent = await page.evaluate(() => document.body.innerText.trim().length > 0);
      expect(hasContent).toBeTruthy();
      expect(errors).toEqual([]);
    });
  }
});
