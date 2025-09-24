import { useCallback, useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import * as Sentry from '@sentry/react'

import { analyzeEmotion, persistScan, type AnalyzeEmotionInput } from '@/services/scan/scanApi'
import { type ScanResult } from '@/modules/emotion-scan/types'
import { useAppStore } from '@/store/appStore'

interface UseEmotionScanState {
  status: 'idle' | 'loading' | 'success' | 'error'
  error: string | null
  result: ScanResult | null
}

interface RunScanInput extends Omit<AnalyzeEmotionInput, 'signal'> {}

export function useEmotionScan() {
  const updateEmotionState = useAppStore((state) => state.updateEmotionState)
  const queryClient = useQueryClient()
  const [state, setState] = useState<UseEmotionScanState>({ status: 'idle', error: null, result: null })
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => () => {
    abortRef.current?.abort()
  }, [])

  const publishMoodUpdated = useCallback((result: ScanResult, createdAt: string) => {
    if (typeof window === 'undefined' || typeof window.dispatchEvent !== 'function') {
      return
    }

    const detail = {
      labels: result.labels,
      valence: result.valence ?? null,
      arousal: result.arousal ?? null,
      moodScore: result.mood_score ?? null,
      createdAt,
      source: 'emotion-scan',
    }

    window.dispatchEvent(new CustomEvent('mood.updated', { detail }))
  }, [])

  const runScan = useCallback(async ({ text, lang, transcript }: RunScanInput) => {
    const trimmed = text?.trim()
    if (!trimmed) {
      const error = new Error('empty_scan_text')
      setState({ status: 'error', error: 'empty_scan_text', result: null })
      throw error
    }

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setState((prev) => ({ ...prev, status: 'loading', error: null }))

    try {
      const result = await analyzeEmotion({ text: trimmed, lang, transcript, signal: controller.signal })
      const persisted = await persistScan(result)

      setState({ status: 'success', error: null, result })

      updateEmotionState({
        currentMood: result.labels[0] ?? null,
        lastScan: { ...result, createdAt: persisted.created_at },
      })

      publishMoodUpdated(result, persisted.created_at)

      queryClient.invalidateQueries({ queryKey: ['last-emotion-scans'] })
      queryClient.invalidateQueries({ queryKey: ['emotion-scan-history'] })
      queryClient.invalidateQueries({ queryKey: ['scan-history'] })

      return result
    } catch (error) {
      if (controller.signal.aborted) {
        setState({ status: 'idle', error: null, result: null })
        throw error
      }

      const message = error instanceof Error ? error.message : 'scan_failed'
      const friendlyMessage = message === 'invalid_scan_payload'
        ? 'scan_invalid'
        : message.startsWith('analysis_failed') || message === 'user_not_authenticated'
          ? 'scan_failed'
          : message
      setState({ status: 'error', error: friendlyMessage, result: null })
      Sentry.captureException(error)
      throw error
    } finally {
      abortRef.current = null
    }
  }, [publishMoodUpdated, queryClient, updateEmotionState])

  const reset = useCallback(() => {
    abortRef.current?.abort()
    setState({ status: 'idle', error: null, result: null })
  }, [])

  return {
    runScan,
    reset,
    status: state.status,
    error: state.error,
    result: state.result,
    isLoading: state.status === 'loading',
    isSuccess: state.status === 'success',
  }
}
