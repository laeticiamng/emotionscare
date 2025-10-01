// @ts-nocheck
import { test, expect } from '@playwright/test';

const POSITIVE_IDS = ['active', 'determined', 'attentive', 'inspired', 'alert'] as const;
const NEGATIVE_IDS = ['upset', 'hostile', 'ashamed', 'nervous', 'afraid'] as const;

interface TimelineRow {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string | null;
  scan_type: string | null;
  mood: string | null;
  summary: string | null;
  confidence: number | null;
  emotional_balance: number | null;
  recommendations: string[] | null;
  insights: string[] | null;
  emotions: any;
}

test.describe('Emotion Scan → Dashboard timeline', () => {
  test.skip(({ }, testInfo) => testInfo.project.name !== 'b2c-chromium');

  test('records a scan and surfaces it on the dashboard timeline', async ({ page }) => {
    const timelineRows: TimelineRow[] = [
      {
        id: 'seed-scan',
        user_id: 'user-b2c',
        created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        updated_at: null,
        scan_type: 'self-report',
        mood: 'calme',
        summary: 'Émotion dominante: calme · Confiance: 78% · Équilibre émotionnel: 66/100',
        confidence: 78,
        emotional_balance: 66,
        recommendations: ['Prendre un moment de respiration'],
        insights: ['Stabilité émotionnelle observée'],
        emotions: {
          scores: {
            joie: 6,
            confiance: 5,
            anticipation: 5,
            surprise: 4,
            tristesse: 3,
            colere: 2,
            peur: 2,
            degout: 1,
          },
          insights: ['Stabilité émotionnelle observée'],
          context: 'Historique seed',
          previousEmotions: null,
        },
      },
    ];

    const analysisResponse = {
      emotions: {
        joie: 8.2,
        confiance: 7.6,
        anticipation: 6.9,
        surprise: 5.8,
        tristesse: 1.9,
        colere: 1.2,
        peur: 1,
        degout: 0.6,
      },
      dominantEmotion: 'joie',
      confidence: 0.92,
      emotionalBalance: 72,
      insights: [
        'Belle dynamique positive détectée',
        'Votre énergie est en hausse',
      ],
      recommendations: [
        'Planifier une activité créative',
        'Partager cette émotion avec un proche',
      ],
      persisted: false,
      scanId: null,
    };

    await page.route('**/functions/v1/ai-emotion-analysis', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(analysisResponse),
        });
      } else {
        await route.continue();
      }
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
        const inserted = incoming.map((entry, index) => {
          const createdAt = new Date().toISOString();
          const record: TimelineRow = {
            id: entry.id ?? `scan-${Date.now()}-${index}`,
            user_id: entry.user_id ?? 'user-b2c',
            created_at: entry.created_at ?? createdAt,
            updated_at: entry.updated_at ?? createdAt,
            scan_type: entry.scan_type ?? 'self-report',
            mood: entry.mood ?? analysisResponse.dominantEmotion,
            summary:
              entry.summary ??
              `Émotion dominante: ${analysisResponse.dominantEmotion} · Confiance: ${Math.round(analysisResponse.confidence * 100)}% · Équilibre émotionnel: ${analysisResponse.emotionalBalance}/100`,
            confidence: entry.confidence ?? Math.round(analysisResponse.confidence * 100),
            emotional_balance: entry.emotional_balance ?? analysisResponse.emotionalBalance,
            recommendations: entry.recommendations ?? analysisResponse.recommendations,
            insights: entry.insights ?? analysisResponse.insights,
            emotions: entry.emotions ?? {
              scores: analysisResponse.emotions,
              insights: analysisResponse.insights,
              context: entry.context ?? 'Auto-évaluation I-PANAS-SF',
              previousEmotions: entry.previousEmotions ?? null,
            },
          };
          return record;
        });

        inserted.reverse().forEach((row) => {
          timelineRows.unshift(row);
        });

        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify(inserted),
        });
        return;
      }

      await route.continue();
    });

    await page.goto('/modules/emotion-scan');
    await expect(page).toHaveURL(/\/modules\/emotion-scan/);

    for (const id of POSITIVE_IDS) {
      await page.locator(`#${id}-5`).check();
    }
    for (const id of NEGATIVE_IDS) {
      await page.locator(`#${id}-2`).check();
    }

    await page.locator('[data-ui="primary-cta"]').click();
    await expect(page.getByText(/Émotion dominante/i)).toBeVisible();

    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    const timeline = page.getByTestId('recent-scan-entry');
    await expect(page.getByTestId('recent-scans-card')).toBeVisible();
    await expect(timeline.first()).toContainText(/joie/i);
    await expect(page.getByTestId('recent-scans-card')).toContainText('72 / 100');
    await expect(page.getByTestId('recent-scans-card')).toContainText('92%');
  });
});
