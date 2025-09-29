import { supabase } from '@/integrations/supabase/client'
import * as Sentry from '@sentry/react'
import sanitizeHtml from 'sanitize-html'
import {
  FeedQuerySchema,
  InsertTextSchema,
  NoteIdSchema,
  SanitizedNoteSchema,
  VoiceInsertSchema,
  type FeedQuery,
  type SanitizedNote,
} from '@/modules/journal/types'

const TAG_PATTERN = /[^\p{L}\p{N}_-]+/gu
const HASH_TAG_REGEX = /#([\p{L}\p{N}_-]{1,24})/gu

type JournalRow = {
  id: string
  content?: string | null
  text_content?: string | null
  transcript?: string | null
  summary?: string | null
  tags?: string[] | null
  created_at?: string | null
  updated_at?: string | null
  mode?: string | null
  is_voice?: boolean | null
}

const sanitizePlainText = (value: string) =>
  sanitizeHtml(value, {
    allowedTags: [],
    allowedAttributes: {},
  })
    .replace(/\s+/g, ' ')
    .trim()

const sanitizeSummary = (value: string | null | undefined) => {
  if (!value) return undefined
  const cleaned = sanitizePlainText(value)
  return cleaned || undefined
}

const sanitizeTags = (tags: string[] | null | undefined): string[] => {
  if (!Array.isArray(tags)) return []
  return Array.from(
    new Set(
      tags
        .map(tag => (typeof tag === 'string' ? tag.trim().toLowerCase() : ''))
        .map(tag => tag.replace(TAG_PATTERN, ''))
        .filter(Boolean),
    ),
  ).slice(0, 8)
}

const extractHashtags = (value: string): string[] => {
  const matches = value.matchAll(HASH_TAG_REGEX)
  const tags: string[] = []
  for (const match of matches) {
    if (match[1]) {
      tags.push(match[1])
    }
  }
  return tags
}

const mapRowToNote = (row: JournalRow): SanitizedNote => {
  const rawText =
    row.content ?? row.text_content ?? row.transcript ?? ''
  const text = sanitizePlainText(typeof rawText === 'string' ? rawText : String(rawText))
  const tags = sanitizeTags(row.tags)
  const mode = row.mode ?? (row.is_voice ? 'voice' : 'text')
  return SanitizedNoteSchema.parse({
    id: row.id,
    text,
    created_at: row.created_at ?? new Date().toISOString(),
    summary: sanitizeSummary(row.summary),
    tags,
    mode,
  })
}

const redactErrorScope = (scope: Sentry.Scope, context: Record<string, unknown>) => {
  scope.setContext('journal', context)
  scope.setFingerprint(['journal'])
}

export async function insertText(input: { text: string; tags?: string[] }): Promise<string> {
  const parsed = InsertTextSchema.parse(input)
  const sanitizedText = sanitizePlainText(parsed.text)
  const extractedTags = sanitizeTags(extractHashtags(parsed.text))
  const sanitizedTags = Array.from(new Set([...sanitizeTags(parsed.tags), ...extractedTags])).slice(0, 8)

  Sentry.addBreadcrumb({
    category: 'journal',
    message: 'journal:insert_text',
    level: 'info',
    data: {
      length: sanitizedText.length,
      tags: sanitizedTags.length,
    },
  })

  const { data: authData, error: authError } = await supabase.auth.getUser()
  if (authError) {
    Sentry.captureException(authError, scope =>
      redactErrorScope(scope, { action: 'insert_text', reason: 'auth_error' }),
    )
    throw new Error('auth_required')
  }
  const userId = authData?.user?.id
  if (!userId) {
    Sentry.captureException(new Error('journal_auth_missing'), scope =>
      redactErrorScope(scope, { action: 'insert_text', reason: 'no_user' }),
    )
    throw new Error('auth_required')
  }

  const summary = sanitizedText.split(/\s+/).slice(0, 40).join(' ')

  const { data, error } = await supabase
    .from('journal_entries')
    .insert({
      user_id: userId,
      content: sanitizedText,
      tags: sanitizedTags,
      summary,
      mode: 'text',
    })
    .select('id')
    .single()

  if (error || !data?.id) {
    const cause = error ?? new Error('journal_insert_failed')
    Sentry.captureException(cause, scope =>
      redactErrorScope(scope, {
        action: 'insert_text',
        reason: 'insert_failed',
        length: sanitizedText.length,
      }),
    )
    throw new Error('journal_insert_failed')
  }

  return data.id as string
}

export async function insertVoice(input: { audioBlob: Blob; lang?: string; tags?: string[] }): Promise<string> {
  const parsed = VoiceInsertSchema.parse(input)
  const sanitizedTags = sanitizeTags(parsed.tags)

  Sentry.addBreadcrumb({
    category: 'journal',
    message: 'journal:insert_voice',
    level: 'info',
    data: {
      size: parsed.audioBlob.size,
      lang: parsed.lang ?? 'fr',
      tags: sanitizedTags.length,
    },
  })

  const formData = new FormData()
  formData.append('file', parsed.audioBlob, `journal-${Date.now()}.webm`)
  if (parsed.lang) {
    formData.append('lang', parsed.lang)
  }

  const { data, error } = await supabase.functions.invoke<{ entry_id?: string }>('journal-voice', {
    body: formData,
  })

  if (error || !data?.entry_id) {
    const cause = error ?? new Error('voice_transcription_unavailable')
    Sentry.captureException(cause, scope =>
      redactErrorScope(scope, { action: 'insert_voice', reason: 'transcription_failed' }),
    )
    throw new Error('voice_transcription_unavailable')
  }

  if (sanitizedTags.length) {
    await supabase
      .from('journal_entries')
      .update({ tags: sanitizedTags })
      .eq('id', data.entry_id)
  }

  return data.entry_id
}

export async function listFeed(query: Partial<FeedQuery> = {}): Promise<SanitizedNote[]> {
  const q = FeedQuerySchema.parse(query)

  Sentry.addBreadcrumb({
    category: 'journal',
    message: 'journal:list',
    level: 'info',
    data: {
      limit: q.limit,
      offset: q.offset,
      hasQuery: Boolean(q.q),
      tagCount: q.tags?.length ?? 0,
    },
  })

  let request = supabase
    .from('journal_entries')
    .select('id, content, text_content, transcript, summary, tags, created_at, mode, is_voice')
    .order('created_at', { ascending: false })

  if (q.q) {
    const safeQuery = q.q.replace(/[%_]/g, match => `\\${match}`)
    const pattern = `%${safeQuery}%`
    request = request.or(
      `content.ilike.${pattern},text_content.ilike.${pattern},transcript.ilike.${pattern},summary.ilike.${pattern}`,
    )
  }
  if (q.tags?.length) {
    request = request.contains('tags', q.tags)
  }

  const { data, error } = await request.range(q.offset, q.offset + q.limit - 1)

  if (error) {
    Sentry.captureException(error, scope =>
      redactErrorScope(scope, { action: 'list', reason: 'query_failed' }),
    )
    throw new Error('journal_fetch_failed')
  }

  return (data ?? []).map(mapRowToNote)
}

export async function createCoachDraft(note: Pick<SanitizedNote, 'id'> | { id: string }): Promise<string> {
  const noteId = NoteIdSchema.parse(note.id)

  Sentry.addBreadcrumb({
    category: 'journal',
    message: 'journal:coach_draft',
    level: 'info',
    data: {
      noteId,
    },
  })

  const { data: authData, error: authError } = await supabase.auth.getUser()
  if (authError) {
    Sentry.captureException(authError, scope =>
      redactErrorScope(scope, { action: 'coach_draft', reason: 'auth_error' }),
    )
    throw new Error('auth_required')
  }
  const userId = authData?.user?.id
  if (!userId) {
    Sentry.captureException(new Error('journal_auth_missing'), scope =>
      redactErrorScope(scope, { action: 'coach_draft', reason: 'no_user' }),
    )
    throw new Error('auth_required')
  }

  const nowIso = new Date().toISOString()
  const { data: conversation, error } = await supabase
    .from('coach_conversations')
    .insert({
      user_id: userId,
      coach_mode: 'journal_draft',
      title: 'Brouillon journal',
      message_count: 0,
      last_message_at: nowIso,
    })
    .select('id')
    .single()

  if (error || !conversation?.id) {
    const cause = error ?? new Error('coach_draft_failed')
    Sentry.captureException(cause, scope =>
      redactErrorScope(scope, { action: 'coach_draft', reason: 'conversation_failed' }),
    )
    throw new Error('coach_draft_failed')
  }

  const { error: messageError } = await supabase.from('coach_messages').insert({
    conversation_id: conversation.id,
    sender: 'system',
    content: `NOTE_REF:${noteId}`,
    message_type: 'journal_draft',
  })

  if (messageError) {
    Sentry.captureException(messageError, scope =>
      redactErrorScope(scope, { action: 'coach_draft', reason: 'message_failed' }),
    )
    throw new Error('coach_draft_failed')
  }

  return conversation.id as string
}

export function __testUtils__() {
  return { sanitizePlainText, sanitizeTags, sanitizeSummary, extractHashtags, mapRowToNote }
}
