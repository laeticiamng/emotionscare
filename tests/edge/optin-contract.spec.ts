/* @vitest-environment node */

import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

import type { paths } from '../../types/optin';

type AcceptSuccess = paths['/optin/accept']['post']['responses'][200]['content']['application/json'];
type RejectError = paths['/optin/accept']['post']['responses'][401]['content']['application/json'];
type ValidationError = paths['/optin/accept']['post']['responses'][422]['content']['application/json'];
type RevokeSuccess = paths['/optin/revoke']['post']['responses'][200]['content']['application/json'];

const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('optin OpenAPI contracts', () => {
  it('serves the accept 200 schema', async () => {
    const payload: AcceptSuccess = {
      status: 'accepted',
      accepted_at: '2025-03-01T10:00:00.000Z',
      version: 'v1',
    };

    server.use(
      http.post('https://api.test/optin/accept', async ({ request }) => {
        const body = await request.json() as paths['/optin/accept']['post']['requestBody']['content']['application/json'];
        expect(body.version).toBe('v1');
        return HttpResponse.json(payload, { status: 200 });
      }),
    );

    const response = await fetch('https://api.test/optin/accept', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: 'Bearer token' },
      body: JSON.stringify({ version: 'v1', scope: { clinical: true } }),
    });

    expect(response.status).toBe(200);
    const json = await response.json() as AcceptSuccess;
    expect(json).toEqual(payload);
  });

  it('propagates authentication errors for accept route', async () => {
    const payload: RejectError = { error: 'unauthorized' };

    server.use(
      http.post('https://api.test/optin/accept', () => HttpResponse.json(payload, { status: 401 })),
    );

    const response = await fetch('https://api.test/optin/accept', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ version: 'v1' }),
    });

    expect(response.status).toBe(401);
    const json = await response.json() as RejectError;
    expect(json).toEqual(payload);
  });

  it('returns validation error schema for accept route', async () => {
    const payload: ValidationError = { error: 'invalid_body' };

    server.use(
      http.post('https://api.test/optin/accept', () => HttpResponse.json(payload, { status: 422 })),
    );

    const response = await fetch('https://api.test/optin/accept', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: 'Bearer token' },
      body: JSON.stringify({ version: '' }),
    });

    expect(response.status).toBe(422);
    const json = await response.json() as ValidationError;
    expect(json).toEqual(payload);
  });

  it('serves the revoke 200 schema', async () => {
    const payload: RevokeSuccess = {
      status: 'revoked',
      revoked_at: '2025-03-02T11:00:00.000Z',
    };

    server.use(
      http.post('https://api.test/optin/revoke', () => HttpResponse.json(payload, { status: 200 })),
    );

    const response = await fetch('https://api.test/optin/revoke', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: 'Bearer token' },
      body: JSON.stringify({ reason: 'user-request' }),
    });

    expect(response.status).toBe(200);
    const json = await response.json() as RevokeSuccess;
    expect(json).toEqual(payload);
  });
});
