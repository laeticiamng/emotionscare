import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, fireEvent, waitFor, screen, act } from "@testing-library/react";
import FlashGlowUltraPage from "@/modules/flash-glow-ultra/FlashGlowUltraPage";

const clockControls: {
  setElapsed: (ms: number) => void;
  complete: () => void;
  reset: () => void;
} = {
  setElapsed: () => {},
  complete: () => {},
  reset: () => {},
};

vi.mock("@/components/ui/PageHeader", () => ({
  default: ({ title, subtitle }: any) => (
    <header>
      <h1>{title}</h1>
      {subtitle ? <p>{subtitle}</p> : null}
    </header>
  ),
}));

vi.mock("@/components/ui/card", () => ({
  Card: ({ children }: any) => <section>{children}</section>,
}));

vi.mock("@/components/ui/button", () => ({
  Button: React.forwardRef<HTMLButtonElement, any>(({ children, ...props }, ref) => (
    <button ref={ref} {...props}>
      {children}
    </button>
  )),
}));

vi.mock("@/ui/GlowSurface", () => ({
  GlowSurface: () => <div data-testid="glow-surface" />,
}));

vi.mock("@/ui/ProgressBar", () => ({
  ProgressBar: ({ value }: any) => <div data-testid="progress">{value}</div>,
}));

vi.mock("@/ui/hooks/usePulseClock", () => ({
  usePulseClock: () => 0,
}));

vi.mock("@/ui/hooks/useSound", () => ({
  useSound: () => null,
}));

vi.mock("@/modules/sessions/hooks/useSessionClock", () => {
  return {
    useSessionClock: (options?: { durationMs?: number }) => {
      const [state, setState] = React.useState<"idle" | "running" | "paused" | "completed">("idle");
      const [elapsedMs, setElapsedMs] = React.useState(0);
      const callbacksRef = React.useRef(new Set<(ms: number) => void>());

      const start = () => setState("running");
      const pause = () => setState("paused");
      const resume = () => setState("running");
      const complete = () => setState("completed");
      const reset = () => {
        setState("idle");
        setElapsedMs(0);
      };

      clockControls.setElapsed = (ms: number) => {
        setElapsedMs(ms);
        callbacksRef.current.forEach((cb) => cb(ms));
      };
      clockControls.complete = () => complete();
      clockControls.reset = reset;

      const progress = options?.durationMs
        ? Math.min(1, elapsedMs / options.durationMs)
        : 0;

      return {
        state,
        elapsedMs,
        progress,
        start,
        pause,
        resume,
        complete,
        reset,
        onTick: (cb: (ms: number) => void) => {
          callbacksRef.current.add(cb);
          return () => {
            callbacksRef.current.delete(cb);
          };
        },
      };
    },
  };
});

const mockLogAndJournal = vi.fn().mockResolvedValue({
  id: "session-xyz",
  type: "flash_glow",
  duration_sec: 65,
  mood_delta: 6,
  meta: {},
  created_at: new Date().toISOString(),
});

vi.mock("@/services/sessions/sessionsApi", () => ({
  logAndJournal: (...args: any[]) => mockLogAndJournal(...args),
}));

const mockEndSession = vi.fn().mockResolvedValue({
  activity_session_id: "fg-session-1",
  mood_delta: 7,
});

vi.mock("@/modules/flash-glow/flash-glowService", () => ({
  flashGlowService: {
    endSession: (...args: any[]) => mockEndSession(...args),
  },
}));

const mockCreateEntry = vi.fn().mockResolvedValue({ id: "journal-123" });

vi.mock("@/modules/flash-glow/journal", () => ({
  createFlashGlowJournalEntry: (...args: any[]) => mockCreateEntry(...args),
}));

vi.mock("@/lib/scores/events", () => ({
  recordEvent: vi.fn(),
}));

const mockToast = vi.fn();

vi.mock("@/hooks/use-toast", () => ({
  toast: (...args: any[]) => mockToast(...args),
}));

vi.mock("@/lib/flags/ff", () => ({
  ff: () => false,
}));

vi.mock("@/routerV2/routes", () => ({
  routes: {
    auth: {
      login: () => "/login",
    },
  },
}));

vi.mock("@sentry/react", () => ({
  addBreadcrumb: vi.fn(),
  captureException: vi.fn(),
}));

describe("FlashGlowUltraPage integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clockControls.reset();
  });

  afterEach(() => {
    clockControls.reset();
  });

  it("enregistre une session complète avec journal automatique", async () => {
    const { getByText, getByLabelText } = render(<FlashGlowUltraPage />);

    fireEvent.click(getByText(/Démarrer/i));

    fireEvent.change(getByLabelText(/Humeur après séance/i), { target: { value: "76" } });

    await act(async () => {
      clockControls.setElapsed(65_000);
    });

    fireEvent.click(getByText(/Terminer/i));

    await act(async () => {
      clockControls.complete();
    });

    await waitFor(() => {
      expect(mockLogAndJournal).toHaveBeenCalledTimes(1);
    });

    expect(mockEndSession).toHaveBeenCalledTimes(1);
    expect(mockCreateEntry).toHaveBeenCalledTimes(1);

    const logArgs = mockLogAndJournal.mock.calls[0][0];
    expect(logArgs).toMatchObject({
      type: "flash_glow",
      duration_sec: expect.any(Number),
      meta: expect.objectContaining({ reason: "manual_stop" }),
    });

    await waitFor(() => {
      expect(screen.getByText(/Session enregistrée automatiquement\s*\(#/i)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: expect.stringMatching(/Session terminée/),
        })
      );
    });
  });
});
