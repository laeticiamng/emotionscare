import { vi } from 'vitest';

type QueryAction = 'select' | 'insert' | 'update' | 'delete' | 'upsert';

type QueryResponse<T = any> = {
  data: T | null;
  error: { message: string } | null;
};

type FilterLog = {
  method: string;
  args: unknown[];
};

type QueryLogEntry = {
  table: string;
  action: QueryAction;
  payload?: unknown;
  filters: FilterLog[];
  selectColumns: string[];
};

type StorageUploadCall = {
  bucket: string;
  path: string;
  options?: Record<string, unknown>;
  body: Blob;
};

type StorageSignedCall = {
  bucket: string;
  path: string;
  expiresIn: number;
};

const defaultResponse: QueryResponse = { data: null, error: null };

function isErrorResponse(value: unknown): value is Error {
  return value instanceof Error;
}

function cloneBlob(blob: Blob) {
  return blob.slice(0, blob.size, blob.type);
}

export class SupabaseServiceDouble {
  queryLog: QueryLogEntry[] = [];

  private insertQueues = new Map<string, QueryResponse[]>();
  private updateQueues = new Map<string, QueryResponse[]>();
  private deleteQueues = new Map<string, QueryResponse[]>();
  private selectQueues = new Map<string, QueryResponse[]>();
  private upsertQueues = new Map<string, QueryResponse[]>();

  private storageUploadQueues = new Map<string, Array<QueryResponse | Error>>();
  private storageSignedQueues = new Map<string, Array<{ data: { signedUrl: string } | null; error: { message: string } | null }>>();

  storageUploadCalls: StorageUploadCall[] = [];
  storageSignedCalls: StorageSignedCall[] = [];

  auth = {
    getUser: vi.fn<[], Promise<{ data: { user: any } | null; error: { message: string } | null }>>(),
    admin: {
      getUserById: vi.fn<[], Promise<{ user: any } | null>>(),
      updateUserById: vi.fn<[], Promise<void>>(),
    },
  };

  from = vi.fn((table: string) => ({
    insert: (payload: unknown) => this.buildQuery(table, 'insert', payload, this.insertQueues),
    update: (payload: unknown) => this.buildQuery(table, 'update', payload, this.updateQueues),
    delete: () => this.buildQuery(table, 'delete', undefined, this.deleteQueues),
    select: (columns?: string) => this.buildQuery(table, 'select', undefined, this.selectQueues, columns),
    upsert: (payload: unknown) => this.buildQuery(table, 'upsert', payload, this.upsertQueues),
  }));

  storage = {
    from: vi.fn((bucket: string) => ({
      upload: vi.fn(async (path: string, body: Blob, options?: Record<string, unknown>) => {
        this.storageUploadCalls.push({ bucket, path, body: cloneBlob(body), options });
        const nextQueue = this.storageUploadQueues.get(bucket);
        if (nextQueue && nextQueue.length > 0) {
          const next = nextQueue.shift()!;
          if (isErrorResponse(next)) {
            throw next;
          }
          return next;
        }
        return { data: { path }, error: null } satisfies QueryResponse<{ path: string }>;
      }),
      createSignedUrl: vi.fn(async (path: string, expiresIn: number) => {
        this.storageSignedCalls.push({ bucket, path, expiresIn });
        const nextQueue = this.storageSignedQueues.get(bucket);
        if (nextQueue && nextQueue.length > 0) {
          return nextQueue.shift()!;
        }
        return { data: { signedUrl: `https://storage.test/${bucket}/${path}` }, error: null };
      }),
    })),
  };

  queueResponse<T = any>(action: QueryAction, table: string, response: QueryResponse<T>) {
    const map = this.getQueueMap(action);
    if (!map.has(table)) {
      map.set(table, []);
    }
    map.get(table)!.push(response);
  }

  queueStorageUpload(bucket: string, response: QueryResponse | Error) {
    if (!this.storageUploadQueues.has(bucket)) {
      this.storageUploadQueues.set(bucket, []);
    }
    this.storageUploadQueues.get(bucket)!.push(response);
  }

  queueStorageSigned(bucket: string, response: { data: { signedUrl: string } | null; error: { message: string } | null }) {
    if (!this.storageSignedQueues.has(bucket)) {
      this.storageSignedQueues.set(bucket, []);
    }
    this.storageSignedQueues.get(bucket)!.push(response);
  }

  findLastLog(table: string, action: QueryAction) {
    for (let index = this.queryLog.length - 1; index >= 0; index -= 1) {
      const entry = this.queryLog[index];
      if (entry.table === table && entry.action === action) {
        return entry;
      }
    }
    return null;
  }

  reset() {
    this.queryLog = [];
    this.insertQueues.clear();
    this.updateQueues.clear();
    this.deleteQueues.clear();
    this.selectQueues.clear();
    this.upsertQueues.clear();
    this.storageUploadQueues.clear();
    this.storageSignedQueues.clear();
    this.storageUploadCalls = [];
    this.storageSignedCalls = [];
    this.from.mockClear();
    this.storage.from.mockClear();
    this.auth.getUser.mockReset();
    this.auth.admin.getUserById.mockReset();
    this.auth.admin.updateUserById.mockReset();
  }

  private buildQuery(
    table: string,
    action: QueryAction,
    payload: unknown,
    queueMap: Map<string, QueryResponse[]>,
    initialSelect?: string,
  ) {
    const entry: QueryLogEntry = {
      table,
      action,
      payload,
      filters: [],
      selectColumns: initialSelect ? [initialSelect] : [],
    };
    this.queryLog.push(entry);

    const provider = () => {
      const queue = queueMap.get(table);
      if (queue && queue.length > 0) {
        return queue.shift()!;
      }
      return defaultResponse;
    };

    const chain: any = {};

    const record = (method: string) => (...args: unknown[]) => {
      entry.filters.push({ method, args });
      return chain;
    };

    chain.eq = record('eq');
    chain.neq = record('neq');
    chain.order = record('order');
    chain.limit = record('limit');
    chain.gte = record('gte');
    chain.lte = record('lte');
    chain.filter = record('filter');
    chain.match = record('match');
    chain.in = record('in');
    chain.range = record('range');
    chain.select = (columns?: string) => {
      if (columns) {
        entry.selectColumns.push(columns);
      }
      return chain;
    };
    chain.maybeSingle = () => Promise.resolve(provider());
    chain.single = () => Promise.resolve(provider());
    chain.then = (resolve: (value: QueryResponse) => unknown, reject?: (reason: unknown) => unknown) =>
      Promise.resolve(provider()).then(resolve, reject);
    chain.__entry = entry;
    return chain;
  }

  private getQueueMap(action: QueryAction) {
    switch (action) {
      case 'insert':
        return this.insertQueues;
      case 'update':
        return this.updateQueues;
      case 'delete':
        return this.deleteQueues;
      case 'select':
        return this.selectQueues;
      case 'upsert':
        return this.upsertQueues;
      default:
        return this.selectQueues;
    }
  }
}

export const supabaseDouble = new SupabaseServiceDouble();

export const createClientMock = vi.fn(() => supabaseDouble);

export const resendSendMock = vi.fn();
export const ResendCtorMock = vi.fn(() => ({ emails: { send: resendSendMock } }));

export type Handler = (req: Request) => Promise<Response>;
export const handlerRef: { current: Handler | null } = { current: null };

export const envStore = new Map<string, string>();
export const getEnvMock = vi.fn((key: string) => envStore.get(key));

if (!('Deno' in globalThis)) {
  (globalThis as any).Deno = { env: { get: getEnvMock } };
} else {
  (globalThis as any).Deno.env.get = getEnvMock;
}

vi.mock('https://deno.land/std@0.208.0/http/server.ts', () => ({
  serve: (handler: Handler) => {
    handlerRef.current = handler;
  },
}));

vi.mock('https://esm.sh/@supabase/supabase-js@2', () => ({
  createClient: createClientMock,
}));

vi.mock('https://esm.sh/resend@3.4.0', () => ({
  Resend: ResendCtorMock,
}));

export function resetTestState() {
  supabaseDouble.reset();
  resendSendMock.mockReset();
  ResendCtorMock.mockReset();
  createClientMock.mockClear();
  handlerRef.current = null;
  envStore.clear();
  getEnvMock.mockClear();
}

export type { QueryLogEntry, FilterLog, QueryResponse };
