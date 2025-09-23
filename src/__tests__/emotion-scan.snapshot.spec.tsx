import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
vi.mock("@/components/ui/PageHeader", () => ({
  default: ({ title }: any) => <div>{title}</div>,
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

vi.mock("@/components/ui/card", () => ({
  Card: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("@/ui/ProgressBar", () => ({
  ProgressBar: ({ value }: any) => <div>progress {value}</div>,
}));

vi.mock("@/ui/Sparkline", () => ({
  Sparkline: ({ values }: any) => <div>{values.join(',')}</div>,
}));
vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({ user: null, isAuthenticated: false }),
}));
vi.mock("@/services/emotionScan.service", () => ({
  invokeEmotionScan: vi.fn().mockResolvedValue({
    emotions: {},
    dominantEmotion: "neutre",
    confidence: 75,
    insights: [],
    recommendations: [],
    emotionalBalance: 50,
  }),
  getEmotionScanHistory: vi.fn().mockResolvedValue([]),
  summarizeLikertAnswers: vi.fn(() => "Résumé"),
  deriveScore10: vi.fn((value: number) => value / 10),
}));
import EmotionScanPage from "@/modules/emotion-scan/EmotionScanPage";

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

describe("EmotionScanPage", () => {
  it("rend la page et le CTA Calculer", () => {
    const { container, getByText } = render(<EmotionScanPage />, { wrapper });
    expect(getByText(/Emotion Scan/i)).toBeTruthy();
    expect(getByText(/Calculer/i)).toBeTruthy();
    expect(container).toMatchSnapshot();
  });
});
