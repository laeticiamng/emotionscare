export type NyveePersistPayload = {
  profile: string;
  next: 'anchor' | '54321';
  exit: 'soft';
  notes: string;
};

const DEFAULT_ENDPOINT = '/api/modules/nyvee/sessions';

type PersistSessionOptions = {
  endpoint?: string;
};

export async function persistSession(
  module: 'nyvee',
  payload: NyveePersistPayload,
  options: PersistSessionOptions = {}
): Promise<void> {
  const endpoint = options.endpoint ?? DEFAULT_ENDPOINT;
  const body = JSON.stringify({ module, payload });

  const response = await (typeof fetch === 'function'
    ? fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      })
    : Promise.reject(new Error('fetch_unavailable')));

  if (!response || !('ok' in response)) {
    throw new Error('persist_session_invalid_response');
  }

  if (!response.ok) {
    throw new Error(`persist_session_failed:${response.status}`);
  }
}
