import { expect, test } from '@playwright/test';
import manifest from '../../scripts/routes/ROUTES_MANIFEST.json';

type ForbiddenPattern = { pattern: RegExp; label: string };

type ForbiddenDigit = { value: string; context: string };

const FORBIDDEN_TEXT_PATTERNS: ForbiddenPattern[] = [
  { pattern: /\bscores?\b/i, label: 'term "score"' },
  { pattern: /\bpoints?\b/i, label: 'term "points"' },
  { pattern: /%/, label: 'percent symbol "%"' },
];

const DIGIT_CONTEXT_ALLOWLIST: RegExp[] = [
  /30 derniers jours/i,
  /lissées sur 3 jours/i,
  /sur 8 semaines/i,
];

const auditedRoutes = manifest.routes
  .map((route) => route.path)
  .filter((path): path is string => typeof path === 'string')
  .filter((path) => path.startsWith('/app/') || path.startsWith('/b2b/'));

const uniqueRoutes = Array.from(new Set(auditedRoutes));

function findForbiddenDigits(text: string): ForbiddenDigit[] {
  const matches = text.matchAll(/\d+/g);
  const forbidden: ForbiddenDigit[] = [];

  for (const match of matches) {
    if (!match[0] || match.index == null) {
      continue;
    }

    const value = match[0];
    const start = Math.max(0, match.index - 40);
    const end = Math.min(text.length, match.index + value.length + 40);
    const context = text.slice(start, end);

    const isAllowed = DIGIT_CONTEXT_ALLOWLIST.some((pattern) => pattern.test(context));
    if (isAllowed) {
      continue;
    }

    forbidden.push({ value, context: context.trim() });
  }

  return forbidden;
}

test.describe('Clinical privacy text audit', () => {
  for (const path of uniqueRoutes) {
    test(`${path} should not expose clinical metrics`, async ({ page }) => {
      await page.goto(path);

      const rootLocator = page.locator('[data-testid="page-root"]');
      await expect(rootLocator).toBeVisible({ timeout: 5000 });

      const bodyText = await page.locator('body').innerText();
      const normalized = bodyText.replace(/\s+/g, ' ').trim();

      for (const { pattern, label } of FORBIDDEN_TEXT_PATTERNS) {
        const match = normalized.match(pattern);
        expect(match, `Forbidden ${label} detected on ${path}: "${match?.[0] ?? ''}"`).toBeNull();
      }

      const forbiddenDigits = findForbiddenDigits(normalized);
      expect(
        forbiddenDigits,
        forbiddenDigits
          .map((entry) => `value "${entry.value}" (context: "${entry.context}")`)
          .join(', ') ||
          undefined
      ).toEqual([]);
    });
  }
});
