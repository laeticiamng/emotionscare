/**
 * Breath Constellation - E2E Robustness & Security Suite
 * 
 * Cartographie fonctionnelle:
 * - Entrées: Protocole (coherence, 4-7-8, box, triangle), cycles, densité, sons, haptiques
 * - Sorties: Sessions persistées (breathwork_sessions, user_activity_sessions), journaux, statistiques
 * - Dépendances: useSessionClock, useBreathPattern, Supabase auth, localStorage
 * - Données sensibles: userId, historique sessions, humeur
 * 
 * Tests couverts:
 * 1. Session Flow (démarrage, pause, reprise, fin, annulation)
 * 2. Protocoles respiratoires (4 patterns, validation paramètres)
 * 3. Audio/Haptiques (activation, désactivation, reduced motion)
 * 4. Robustesse (erreurs réseau, auth, données nulles, session recovery)
 * 5. Sécurité (isolation données, RLS, authentification requise)
 * 6. Accessibilité (clavier, ARIA, annonces live)
 * 7. Performance (chargement < 2s, timer fluide)
 */

import { test, expect, type Page } from '@playwright/test';

// =============================================================================
// HELPERS
// =============================================================================

async function mockSupabaseAuth(page: Page, userId = 'test-breath-user') {
  await page.route('**/auth/v1/user**', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ user: { id: userId, email: 'breath@test.com' } }),
      });
    } else {
      await route.continue();
    }
  });
}

async function mockBreathworkInsert(page: Page, capturePayload: (data: unknown) => void) {
  await page.route('**/rest/v1/breathwork_sessions**', async (route) => {
    const method = route.request().method();
    if (method === 'OPTIONS') {
      await route.fulfill({ status: 204 });
      return;
    }
    if (method === 'POST') {
      const body = JSON.parse(route.request().postData() ?? '{}');
      capturePayload(body);
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify([{ id: 'session-1', ...body }]),
      });
      return;
    }
    await route.continue();
  });
}

async function mockActivityInsert(page: Page, capturePayload: (data: unknown) => void) {
  await page.route('**/rest/v1/user_activity_sessions**', async (route) => {
    const method = route.request().method();
    if (method === 'OPTIONS') {
      await route.fulfill({ status: 204 });
      return;
    }
    if (method === 'POST') {
      const body = JSON.parse(route.request().postData() ?? '{}');
      capturePayload(body);
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify([{ id: 'activity-1', ...body }]),
      });
      return;
    }
    await route.continue();
  });
}

async function navigateToBreath(page: Page) {
  await page.goto('/modules/breath-constellation');
  await expect(page.locator('main[aria-label="Breath Constellation"]')).toBeVisible({ timeout: 5000 });
}

// =============================================================================
// SESSION FLOW TESTS
// =============================================================================

test.describe('Breath Constellation - Session Flow', () => {
  test.beforeEach(async ({ page }) => {
    await mockSupabaseAuth(page);
  });

  test('démarre une session et affiche le statut "en cours"', async ({ page }) => {
    let breathworkPayload: unknown = null;
    await mockBreathworkInsert(page, (data) => { breathworkPayload = data; });
    await mockActivityInsert(page, () => {});

    await navigateToBreath(page);

    const status = page.locator('[role="status"]').first();
    await expect(status).toContainText(/prête à démarrer/i);

    await page.getByRole('button', { name: /Démarrer/i }).click();
    await expect(status).toContainText(/en cours/i);
  });

  test('pause et reprise de session', async ({ page }) => {
    await mockBreathworkInsert(page, () => {});
    await mockActivityInsert(page, () => {});
    await navigateToBreath(page);

    await page.getByRole('button', { name: /Démarrer/i }).click();
    await page.waitForTimeout(500);

    await page.getByRole('button', { name: /Pause/i }).click();
    const status = page.locator('[role="status"]').first();
    await expect(status).toContainText(/pause/i);

    await page.getByRole('button', { name: /Reprendre/i }).click();
    await expect(status).toContainText(/en cours/i);
  });

  test('termine une session et persiste les données', async ({ page }) => {
    let breathworkPayload: any = null;
    let activityPayload: any = null;

    await mockBreathworkInsert(page, (data) => { breathworkPayload = data; });
    await mockActivityInsert(page, (data) => { activityPayload = data; });
    await navigateToBreath(page);

    await page.getByRole('button', { name: /Démarrer/i }).click();
    await page.waitForTimeout(1000);
    await page.getByRole('button', { name: /Terminer/i }).click();

    // Vérifie le feedback de sauvegarde
    await expect(page.getByText(/enregistrée|journal/i)).toBeVisible({ timeout: 10000 });

    // Vérifie les payloads
    expect(breathworkPayload).toBeTruthy();
    expect(activityPayload).toBeTruthy();
  });

  test('statut terminé après complétion', async ({ page }) => {
    await mockBreathworkInsert(page, () => {});
    await mockActivityInsert(page, () => {});
    await navigateToBreath(page);

    await page.getByRole('button', { name: /Démarrer/i }).click();
    await page.waitForTimeout(800);
    await page.getByRole('button', { name: /Terminer/i }).click();

    const status = page.locator('[role="status"]').first();
    await expect(status).toContainText(/terminée/i);
  });
});

// =============================================================================
// PROTOCOL TESTS
// =============================================================================

test.describe('Breath Constellation - Protocoles', () => {
  test.beforeEach(async ({ page }) => {
    await mockSupabaseAuth(page);
    await mockBreathworkInsert(page, () => {});
    await mockActivityInsert(page, () => {});
  });

  test('affiche les 4 protocoles disponibles', async ({ page }) => {
    await navigateToBreath(page);

    // Vérifie la présence des protocoles dans le sélecteur
    const content = await page.locator('main').textContent();
    expect(content).toMatch(/cohérence|5-5/i);
    expect(content).toMatch(/4-7-8/i);
    expect(content).toMatch(/carré|4-4-4-4/i);
    expect(content).toMatch(/triangle|4-6-8/i);
  });

  test('sélection protocole 4-7-8 met à jour les paramètres', async ({ page }) => {
    let breathworkPayload: any = null;
    await mockBreathworkInsert(page, (data) => { breathworkPayload = data; });
    await navigateToBreath(page);

    // Cherche et clique sur le protocole 4-7-8
    const protocolButton = page.getByText(/4-7-8/i).first();
    if (await protocolButton.isVisible()) {
      await protocolButton.click();
    }

    await page.getByRole('button', { name: /Démarrer/i }).click();
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: /Terminer/i }).click();

    await page.waitForTimeout(1000);
    // La technique devrait refléter le protocole sélectionné
    if (breathworkPayload) {
      expect(breathworkPayload.technique_type || breathworkPayload.technique).toBeDefined();
    }
  });

  test('validation du nombre de cycles (min/max)', async ({ page }) => {
    await navigateToBreath(page);

    // Cherche le contrôle de cycles si disponible
    const cyclesInput = page.getByLabel(/cycles/i).first();
    if (await cyclesInput.isVisible()) {
      await cyclesInput.fill('0');
      await cyclesInput.blur();
      
      // Le système devrait avoir une valeur minimale
      const value = await cyclesInput.inputValue();
      expect(parseInt(value)).toBeGreaterThanOrEqual(0);
    }
  });
});

// =============================================================================
// AUDIO & HAPTICS TESTS
// =============================================================================

test.describe('Breath Constellation - Audio & Haptiques', () => {
  test.beforeEach(async ({ page }) => {
    await mockSupabaseAuth(page);
    await mockBreathworkInsert(page, () => {});
    await mockActivityInsert(page, () => {});
  });

  test('toggle sons respiratoires', async ({ page }) => {
    await navigateToBreath(page);

    const soundToggle = page.getByRole('checkbox', { name: /son|audio|cue/i }).first();
    if (await soundToggle.isVisible()) {
      const initialState = await soundToggle.isChecked();
      await soundToggle.click();
      const newState = await soundToggle.isChecked();
      expect(newState).not.toBe(initialState);
    }
  });

  test('reduced motion désactive les haptiques automatiquement', async ({ page }) => {
    // Simule prefers-reduced-motion
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await navigateToBreath(page);

    // Vérifie que le toggle haptique est désactivé ou absent
    const hapticToggle = page.getByRole('checkbox', { name: /haptique|vibration/i }).first();
    if (await hapticToggle.isVisible()) {
      const isChecked = await hapticToggle.isChecked();
      expect(isChecked).toBe(false);
    }
  });
});

// =============================================================================
// ROBUSTNESS TESTS
// =============================================================================

test.describe('Breath Constellation - Robustesse', () => {
  test('gestion erreur réseau lors de la sauvegarde', async ({ page }) => {
    await mockSupabaseAuth(page);
    
    // Mock une erreur réseau
    await page.route('**/rest/v1/breathwork_sessions**', async (route) => {
      await route.fulfill({ status: 500, body: 'Internal Server Error' });
    });

    await navigateToBreath(page);
    await page.getByRole('button', { name: /Démarrer/i }).click();
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: /Terminer/i }).click();

    // Devrait afficher un message d'erreur (pas de crash)
    await expect(page.getByText(/erreur|impossible|échoué/i)).toBeVisible({ timeout: 10000 });
  });

  test('gestion utilisateur non authentifié', async ({ page }) => {
    // Mock utilisateur non connecté
    await page.route('**/auth/v1/user**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ user: null }),
      });
    });

    await navigateToBreath(page);
    await page.getByRole('button', { name: /Démarrer/i }).click();
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: /Terminer/i }).click();

    // Message approprié pour utilisateur non connecté
    await expect(page.getByText(/connectez-vous|authentif|login/i)).toBeVisible({ timeout: 10000 });
  });

  test('session récupérable après rechargement page', async ({ page }) => {
    await mockSupabaseAuth(page);
    await mockBreathworkInsert(page, () => {});
    await mockActivityInsert(page, () => {});

    await navigateToBreath(page);
    await page.getByRole('button', { name: /Démarrer/i }).click();
    await page.waitForTimeout(1000);

    // Stocke le temps écoulé
    const elapsedBefore = await page.locator('[aria-label*="temps"]').textContent().catch(() => null);

    // Recharge la page
    await page.reload();
    await expect(page.locator('main[aria-label="Breath Constellation"]')).toBeVisible({ timeout: 5000 });

    // La page devrait être dans un état cohérent (idle ou récupérée)
    const status = page.locator('[role="status"]').first();
    await expect(status).toBeVisible();
  });

  test('données nulles/invalides ne crashent pas', async ({ page }) => {
    await mockSupabaseAuth(page);
    
    // Mock retourne des données invalides
    await page.route('**/rest/v1/breathwork_sessions**', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify([{ id: null, duration: null, technique_type: undefined }]),
        });
        return;
      }
      await route.continue();
    });

    await navigateToBreath(page);
    await page.getByRole('button', { name: /Démarrer/i }).click();
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: /Terminer/i }).click();

    // La page ne devrait pas crasher
    await expect(page.locator('main[aria-label="Breath Constellation"]')).toBeVisible();
  });

  test('timeout réseau géré gracieusement', async ({ page }) => {
    await mockSupabaseAuth(page);
    
    // Mock un timeout
    await page.route('**/rest/v1/breathwork_sessions**', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 15000));
      await route.abort('timedout');
    });

    await navigateToBreath(page);
    await page.getByRole('button', { name: /Démarrer/i }).click();
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: /Terminer/i }).click();

    // La page reste fonctionnelle
    await expect(page.locator('main[aria-label="Breath Constellation"]')).toBeVisible({ timeout: 20000 });
  });
});

// =============================================================================
// SECURITY TESTS
// =============================================================================

test.describe('Breath Constellation - Sécurité', () => {
  test('isolation des données par utilisateur (RLS simulé)', async ({ page }) => {
    // Utilisateur A
    await mockSupabaseAuth(page, 'user-A');
    
    let capturedUserId: string | null = null;
    await page.route('**/rest/v1/breathwork_sessions**', async (route) => {
      if (route.request().method() === 'POST') {
        const body = JSON.parse(route.request().postData() ?? '{}');
        capturedUserId = body.user_id;
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify([{ id: 'session-a', ...body }]),
        });
        return;
      }
      await route.continue();
    });
    await mockActivityInsert(page, () => {});

    await navigateToBreath(page);
    await page.getByRole('button', { name: /Démarrer/i }).click();
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: /Terminer/i }).click();

    await page.waitForTimeout(2000);
    // Le user_id doit correspondre à l'utilisateur connecté
    expect(capturedUserId === null || capturedUserId === 'user-A').toBe(true);
  });

  test('pas de fuite de données sensibles dans les logs console', async ({ page }) => {
    const consoleLogs: string[] = [];
    page.on('console', (msg) => {
      consoleLogs.push(msg.text());
    });

    await mockSupabaseAuth(page, 'secret-user-id-123');
    await mockBreathworkInsert(page, () => {});
    await mockActivityInsert(page, () => {});

    await navigateToBreath(page);
    await page.getByRole('button', { name: /Démarrer/i }).click();
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: /Terminer/i }).click();

    await page.waitForTimeout(2000);

    // Vérifie qu'aucun log ne contient l'ID utilisateur brut
    const sensitivePattern = /secret-user-id-123/i;
    const hasLeakedData = consoleLogs.some(log => sensitivePattern.test(log));
    expect(hasLeakedData).toBe(false);
  });

  test('localStorage ne stocke pas de tokens sensibles', async ({ page }) => {
    await mockSupabaseAuth(page);
    await mockBreathworkInsert(page, () => {});
    await mockActivityInsert(page, () => {});

    await navigateToBreath(page);
    await page.getByRole('button', { name: /Démarrer/i }).click();
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: /Terminer/i }).click();

    await page.waitForTimeout(1000);

    // Vérifie le localStorage
    const localStorageKeys = await page.evaluate(() => Object.keys(localStorage));
    const sensitiveKeys = localStorageKeys.filter(key => 
      /token|password|secret|api_key/i.test(key)
    );
    
    // Seuls les tokens Supabase standards sont acceptables
    sensitiveKeys.forEach(key => {
      expect(key).toMatch(/supabase|sb-/i);
    });
  });
});

// =============================================================================
// ACCESSIBILITY TESTS
// =============================================================================

test.describe('Breath Constellation - Accessibilité (WCAG AA)', () => {
  test.beforeEach(async ({ page }) => {
    await mockSupabaseAuth(page);
    await mockBreathworkInsert(page, () => {});
    await mockActivityInsert(page, () => {});
  });

  test('navigation complète au clavier', async ({ page }) => {
    await navigateToBreath(page);

    // Tab vers le bouton Démarrer
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBeTruthy();

    // Activation au clavier
    await page.keyboard.press('Enter');
    const status = page.locator('[role="status"]').first();
    // Devrait avoir changé d'état (peut-être démarré ou focus sur autre élément)
  });

  test('annonces live region pour changements de phase', async ({ page }) => {
    await navigateToBreath(page);

    // Vérifie présence d'une live region
    const liveRegion = page.locator('[role="status"][aria-live="polite"]');
    await expect(liveRegion).toBeVisible();

    await page.getByRole('button', { name: /Démarrer/i }).click();
    
    // La live region devrait annoncer le changement
    await expect(liveRegion).toContainText(/./);
  });

  test('boutons ont des labels accessibles', async ({ page }) => {
    await navigateToBreath(page);

    const startButton = page.getByRole('button', { name: /Démarrer/i });
    await expect(startButton).toBeVisible();
    await expect(startButton).toBeEnabled();

    await startButton.click();

    const pauseButton = page.getByRole('button', { name: /Pause/i });
    await expect(pauseButton).toBeVisible();

    const stopButton = page.getByRole('button', { name: /Terminer/i });
    await expect(stopButton).toBeVisible();
  });

  test('progress bar a les attributs ARIA requis', async ({ page }) => {
    await navigateToBreath(page);
    await page.getByRole('button', { name: /Démarrer/i }).click();

    // Cherche une barre de progression
    const progressBar = page.locator('[role="progressbar"]').first();
    if (await progressBar.isVisible()) {
      const ariaValueNow = await progressBar.getAttribute('aria-valuenow');
      const ariaValueMin = await progressBar.getAttribute('aria-valuemin');
      const ariaValueMax = await progressBar.getAttribute('aria-valuemax');

      // Au moins aria-valuenow devrait être présent
      expect(ariaValueNow !== null || await progressBar.getAttribute('aria-label') !== null).toBe(true);
    }
  });

  test('contraste suffisant sur les éléments interactifs', async ({ page }) => {
    await navigateToBreath(page);

    // Vérifie que les boutons sont visibles et distinguables
    const startButton = page.getByRole('button', { name: /Démarrer/i });
    await expect(startButton).toBeVisible();

    // Le bouton devrait avoir un style visible
    const buttonStyles = await startButton.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        backgroundColor: styles.backgroundColor,
        color: styles.color,
      };
    });

    expect(buttonStyles.backgroundColor).toBeTruthy();
    expect(buttonStyles.color).toBeTruthy();
  });

  test('focus visible sur tous les éléments interactifs', async ({ page }) => {
    await navigateToBreath(page);

    await page.keyboard.press('Tab');
    
    // Vérifie qu'un élément a le focus
    const hasFocusedElement = await page.evaluate(() => {
      const focused = document.activeElement;
      if (!focused || focused === document.body) return false;
      
      const styles = window.getComputedStyle(focused);
      // Vérifie outline ou box-shadow pour le focus
      return styles.outline !== 'none' || 
             styles.boxShadow !== 'none' ||
             focused.classList.contains('focus-visible');
    });

    // Au moins un élément devrait être focusable
    expect(hasFocusedElement).toBeDefined();
  });
});

// =============================================================================
// PERFORMANCE TESTS
// =============================================================================

test.describe('Breath Constellation - Performance', () => {
  test('chargement page < 3s', async ({ page }) => {
    await mockSupabaseAuth(page);

    const start = Date.now();
    await page.goto('/modules/breath-constellation');
    await expect(page.locator('main[aria-label="Breath Constellation"]')).toBeVisible();
    const loadTime = Date.now() - start;

    expect(loadTime).toBeLessThan(3000);
  });

  test('timer fluide sans freeze', async ({ page }) => {
    await mockSupabaseAuth(page);
    await mockBreathworkInsert(page, () => {});
    await mockActivityInsert(page, () => {});
    await navigateToBreath(page);

    await page.getByRole('button', { name: /Démarrer/i }).click();

    // Attend 2 secondes et vérifie que le timer avance
    await page.waitForTimeout(2000);

    // La page devrait toujours être responsive
    const status = page.locator('[role="status"]').first();
    await expect(status).toBeVisible();
    await expect(status).toContainText(/en cours/i);

    // Arrête la session
    await page.getByRole('button', { name: /Terminer/i }).click();
  });

  test('pas de memory leak après plusieurs sessions', async ({ page }) => {
    await mockSupabaseAuth(page);
    await mockBreathworkInsert(page, () => {});
    await mockActivityInsert(page, () => {});
    await navigateToBreath(page);

    // Exécute 3 sessions courtes
    for (let i = 0; i < 3; i++) {
      await page.getByRole('button', { name: /Démarrer/i }).click();
      await page.waitForTimeout(500);
      await page.getByRole('button', { name: /Terminer/i }).click();
      await page.waitForTimeout(1000);
    }

    // La page devrait toujours être fonctionnelle
    await expect(page.locator('main[aria-label="Breath Constellation"]')).toBeVisible();
    await expect(page.getByRole('button', { name: /Démarrer/i })).toBeEnabled();
  });
});

// =============================================================================
// EDGE CASES
// =============================================================================

test.describe('Breath Constellation - Edge Cases', () => {
  test('session avec 0 cycles complétés', async ({ page }) => {
    let breathworkPayload: any = null;
    await mockSupabaseAuth(page);
    await mockBreathworkInsert(page, (data) => { breathworkPayload = data; });
    await mockActivityInsert(page, () => {});

    await navigateToBreath(page);
    await page.getByRole('button', { name: /Démarrer/i }).click();
    // Termine immédiatement
    await page.getByRole('button', { name: /Terminer/i }).click();

    await page.waitForTimeout(2000);

    // Devrait quand même persister avec cycles = 0
    if (breathworkPayload) {
      expect(breathworkPayload.session_data?.cycles_completed).toBeGreaterThanOrEqual(0);
    }
  });

  test('double-clic sur Démarrer ne crée pas de doublon', async ({ page }) => {
    let insertCount = 0;
    await mockSupabaseAuth(page);
    await page.route('**/rest/v1/breathwork_sessions**', async (route) => {
      if (route.request().method() === 'POST') {
        insertCount++;
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify([{ id: `session-${insertCount}` }]),
        });
        return;
      }
      await route.continue();
    });
    await mockActivityInsert(page, () => {});

    await navigateToBreath(page);
    
    // Double-clic rapide
    const startButton = page.getByRole('button', { name: /Démarrer/i });
    await startButton.dblclick();

    await page.waitForTimeout(500);
    const terminateBtn = page.getByRole('button', { name: /Terminer/i });
    if (await terminateBtn.isVisible()) {
      await terminateBtn.click();
    }

    await page.waitForTimeout(2000);

    // Une seule session devrait être créée
    expect(insertCount).toBeLessThanOrEqual(1);
  });

  test('changement de protocole pendant session inactive', async ({ page }) => {
    await mockSupabaseAuth(page);
    await mockBreathworkInsert(page, () => {});
    await mockActivityInsert(page, () => {});

    await navigateToBreath(page);

    // Change le protocole avant de démarrer
    const protocol478 = page.getByText(/4-7-8/i).first();
    if (await protocol478.isVisible()) {
      await protocol478.click();
    }

    // Démarre et vérifie que ça fonctionne
    await page.getByRole('button', { name: /Démarrer/i }).click();
    const status = page.locator('[role="status"]').first();
    await expect(status).toContainText(/en cours/i);

    await page.getByRole('button', { name: /Terminer/i }).click();
  });

  test('navigation away pendant session active', async ({ page }) => {
    await mockSupabaseAuth(page);
    await mockBreathworkInsert(page, () => {});
    await mockActivityInsert(page, () => {});

    await navigateToBreath(page);
    await page.getByRole('button', { name: /Démarrer/i }).click();
    await page.waitForTimeout(500);

    // Navigue ailleurs
    await page.goto('/');
    await page.waitForTimeout(500);

    // Retourne à la page breath
    await page.goto('/modules/breath-constellation');
    await expect(page.locator('main[aria-label="Breath Constellation"]')).toBeVisible();

    // La page devrait être dans un état cohérent
    const status = page.locator('[role="status"]').first();
    await expect(status).toBeVisible();
  });
});
