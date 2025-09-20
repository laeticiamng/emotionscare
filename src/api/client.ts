import type { paths } from './types.gen';

type HttpMethod<P extends keyof paths> = keyof paths[P];

type ExtractRequestBody<P extends keyof paths, M extends HttpMethod<P>> = paths[P][M] extends {
  requestBody: { content: { 'application/json': infer Body } };
}
  ? Body
  : undefined;

type ExtractResponseBody<P extends keyof paths, M extends HttpMethod<P>> = paths[P][M] extends {
  responses: { '200': { content: { 'application/json': infer Body } } };
}
  ? Body
  : never;

type ExtractQuery<P extends keyof paths, M extends HttpMethod<P>> = paths[P][M] extends {
  parameters: { query: infer Query };
}
  ? Query
  : undefined;

export interface ApiClientOptions {
  baseUrl?: string;
  getAuthToken?: () => Promise<string | null> | string | null;
}

export class ApiError extends Error {
  constructor(message: string, public readonly status: number, public readonly payload?: unknown) {
    super(message);
    this.name = 'ApiError';
  }
}

export class EmotionsCareApiClient {
  private readonly baseUrl: string;
  private readonly getAuthToken?: ApiClientOptions['getAuthToken'];

  constructor(options: ApiClientOptions = {}) {
    this.baseUrl = options.baseUrl ?? '/api';
    this.getAuthToken = options.getAuthToken;
  }

  async request<P extends keyof paths, M extends HttpMethod<P>>(
    path: P,
    method: M,
    {
      body,
      query
    }: {
      body?: ExtractRequestBody<P, M> extends undefined ? undefined : ExtractRequestBody<P, M>;
      query?: ExtractQuery<P, M> extends undefined ? undefined : ExtractQuery<P, M>;
    } = {}
  ): Promise<ExtractResponseBody<P, M>> {
    const url = new URL(`${this.baseUrl}${String(path)}`);

    if (query && typeof query === 'object') {
      (Object.entries(query) as Array<[string, unknown]>).forEach(([key, value]) => {
        if (value === undefined || value === null) {
          return;
        }
        if (Array.isArray(value)) {
          value.forEach((item) => {
            url.searchParams.append(key, String(item));
          });
        } else {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (this.getAuthToken) {
      const token = await this.getAuthToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    const response = await fetch(url.toString(), {
      method: String(method).toUpperCase(),
      headers,
      body: body ? JSON.stringify(body) : undefined
    });

    if (!response.ok) {
      const payload = await safeJson(response);
      throw new ApiError(`Requête ${response.status}`, response.status, payload);
    }

    return (await response.json()) as ExtractResponseBody<P, M>;
  }

  startAssessment(payload: ExtractRequestBody<'/assess/start', 'post'>) {
    return this.request('/assess/start', 'post', { body: payload });
  }

  submitAssessment(payload: ExtractRequestBody<'/assess/submit', 'post'>) {
    return this.request('/assess/submit', 'post', { body: payload });
  }

  aggregateAssessment(payload: ExtractRequestBody<'/assess/aggregate', 'post'>) {
    return this.request('/assess/aggregate', 'post', { body: payload });
  }

  listTeams(query: ExtractQuery<'/b2b/teams/list', 'get'>) {
    return this.request('/b2b/teams/list', 'get', { query });
  }

  buildNarrativeReport(payload: ExtractRequestBody<'/b2b/reports/summary', 'post'>) {
    return this.request('/b2b/reports/summary', 'post', { body: payload });
  }

  auditTrail(query: ExtractQuery<'/b2b/audit/trail', 'get'>) {
    return this.request('/b2b/audit/trail', 'get', { query });
  }

  prepareJournalExport(payload: ExtractRequestBody<'/b2b/exports/journal', 'post'>) {
    return this.request('/b2b/exports/journal', 'post', { body: payload });
  }
}

async function safeJson(response: Response) {
  try {
    return await response.json();
  } catch (error) {
    console.warn('Réponse non JSON redirigée', error);
    return undefined;
  }
}
