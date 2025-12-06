import { expect, test } from '@playwright/test';

test.describe('AI Coach session', () => {
  test.skip(({}, testInfo) => testInfo.project.name !== 'b2c-chromium');

  test('handles consented coaching flow with anonymised logging', async ({ page }) => {
    const baseTimestamp = '2025-03-01T09:00:00.000Z';

    await page.route('**/auth/v1/user**', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            user: {
              id: 'user-b2c',
              app_metadata: { role: 'b2c' },
            },
          }),
        });
        return;
      }

      await route.continue();
    });

    const conversations = [
      {
        id: 'conv-session',
        user_id: 'user-b2c',
        title: 'Session Focus',
        coach_mode: 'empathetic',
        message_count: 2,
        last_message_at: baseTimestamp,
      },
    ];

    const messagesByConversation: Record<string, any[]> = {
      'conv-session': [
        {
          id: 'msg-welcome',
          conversation_id: 'conv-session',
          sender: 'assistant',
          content: 'Bienvenue sur votre coach IA, prenons un instant pour respirer.',
          created_at: baseTimestamp,
          message_type: 'neutre',
        },
        {
          id: 'msg-user',
          conversation_id: 'conv-session',
          sender: 'user',
          content: 'Je me sens nerveux avant la réunion.',
          created_at: baseTimestamp,
          message_type: 'peur',
        },
      ],
    };

    await page.route('**/rest/v1/coach_conversations**', async (route) => {
      const request = route.request();
      const method = request.method();

      if (method === 'OPTIONS') {
        await route.fulfill({ status: 204 });
        return;
      }

      if (method === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(conversations),
        });
        return;
      }

      if (method === 'PATCH') {
        const payloadText = request.postData() ?? '{}';
        const patch = JSON.parse(payloadText);
        const targetId = new URL(request.url()).searchParams.get('id')?.replace('eq.', '');
        const existing = conversations.find((item) => item.id === targetId);
        if (existing) {
          Object.assign(existing, patch);
        }
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(existing ? [existing] : []),
        });
        return;
      }

      await route.continue();
    });

    await page.route('**/rest/v1/coach_messages**', async (route) => {
      const request = route.request();
      const method = request.method();
      const url = new URL(request.url());

      if (method === 'OPTIONS') {
        await route.fulfill({ status: 204 });
        return;
      }

      if (method === 'GET') {
        const targetId = url.searchParams.get('conversation_id')?.replace('eq.', '') ?? '';
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(messagesByConversation[targetId] ?? []),
        });
        return;
      }

      if (method === 'POST') {
        const payloadText = request.postData() ?? '{}';
        const parsed = JSON.parse(payloadText);
        const entries = Array.isArray(parsed) ? parsed : [parsed];
        const createdAt = new Date().toISOString();

        const created = entries.map((entry: any, index: number) => ({
          id: entry.id ?? `msg-${Date.now()}-${index}`,
          conversation_id: entry.conversation_id ?? entry.conversationId ?? 'conv-session',
          sender: entry.sender ?? entry.author ?? 'user',
          content: entry.content ?? '',
          created_at: entry.created_at ?? createdAt,
          message_type: entry.message_type ?? entry.type ?? null,
        }));

        for (const record of created) {
          const list = messagesByConversation[record.conversation_id] ?? [];
          messagesByConversation[record.conversation_id] = [...list, record];
        }

        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify(created),
        });
        return;
      }

      await route.continue();
    });

    const sessionLogs: any[] = [];

    await page.route('**/rest/v1/ai_coach_sessions**', async (route) => {
      const request = route.request();
      const method = request.method();

      if (method === 'OPTIONS') {
        await route.fulfill({ status: 204 });
        return;
      }

      if (method === 'POST') {
        const payloadText = request.postData() ?? '{}';
        const parsed = JSON.parse(payloadText);
        const entries = Array.isArray(parsed) ? parsed : [parsed];
        sessionLogs.push(...entries);

        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify(entries),
        });
        return;
      }

      await route.continue();
    });

    await page.route('**/functions/v1/ai-coach', async (route) => {
      if (route.request().method() === 'OPTIONS') {
        await route.fulfill({ status: 204 });
        return;
      }

      const responsePayload = {
        response: 'Merci pour ce partage guidé. Respire profondément et ciblons trois actions concrètes.',
        suggestions: [
          'Respiration 4-7-8 guidée',
          'Note trois actions positives accomplies cette semaine',
        ],
        disclaimers: [
          'Dispositif test 1 : le coach ne remplace pas un professionnel.',
          'Dispositif test 2 : appelez le 112 en cas d’urgence.',
          'Confidentialité active : vos échanges sont anonymisés.',
        ],
        meta: {
          emotion: 'joie',
          source: 'openai',
          timestamp: new Date().toISOString(),
          audience: 'b2c',
        },
      };

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(responsePayload),
      });
    });

    await page.route('**/functions/v1/assistant-api', async (route) => {
      if (route.request().method() === 'OPTIONS') {
        await route.fulfill({ status: 204 });
        return;
      }

      const payloadText = route.request().postData() ?? '{}';
      const payload = JSON.parse(payloadText);

      switch (payload.action) {
        case 'create_assistant':
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ assistant: { id: 'assistant-mock' } }),
          });
          return;
        case 'create_thread':
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ thread: { id: 'thread-mock' } }),
          });
          return;
        case 'create_message':
          await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) });
          return;
        case 'run_assistant':
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ run: { id: 'run-mock', status: 'completed' } }),
          });
          return;
        case 'check_run':
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ run: { id: 'run-mock', status: 'completed' } }),
          });
          return;
        case 'get_messages':
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              messages: {
                data: [
                  {
                    role: 'assistant',
                    content: [
                      {
                        text: {
                          value: JSON.stringify({
                            summary: 'Synthèse anonymisée',
                            signals: ['focus', 'stress'],
                          }),
                        },
                      },
                    ],
                  },
                ],
              },
            }),
          });
          return;
        default:
          await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) });
      }
    });

    await page.goto('/app/coach');

    await expect(page.getByRole('heading', { name: 'Coach IA Personnel' })).toBeVisible();

    await page.getByRole('button', { name: 'Session Focus' }).click();

    await expect(page.getByText('Bienvenue sur votre coach IA', { exact: false })).toBeVisible();

    await page.getByLabel('J’ai lu et compris ces indications', { exact: false }).click();

    await page.getByTestId('coach-input').fill('Je voudrais rester calme avant de présenter mon travail.');
    await page.getByTestId('coach-send').click();

    await expect(page.getByText('Merci pour ce partage guidé', { exact: false })).toBeVisible();
    await expect(page.getByText('Respiration 4-7-8 guidée')).toBeVisible();
    await expect(page.getByTestId('coach-disclaimers')).toContainText('Dispositif test 1');

    await expect.poll(() => sessionLogs.length).toBe(1);

    const loggedSession = sessionLogs[0];
    const notes = typeof loggedSession.session_notes === 'string'
      ? JSON.parse(loggedSession.session_notes)
      : loggedSession.session_notes;

    expect(notes.summary).toBe('Synthèse anonymisée • focus • stress');
    expect(notes.hashed.lastUser).toMatch(/^[a-f0-9]{64}$/);
    expect(notes.hashed.coach).toMatch(/^[a-f0-9]{64}$/);
  });
});

