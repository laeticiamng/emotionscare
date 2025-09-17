import { test, expect } from '@playwright/test';

/**
 * Parcours E2E principaux pour un utilisateur B2C authentifié.
 * Couvre la connexion, le dashboard, le scanner émotionnel,
 * l'historique, le module MoodMixer et l'expérience Flash Glow.
 */

test.describe('B2C Experience - Parcours principaux', () => {
  test.skip(({ }, testInfo) => testInfo.project.name !== 'b2c-chromium');

  test.describe('Authentification', () => {
    test.use({ storageState: undefined });

    test('permet de se connecter avec des identifiants valides', async ({ page }) => {
      const email = process.env.PW_B2C_EMAIL;
      const password = process.env.PW_B2C_PASSWORD;

      test.skip(!email || !password, 'Identifiants B2C manquants pour le test de connexion');

      await page.goto('/login?segment=b2c');

      await page.getByLabel(/Adresse email/i).fill(email!);
      await page.getByLabel(/Mot de passe/i).fill(password!);
      await page.getByRole('button', { name: /Se connecter/i }).click();

      await expect(page.getByText(/Connexion réussie/i)).toBeVisible({ timeout: 20000 });

      await page.goto('/app/home');
      await expect(page).toHaveURL(/\/app\/home/);
      await expect(page.getByRole('heading', { name: /Bienvenue sur votre espace bien-être/i })).toBeVisible();
    });
  });

  test('affiche les actions rapides du dashboard et permet la navigation', async ({ page }) => {
    await page.goto('/app/home');

    const welcomeHeading = page.getByRole('heading', { name: /Bienvenue sur votre espace bien-être/i });
    await expect(welcomeHeading).toBeVisible({ timeout: 20000 });

    const scanLink = page.getByRole('link', { name: /Scanner mes émotions/i });
    await expect(scanLink).toBeVisible();

    await Promise.all([
      page.waitForURL(/\/app\/scan/),
      scanLink.click()
    ]);

    await expect(page).toHaveURL(/\/app\/scan/);
    await expect(page.getByRole('heading', { name: /Scanner Émotionnel IA/i })).toBeVisible();
  });

  test('réalise un scan émotionnel via les cartes et alimente l\'historique', async ({ page }) => {
    await page.goto('/app/scan');

    await expect(page.getByRole('heading', { name: /Scanner Émotionnel IA/i })).toBeVisible();

    const happyCard = page.getByRole('button', { name: /Heureux|😊/i }).first();
    await happyCard.click();

    const analyseButton = page.getByRole('button', { name: /Analyser mon humeur/i });
    await analyseButton.click();

    await expect(page.getByText(/Analyse en cours/i)).toBeVisible();

    const historyCard = page
      .locator('div')
      .filter({ has: page.getByRole('heading', { name: /Historique des Analyses/i }) })
      .first();

    await expect(historyCard.locator('text=/Happy/i').first()).toBeVisible({ timeout: 20000 });

    const historyCount = page.getByText(/Vos \d+ dernières analyses émotionnelles/);
    await expect(historyCount).toHaveText(/Vos [1-9]\d* dernières analyses émotionnelles/);
  });

  test('permet de sauvegarder et recharger une vibe dans MoodMixer', async ({ page }) => {
    await page.goto('/app/mood-mixer');

    await expect(page.getByRole('heading', { name: /Mood Mixer/i })).toBeVisible({ timeout: 20000 });

    const currentVibe = await page.locator('div:has(> p:text("Votre climat sonore")) h2').first().innerText();
    expect(currentVibe?.trim().length).toBeGreaterThan(0);

    await page.getByRole('button', { name: /Sauvegarder ce mix/i }).click();

    const vibePattern = new RegExp(currentVibe!.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    await expect(page.getByRole('heading', { name: vibePattern })).toBeVisible({ timeout: 10000 });

    const existingVibe = page.getByRole('heading', { name: /brise lagon/i }).first();
    await existingVibe.click();

    await expect(page.locator('div:has(> p:text("Votre climat sonore")) h2').first()).toHaveText(/brise lagon/i);
  });

  test('démarre et arrête une session Flash Glow', async ({ page }) => {
    await page.goto('/app/flash-glow');

    await expect(page.getByRole('heading', { name: /Flash Glow Ultra/i })).toBeVisible({ timeout: 20000 });

    const calmRadio = page.getByRole('radio', { name: /calm|sérénité/i }).first();
    await calmRadio.click();
    await expect(calmRadio).toHaveAttribute('aria-checked', 'true');

    const startButton = page.getByRole('button', { name: /Déclencher le Flash Glow/i });
    await startButton.click();

    const stopButton = page.getByRole('button', { name: /Arrêter/i });
    await expect(stopButton).toBeVisible({ timeout: 10000 });
    await stopButton.click();

    await expect(page.getByLabel(/Ressenti après séance/i)).toBeVisible();
    await expect(page.getByText(/Delta d'humeur/i)).toBeVisible();

    await expect(page.getByRole('button', { name: /Déclencher le Flash Glow/i })).toBeVisible();
  });

  test('parcours complet du bien-être b2c', async ({ page }) => {
    await page.goto('/app/home');

    await test.step('Dashboard accessible', async () => {
      const welcomeHeading = page.getByRole('heading', { name: /Bienvenue sur votre espace bien-être/i });
      await expect(welcomeHeading).toBeVisible({ timeout: 20000 });

      const scanLink = page.getByRole('link', { name: /Scanner mes émotions/i });
      await expect(scanLink).toBeVisible();

      await Promise.all([
        page.waitForURL(/\/app\/scan/),
        scanLink.click()
      ]);
    });

    await test.step('Emotion Scan et historique', async () => {
      await expect(page).toHaveURL(/\/app\/scan/);
      await expect(page.getByRole('heading', { name: /Scanner Émotionnel IA/i })).toBeVisible();

      const happyCard = page.getByRole('button', { name: /Heureux|😊/i }).first();
      await happyCard.click();

      const analyseButton = page.getByRole('button', { name: /Analyser mon humeur/i });
      await analyseButton.click();

      await expect(page.getByText(/Analyse en cours/i)).toBeVisible();

      const historyCard = page
        .locator('div')
        .filter({ has: page.getByRole('heading', { name: /Historique des Analyses/i }) })
        .first();

      await expect(historyCard.locator('text=/Happy/i').first()).toBeVisible({ timeout: 20000 });
    });

    await test.step('MoodMixer CRUD', async () => {
      await page.goto('/app/mood-mixer');

      await expect(page.getByRole('heading', { name: /Mood Mixer/i })).toBeVisible({ timeout: 20000 });

      const mixTitle = await page.locator('div:has(> p:text("Votre climat sonore")) h2').first().innerText();
      await page.getByRole('button', { name: /Sauvegarder ce mix/i }).click();

      const vibePattern = new RegExp(mixTitle.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      await expect(page.getByRole('heading', { name: vibePattern })).toBeVisible({ timeout: 10000 });

      const existingVibe = page.getByRole('heading', { name: /brise lagon/i }).first();
      await existingVibe.click();

      await expect(page.locator('div:has(> p:text("Votre climat sonore")) h2').first()).toHaveText(/brise lagon/i);
    });

    await test.step('Flash Glow complet', async () => {
      await page.goto('/app/flash-glow');

      await expect(page.getByRole('heading', { name: /Flash Glow Ultra/i })).toBeVisible({ timeout: 20000 });

      const startButton = page.getByRole('button', { name: /Déclencher le Flash Glow/i });
      await startButton.click();

      const stopButton = page.getByRole('button', { name: /Arrêter/i });
      await expect(stopButton).toBeVisible({ timeout: 10000 });
      await stopButton.click();

      await expect(page.getByLabel(/Ressenti après séance/i)).toBeVisible();
      await page.getByRole('button', { name: /Gain ressenti/i }).click();
      await expect(page.getByText(/Votre retour nous aide/i)).toBeVisible();
    });
  });
});
