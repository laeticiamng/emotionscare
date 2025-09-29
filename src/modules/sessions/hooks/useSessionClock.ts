import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

type ClockState = 'idle' | 'running' | 'paused' | 'completed'

type Options = {
  tickMs?: number
  durationMs?: number
  autoStart?: boolean
}

type TickCallback = (elapsedMs: number) => void

type Return = {
  state: ClockState
  elapsedMs: number
  progress?: number
  start: () => void
  pause: () => void
  resume: () => void
  complete: () => void
  reset: () => void
  onTick: (cb: TickCallback) => () => void
}

const MIN_TICK = 16

const now = () => (typeof performance !== 'undefined' && typeof performance.now === 'function' ? performance.now() : Date.now())

export function useSessionClock(options: Options = {}): Return {
  const { tickMs = 1000, durationMs, autoStart } = options
  const sanitizedTick = Number.isFinite(tickMs) && tickMs > 0 ? Math.max(MIN_TICK, tickMs) : 1000
  const durationRef = useRef<number | undefined>(
    typeof durationMs === 'number' && Number.isFinite(durationMs) && durationMs > 0 ? durationMs : undefined
  )
  const tickIntervalRef = useRef(sanitizedTick)
  const [state, setState] = useState<ClockState>('idle')
  const [elapsedMs, setElapsedMs] = useState(0)

  const frameRef = useRef<number | null>(null)
  const lastFrameRef = useRef<number | null>(null)
  const accumulatorRef = useRef(0)
  const lastEmitRef = useRef(0)
  const mountedRef = useRef(true)
  const stateRef = useRef<ClockState>('idle')
  const tickCallbacksRef = useRef(new Set<TickCallback>())
  const fallbackTimersRef = useRef(new Map<number, ReturnType<typeof setTimeout>>())
  const fallbackIdRef = useRef(0)

  const cancelFrame = useCallback((handle: number | null) => {
    if (handle == null) {
      return
    }

    if (typeof window !== 'undefined' && typeof window.cancelAnimationFrame === 'function') {
      window.cancelAnimationFrame(handle)
      return
    }

    const timer = fallbackTimersRef.current.get(handle)
    if (timer) {
      clearTimeout(timer)
      fallbackTimersRef.current.delete(handle)
    }
  }, [])

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      if (frameRef.current != null) {
        cancelFrame(frameRef.current)
        frameRef.current = null
      }
    }
  }, [cancelFrame])

  useEffect(() => {
    tickIntervalRef.current = Math.max(MIN_TICK, sanitizedTick)
  }, [sanitizedTick])

  useEffect(() => {
    if (typeof durationMs === 'number' && Number.isFinite(durationMs) && durationMs > 0) {
      durationRef.current = durationMs
      if (accumulatorRef.current > durationMs) {
        accumulatorRef.current = durationMs
      }
      if (lastEmitRef.current > durationMs) {
        lastEmitRef.current = durationMs
      }
      setElapsedMs(prev => Math.min(prev, durationMs))
    } else {
      durationRef.current = undefined
    }
  }, [durationMs])

  const requestFrame = useCallback(
    (cb: FrameRequestCallback): number => {
      if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
        return window.requestAnimationFrame(cb)
      }

      const id = ++fallbackIdRef.current
      const timer = setTimeout(() => {
        fallbackTimersRef.current.delete(id)
        cb(now())
      }, tickIntervalRef.current) as unknown as number
      fallbackTimersRef.current.set(id, timer as unknown as ReturnType<typeof setTimeout>)
      return id
    },
    []
  )

  const emitTick = useCallback((ms: number) => {
    tickCallbacksRef.current.forEach(cb => {
      try {
        cb(ms)
      } catch (error) {
        if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production') {
          console.error('useSessionClock tick callback error', error)
        }
      }
    })
  }, [])

  const finish = useCallback(
    (status: ClockState, nextElapsed?: number) => {
      cancelFrame(frameRef.current)
      frameRef.current = null
      stateRef.current = status
      if (mountedRef.current) {
        setState(status)
      }

      if (typeof nextElapsed === 'number') {
        accumulatorRef.current = nextElapsed
        lastEmitRef.current = nextElapsed
        if (mountedRef.current) {
          setElapsedMs(nextElapsed)
        }
        emitTick(nextElapsed)
      }
    },
    [cancelFrame, emitTick]
  )

  const step = useCallback(
    (timestamp: number) => {
      if (stateRef.current !== 'running') {
        return
      }

      if (lastFrameRef.current == null) {
        lastFrameRef.current = timestamp
      }

      const delta = Math.max(0, timestamp - lastFrameRef.current)
      lastFrameRef.current = timestamp
      accumulatorRef.current += delta

      const limit = durationRef.current ?? Number.POSITIVE_INFINITY
      const clampedElapsed = Math.min(accumulatorRef.current, limit)

      if (clampedElapsed - lastEmitRef.current >= tickIntervalRef.current || clampedElapsed >= limit) {
        lastEmitRef.current = clampedElapsed
        if (mountedRef.current) {
          setElapsedMs(clampedElapsed)
        }
        emitTick(clampedElapsed)
      }

      if (durationRef.current != null && accumulatorRef.current >= durationRef.current) {
        finish('completed', durationRef.current)
        return
      }

      frameRef.current = requestFrame(step)
    },
    [emitTick, finish, requestFrame]
  )

  const start = useCallback(() => {
    if (stateRef.current !== 'idle') {
      return
    }

    accumulatorRef.current = 0
    lastFrameRef.current = now()
    lastEmitRef.current = 0
    stateRef.current = 'running'
    if (mountedRef.current) {
      setState('running')
      setElapsedMs(0)
    }
    emitTick(0)
    frameRef.current = requestFrame(step)
  }, [emitTick, requestFrame, step])

  const pause = useCallback(() => {
    if (stateRef.current !== 'running') {
      return
    }

    cancelFrame(frameRef.current)
    frameRef.current = null
    lastFrameRef.current = null
    stateRef.current = 'paused'
    if (mountedRef.current) {
      setState('paused')
    }
  }, [cancelFrame])

  const resume = useCallback(() => {
    if (stateRef.current !== 'paused') {
      return
    }

    stateRef.current = 'running'
    if (mountedRef.current) {
      setState('running')
    }
    lastFrameRef.current = now()
    frameRef.current = requestFrame(step)
  }, [requestFrame, step])

  const complete = useCallback(() => {
    if (stateRef.current === 'completed') {
      return
    }

    const limit = durationRef.current ?? accumulatorRef.current
    const nextElapsed = Math.min(accumulatorRef.current, limit)
    finish('completed', limit ?? nextElapsed)
  }, [finish])

  const reset = useCallback(() => {
    cancelFrame(frameRef.current)
    frameRef.current = null
    accumulatorRef.current = 0
    lastFrameRef.current = null
    lastEmitRef.current = 0
    stateRef.current = 'idle'
    if (mountedRef.current) {
      setState('idle')
      setElapsedMs(0)
    }
  }, [cancelFrame])

  const onTick = useCallback((cb: TickCallback) => {
    tickCallbacksRef.current.add(cb)
    return () => {
      tickCallbacksRef.current.delete(cb)
    }
  }, [])

  useEffect(() => {
    if (!autoStart) {
      return
    }
    start()
  }, [autoStart, start])

  const progress = useMemo(() => {
    if (!durationRef.current || durationRef.current <= 0) {
      return undefined
    }
    return Math.min(1, elapsedMs / durationRef.current)
  }, [elapsedMs])

  return {
    state,
    elapsedMs,
    progress,
    start,
    pause,
    resume,
    complete,
    reset,
    onTick
  }
}

