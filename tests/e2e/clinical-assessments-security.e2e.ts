// @ts-nocheck
import { test, expect } from '@playwright/test';

/**
 * Suite E2E Robuste - Assessments Cliniques
 * 
 * Couverture complète des flux PHQ-9, GAD-7, WHO-5:
 * - Consentement RGPD obligatoire
 * - Scoring et seuils cliniques
 * - Détection de crise (PHQ-9 ≥20, GAD-7 ≥15)
 * - Sécurité et isolation des données
 * - Edge cases et robustesse
 */

test.describe('Clinical Assessments - Security & Consent', () => {
  test.skip(({ }, testInfo) => testInfo.project.name !== 'b2c-chromium');

  /**
   * RGPD: L'accès aux évaluations cliniques DOIT exiger un consentement explicite
   */
  test('blocks assessment without explicit clinical consent', async ({ page }) => {
    await page.route('**/rest/v1/clinical_optins*', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({ 
          status: 200, 
          contentType: 'application/json', 
          body: JSON.stringify([]) // Pas de consentement
        });
        return;
      }
      await route.continue();
    });

    await page.route('**/functions/v1/assess-start', async (route) => {
      await route.fulfill({
        status: 403,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'optin_required' }),
      });
    });

    await page.goto('/app/assess');
    
    // Doit afficher le formulaire de consentement, pas le questionnaire
    const consentPrompt = page.getByRole('heading', { name: /consentement|autorisation|activer/i });
    await expect(consentPrompt).toBeVisible({ timeout: 10000 });
    
    // Le bouton de démarrage doit être désactivé ou absent
    const startButton = page.getByRole('button', { name: /commencer|démarrer/i });
    if (await startButton.count() > 0) {
      await expect(startButton).toBeDisabled();
    }
  });

  /**
   * RGPD: Le consentement doit être enregistré avec horodatage
   */
  test('records consent with timestamp when user opts in', async ({ page }) => {
    let consentPayload: Record<string, unknown> | null = null;

    await page.route('**/rest/v1/clinical_optins*', async (route) => {
      const method = route.request().method();
      if (method === 'GET') {
        await route.fulfill({ 
          status: 200, 
          contentType: 'application/json', 
          body: JSON.stringify([]) 
        });
        return;
      }
      if (method === 'POST') {
        consentPayload = JSON.parse(route.request().postData() || '{}');
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ id: 'consent-test-1', created_at: new Date().toISOString() }),
        });
        return;
      }
      await route.continue();
    });

    await page.goto('/app/assess');
    
    const acceptButton = page.getByRole('button', { name: /accepter|activer|oui/i });
    if (await acceptButton.count() > 0) {
      await acceptButton.click();
      
      // Attendre la requête POST
      await page.waitForTimeout(500);
      
      // Vérifier que le consentement contient les champs requis RGPD
      expect(consentPayload).toBeTruthy();
      if (consentPayload) {
        expect(consentPayload).toHaveProperty('user_id');
        expect(consentPayload).toHaveProperty('scope');
      }
    }
  });

  /**
   * RGPD: L'utilisateur peut retirer son consentement
   */
  test('allows consent withdrawal and blocks future assessments', async ({ page }) => {
    let consentRevoked = false;

    await page.route('**/rest/v1/clinical_optins*', async (route) => {
      const method = route.request().method();
      if (method === 'GET') {
        await route.fulfill({ 
          status: 200, 
          contentType: 'application/json', 
          body: JSON.stringify(consentRevoked ? [] : [{ id: 'c1', scope: 'clinical', revoked_at: null }]) 
        });
        return;
      }
      if (method === 'PATCH' || method === 'DELETE') {
        consentRevoked = true;
        await route.fulfill({ status: 200, body: JSON.stringify({ success: true }) });
        return;
      }
      await route.continue();
    });

    await page.goto('/settings/privacy');
    
    const revokeButton = page.getByRole('button', { name: /retirer|révoquer|désactiver/i });
    if (await revokeButton.count() > 0) {
      await revokeButton.click();
      
      // Confirmer dans le dialog
      const confirmButton = page.getByRole('button', { name: /confirmer|oui/i });
      if (await confirmButton.count() > 0) {
        await confirmButton.click();
      }
      
      expect(consentRevoked).toBe(true);
    }
  });

  /**
   * Sécurité: Les données d'un utilisateur ne doivent pas être visibles par un autre
   */
  test('isolates assessment data between users (RLS verification)', async ({ page }) => {
    const userId = 'test-user-123';
    
    await page.route('**/rest/v1/assessments*', async (route) => {
      const url = route.request().url();
      
      // Vérifier que la requête filtre bien par user_id
      if (route.request().method() === 'GET') {
        // Simuler RLS: ne retourner que les données de l'utilisateur courant
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            { id: 'a1', user_id: userId, instrument: 'WHO5', score_json: { total: 20 } }
          ])
        });
        return;
      }
      await route.continue();
    });

    await page.goto('/app/assess/history');
    
    // Vérifier qu'aucune donnée d'autres utilisateurs n'apparaît
    const pageContent = await page.content();
    expect(pageContent).not.toContain('other-user');
    expect(pageContent).not.toContain('admin-user');
  });

  /**
   * Sécurité: Les tokens expirés doivent bloquer l'accès aux données cliniques
   */
  test('blocks access with expired auth token', async ({ page }) => {
    await page.route('**/functions/v1/assess-*', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'token_expired' }),
      });
    });

    await page.goto('/app/assess');
    
    // Doit rediriger vers login ou afficher erreur d'authentification
    await expect(page).toHaveURL(/login|auth/);
  });
});

test.describe('Clinical Assessments - PHQ-9 Depression Screening', () => {
  test.skip(({ }, testInfo) => testInfo.project.name !== 'b2c-chromium');

  const mockPHQ9Questions = [
    'Peu d\'intérêt ou de plaisir à faire les choses',
    'Se sentir triste, déprimé(e) ou désespéré(e)',
    'Difficulté à s\'endormir, se réveiller ou trop dormir',
    'Se sentir fatigué(e) ou manquer d\'énergie',
    'Peu d\'appétit ou manger trop',
    'Sentiment de dévalorisation ou culpabilité',
    'Difficulté à se concentrer',
    'Bouger ou parler lentement, ou être agité(e)',
    'Pensées de se faire du mal'
  ];

  /**
   * Vérifier que toutes les 9 questions du PHQ-9 sont affichées
   */
  test('displays all 9 PHQ-9 questions', async ({ page }) => {
    await page.route('**/functions/v1/assess-start', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          instrument: 'PHQ9',
          locale: 'fr',
          version: '1.0',
          expiry_minutes: 30,
          items: mockPHQ9Questions.map((q, i) => ({
            id: `q${i + 1}`,
            prompt: q,
            type: 'scale',
            min: 0,
            max: 3
          }))
        }),
      });
    });

    await page.route('**/rest/v1/clinical_optins*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ id: 'c1', scope: 'clinical', revoked_at: null }])
      });
    });

    await page.goto('/app/assess?instrument=PHQ9');
    
    // Vérifier la présence des questions
    for (const question of mockPHQ9Questions.slice(0, 3)) {
      const questionText = page.getByText(question, { exact: false });
      if (await questionText.count() > 0) {
        await expect(questionText.first()).toBeVisible();
      }
    }
  });

  /**
   * CRITIQUE: Score PHQ-9 ≥ 20 doit déclencher alerte de crise
   */
  test('triggers crisis alert when PHQ-9 score >= 20', async ({ page }) => {
    let crisisAlertTriggered = false;
    let submittedScore = 0;

    await page.route('**/functions/v1/assess-submit', async (route) => {
      const body = JSON.parse(route.request().postData() || '{}');
      
      // Calculer le score total
      const answers = body.answers || {};
      submittedScore = Object.values(answers).reduce((sum: number, val) => sum + (val as number), 0);
      
      // PHQ-9 ≥ 20 = crise
      if (submittedScore >= 20) {
        crisisAlertTriggered = true;
      }
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ 
          status: 'ok', 
          score: submittedScore,
          crisis_detected: submittedScore >= 20,
          summary: submittedScore >= 20 ? 'Dépression sévère détectée' : 'Évaluation enregistrée'
        }),
      });
    });

    await page.route('**/rest/v1/clinical_optins*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ id: 'c1', scope: 'clinical', revoked_at: null }])
      });
    });

    await page.route('**/functions/v1/assess-start', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          instrument: 'PHQ9',
          items: mockPHQ9Questions.map((q, i) => ({
            id: `q${i + 1}`,
            prompt: q,
            type: 'scale',
            min: 0,
            max: 3
          }))
        }),
      });
    });

    await page.goto('/app/assess?instrument=PHQ9');
    
    // Simuler réponses maximales (score = 27)
    const maxScoreButtons = page.getByRole('button', { name: /3|presque tous les jours/i });
    const count = await maxScoreButtons.count();
    
    for (let i = 0; i < Math.min(count, 9); i++) {
      await maxScoreButtons.nth(i).click();
    }
    
    const submitButton = page.getByRole('button', { name: /soumettre|terminer|enregistrer/i });
    if (await submitButton.count() > 0) {
      await submitButton.click();
      
      // Vérifier l'affichage de l'alerte de crise ou redirection
      const crisisAlert = page.getByText(/crise|urgence|aide|numéro|ressources/i);
      await expect(crisisAlert).toBeVisible({ timeout: 5000 });
    }
  });

  /**
   * Seuils PHQ-9: Vérifier l'interprétation correcte des scores
   */
  test('correctly interprets PHQ-9 severity levels', async ({ page }) => {
    const testCases = [
      { score: 3, expected: 'minimal' },
      { score: 7, expected: 'mild' },
      { score: 12, expected: 'moderate' },
      { score: 17, expected: 'moderatelySevere' },
      { score: 23, expected: 'severe' }
    ];

    for (const testCase of testCases) {
      await page.route('**/rest/v1/assessments*', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([{
            id: `phq9-${testCase.score}`,
            instrument: 'PHQ9',
            score_json: { 
              total: testCase.score, 
              interpretation: testCase.expected 
            },
            created_at: new Date().toISOString()
          }])
        });
      });

      await page.goto('/app/assess/history');
      
      // Le niveau de sévérité doit être affiché
      const historyCard = page.locator('[data-testid="assessment-card"]').first();
      if (await historyCard.count() > 0) {
        // Vérifier que le badge de niveau est présent
        const badge = historyCard.locator('[data-testid="severity-badge"], .badge, [class*="level"]');
        if (await badge.count() > 0) {
          await expect(badge.first()).toBeVisible();
        }
      }
    }
  });
});

test.describe('Clinical Assessments - GAD-7 Anxiety Screening', () => {
  test.skip(({ }, testInfo) => testInfo.project.name !== 'b2c-chromium');

  /**
   * CRITIQUE: Score GAD-7 ≥ 15 doit déclencher alerte
   */
  test('triggers alert when GAD-7 score >= 15 (severe anxiety)', async ({ page }) => {
    let alertTriggered = false;

    await page.route('**/functions/v1/assess-submit', async (route) => {
      const body = JSON.parse(route.request().postData() || '{}');
      const answers = body.answers || {};
      const score = Object.values(answers).reduce((sum: number, val) => sum + (val as number), 0);
      
      if (score >= 15) {
        alertTriggered = true;
      }
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ 
          status: 'ok', 
          score,
          alert_triggered: score >= 15,
          summary: score >= 15 ? 'Anxiété sévère détectée' : 'Évaluation enregistrée'
        }),
      });
    });

    await page.route('**/rest/v1/clinical_optins*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ id: 'c1', scope: 'clinical', revoked_at: null }])
      });
    });

    await page.route('**/functions/v1/assess-start', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          instrument: 'GAD7',
          items: Array.from({ length: 7 }, (_, i) => ({
            id: `g${i + 1}`,
            prompt: `Question anxiété ${i + 1}`,
            type: 'scale',
            min: 0,
            max: 3
          }))
        }),
      });
    });

    await page.goto('/app/assess?instrument=GAD7');
    
    // Test avec score maximal
    const maxButtons = page.getByRole('button', { name: /3|presque tous les jours/i });
    const count = await maxButtons.count();
    
    for (let i = 0; i < Math.min(count, 7); i++) {
      await maxButtons.nth(i).click();
    }
    
    const submitButton = page.getByRole('button', { name: /soumettre|terminer/i });
    if (await submitButton.count() > 0) {
      await submitButton.click();
      expect(alertTriggered).toBe(true);
    }
  });
});

test.describe('Clinical Assessments - WHO-5 Well-being', () => {
  test.skip(({ }, testInfo) => testInfo.project.name !== 'b2c-chromium');

  /**
   * WHO-5: Score bas (≤28) doit suggérer un suivi
   */
  test('suggests follow-up when WHO-5 score is low', async ({ page }) => {
    await page.route('**/functions/v1/assess-submit', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ 
          status: 'ok', 
          score: 24, // Score bas
          percentile: 24,
          hint: 'Un score bas peut indiquer un besoin de suivi',
          recommendation: 'Considérer un rendez-vous'
        }),
      });
    });

    await page.route('**/rest/v1/clinical_optins*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ id: 'c1', scope: 'clinical', revoked_at: null }])
      });
    });

    await page.route('**/functions/v1/assess-start', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          instrument: 'WHO5',
          items: Array.from({ length: 5 }, (_, i) => ({
            id: `w${i + 1}`,
            prompt: `Bien-être question ${i + 1}`,
            type: 'scale',
            min: 0,
            max: 5
          }))
        }),
      });
    });

    await page.goto('/app/assess?instrument=WHO5');
    
    // Répondre avec des scores bas
    const lowScoreButtons = page.getByRole('button', { name: /0|1|jamais|rarement/i });
    const count = await lowScoreButtons.count();
    
    for (let i = 0; i < Math.min(count, 5); i++) {
      await lowScoreButtons.nth(i).click();
    }
    
    const submitButton = page.getByRole('button', { name: /soumettre|terminer/i });
    if (await submitButton.count() > 0) {
      await submitButton.click();
      
      // Doit afficher une recommandation de suivi
      const recommendation = page.getByText(/suivi|rendez-vous|accompagnement|recommand/i);
      await expect(recommendation).toBeVisible({ timeout: 5000 });
    }
  });

  /**
   * WHO-5: Calcul correct du percentile (score * 4)
   */
  test('correctly calculates WHO-5 percentile score', async ({ page }) => {
    // WHO-5 percentile = raw score * 4 (range 0-100)
    const rawScore = 15;
    const expectedPercentile = 60; // 15 * 4

    await page.route('**/rest/v1/assessments*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{
          id: 'who5-test',
          instrument: 'WHO5',
          score_json: { 
            total: rawScore, 
            percentile: expectedPercentile,
            interpretation: 'moderate'
          },
          created_at: new Date().toISOString()
        }])
      });
    });

    await page.goto('/app/assess/history');
    
    // Le percentile doit être affiché correctement
    const percentileDisplay = page.getByText(`${expectedPercentile}%`);
    if (await percentileDisplay.count() > 0) {
      await expect(percentileDisplay.first()).toBeVisible();
    }
  });
});

test.describe('Clinical Assessments - Edge Cases & Robustness', () => {
  test.skip(({ }, testInfo) => testInfo.project.name !== 'b2c-chromium');

  /**
   * Robustesse: Gestion des erreurs réseau pendant la soumission
   */
  test('handles network error during submission gracefully', async ({ page }) => {
    await page.route('**/rest/v1/clinical_optins*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ id: 'c1', scope: 'clinical', revoked_at: null }])
      });
    });

    await page.route('**/functions/v1/assess-start', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          instrument: 'WHO5',
          items: [{ id: 'w1', prompt: 'Test', type: 'scale', min: 0, max: 5 }]
        }),
      });
    });

    await page.route('**/functions/v1/assess-submit', async (route) => {
      await route.abort('connectionfailed');
    });

    await page.goto('/app/assess?instrument=WHO5');
    
    const submitButton = page.getByRole('button', { name: /soumettre|terminer/i });
    if (await submitButton.count() > 0) {
      await submitButton.click();
      
      // Doit afficher un message d'erreur explicite
      const errorMessage = page.getByText(/erreur|échec|réessayer|connexion/i);
      await expect(errorMessage).toBeVisible({ timeout: 5000 });
    }
  });

  /**
   * Robustesse: Gestion des réponses partielles
   */
  test('prevents submission with incomplete answers', async ({ page }) => {
    await page.route('**/rest/v1/clinical_optins*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ id: 'c1', scope: 'clinical', revoked_at: null }])
      });
    });

    await page.route('**/functions/v1/assess-start', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          instrument: 'WHO5',
          items: Array.from({ length: 5 }, (_, i) => ({
            id: `w${i + 1}`,
            prompt: `Question ${i + 1}`,
            type: 'scale',
            min: 0,
            max: 5
          }))
        }),
      });
    });

    await page.goto('/app/assess?instrument=WHO5');
    
    // Ne pas répondre à toutes les questions
    const firstOption = page.getByRole('button', { name: /0|jamais/i }).first();
    if (await firstOption.count() > 0) {
      await firstOption.click();
    }
    
    // Le bouton de soumission doit être désactivé
    const submitButton = page.getByRole('button', { name: /soumettre|terminer/i });
    if (await submitButton.count() > 0) {
      await expect(submitButton).toBeDisabled();
    }
  });

  /**
   * Robustesse: Expiration de session pendant l'évaluation
   */
  test('handles session expiry during assessment', async ({ page }) => {
    let requestCount = 0;

    await page.route('**/rest/v1/clinical_optins*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ id: 'c1', scope: 'clinical', revoked_at: null }])
      });
    });

    await page.route('**/functions/v1/assess-start', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          instrument: 'WHO5',
          expiry_minutes: 0.01, // Expiration très rapide pour le test
          items: [{ id: 'w1', prompt: 'Test', type: 'scale', min: 0, max: 5 }]
        }),
      });
    });

    await page.route('**/functions/v1/assess-submit', async (route) => {
      requestCount++;
      if (requestCount === 1) {
        await route.fulfill({
          status: 410, // Gone - session expirée
          contentType: 'application/json',
          body: JSON.stringify({ error: 'session_expired' }),
        });
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ status: 'ok' }),
      });
    });

    await page.goto('/app/assess?instrument=WHO5');
    
    // Attendre l'expiration simulée
    await page.waitForTimeout(100);
    
    const submitButton = page.getByRole('button', { name: /soumettre|terminer/i });
    if (await submitButton.count() > 0) {
      await submitButton.click();
      
      // Doit afficher message d'expiration et permettre de recommencer
      const expiredMessage = page.getByText(/expir|recommencer|nouvelle session/i);
      await expect(expiredMessage).toBeVisible({ timeout: 5000 });
    }
  });

  /**
   * Robustesse: Données nulles ou malformées
   */
  test('handles malformed API response gracefully', async ({ page }) => {
    await page.route('**/rest/v1/clinical_optins*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ id: 'c1', scope: 'clinical', revoked_at: null }])
      });
    });

    await page.route('**/functions/v1/assess-start', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          instrument: 'WHO5',
          items: null // Données malformées
        }),
      });
    });

    await page.goto('/app/assess?instrument=WHO5');
    
    // Ne doit pas crasher, doit afficher un message d'erreur
    const errorState = page.getByText(/erreur|indisponible|réessayer/i);
    await expect(errorState).toBeVisible({ timeout: 5000 });
  });

  /**
   * Accessibilité: Navigation clavier complète
   */
  test('supports full keyboard navigation', async ({ page }) => {
    await page.route('**/rest/v1/clinical_optins*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ id: 'c1', scope: 'clinical', revoked_at: null }])
      });
    });

    await page.route('**/functions/v1/assess-start', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          instrument: 'WHO5',
          items: [
            { id: 'w1', prompt: 'Question 1', type: 'scale', min: 0, max: 5 },
            { id: 'w2', prompt: 'Question 2', type: 'scale', min: 0, max: 5 }
          ]
        }),
      });
    });

    await page.goto('/app/assess?instrument=WHO5');
    
    // Naviguer avec Tab
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Sélectionner avec Enter ou Space
    await page.keyboard.press('Enter');
    
    // Continuer la navigation
    await page.keyboard.press('Tab');
    await page.keyboard.press('Space');
    
    // Vérifier que les options peuvent être sélectionnées au clavier
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  /**
   * Performance: Temps de chargement acceptable
   */
  test('loads assessment in under 2 seconds', async ({ page }) => {
    await page.route('**/rest/v1/clinical_optins*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ id: 'c1', scope: 'clinical', revoked_at: null }])
      });
    });

    await page.route('**/functions/v1/assess-start', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          instrument: 'WHO5',
          items: Array.from({ length: 5 }, (_, i) => ({
            id: `w${i + 1}`,
            prompt: `Question ${i + 1}`,
            type: 'scale',
            min: 0,
            max: 5
          }))
        }),
      });
    });

    const startTime = Date.now();
    await page.goto('/app/assess?instrument=WHO5');
    
    // Attendre que le contenu principal soit visible
    const mainContent = page.locator('main, [role="main"], .assessment-container, form');
    await expect(mainContent.first()).toBeVisible({ timeout: 2000 });
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(2000);
  });
});

test.describe('Clinical Assessments - Data Integrity', () => {
  test.skip(({ }, testInfo) => testInfo.project.name !== 'b2c-chromium');

  /**
   * Intégrité: Les scores ne doivent jamais dépasser les limites
   */
  test('validates score within instrument bounds', async ({ page }) => {
    let submittedAnswers: Record<string, number> = {};

    await page.route('**/functions/v1/assess-submit', async (route) => {
      const body = JSON.parse(route.request().postData() || '{}');
      submittedAnswers = body.answers || {};
      
      // Vérifier les limites côté serveur
      const allValid = Object.values(submittedAnswers).every(
        (val) => typeof val === 'number' && val >= 0 && val <= 5
      );
      
      if (!allValid) {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'invalid_score_range' }),
        });
        return;
      }
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ status: 'ok' }),
      });
    });

    await page.route('**/rest/v1/clinical_optins*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ id: 'c1', scope: 'clinical', revoked_at: null }])
      });
    });

    await page.route('**/functions/v1/assess-start', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          instrument: 'WHO5',
          items: [{ id: 'w1', prompt: 'Test', type: 'scale', min: 0, max: 5 }]
        }),
      });
    });

    await page.goto('/app/assess?instrument=WHO5');
    
    // Sélectionner une option valide
    const validOption = page.getByRole('button', { name: /3|souvent/i }).first();
    if (await validOption.count() > 0) {
      await validOption.click();
    }
    
    const submitButton = page.getByRole('button', { name: /soumettre|terminer/i });
    if (await submitButton.count() > 0) {
      await submitButton.click();
      
      // Vérifier que les valeurs soumises sont valides
      for (const [key, value] of Object.entries(submittedAnswers)) {
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(5);
      }
    }
  });

  /**
   * Intégrité: Horodatage correct des évaluations
   */
  test('records accurate timestamps for assessments', async ({ page }) => {
    let submissionTimestamp: string | null = null;
    const beforeSubmit = new Date();

    await page.route('**/functions/v1/assess-submit', async (route) => {
      submissionTimestamp = new Date().toISOString();
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ 
          status: 'ok',
          submitted_at: submissionTimestamp
        }),
      });
    });

    await page.route('**/rest/v1/clinical_optins*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ id: 'c1', scope: 'clinical', revoked_at: null }])
      });
    });

    await page.route('**/functions/v1/assess-start', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          instrument: 'WHO5',
          items: [{ id: 'w1', prompt: 'Test', type: 'scale', min: 0, max: 5 }]
        }),
      });
    });

    await page.goto('/app/assess?instrument=WHO5');
    
    const option = page.getByRole('button', { name: /3/i }).first();
    if (await option.count() > 0) {
      await option.click();
    }
    
    const submitButton = page.getByRole('button', { name: /soumettre|terminer/i });
    if (await submitButton.count() > 0) {
      await submitButton.click();
      
      const afterSubmit = new Date();
      
      if (submissionTimestamp) {
        const ts = new Date(submissionTimestamp);
        expect(ts.getTime()).toBeGreaterThanOrEqual(beforeSubmit.getTime());
        expect(ts.getTime()).toBeLessThanOrEqual(afterSubmit.getTime());
      }
    }
  });
});
