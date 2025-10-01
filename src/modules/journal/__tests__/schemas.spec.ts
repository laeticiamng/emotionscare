// @ts-nocheck
import { describe, expect, it } from 'vitest'
import { FeedQuerySchema, InsertTextSchema, NoteSchema, VoiceInsertSchema } from '../types'

describe('journal schemas', () => {
  it('validates minimal note', () => {
    const result = NoteSchema.parse({ text: 'Bonjour', tags: ['focus'] })
    expect(result.tags).toEqual(['focus'])
  })

  it('rejects empty text note', () => {
    expect(() => InsertTextSchema.parse({ text: '', tags: [] })).toThrow()
  })

  it('applies defaults for feed query', () => {
    const query = FeedQuerySchema.parse({})
    expect(query.limit).toBe(10)
    expect(query.offset).toBe(0)
  })

  it('normalises voice insert schema', () => {
    const blob = new Blob(['abc'])
    const voice = VoiceInsertSchema.parse({ audioBlob: blob, lang: 'fr-FR', tags: ['Zen'] })
    expect(voice.tags).toEqual(['Zen'])
  })
})
