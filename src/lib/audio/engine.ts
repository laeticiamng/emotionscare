// @ts-nocheck
// Moteur audio unifié avec WebAudio (si disponible), sinon HTMLAudio.
// Append-only, pas d'impact sur l'existant.
type Source = { url: string; loop?: boolean; volume?: number };
type Handle = {
  id: string;
  play: () => Promise<void>;
  pause: () => void;
  stop: () => void;
// @ts-nocheck
  setVolume: (v: number) => void;
  setLoop: (loop: boolean) => void;
  getCurrentTime: () => number;
  getDuration: () => number | null;
  seek: (time: number) => void;
  onEnded: (cb: () => void) => void;
};

let ctx: AudioContext | null = null;
function getCtx() {
  if (typeof window === "undefined") return null;
  if (!("AudioContext" in window)) return null;
  if (!ctx) ctx = new (window.AudioContext as any)();
  return ctx;
}

export async function createAudioHandle(src: Source): Promise<Handle> {
  const id = Math.random().toString(36).slice(2);
  const audioContext = getCtx();

  // Fallback HTMLAudio si WebAudio indisponible
  if (!audioContext) {
    const el = new Audio(src.url);
    el.loop = !!src.loop;
    el.preload = "auto";
    el.volume = src.volume ?? 0.8;
    let endedCb: (() => void) | null = null;
    el.addEventListener("ended", () => endedCb?.());
    return {
      id,
      play: () => el.play().catch(()=>{}),
      pause: () => el.pause(),
      stop: () => { el.pause(); el.currentTime = 0; },
      setVolume: (v: number) => { el.volume = Math.max(0, Math.min(1, v)); },
      setLoop: (loop: boolean) => { el.loop = loop; },
      getCurrentTime: () => el.currentTime,
      getDuration: () => el.duration || null,
      seek: (time: number) => {
        const clamped = Math.max(0, Math.min(time, el.duration || Infinity));
        el.currentTime = clamped;
      },
      onEnded: (cb) => { endedCb = cb; }
    };
  }

  // WebAudio path
  const res = await fetch(src.url);
  const arr = await res.arrayBuffer();
  const buf = await audioContext.decodeAudioData(arr);
  const gain = audioContext.createGain();
  gain.gain.value = src.volume ?? 0.8;
  gain.connect(audioContext.destination);

  let srcNode: AudioBufferSourceNode | null = null;
  let startedAt = 0;
  let pausedAt = 0;
  let loop = !!src.loop;
  let endedCb: (() => void) | null = null;

  function startNode(offset = 0) {
    srcNode = audioContext.createBufferSource();
    srcNode.buffer = buf;
    srcNode.loop = loop;
    srcNode.connect(gain);
    srcNode.onended = () => endedCb?.();
    srcNode.start(0, offset);
  }

  return {
    id,
    play: async () => {
      if (audioContext.state === "suspended") await audioContext.resume();
      startNode(pausedAt);
      startedAt = audioContext.currentTime - pausedAt;
      pausedAt = 0;
    },
    pause: () => {
      if (!srcNode) return;
      pausedAt = Math.min(buf.duration, Math.max(0, (getCtx()?.currentTime ?? 0) - startedAt));
      srcNode.stop(0);
      srcNode.disconnect();
      srcNode = null;
    },
    stop: () => {
      if (srcNode) { srcNode.stop(0); srcNode.disconnect(); srcNode = null; }
      pausedAt = 0;
      startedAt = 0;
    },
    setVolume: (v: number) => { gain.gain.value = Math.max(0, Math.min(1, v)); },
    setLoop: (l: boolean) => { loop = l; if (srcNode) srcNode.loop = l; },
    getCurrentTime: () => {
      if (!buf) return 0;
      if (pausedAt) return pausedAt;
      if (!startedAt) return 0;
      return Math.min(buf.duration, (getCtx()?.currentTime ?? 0) - startedAt);
    },
    getDuration: () => buf?.duration ?? null,
    seek: (time: number) => {
      if (!buf) return;
      const clamped = Math.max(0, Math.min(buf.duration, time));
      pausedAt = clamped;
      if (srcNode) {
        srcNode.stop(0);
        srcNode.disconnect();
        startNode(clamped);
        startedAt = (getCtx()?.currentTime ?? 0) - clamped;
      }
    },
    onEnded: (cb) => { endedCb = cb; }
  };
}
