import { test, expect } from '@playwright/test';

const SUPABASE_FUNCTION_URL = '**/functions/v1/ai-emotion-analysis';
const SUPABASE_TABLE_URL = '**/rest/v1/emotion_scans*';

const credentialsAvailable = Boolean(process.env.PW_B2C_EMAIL && process.env.PW_B2C_PASSWORD);

test.describe('Emotion Scan → Dashboard', () => {
  test.skip(({ }, testInfo) => testInfo.project.name !== 'b2c-chromium');

  test('le widget dashboard reflète un scan récent', async ({ page }) => {
    test.skip(!credentialsAvailable, 'Identifiants B2C manquants pour le parcours complet.');

    const now = new Date();
    const insertedScan = {
      id: 'scan-e2e-1',
      user_id: 'stub-user-id',
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
      summary: 'Test e2e — sérénité retrouvée.',
      mood: 'serenite',
      confidence: 88,
      emotional_balance: 72,
      recommendations: ['Continuer les respirations en carré.'],
      insights: ['Baisse du stress après la session.'],
      scan_type: 'ipanassf',
      emotions: {
        scores: {
          joie: 7,
          confiance: 6,
          anticipation: 5,
          surprise: 3,
          tristesse: 1,
          colere: 0,
          peur: 0,
          degout: 0,
        },
        context: 'Auto-évaluation I-PANAS-SF',
      },
    };

    await page.route(SUPABASE_FUNCTION_URL, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          emotions: {
            joie: 0.7,
            confiance: 0.6,
            anticipation: 0.5,
            surprise: 0.3,
            tristesse: 0.1,
            colere: 0,
            peur: 0,
            degout: 0,
          },
          dominantEmotion: 'serenite',
          confidence: 0.88,
          insights: ['Respiration profonde recommandée.'],
          recommendations: ['Continuer les respirations en carré.'],
          emotionalBalance: 72,
        }),
      });
    });

    let persisted = false;
    await page.route(SUPABASE_TABLE_URL, async (route) => {
      const request = route.request();
      if (request.method() === 'POST') {
        persisted = true;
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify(insertedScan),
        });
        return;
      }

      // select history
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([insertedScan]),
      });
    });

    await page.goto('/login?segment=b2c');
    await page.getByLabel(/Adresse email/i).fill(process.env.PW_B2C_EMAIL!);
    await page.getByLabel(/Mot de passe/i).fill(process.env.PW_B2C_PASSWORD!);
    await page.getByRole('button', { name: /Se connecter/i }).click();

    await expect(page.getByText(/Connexion réussie/i)).toBeVisible({ timeout: 20000 });

    await page.goto('/app/scan');

    const radioInputs = page.locator('input[type="radio"]');
    await expect(radioInputs.first()).toBeVisible();
    const radioCount = await radioInputs.count();
    for (let index = 4; index < radioCount; index += 5) {
      await radioInputs.nth(index).check();
    }

    await page.getByRole('button', { name: /Calculer/i }).click();
    await expect(page.getByText(/Analyse de vos réponses/i)).toBeVisible();
    await expect.poll(() => persisted).toBeTruthy();

    await page.goto('/app/home');

    const widget = page.getByTestId('dashboard-emotion-scan');
    await expect(widget).toBeVisible();
    await expect(widget.getByTestId('emotion-scan-latest')).toContainText(/72/);
    await expect(widget.getByTestId('emotion-scan-timeline')).toContainText(/serenite/i);
  });
});
