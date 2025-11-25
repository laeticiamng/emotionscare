import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TextSchema } from '../../journal/lib/validate';
import { hash } from '../../journal/lib/hash';

vi.hoisted(() => {
  process.env.HASH_PEPPER = 'test-pepper';
});

const insertTextMock = vi.fn(async (data: any) => ({
  id: 'text-1',
  ts: '2024-05-20T10:00:00.000Z',
  ...data,
}));

const listFeedMock = vi.fn(async () => [
  {
    id: 'entry-1',
    type: 'text',
    ts: '2024-05-19T09:30:00.000Z',
    preview: 'Bonjour journal',
    text_raw: 'Bonjour journal',
    summary: 'Bonjour journal',
    valence: 0.25,
  },
]);

async function handleText(req: any, reply: any) {
  if (!req.user) {
    reply.code(401).send({ ok: false, error: { code: 'unauthorized', message: 'Unauthorized' } });
    return;
  }
  const data = TextSchema.parse(req.body);
  const userHash = hash(req.user.sub);
  const row = await insertTextMock({ ...data, user_hash: userHash });
  reply.code(201).send({ ok: true, data: { id: row.id, ts: row.ts } });
}

async function handleFeed(req: any, reply: any) {
  if (!req.user) {
    reply.code(401).send({ ok: false, error: { code: 'unauthorized', message: 'Unauthorized' } });
    return;
  }
  const entries = await listFeedMock();
  reply.send({ ok: true, data: { entries, weekly: [] } });
}

beforeEach(() => {
  insertTextMock.mockClear();
  listFeedMock.mockClear();
});

describe('journal API routes', () => {
  it('rejects text journal creation without authentication', async () => {
    const reply = createReply();
    await handleText({ body: { text_raw: 'Bonjour', styled_html: '<p>Bonjour</p>', preview: 'Bonjour', valence: 0, emo_vec: Array(8).fill(0) } }, reply);

    expect(reply.statusCode).toBe(401);
    expect(insertTextMock).not.toHaveBeenCalled();
  });

  it('creates a text journal entry for the authenticated user', async () => {
    const payload = {
      text_raw: 'Bonjour journal',
      styled_html: '<p>Bonjour journal</p>',
      preview: 'Bonjour journal',
      valence: 0.1,
      emo_vec: Array(8).fill(0.1),
    };
    const reply = createReply();

    await handleText({ body: payload, user: { sub: 'user-123' } }, reply);

    expect(reply.statusCode).toBe(201);
    const expectedHash = hash('user-123');
    expect(insertTextMock).toHaveBeenCalledWith({
      ...payload,
      user_hash: expectedHash,
    });

    expect(reply.payload).toEqual({
      ok: true,
      data: { id: 'text-1', ts: '2024-05-20T10:00:00.000Z' },
    });
  });

  it('returns the journal feed for the authenticated user', async () => {
    const reply = createReply();

    await handleFeed({ user: { sub: 'user-123' } }, reply);

    expect(reply.statusCode).toBe(200);
    expect(listFeedMock).toHaveBeenCalled();

    expect(reply.payload).toEqual({
      ok: true,
      data: {
        entries: [
          {
            id: 'entry-1',
            type: 'text',
            ts: '2024-05-19T09:30:00.000Z',
            preview: 'Bonjour journal',
            text_raw: 'Bonjour journal',
            summary: 'Bonjour journal',
            valence: 0.25,
          },
        ],
        weekly: [],
      },
    });
  });
});

function createReply() {
  return {
    statusCode: 0,
    payload: undefined as any,
    code(code: number) {
      this.statusCode = code;
      return this;
    },
    send(body: any) {
      this.payload = body;
      this.statusCode = this.statusCode || 200;
    },
  };
}
