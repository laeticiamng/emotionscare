import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import BreathConstellationPage from "@/modules/breath-constellation/BreathConstellationPage";

const mockClockState = {
  state: "idle" as "idle" | "running" | "paused" | "completed",
  elapsedMs: 0,
  progress: 0,
};

const mockBreathState = {
  running: false,
};

vi.mock("@sentry/react", () => ({
  addBreadcrumb: vi.fn(),
  captureException: vi.fn(),
}));

vi.mock("framer-motion", () => ({
  useReducedMotion: () => false,
}));

vi.mock("@/COMPONENTS.reg", () => ({
  PageHeader: ({ title, subtitle }: any) => (
    <header>
      <h1>{title}</h1>
      {subtitle ? <p>{subtitle}</p> : null}
    </header>
  ),
  Card: ({ children }: any) => <section>{children}</section>,
  Button: React.forwardRef<HTMLButtonElement, any>(({ children, ...props }, ref) => (
    <button ref={ref} {...props}>
      {children}
    </button>
  )),
  ConstellationCanvas: () => <div data-testid="constellation" />,
  useSound: () => null,
}));

vi.mock("@/modules/sessions/hooks/useSessionClock", () => ({
  useSessionClock: () => ({
    state: mockClockState.state,
    elapsedMs: mockClockState.elapsedMs,
    progress: mockClockState.progress,
    start: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    complete: vi.fn(),
    reset: vi.fn(),
    onTick: vi.fn(() => () => {}),
  }),
}));

vi.mock("@/ui/hooks/useBreathPattern", () => ({
  useBreathPattern: () => ({
    current: { phase: "inhale", sec: 4 },
    phaseProgress: 0,
    running: mockBreathState.running,
    cycle: 0,
    start: vi.fn(),
    stop: vi.fn(),
    toggle: vi.fn(),
    phaseDuration: 4,
  }),
}));

vi.mock("@/services/breathworkSessions.service", () => ({
  logBreathworkSession: vi.fn(),
  BreathworkSessionAuthError: class extends Error {},
  BreathworkSessionPersistError: class extends Error {},
}));

vi.mock("@/services/sessions/sessionsApi", () => ({
  logAndJournal: vi.fn().mockResolvedValue({
    id: "session-1",
    type: "breath",
    duration_sec: 120,
    mood_delta: null,
    meta: {},
    created_at: new Date().toISOString(),
  }),
}));

vi.mock("@/lib/scores/events", () => ({
  recordEvent: vi.fn(),
}));

vi.mock("@/hooks/use-toast", () => ({
  toast: vi.fn(),
}));

vi.mock("@/lib/flags/ff", () => ({
  ff: () => false,
}));

vi.mock("@/services/sessions/moodDelta", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/services/sessions/moodDelta")>();
  return actual;
});

const extractStatusText = (container: HTMLElement) => {
  const region = container.querySelector('main [role="status"][aria-live="polite"]');
  return region?.textContent?.trim();
};

describe("BreathConstellationPage status messaging", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockClockState.state = "idle";
    mockClockState.elapsedMs = 0;
    mockClockState.progress = 0;
    mockBreathState.running = false;
  });

  it("annonce la préparation de séance à l'état initial", () => {
    const { container } = render(<BreathConstellationPage />);
    expect(extractStatusText(container)).toBe("Séance prête à démarrer.");
  });

  it("annonce une séance en cours lorsque la respiration est active", () => {
    mockClockState.state = "running";
    mockBreathState.running = true;
    const { container } = render(<BreathConstellationPage />);
    expect(extractStatusText(container)).toBe("Séance en cours.");
  });

  it("annonce une pause lorsque le minuteur est en pause", () => {
    mockClockState.state = "paused";
    mockBreathState.running = false;
    const { container } = render(<BreathConstellationPage />);
    expect(extractStatusText(container)).toBe("Séance en pause.");
  });

  it("annonce la fin de séance lorsque la session est terminée", () => {
    mockClockState.state = "completed";
    mockBreathState.running = false;
    const { container } = render(<BreathConstellationPage />);
    expect(extractStatusText(container)).toBe("Séance terminée.");
  });
});
