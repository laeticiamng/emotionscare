/* @vitest-environment node */

import { beforeAll, beforeEach, describe, expect, it } from 'vitest';

import {
  envStore,
  handlerRef,
  resetTestState,
  supabaseDouble,
  type Handler,
} from './b2b-test-utils';

describe('b2b events edge functions', () => {
  let createHandler: Handler;
  let updateHandler: Handler;
  let deleteHandler: Handler;

  beforeAll(async () => {
    resetTestState();
    envStore.set('SUPABASE_URL', 'https://supabase.test');
    envStore.set('SUPABASE_SERVICE_ROLE_KEY', 'service-key');
    envStore.set('FF_B2B_SUITE', 'true');

    await import('../../supabase/functions/b2b-events-create/index.ts');
    createHandler = handlerRef.current!;
    handlerRef.current = null;

    await import('../../supabase/functions/b2b-events-update/index.ts');
    updateHandler = handlerRef.current!;
    handlerRef.current = null;

    await import('../../supabase/functions/b2b-events-delete/index.ts');
    deleteHandler = handlerRef.current!;
  });

  beforeEach(() => {
    supabaseDouble.reset();
    supabaseDouble.auth.getUser.mockResolvedValue({
      data: {
        user: {
          id: 'manager-1',
          user_metadata: { org_id: 'org-evt', org_role: 'manager' },
        },
      },
      error: null,
    });
  });

  it('creates events scoped to the organization and persists reminder flags', async () => {
    const createdEvent = {
      id: 'evt-1',
      title: 'Réunion hebdo',
      description: 'Sync rapide',
      starts_at: '2025-07-10T10:00:00.000Z',
      ends_at: '2025-07-10T11:00:00.000Z',
      location: 'Salle A',
      reminders: { email: true, push: false },
    };
    supabaseDouble.queueResponse('insert', 'org_events', { data: createdEvent, error: null });

    const response = await createHandler(
      new Request('https://edge.local/b2b/events/create', {
        method: 'POST',
        headers: {
          authorization: 'Bearer token',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          title: '  Réunion hebdo ',
          description: ' Sync rapide ',
          starts_at: '2025-07-10T10:00:00.000Z',
          ends_at: '2025-07-10T11:00:00.000Z',
          location: ' Salle A ',
          reminders: { email: true, push: false },
        }),
      }),
    );

    expect(response.status).toBe(200);

    const insertEntry = supabaseDouble.findLastLog('org_events', 'insert');
    expect(insertEntry?.payload).toMatchObject({
      org_id: 'org-evt',
      title: 'Réunion hebdo',
      reminders: { email: true, push: false },
    });

    const auditEntry = supabaseDouble.findLastLog('org_audit_logs', 'insert');
    expect(auditEntry?.payload).toMatchObject({
      org_id: 'org-evt',
      event: 'event.created',
    });
  });

  it('updates events with org filters and keeps reminder preferences', async () => {
    const updatedEvent = {
      id: 'evt-1',
      title: 'Réunion mise à jour',
      description: 'Sync plus long',
      starts_at: '2025-07-11T10:00:00.000Z',
      ends_at: '2025-07-11T12:00:00.000Z',
      location: 'Salle B',
      reminders: { email: true, push: true },
    };
    supabaseDouble.queueResponse('update', 'org_events', { data: updatedEvent, error: null });

    const response = await updateHandler(
      new Request('https://edge.local/b2b/events/update', {
        method: 'POST',
        headers: {
          authorization: 'Bearer token',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          event_id: 'evt-1',
          title: 'Réunion mise à jour',
          starts_at: '2025-07-11T10:00:00.000Z',
          ends_at: '2025-07-11T12:00:00.000Z',
          reminders: { email: true, push: true },
        }),
      }),
    );

    expect(response.status).toBe(200);
    const updateEntry = supabaseDouble.findLastLog('org_events', 'update');
    expect(updateEntry?.payload).toMatchObject({
      title: 'Réunion mise à jour',
      reminders: { email: true, push: true },
    });
    expect(updateEntry?.filters.map((filter) => filter.args)).toContainEqual(['org_id', 'org-evt']);
    expect(updateEntry?.filters.map((filter) => filter.args)).toContainEqual(['id', 'evt-1']);
  });

  it('deletes events within org scope', async () => {
    supabaseDouble.queueResponse('delete', 'org_events', { data: { id: 'evt-1' }, error: null });

    const response = await deleteHandler(
      new Request('https://edge.local/b2b/events/delete', {
        method: 'POST',
        headers: {
          authorization: 'Bearer token',
          'content-type': 'application/json',
        },
        body: JSON.stringify({ event_id: 'evt-1' }),
      }),
    );

    expect(response.status).toBe(200);

    const deleteEntry = supabaseDouble.findLastLog('org_events', 'delete');
    expect(deleteEntry?.filters.map((filter) => filter.args)).toContainEqual(['org_id', 'org-evt']);
    expect(deleteEntry?.filters.map((filter) => filter.args)).toContainEqual(['id', 'evt-1']);
  });
});
