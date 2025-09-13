"use client";
import { useEffect, useRef, useState } from "react";
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
  }, [url]);

  return {
    ready,
    play: () => ref.current?.play() ?? Promise.resolve(),
    pause: () => ref.current?.pause(),
    stop: () => ref.current?.stop(),
    setVolume: (v: number) => ref.current?.setVolume(v),
    setLoop: (l: boolean) => ref.current?.setLoop(l),
    getTime: () => ref.current?.getCurrentTime() ?? 0,
    getDuration: () => ref.current?.getDuration() ?? null,
    onEnded: (cb: () => void) => ref.current?.onEnded(cb)
  };
}
