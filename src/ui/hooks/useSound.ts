// @ts-nocheck
"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createAudioHandle } from "@/lib/audio/engine";

export function useSound(url: string, opts?: { loop?: boolean; volume?: number }) {
  const ref = useRef<Awaited<ReturnType<typeof createAudioHandle>> | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    createAudioHandle({ url, loop: opts?.loop, volume: opts?.volume ?? 0.8 }).then(h => {
      if (!mounted) return;
      ref.current = h;
      setReady(true);
    });
    return () => { mounted = false; ref.current?.stop(); };
  }, [url, opts?.loop, opts?.volume]);

  const play = useCallback(() => ref.current?.play() ?? Promise.resolve(), []);
  const pause = useCallback(() => ref.current?.pause(), []);
  const stop = useCallback(() => ref.current?.stop(), []);
  const setVolume = useCallback((v: number) => ref.current?.setVolume(v), []);
  const setLoop = useCallback((l: boolean) => ref.current?.setLoop(l), []);
  const seek = useCallback((time: number) => ref.current?.seek(time), []);
  const getTime = useCallback(() => ref.current?.getCurrentTime() ?? 0, []);
  const getDuration = useCallback(() => ref.current?.getDuration() ?? null, []);
  const onEnded = useCallback((cb: () => void) => ref.current?.onEnded(cb), []);

  return useMemo(() => ({
    ready,
    play,
    pause,
    stop,
    setVolume,
    setLoop,
    seek,
    getTime,
    getDuration,
    onEnded
  }), [ready, play, pause, stop, setVolume, setLoop, seek, getTime, getDuration, onEnded]);
}
