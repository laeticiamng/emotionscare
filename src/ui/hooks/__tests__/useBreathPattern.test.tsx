import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";

const rafStore: { callback: ((time: number) => void) | null } = { callback: null };

vi.mock("../useRaf", () => {
  const React = require("react");

  return {
    useRaf: (cb: (time: number) => void, enabled = true) => {
      const callbackRef = React.useRef(cb);
      callbackRef.current = cb;

      React.useEffect(() => {
        if (!enabled) {
          if (rafStore.callback && rafStore.callback === callbackRef.current) {
            rafStore.callback = null;
          }
          return;
        }

        const handler = (time: number) => {
          callbackRef.current(time);
        };
        rafStore.callback = handler;

        return () => {
          if (rafStore.callback === handler) {
            rafStore.callback = null;
          }
        };
      }, [enabled]);
    },
  };
});

import { useBreathPattern, type Pattern } from "../useBreathPattern";

const triggerFrame = async (time: number) => {
  const callback = rafStore.callback;
  if (!callback) {
    throw new Error("No RAF callback registered");
  }

  await act(async () => {
    callback(time);
    await Promise.resolve();
  });
};

describe("useBreathPattern", () => {
  let now = 0;

  beforeEach(() => {
    now = 0;
    rafStore.callback = null;
    vi.spyOn(performance, "now").mockImplementation(() => now);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    rafStore.callback = null;
  });

  const advanceTime = async (ms: number) => {
    now += ms;
    await triggerFrame(now);
  };

  it("progresses through phases according to the configured pattern", async () => {
    const pattern: Pattern = [
      { phase: "inhale", sec: 1 },
      { phase: "hold", sec: 0.5 },
      { phase: "exhale", sec: 1.5 },
    ];

    const { result } = renderHook(() => useBreathPattern(pattern, 3));

    expect(result.current.running).toBe(false);
    expect(result.current.cycle).toBe(0);
    expect(result.current.current.phase).toBe("inhale");

    await act(async () => {
      result.current.start();
      await Promise.resolve();
    });

    expect(result.current.running).toBe(true);
    expect(result.current.phaseDuration).toBe(1);

    await advanceTime(1000);
    expect(result.current.current.phase).toBe("hold");
    expect(result.current.phaseDuration).toBe(0.5);

    await advanceTime(500);
    expect(result.current.current.phase).toBe("exhale");
    expect(result.current.phaseDuration).toBe(1.5);

    await advanceTime(1500);
    expect(result.current.current.phase).toBe("inhale");
    expect(result.current.cycle).toBe(1);

    await advanceTime(1000);
    expect(result.current.current.phase).toBe("hold");
    expect(result.current.cycle).toBe(1);

    await act(async () => {
      result.current.stop();
      await Promise.resolve();
    });

    expect(result.current.running).toBe(false);
    expect(result.current.cycle).toBe(0);
    expect(result.current.phaseDuration).toBe(1);
    expect(result.current.phaseIndex).toBe(0);
  });

  it("toggle resumes from the beginning when restarting", async () => {
    const pattern: Pattern = [
      { phase: "inhale", sec: 0.75 },
      { phase: "exhale", sec: 0.75 },
    ];

    const { result } = renderHook(() => useBreathPattern(pattern, 2));

    await act(async () => {
      result.current.toggle();
      await Promise.resolve();
    });

    expect(result.current.running).toBe(true);

    await advanceTime(750);
    expect(result.current.current.phase).toBe("exhale");

    await act(async () => {
      result.current.toggle();
      await Promise.resolve();
    });

    expect(result.current.running).toBe(false);
    expect(result.current.cycle).toBe(0);
    expect(result.current.current.phase).toBe("exhale");

    await act(async () => {
      result.current.toggle();
      await Promise.resolve();
    });

    expect(result.current.running).toBe(true);
    expect(result.current.current.phase).toBe("inhale");
    expect(result.current.phaseProgress).toBeCloseTo(0, 2);
  });
});
