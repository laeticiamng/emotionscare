// @ts-nocheck
import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'

import { useSessionClock } from '../useSessionClock'

describe('useSessionClock', () => {
  const originalRaf = globalThis.requestAnimationFrame
  const originalCancelRaf = globalThis.cancelAnimationFrame
  let now = 0
  let perfSpy: ReturnType<typeof vi.spyOn>

  const advance = (ms: number) => {
    now += ms
    vi.advanceTimersByTime(ms)
  }

  beforeEach(() => {
    vi.useFakeTimers()
    now = 0
    perfSpy = vi.spyOn(performance, 'now').mockImplementation(() => now)
    const timers = new Map<number, ReturnType<typeof setTimeout>>()
    let rafId = 0
    globalThis.requestAnimationFrame = vi.fn((cb: FrameRequestCallback) => {
      const id = ++rafId
      const timer = setTimeout(() => {
        cb(now)
      }, 16)
      timers.set(id, timer)
      return id
    })
    globalThis.cancelAnimationFrame = vi.fn((id: number) => {
      const timer = timers.get(id)
      if (timer) {
        clearTimeout(timer)
        timers.delete(id)
      }
    })
  })

  afterEach(() => {
    vi.useRealTimers()
    perfSpy.mockRestore()
    if (originalRaf) {
      globalThis.requestAnimationFrame = originalRaf
    }
    if (originalCancelRaf) {
      globalThis.cancelAnimationFrame = originalCancelRaf
    }
    vi.restoreAllMocks()
  })

  it('mesure le temps écoulé avec une dérive minimale', () => {
    const { result } = renderHook(() => useSessionClock({ durationMs: 5000, tickMs: 100 }))

    act(() => {
      result.current.start()
    })

    act(() => {
      advance(2000)
    })

    expect(result.current.elapsedMs).toBeGreaterThanOrEqual(1900)
    expect(result.current.elapsedMs).toBeLessThanOrEqual(2100)

    act(() => {
      advance(3200)
    })

    expect(result.current.state).toBe('completed')
    expect(result.current.elapsedMs).toBeGreaterThanOrEqual(4900)
    expect(result.current.elapsedMs).toBeLessThanOrEqual(5100)
  })

  it('gère la pause et la reprise correctement', () => {
    const { result } = renderHook(() => useSessionClock({ tickMs: 100 }))

    act(() => {
      result.current.start()
    })

    act(() => {
      advance(1500)
    })

    expect(result.current.elapsedMs).toBeGreaterThanOrEqual(1400)

    act(() => {
      result.current.pause()
      advance(1500)
    })

    expect(result.current.elapsedMs).toBeGreaterThanOrEqual(1400)
    expect(result.current.elapsedMs).toBeLessThan(1700)

    act(() => {
      result.current.resume()
      advance(500)
    })

    expect(result.current.elapsedMs).toBeGreaterThanOrEqual(1800)
  })

  it('déclenche les callbacks onTick', () => {
    const ticks: number[] = []
    const { result } = renderHook(() => useSessionClock({ durationMs: 1500, tickMs: 200 }))

    act(() => {
      const unsubscribe = result.current.onTick(ms => {
        ticks.push(ms)
      })
      result.current.start()
      advance(1600)
      unsubscribe()
    })

    expect(ticks.length).toBeGreaterThan(0)
    expect(ticks[ticks.length - 1]).toBeGreaterThanOrEqual(1400)
    expect(result.current.state).toBe('completed')
  })
})

