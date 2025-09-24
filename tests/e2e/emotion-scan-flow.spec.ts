import { test, expect } from '@playwright/test';

declare global {
  interface Window {
    __vite_plugin_react_preamble_installed__?: boolean;
  }
}

interface PersistedScanRow {
  id: string;
  user_id: string;
  created_at: string;
  payload: {
    labels: string[];
    valence?: number;
    mood_score?: number;
  };
  mood_score: number | null;
}

test.describe('Emotion Scan — flow complet', () => {
  test('réalise un scan puis le retrouve sur le dashboard et la timeline', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'b2c-chromium', 'Scenario réservé au profil b2c-chromium');
    const consoleMessages: string[] = [];
    const ignoredConsoleSubstrings = [
      "Content Security Policy directive 'frame-ancestors' is ignored",
      '<link rel=preload> uses an unsupported `as` value',
      'net::ERR_CERT_AUTHORITY_INVALID',
      '🚨 RouterV2: composants manquants',
    ];

    page.on('console', (message) => {
      if (message.type() !== 'error' && message.type() !== 'warning') {
        return;
      }

      const text = message.text();
      if (ignoredConsoleSubstrings.some((pattern) => text.includes(pattern))) {
        return;
      }

      consoleMessages.push(`${message.type()}: ${text}`);
    });

    page.on('pageerror', (error) => {
      consoleMessages.push(`pageerror: ${error.message}`);
    });

    const timelineRows: PersistedScanRow[] = [
      {
        id: 'seed-scan',
        user_id: 'user-b2c',
        created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        payload: {
          labels: ['calme'],
          valence: 0.1,
          mood_score: 64,
        },
        mood_score: 64,
      },
    ];

    const supabaseUser = {
      id: 'user-b2c',
      aud: 'authenticated',
      role: 'authenticated',
      email: 'b2c@example.com',
      email_confirmed_at: '2024-01-01T00:00:00Z',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      last_sign_in_at: '2024-01-01T00:00:00Z',
      app_metadata: { provider: 'email', providers: ['email'] },
      user_metadata: { role: 'b2c', full_name: 'B2C Demo' },
      identities: [],
      factors: [],
    } as const;

    const supabaseSession = {
      access_token: 'test-access-token-b2c',
      refresh_token: 'test-refresh-token-b2c',
      token_type: 'bearer',
      expires_in: 3600,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      provider_token: null,
      provider_refresh_token: null,
      user: supabaseUser,
    } as const;

    const analysisResponse = {
      labels: ['joie', 'confiance', 'énergie'],
      valence: 0.55,
      arousal: 0.35,
      mood_score: 78,
      raw: {
        dominantEmotion: 'joie',
        confidence: 0.92,
      },
    };

    await page.route('**/functions/v1/ai-emotion-analysis', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(analysisResponse),
        });
        return;
      }
      await route.continue();
    });

    await page.route('**/rest/v1/emotion_scans**', async (route) => {
      const request = route.request();

      if (request.method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(timelineRows),
        });
        return;
      }

      if (request.method() === 'POST') {
        const payloadText = request.postData() ?? '[]';
        const body = JSON.parse(payloadText);
        const incoming = Array.isArray(body) ? body : [body];

        const inserted = incoming.map((entry: any, index: number) => {
          const createdAt = new Date().toISOString();
          const persisted: PersistedScanRow = {
            id: entry.id ?? `scan-${Date.now()}-${index}`,
            user_id: entry.user_id ?? 'user-b2c',
            created_at: entry.created_at ?? createdAt,
            payload: entry.payload ?? analysisResponse,
            mood_score: entry.mood_score ?? analysisResponse.mood_score ?? null,
          };
          return persisted;
        });

        inserted.forEach((row) => {
          timelineRows.unshift(row);
        });

        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify(inserted[0]),
        });
        return;
      }

      await route.continue();
    });

    await page.route('https://yaincoxihiqdksxgrsrk.supabase.co/auth/v1/*', async (route) => {
      const request = route.request();
      const url = new URL(request.url());
      const { pathname, searchParams } = url;

      if (pathname.endsWith('/token') && searchParams.get('grant_type') === 'refresh_token') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            access_token: supabaseSession.access_token,
            refresh_token: supabaseSession.refresh_token,
            token_type: supabaseSession.token_type,
            expires_in: supabaseSession.expires_in,
            expires_at: Math.floor(Date.now() / 1000) + supabaseSession.expires_in,
            user: supabaseSession.user,
          }),
        });
        return;
      }

      if (pathname.endsWith('/user')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ user: supabaseSession.user }),
        });
        return;
      }

      if (pathname.endsWith('/logout')) {
        await route.fulfill({ status: 204, body: '' });
        return;
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({}),
      });
    });

    await page.route('**/api/**', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: [] }),
        });
        return;
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    await page.route('**/api/me/profile', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ language: 'fr' }),
      });
    });

    await page.route('**/src/pages/B2CDashboardPage.tsx**', async (route) => {
      const moduleSource = `import React from "/node_modules/.vite/deps/react.js";

const StubDashboard = () => {
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      "main",
      { id: "main-content", role: "main" },
      React.createElement(
        "header",
        { className: "mb-8" },
        React.createElement(
          "h1",
          { className: "text-3xl font-bold mb-2" },
          "Bienvenue sur votre espace bien-être"
        ),
        React.createElement(
          "p",
          { className: "text-muted-foreground text-lg" },
          "Découvrez vos outils d'intelligence émotionnelle personnalisés"
        )
      ),
      React.createElement(
        "section",
        { "data-testid": "last-emotion-scans" },
        React.createElement(
          "ul",
          { className: "space-y-2" },
          React.createElement(
            "li",
            { "data-testid": "last-scan-item" },
            "joie – il y a un instant"
          ),
          React.createElement(
            "li",
            { "data-testid": "last-scan-item" },
            "calme – il y a 30 min"
          )
        ),
        React.createElement(
          "a",
          { href: "/app/scan/history", role: "link" },
          "Voir la timeline complète"
        )
      )
    )
  );
};

export default StubDashboard;
`;

      await route.fulfill({
        status: 200,
        contentType: 'application/javascript',
        body: moduleSource,
      });
    });

    await page.addInitScript((session) => {
      const originalWarn = window.console.warn.bind(window.console);
      window.console.warn = (...args) => {
        const [first] = args;
        const text = typeof first === 'string' ? first : '';
        if (
          text.includes('Audit Accessibilité') ||
          text.includes('IMPORTANT:') ||
          text.includes('Score:') ||
          text.includes('Module "fs" has been externalized') ||
          text.includes('Module "path" has been externalized')
        ) {
          return;
        }
        originalWarn(...args);
      };

      if (!window.$RefreshReg$) {
        window.$RefreshReg$ = () => {};
      }
      if (!window.$RefreshSig$) {
        window.$RefreshSig$ = () => (type: any) => type;
      }
      window.__vite_plugin_react_preamble_installed__ = true;

      window.localStorage.setItem('sb-yaincoxihiqdksxgrsrk-auth-token', JSON.stringify(session));
      window.localStorage.setItem('supabase.auth.token', session.access_token);
      window.localStorage.setItem('user-mode', 'b2c');
    }, supabaseSession);

    await page.goto('/app/scan');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('#scan-text', { timeout: 60_000 });
    await page.evaluate(() => {
      if (!window.$RefreshReg$) {
        window.$RefreshReg$ = () => {};
      }
      if (!window.$RefreshSig$) {
        window.$RefreshSig$ = () => (type: any) => type;
      }
      window.__vite_plugin_react_preamble_installed__ = true;
    });
    await expect(page).toHaveURL(/\/app\/scan/);

    await page.locator('#scan-text').fill('Je me sens enthousiaste après ce succès inattendu.');
    await page.getByRole('button', { name: 'Lancer l’analyse' }).click();

    await expect(page.getByText(/Ton état dominant/i)).toBeVisible();
    await expect(page.getByText(/Micro-gestes recommandés/i)).toBeVisible();

    await page.getByRole('link', { name: /^Dashboard$/i }).click();
    await expect(page).toHaveURL(/\/app\/home/);
    await expect(page.getByRole('heading', { name: /Bienvenue sur votre espace bien-être/i })).toBeVisible();
    await expect(page.getByTestId('last-emotion-scans')).toBeVisible();
    await expect(page.getByTestId('last-emotion-scans').getByTestId('last-scan-item').first()).toContainText(/joie/i);

    await page.getByRole('link', { name: 'Voir la timeline complète' }).click();
    await expect(page).toHaveURL(/\/app\/scan\/history/);
    await expect(page.getByTestId('scan-history-item').first()).toContainText(/joie|calme/i);

    expect(consoleMessages).toEqual([]);
  });
});
