import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";

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
  GlowSurface: () => <div>glow</div>,
}));

vi.mock("@/ui/ProgressBar", () => ({
  ProgressBar: ({ value }: any) => <div>progress:{value}</div>,
}));

vi.mock("@/ui/hooks/usePulseClock", () => ({
  usePulseClock: () => 0,
}));

vi.mock("@/ui/hooks/useSound", () => ({
  useSound: () => null,
}));

vi.mock("@/modules/sessions/hooks/useSessionClock", () => ({
  useSessionClock: () => ({
    state: "idle",
    elapsedMs: 0,
    progress: 0,
    start: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    complete: vi.fn(),
    reset: vi.fn(),
    onTick: vi.fn(() => () => {}),
  }),
}));

vi.mock("@/services/sessions/sessionsApi", () => ({
  logAndJournal: vi.fn().mockResolvedValue({
    id: "session-1",
    type: "flash_glow",
    duration_sec: 120,
    mood_delta: null,
    meta: {},
    created_at: new Date().toISOString(),
  }),
}));

vi.mock("@/modules/flash-glow/flash-glowService", () => ({
  flashGlowService: {
    endSession: vi.fn().mockResolvedValue({ success: true }),
  },
}));

vi.mock("@/modules/flash-glow/journal", () => ({
  createFlashGlowJournalEntry: vi.fn().mockResolvedValue({ id: "journal-1" }),
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

vi.mock("@/routerV2/routes", () => ({
  routes: {
    auth: {
      login: () => "/login",
    },
  },
}));

vi.mock("@/services/sessions/moodDelta", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/services/sessions/moodDelta")>();
  return actual;
});

vi.mock("@sentry/react", () => ({
  addBreadcrumb: vi.fn(),
  captureException: vi.fn(),
}));

import FlashGlowUltraPage from "@/modules/flash-glow-ultra/FlashGlowUltraPage";

describe("FlashGlowUltraPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rend la page et le CTA Démarrer", () => {
    const { container, getByText } = render(<FlashGlowUltraPage />);
    expect(getByText(/Flash Glow Ultra/i)).toBeTruthy();
    expect(getByText(/Démarrer/i)).toBeTruthy();
    expect(container).toMatchSnapshot();
  });
});
