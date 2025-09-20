import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createCoachDraft, insertText, insertVoice } from '@/services/journal/journalApi'
import type { SanitizedNote } from './types'

type SpeechRecognitionEventLike = {
  resultIndex: number
  results: ArrayLike<{ 0?: { transcript?: string } }>
  error?: string
}

type SpeechRecognitionInstance = {
  lang: string
  continuous: boolean
  interimResults: boolean
  start: () => void
  stop: () => void
  onresult: ((event: SpeechRecognitionEventLike) => void) | null
  onerror: ((event: SpeechRecognitionEventLike & { error: string }) => void) | null
  onend: (() => void) | null
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance

type DictationError =
  | 'not_supported'
  | 'no_microphone'
  | 'permission_denied'
  | 'transcription_error'
  | 'idle'

type UseJournalComposerOptions = {
  lang?: string
}

type UseJournalComposerReturn = {
  text: string
  setText: (value: string) => void
  tags: string[]
  setTags: (tags: string[]) => void
  tagInput: string
  setTagInput: (value: string) => void
  commitTagInput: () => void
  removeTag: (tag: string) => void
  reset: () => void
  isSubmittingText: boolean
  isSubmittingVoice: boolean
  submitText: () => Promise<string | undefined>
  uploadVoice: (file: Blob, lang?: string) => Promise<string | undefined>
  lastInsertedId: string | null
  error: string | null
  dictationSupported: boolean
  isDictating: boolean
  dictationError: DictationError | null
  startDictation: () => void
  stopDictation: () => void
  createCoachDraft: (note: Pick<SanitizedNote, 'id'>) => Promise<string>
}

const FEED_QUERY_KEY = ['journal', 'feed'] as const
const MAX_AUDIO_SIZE_BYTES = 15 * 1024 * 1024 // 15 Mo
const PENDING_MEMOS_KEY = 'journal.pending_voice_memos'

const normalizeTag = (value: string) =>
  value
    .trim()
    .replace(/^#+/, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}_-]+/gu, '')

const useSpeechRecognition = (): SpeechRecognitionConstructor | null => {
  if (typeof window === 'undefined') return null
  const Recognition =
    (window as typeof window & { webkitSpeechRecognition?: SpeechRecognitionConstructor })
      .SpeechRecognition ??
    (window as typeof window & { webkitSpeechRecognition?: SpeechRecognitionConstructor })
      .webkitSpeechRecognition
  if (!Recognition) return null
  return Recognition
}

export function useJournalComposer(options: UseJournalComposerOptions = {}): UseJournalComposerReturn {
  const queryClient = useQueryClient()
  const [text, setText] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [lastInsertedId, setLastInsertedId] = useState<string | null>(null)
  const [isDictating, setIsDictating] = useState(false)
  const [dictationError, setDictationError] = useState<DictationError | null>(null)
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)

  const RecognitionCtor = useSpeechRecognition()
  const dictationSupported = useMemo(() => Boolean(RecognitionCtor), [RecognitionCtor])
  const lang = options.lang ?? 'fr-FR'

  const cleanupRecognition = useCallback(() => {
    const recognition = recognitionRef.current
    if (recognition) {
      try {
        recognition.onresult = null
        recognition.onerror = null
        recognition.onend = null
        recognition.stop()
      } catch {
        // ignore
      }
      recognitionRef.current = null
    }
  }, [])

  useEffect(() => () => cleanupRecognition(), [cleanupRecognition])

  const parseTagInput = useCallback(() => {
    if (!tagInput.trim()) return
    const nextTags = tagInput
      .split(/[\s,]+/)
      .map(normalizeTag)
      .filter(Boolean)
      .slice(0, 8)
    if (!nextTags.length) {
      setTagInput('')
      return
    }
    setTags(prev => Array.from(new Set([...prev, ...nextTags])).slice(0, 8))
    setTagInput('')
  }, [tagInput])

  const removeTag = useCallback((tag: string) => {
    setTags(prev => prev.filter(item => item !== tag))
  }, [])

  const reset = useCallback(() => {
    setText('')
    setTags([])
    setTagInput('')
    setError(null)
    setLastInsertedId(null)
    cleanupRecognition()
    setIsDictating(false)
    setDictationError(null)
  }, [cleanupRecognition])

  const invalidateFeed = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: FEED_QUERY_KEY })
  }, [queryClient])

  const textMutation = useMutation({
    mutationFn: insertText,
    onSuccess: (id: string) => {
      setLastInsertedId(id)
      invalidateFeed()
      setText('')
      setTags([])
      setTagInput('')
      setError(null)
    },
    onError: (mutationError: unknown) => {
      const message = mutationError instanceof Error ? mutationError.message : 'journal_insert_failed'
      setError(message)
    },
  })

  const voiceMutation = useMutation({
    mutationFn: insertVoice,
    onSuccess: (id: string) => {
      setLastInsertedId(id)
      invalidateFeed()
      setError(null)
    },
    onError: (mutationError: unknown) => {
      const message = mutationError instanceof Error ? mutationError.message : 'voice_transcription_unavailable'
      setError(message)
    },
  })

  const coachDraftMutation = useMutation({
    mutationFn: createCoachDraft,
  })

  const submitText = useCallback(async () => {
    const trimmed = text.trim()
    if (!trimmed) {
      setError('empty_text')
      return undefined
    }
    return textMutation.mutateAsync({ text: trimmed, tags }).catch(err => {
      setError(err instanceof Error ? err.message : 'journal_insert_failed')
      return undefined
    })
  }, [tags, text, textMutation])

  const persistVoiceMemoOffline = useCallback(
    async (blob: Blob, meta: { lang: string; tags: string[] }) => {
      if (typeof window === 'undefined') return false
      try {
        const reader = new FileReader()
        const base64 = await new Promise<string>((resolve, reject) => {
          reader.onerror = () => reject(reader.error ?? new Error('voice_memo_read_failed'))
          reader.onload = () => {
            const result = reader.result
            if (typeof result === 'string') {
              const [, payload = result] = result.split(',')
              resolve(payload)
            } else {
              reject(new Error('voice_memo_invalid_payload'))
            }
          }
          reader.readAsDataURL(blob)
        })

        const raw = window.localStorage.getItem(PENDING_MEMOS_KEY)
        const existing: Array<Record<string, unknown>> = raw ? JSON.parse(raw) : []
        const memo = {
          id: `memo-${Date.now()}`,
          created_at: new Date().toISOString(),
          lang: meta.lang,
          tags: meta.tags,
          base64,
        }
        const next = [...existing.slice(-2), memo]
        window.localStorage.setItem(PENDING_MEMOS_KEY, JSON.stringify(next))
        return true
      } catch (offlineError) {
        console.warn('voice memo offline persistence failed', offlineError)
        return false
      }
    },
    [],
  )

  const uploadVoice = useCallback(
    async (file: Blob, customLang?: string) => {
      const blob = file instanceof Blob ? file : new Blob([file])
      if (blob.size > MAX_AUDIO_SIZE_BYTES) {
        setError('audio_too_large')
        return undefined
      }
      try {
        return await voiceMutation.mutateAsync({ audioBlob: blob, lang: customLang ?? lang, tags })
      } catch (err) {
        const savedOffline = await persistVoiceMemoOffline(blob, {
          lang: customLang ?? lang,
          tags,
        })
        if (savedOffline) {
          setError('voice_memo_saved_offline')
        } else {
          setError(err instanceof Error ? err.message : 'voice_transcription_unavailable')
        }
        return undefined
      }
    },
    [lang, persistVoiceMemoOffline, tags, voiceMutation],
  )

  const startDictation = useCallback(() => {
    if (!RecognitionCtor) {
      setDictationError('not_supported')
      return
    }
    try {
      cleanupRecognition()
      const recognition = new RecognitionCtor() as SpeechRecognitionInstance
      recognition.lang = lang
      recognition.continuous = true
      recognition.interimResults = true

      recognition.onresult = event => {
        let transcript = ''
        for (let i = event.resultIndex; i < event.results.length; i += 1) {
          const result = event.results[i]
          transcript += result[0]?.transcript ?? ''
        }
        setText(current => `${current.trimEnd()} ${transcript}`.trim())
      }
      recognition.onerror = event => {
        if (event.error === 'not-allowed') {
          setDictationError('permission_denied')
        } else if (event.error === 'no-speech' || event.error === 'audio-capture') {
          setDictationError('no_microphone')
        } else {
          setDictationError('transcription_error')
        }
        setIsDictating(false)
        cleanupRecognition()
      }
      recognition.onend = () => {
        setIsDictating(false)
        recognitionRef.current = null
      }

      recognitionRef.current = recognition
      recognition.start()
      setDictationError(null)
      setIsDictating(true)
    } catch (dictationIssue) {
      console.error('Dictation start failed', dictationIssue)
      setDictationError('transcription_error')
      cleanupRecognition()
    }
  }, [RecognitionCtor, cleanupRecognition, lang])

  const stopDictation = useCallback(() => {
    cleanupRecognition()
    setIsDictating(false)
    setDictationError(null)
  }, [cleanupRecognition])

  const createDraft = useCallback(
    async (note: Pick<SanitizedNote, 'id'>) => {
      const draftId = await coachDraftMutation.mutateAsync(note)
      return draftId
    },
    [coachDraftMutation],
  )

  return {
    text,
    setText,
    tags,
    setTags,
    tagInput,
    setTagInput,
    commitTagInput: parseTagInput,
    removeTag,
    reset,
    isSubmittingText: textMutation.isPending,
    isSubmittingVoice: voiceMutation.isPending,
    submitText,
    uploadVoice,
    lastInsertedId,
    error,
    dictationSupported,
    isDictating,
    dictationError,
    startDictation,
    stopDictation,
    createCoachDraft: createDraft,
  }
}
