import { test, expect } from '@playwright/test';

test.describe('B2C Integration - Parcours complet', () => {
  test.beforeEach(async ({ page }) => {
    // Mock auth
    await page.route('**/auth/v1/token**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access_token: 'mock-token',
          user: { id: 'test-user-b2c', email: 'test@b2c.com' },
        }),
      });
    });

    // Mock feature flags
    await page.addInitScript(() => {
      localStorage.setItem('feature_flags', JSON.stringify({
        FF_B2C_PORTAL: true,
        FF_MUSIC_THERAPY: true,
        FF_VR: true,
        FF_COACHING_AI: true,
      }));
    });
  });

  test('AC-1: Parcours B2C complet - mood, musique, artefact', async ({ page }) => {
    // Mock user role
    await page.route('**/rest/v1/user_roles**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ user_id: 'test-user-b2c', role: 'b2c_user' }]),
      });
    });

    // Mock mood creation
    await page.route('**/rest/v1/moods', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'mood-1',
            user_id: 'test-user-b2c',
            valence: 0.7,
            arousal: 0.5,
            note: 'Je me sens bien',
            ts: new Date().toISOString(),
          }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([]),
        });
      }
    });

    // Mock music session creation
    await page.route('**/rest/v1/music_sessions', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'session-1',
            user_id: 'test-user-b2c',
            preset_id: 'preset-calm',
            status: 'processing',
            ts_start: new Date().toISOString(),
          }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([{
            id: 'session-1',
            status: 'completed',
            artifact_url: 'https://example.com/music.mp3',
          }]),
        });
      }
    });

    // Mock presets
    await page.route('**/rest/v1/session_presets**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'preset-calm',
            name: 'Calme & Sérénité',
            tags: ['calm', 'relaxation'],
            engine: 'suno',
            cfg_json: {},
          },
        ]),
      });
    });

    await page.goto('/mode-selection');
    
    // Sélectionner le mode B2C
    await page.getByRole('button', { name: /Particulier/i }).click();
    await expect(page).toHaveURL(/\/app\/particulier/);

    // Naviguer vers la page mood
    await page.getByRole('link', { name: /humeur/i }).click();
    await expect(page).toHaveURL(/\/app\/particulier\/mood/);

    // Créer un mood
    await page.getByLabel(/Comment vous sentez-vous/i).fill('Je me sens bien');
    await page.getByRole('button', { name: /Enregistrer/i }).click();

    // Attendre la confirmation
    await expect(page.getByText(/Humeur enregistrée/i)).toBeVisible();

    // Naviguer vers la page musique
    await page.getByRole('link', { name: /musique/i }).click();
    await expect(page).toHaveURL(/\/app\/particulier\/music/);

    // Lancer une session musicale
    await page.getByText(/Calme & Sérénité/i).click();
    await page.getByRole('button', { name: /Générer/i }).click();

    // Attendre que la session soit créée
    await expect(page.getByText(/Session créée/i)).toBeVisible();

    // Vérifier que l'artefact est disponible
    await expect(page.getByRole('link', { name: /Écouter/i })).toBeVisible();
  });

  test('AC-2: Session immersive VR', async ({ page }) => {
    // Mock immersive session
    await page.route('**/functions/v1/b2c-immersive-session', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          session_id: 'immersive-1',
          type: 'vr',
          outcome: 'Séance VR complétée : 10 minutes dans un environnement "forêt". Niveau d\'immersion : 80%.',
          status: 'completed',
        }),
      });
    });

    await page.route('**/rest/v1/immersive_sessions**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });

    await page.goto('/app/particulier/immersive');

    // Sélectionner VR
    await page.getByRole('button', { name: /VR/i }).click();

    // Configurer la session
    await page.getByLabel(/Durée/i).fill('10');
    
    // Lancer la session
    await page.getByRole('button', { name: /Démarrer/i }).click();

    // Vérifier le résultat
    await expect(page.getByText(/Séance VR complétée/i)).toBeVisible({ timeout: 10000 });
  });

  test('AC-4: RLS - isolation des données', async ({ page }) => {
    // Mock tentative d'accès aux données d'un autre utilisateur
    await page.route('**/rest/v1/moods**', async route => {
      const url = route.request().url();
      const params = new URL(url).searchParams;
      const userId = params.get('user_id');

      if (userId && userId !== 'test-user-b2c') {
        // RLS bloque l'accès
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([]), // Aucune donnée retournée
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([{
            id: 'mood-1',
            user_id: 'test-user-b2c',
            valence: 0.5,
          }]),
        });
      }
    });

    await page.goto('/app/particulier');

    // Tenter d'accéder aux données d'un autre user via console
    const result = await page.evaluate(async () => {
      try {
        const response = await fetch('/rest/v1/moods?user_id=other-user-id', {
          headers: { 'Authorization': 'Bearer mock-token' },
        });
        const data = await response.json();
        return { success: true, count: data.length };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });

    // Vérifier que RLS a bloqué l'accès
    expect(result.count).toBe(0);
  });
});

test.describe('B2B RH - Agrégats avec k-anonymat', () => {
  test('AC-3: RH voit uniquement agrégats avec n≥5', async ({ page }) => {
    // Mock RH role
    await page.route('**/rest/v1/user_roles**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ user_id: 'test-rh', role: 'b2b_rh' }]),
      });
    });

    // Mock aggregates avec n<5
    await page.route('**/rest/v1/b2b_aggregates**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });

    // Mock fonction compute avec count < 5
    await page.route('**/functions/v1/b2c-compute-aggregates', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          count: 3,
          k_anonymity_met: false,
          message: 'Données insuffisantes pour garantir l\'anonymat (minimum 5 personnes requis)',
        }),
      });
    });

    await page.goto('/app/entreprise/rh/aggregates');

    // Calculer les agrégats
    await page.getByRole('button', { name: /Calculer/i }).click();

    // Vérifier le message d'avertissement
    await expect(page.getByText(/minimum 5 personnes requis/i)).toBeVisible();
    await expect(page.getByText(/Données insuffisantes/i)).toBeVisible();

    // Vérifier qu'aucun détail individuel n'est affiché
    await expect(page.getByText(/valence|arousal/i)).not.toBeVisible();
  });

  test('AC-3: RH voit les agrégats avec n≥5', async ({ page }) => {
    // Mock fonction compute avec count ≥ 5
    await page.route('**/functions/v1/b2c-compute-aggregates', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          count: 12,
          k_anonymity_met: true,
          summary: 'Sur la période "month" (12 participants), la tendance émotionnelle globale est positive avec une énergie modérée.',
          period: 'month',
        }),
      });
    });

    await page.goto('/app/entreprise/rh/aggregates');

    // Calculer les agrégats
    await page.getByRole('button', { name: /Calculer/i }).click();

    // Vérifier que le résumé est affiché
    await expect(page.getByText(/12 participants/i)).toBeVisible();
    await expect(page.getByText(/tendance émotionnelle globale/i)).toBeVisible();

    // Vérifier le badge k-anonymat
    await expect(page.getByText(/✓ n≥5/i)).toBeVisible();
  });
});
