import { describe, it, expect, vi } from "vitest";
import { createAudioHandle } from "@/lib/audio/engine";

describe("audio engine fallback", () => {
  it("uses HTMLAudio when AudioContext unavailable", async () => {
    (global as any).AudioContext = undefined;

    const play = vi.fn().mockResolvedValue(undefined);
    class MockAudio {
      src = "";
      loop = false;
      volume = 1;
      currentTime = 0;
      duration = 0;
      preload = "";
      constructor(url?: string) { if (url) this.src = url; }
      addEventListener() {}
      play = play;
      pause() {}
    }
    (global as any).Audio = MockAudio as any;

    const handle = await createAudioHandle({ url: "/audio/test.mp3" });
    await handle.play();
    expect(play).toHaveBeenCalled();
  });
});
