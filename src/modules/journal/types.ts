// @ts-nocheck
import { z } from 'zod'

export const NoteSchema = z.object({
  id: z.string().uuid().optional(),
  text: z.string().min(1).max(5000),
  tags: z.array(z.string().min(1).max(24)).max(8).optional().default([]),
  created_at: z.string().optional(),
  summary: z.string().optional(),
  mode: z.enum(['text', 'voice']).optional(),
})

export type Note = z.infer<typeof NoteSchema>

export const FeedQuerySchema = z.object({
  q: z.string().max(64).optional(),
  tags: z.array(z.string()).optional(),
  limit: z.number().min(1).max(50).default(10),
  offset: z.number().min(0).default(0),
})
export type FeedQuery = z.infer<typeof FeedQuerySchema>

export const InsertTextSchema = NoteSchema.pick({ text: true, tags: true })

export const VoiceInsertSchema = z.object({
  audioBlob: z.instanceof(Blob),
  lang: z.string().min(2).max(8).optional(),
  tags: z.array(z.string().min(1).max(24)).max(8).optional(),
})

export const SanitizedNoteSchema = NoteSchema.extend({
  text: z.string(),
  created_at: z.string(),
  tags: z.array(z.string()),
})

export type SanitizedNote = z.infer<typeof SanitizedNoteSchema>

export const NoteIdSchema = z.string().uuid()
