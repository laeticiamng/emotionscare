import { expect, test } from '@playwright/test';

test.describe('Error handling experience', () => {
  test('renders shared 401 error view', async ({ page }) => {
    await page.goto('/401');

    const errorView = page.getByTestId('error-view');
    await expect(errorView).toBeVisible();
    await expect(errorView).toContainText('401');
    await expect(errorView).toContainText(/Non authentifié|Not authenticated/);
  });

  test('unknown routes redirect to the 404 error page', async ({ page }) => {
    await page.goto('/route-inexistante-e2e');
    await page.waitForURL(/\/404$/);

    const errorView = page.getByTestId('error-view');
    await expect(errorView).toBeVisible();
    await expect(errorView).toContainText('404');
    await expect(errorView).toContainText(/Page introuvable|Not found/);
  });

  test('page error boundary displays retry action and recovers', async ({ page }) => {
    await page.goto('/dev/error-boundary');

    await page.getByTestId('trigger-error').click();

    const retryButton = page.getByRole('button', { name: /Réessayer|Retry/i });
    await expect(retryButton).toBeVisible();

    await retryButton.click();
    await expect(retryButton).not.toBeVisible();
  });

  test('error toasts are deduplicated', async ({ page }) => {
    await page.goto('/dev/error-boundary');

    await page.getByTestId('trigger-toast-twice').click();

    await expect(page.locator('[data-sonner-toast]')).toHaveCount(1);
    const toast = page.locator('[data-sonner-toast]').first();
    await expect(toast).toHaveAttribute('aria-live', 'polite');
  });
});
