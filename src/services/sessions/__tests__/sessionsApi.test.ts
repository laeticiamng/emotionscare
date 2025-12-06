// @ts-nocheck
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { createSession, listMySessions, logAndJournal } from '../sessionsApi'
import { supabase } from '@/integrations/supabase/client'
import * as Sentry from '@sentry/react'

type SupabaseMock = typeof supabase & {
  from: ReturnType<typeof vi.fn>
  auth: { getUser: ReturnType<typeof vi.fn> }
}

vi.mock('@sentry/react', () => ({
  addBreadcrumb: vi.fn(),
  captureException: vi.fn()
}))

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(),
    auth: {
      getUser: vi.fn()
    }
  }
}))

const mockedSupabase = supabase as SupabaseMock

describe('sessionsApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('insère une session avec les données nettoyées', async () => {
    const singleMock = vi.fn().mockResolvedValue({
      data: {
        id: 'session-1',
        type: 'breath',
        duration_sec: 12,
        mood_delta: null,
        meta: { foo: 'bar' },
        created_at: '2024-01-01T00:00:00.000Z'
      },
      error: null
    })
    const selectMock = vi.fn().mockReturnValue({ single: singleMock })
    const insertMock = vi.fn().mockReturnValue({ select: selectMock })
    mockedSupabase.from.mockImplementation((table: string) => {
      if (table === 'sessions') {
        return { insert: insertMock }
      }
      throw new Error(`unexpected table ${table}`)
    })

    const result = await createSession({
      type: 'breath',
      duration_sec: 12.9,
      mood_delta: 5.4,
      meta: { foo: 'bar' }
    })

    expect(insertMock).toHaveBeenCalledWith({
      type: 'breath',
      duration_sec: 12,
      mood_delta: 5,
      meta: { foo: 'bar' }
    })
    expect(result).toEqual({
      id: 'session-1',
      type: 'breath',
      duration_sec: 12,
      mood_delta: null,
      meta: { foo: 'bar' },
      created_at: '2024-01-01T00:00:00.000Z'
    })
  })

  it('liste les sessions paginées', async () => {
    const rangeMock = vi.fn().mockResolvedValue({
      data: [
        {
          id: 'session-2',
          type: 'flash_glow',
          duration_sec: 120,
          mood_delta: 4,
          meta: { extended: false },
          created_at: '2024-01-02T00:00:00.000Z'
        }
      ],
      error: null
    })
    const eqMock = vi.fn().mockReturnValue({ range: rangeMock })
    const orderMock = vi.fn().mockReturnValue({ eq: eqMock, range: rangeMock })
    const selectMock = vi.fn().mockReturnValue({ order: orderMock })

    mockedSupabase.from.mockImplementation((table: string) => {
      if (table === 'sessions') {
        return { select: selectMock }
      }
      throw new Error(`unexpected table ${table}`)
    })

    const rows = await listMySessions({ type: 'flash_glow', limit: 2, offset: 1 })

    expect(selectMock).toHaveBeenCalledWith('id, type, duration_sec, mood_delta, meta, created_at')
    expect(orderMock).toHaveBeenCalledWith('created_at', { ascending: false })
    expect(eqMock).toHaveBeenCalledWith('type', 'flash_glow')
    expect(rangeMock).toHaveBeenCalledWith(1, 2)
    expect(rows).toEqual([
      {
        id: 'session-2',
        type: 'flash_glow',
        duration_sec: 120,
        mood_delta: 4,
        meta: { extended: false },
        created_at: '2024-01-02T00:00:00.000Z'
      }
    ])
  })

  it('enregistre la session et le journal automatique', async () => {
    const singleMock = vi.fn().mockResolvedValue({
      data: {
        id: 'session-3',
        type: 'breath',
        duration_sec: 30,
        mood_delta: null,
        meta: {},
        created_at: '2024-01-03T00:00:00.000Z'
      },
      error: null
    })
    const selectMock = vi.fn().mockReturnValue({ single: singleMock })
    const insertSessionMock = vi.fn().mockReturnValue({ select: selectMock })
    const journalInsertMock = vi.fn().mockResolvedValue({ error: null })

    mockedSupabase.from.mockImplementation((table: string) => {
      if (table === 'sessions') {
        return { insert: insertSessionMock }
      }
      if (table === 'journal_entries') {
        return { insert: journalInsertMock }
      }
      throw new Error(`unexpected table ${table}`)
    })

    mockedSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })

    await logAndJournal({
      type: 'breath',
      duration_sec: 30,
      journalText: 'Respiration calme.',
      mood_delta: null,
      meta: { density: 0.5 }
    })

    expect(insertSessionMock).toHaveBeenCalled()
    expect(journalInsertMock).toHaveBeenCalledWith(expect.objectContaining({
      user_id: 'user-1',
      content: 'Respiration calme.'
    }))
  })

  it('capture les erreurs de journalisation sans lever', async () => {
    const singleMock = vi.fn().mockResolvedValue({ data: { id: 'session-4', type: 'breath', duration_sec: 20, mood_delta: null, meta: {}, created_at: '2024-01-04T00:00:00.000Z' }, error: null })
    const selectMock = vi.fn().mockReturnValue({ single: singleMock })
    const insertSessionMock = vi.fn().mockReturnValue({ select: selectMock })
    const journalInsertMock = vi.fn().mockResolvedValue({ error: new Error('fail') })

    mockedSupabase.from.mockImplementation((table: string) => {
      if (table === 'sessions') {
        return { insert: insertSessionMock }
      }
      if (table === 'journal_entries') {
        return { insert: journalInsertMock }
      }
      throw new Error(`unexpected table ${table}`)
    })

    mockedSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: 'user-2' } } })

    await expect(
      logAndJournal({ type: 'breath', duration_sec: 20 })
    ).resolves.toBeDefined()

    expect(Sentry.captureException).toHaveBeenCalled()
  })
})

