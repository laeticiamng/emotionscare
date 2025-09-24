import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import React from 'react'
import { renderHook, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { useEmotionScan } from '@/modules/emotion-scan/hooks/useEmotionScan'
import { useAppStore } from '@/store/appStore'
import { type ScanResult } from '@/modules/emotion-scan/types'
import { analyzeEmotion, persistScan } from '@/services/scan/scanApi'

vi.mock('@/services/scan/scanApi', () => ({
  analyzeEmotion: vi.fn(),
  persistScan: vi.fn(),
}))

const createWrapper = () => {
  const queryClient = new QueryClient()
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
  return Wrapper
}

describe('useEmotionScan', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useAppStore.getState().reset()
  })

  afterEach(() => {
    useAppStore.getState().reset()
  })

  it('analyse, persiste et émet un événement mood.updated', async () => {
    const scanResult: ScanResult = {
      labels: ['joie', 'énergie'],
      valence: 0.4,
      arousal: 0.2,
      mood_score: 78,
    }

    ;(analyzeEmotion as ReturnType<typeof vi.fn>).mockResolvedValue(scanResult)
    ;(persistScan as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 'scan-1',
      created_at: '2025-06-01T10:00:00.000Z',
      mood_score: 78,
      payload: scanResult,
    })

    const dispatchSpy = vi.spyOn(window, 'dispatchEvent')
    const { result } = renderHook(() => useEmotionScan(), { wrapper: createWrapper() })

    await act(async () => {
      await result.current.runScan({ text: 'Je me sens plein d’énergie.' })
    })

    expect(analyzeEmotion).toHaveBeenCalledWith(
      expect.objectContaining({ text: 'Je me sens plein d’énergie.' })
    )
    expect(persistScan).toHaveBeenCalledWith(scanResult)
    expect(dispatchSpy).toHaveBeenCalledTimes(1)
    const event = dispatchSpy.mock.calls[0][0] as CustomEvent
    expect(event.type).toBe('mood.updated')
    expect(event.detail.labels).toEqual(['joie', 'énergie'])

    dispatchSpy.mockRestore()

    const store = useAppStore.getState()
    expect(store.modules.emotion.lastScan).not.toBeNull()
    expect(result.current.status).toBe('success')
  })

  it('rejette les entrées vides et expose une erreur lisible', async () => {
    const { result } = renderHook(() => useEmotionScan(), { wrapper: createWrapper() })

    await act(async () => {
      await result.current
        .runScan({ text: '   ' })
        .catch((err) => {
          expect(err).toBeInstanceOf(Error)
          expect((err as Error).message).toBe('empty_scan_text')
        })
    })
    expect(result.current.error).toBe('empty_scan_text')
    expect(result.current.status).toBe('error')
  })
})
