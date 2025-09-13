"use client";
import React from "react";
import { useSound } from "@/ui/hooks/useSound";
import { clamp01 } from "@/lib/audio/utils";

type Props = {
  src: string;
  title?: string;
  loop?: boolean;
  defaultVolume?: number; // 0..1
  haptics?: boolean;
};

export function AudioPlayer({ src, title, loop, defaultVolume = 0.8, haptics = false }: Props) {
  const s = useSound(src, { loop, volume: defaultVolume });
  const [playing, setPlaying] = React.useState(false);
  const [volume, setVolume] = React.useState(defaultVolume);

  React.useEffect(() => { s.setVolume?.(volume); }, [volume]);

  async function toggle() {
    try {
      if (!playing) {
        await s.play?.();
        setPlaying(true);
        const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (haptics && !reduced && "vibrate" in navigator) navigator.vibrate?.(10);
      } else {
        s.pause?.();
        setPlaying(false);
      }
    } catch {}
  }

  return (
    <div aria-label={title ?? "Lecteur audio"} style={{ display: "grid", gap: 8 }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button onClick={toggle} aria-pressed={playing} data-ui="primary-cta">
          {playing ? "Pause" : "Lecture"}
        </button>
        {title && <strong>{title}</strong>}
      </div>
      <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
        Volume
        <input
          type="range" min={0} max={1} step={0.01} value={volume}
          onChange={(e) => setVolume(clamp01(parseFloat(e.target.value)))}
          data-ui="volume-slider"
        />
      </label>
    </div>
  );
}
