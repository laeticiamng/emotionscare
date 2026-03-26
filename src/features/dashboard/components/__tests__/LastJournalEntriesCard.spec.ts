// @ts-nocheck
import { afterEach, describe, expect, it, vi } from 'vitest'
import { buildJournalSummaryMessage } from '@/features/dashboard/components/LastJournalEntriesCard'
import type { SanitizedNote } from '@/modules/journal/types'

describe('buildJournalSummaryMessage', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns a gentle fallback when no notes exist', () => {
    const summary = buildJournalSummaryMessage([])
    expect(summary.headline).toBe('Ton journal est prêt pour accueillir tes ressentis.')
    expect(summary.detail).toContain('première note')
  })

  it('summarises tags and recency without exposing scores', () => {
    vi.setSystemTime(new Date('2024-03-10T10:00:00.000Z'))
    const notes: SanitizedNote[] = [
      {
        id: '1',
        text: 'Note calme',
        created_at: '2024-03-10T08:00:00.000Z',
        tags: ['calme', 'focus'],
        summary: 'Résumé doux',
        mode: 'text',
      },
      {
        id: '2',
        text: 'Autre note',
        created_at: '2024-03-07T08:00:00.000Z',
        tags: ['gratitude'],
        summary: undefined,
        mode: 'text',
      },
    ]

    const summary = buildJournalSummaryMessage(notes)
    expect(summary.headline).toContain('#calme')
    expect(summary.headline).toContain('#focus')
    expect(summary.detail).toContain('aujourd’hui')
    expect(summary.detail).not.toMatch(/\d+/)
  })
})
