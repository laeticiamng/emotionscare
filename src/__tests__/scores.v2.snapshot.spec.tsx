import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ScoresV2Panel from "@/app/modules/scores/ScoresV2Panel";

const mockDashboardData = vi.hoisted(() => ({
  moodTrend: [
    { date: "2024-05-01", mood: 7.2, energy: 6.8, annotation: "Journal du matin" },
    { date: "2024-05-02", mood: 7.8, energy: 7.1, annotation: "Respiration 4-7-8" },
    { date: "2024-05-03", mood: 8.0, energy: 7.5, annotation: "Session adaptive music" },
  ],
  weeklySessions: [
    { week: "S18", guided: 3, breathwork: 2, vr: 1, journaling: 2, total: 8 },
    { week: "S19", guided: 4, breathwork: 3, vr: 2, journaling: 2, total: 11 },
  ],
  heatmap: [
    { day: "Lun", slot: "Matin", intensity: 72, dominantMood: "Positif", sessions: 2 },
    { day: "Mar", slot: "Après-midi", intensity: 65, dominantMood: "Créatif", sessions: 1 },
    { day: "Jeu", slot: "Soir", intensity: 78, dominantMood: "Serein", sessions: 2 },
    { day: "Sam", slot: "Midi", intensity: 54, dominantMood: "Curieux", sessions: 1 },
  ],
  summary: {
    moodAverage: 7.7,
    moodVariation: 0.8,
    bestMoodDay: { date: "2024-05-03", mood: 8.0, energy: 7.5, annotation: "Session adaptive music" },
    sessionsAverage: 9.5,
    lastWeek: { week: "S19", guided: 4, breathwork: 3, vr: 2, journaling: 2, total: 11 },
    level: 4,
    currentExperience: 1680,
    nextLevelExperience: 2200,
    levelProgress: 76,
    streakDays: 6,
    mostIntenseSlot: { day: "Jeu", slot: "Soir", intensity: 78, dominantMood: "Serein", sessions: 2 },
    totalSessions: 19,
  },
  source: "remote" as const,
}));

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({
    user: { id: "user-123", email: "demo@example.com" },
    isAuthenticated: true,
  }),
}));

vi.mock("@/services/scoresDashboard.service", () => ({
  fetchScoresDashboard: vi.fn().mockResolvedValue(mockDashboardData),
  SCORES_DASHBOARD_FALLBACK: mockDashboardData,
}));

vi.stubGlobal(
  "ResizeObserver",
  class {
    observe() {}
    unobserve() {}
    disconnect() {}
  },
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

beforeEach(() => {
  queryClient.clear();
});

describe("ScoresV2Panel", () => {
  it("rend un panneau scores", () => {
    const { container, getByText } = render(<ScoresV2Panel />, { wrapper });
    expect(getByText(/Scores/i)).toBeTruthy();
    expect(container).toMatchSnapshot();
  });
});
