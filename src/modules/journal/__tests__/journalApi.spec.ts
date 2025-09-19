import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { SanitizedNote } from '../types'
import { __testUtils__ } from '@/services/journal/journalApi'

const insertMock = vi.fn()
const updateMock = vi.fn()
const selectBuilder = {
  order: vi.fn().mockReturnThis(),
  range: vi.fn().mockReturnThis(),
  ilike: vi.fn().mockReturnThis(),
  contains: vi.fn().mockReturnThis(),
  then: (resolve: (value: { data: SanitizedNote[]; error: null }) => void) => {
    const rows = [
      {
        id: '00000000-0000-0000-0000-000000000001',
        content: 'Hello <b>world</b>',
        created_at: '2024-02-10T10:00:00.000Z',
        tags: ['focus', 'Calme'],
        summary: 'Résumé',
      } as any,
    ]
    return Promise.resolve(resolve({ data: rows as unknown as SanitizedNote[], error: null }))
  },
} as const

const singleResponse = () => Promise.resolve({ data: { id: 'note-uuid' }, error: null })

type SupabaseMock = ReturnType<typeof createSupabaseMock>

let supabaseMock: SupabaseMock

function createSupabaseMock() {
  return {
    auth: {
      getUser: vi.fn(),
    },
    from: vi.fn(),
    functions: {
      invoke: vi.fn(),
    },
  }
}

vi.mock('@/integrations/supabase/client', () => ({
  get supabase() {
    return supabaseMock
  },
}))

describe('journalApi', () => {
  beforeEach(() => {
    supabaseMock = createSupabaseMock()
    insertMock.mockReset()
    updateMock.mockReset()
    supabaseMock.auth.getUser.mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null })
    supabaseMock.functions.invoke.mockResolvedValue({ data: { entry_id: 'voice-1' }, error: null })

    supabaseMock.from.mockImplementation((table: string) => {
      if (table === 'journal_entries') {
        return {
          insert: insertMock.mockReturnValue({
            select: () => ({
              single: singleResponse,
            }),
          }),
          update: updateMock.mockReturnValue({
            eq: vi.fn().mockResolvedValue({ data: null, error: null }),
          }),
          select: () => selectBuilder,
        }
      }
      if (table === 'coach_conversations') {
        return {
          insert: vi.fn().mockReturnValue({
            select: () => ({
              single: () => Promise.resolve({ data: { id: 'conversation-1' }, error: null }),
            }),
          }),
        }
      }
      if (table === 'coach_messages') {
        return {
          insert: vi.fn().mockResolvedValue({ error: null }),
        }
      }
      return {} as any
    })
  })

  it('sanitizes text and tags on insertText', async () => {
    const { insertText } = await import('@/services/journal/journalApi')

    await insertText({ text: 'Hello<script>alert(1)</script>!', tags: ['Focus', '  '] })

    expect(insertMock).toHaveBeenCalledTimes(1)
    const payload = insertMock.mock.calls[0]?.[0] as Record<string, unknown>
    expect(payload?.content).toBe('Hello!')
    expect(payload?.tags).toEqual(['focus'])
    expect(payload?.mode).toBe('text')
    expect(payload?.user_id).toBe('user-1')
  })

  it('lists feed with sanitized notes', async () => {
    const { listFeed } = await import('@/services/journal/journalApi')

    const notes = await listFeed({ limit: 5 })

    expect(notes).toHaveLength(1)
    expect(notes[0]?.text).toBe('Hello world')
    expect(notes[0]?.tags).toEqual(['focus', 'calme'])
  })

  it('creates a coach draft without exposing content', async () => {
    const { createCoachDraft } = await import('@/services/journal/journalApi')

    const conversationId = await createCoachDraft({ id: '00000000-0000-0000-0000-000000000002' })

    expect(conversationId).toBe('conversation-1')
    expect(supabaseMock.from).toHaveBeenCalledWith('coach_conversations')
  })

  it('sanitizes plain text helper', () => {
    const { sanitizePlainText } = __testUtils__()
    expect(sanitizePlainText('<img src=x onerror=alert(1)>Bonjour')).toBe('Bonjour')
  })
})
