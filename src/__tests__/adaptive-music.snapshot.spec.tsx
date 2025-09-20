import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AdaptiveMusicPage from "@/modules/adaptive-music/AdaptiveMusicPage";
import MoodProvider from "@/contexts/MoodContext";

vi.mock("@/integrations/supabase/client", () => {
  const chain = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    upsert: vi.fn().mockResolvedValue({ error: null }),
    delete: vi.fn().mockReturnThis(),
  };

  return {
    supabase: {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
      },
      from: vi.fn(() => chain),
    },
  };
});

const mockPlaylistResponse = {
  ok: true,
  data: {
    playlist_id: "calm_relax",
    mood: "calm",
    requested_mood: "relaxed",
    title: "Mock Playlist",
    description: "Sélection de test pour la snapshot",
    total_duration: 600,
    unit: "seconds",
    tracks: [
      {
        id: "track-1",
        title: "First track",
        artist: "EmotionsCare",
        url: "/audio/mock-track.mp3",
        duration: 300,
        mood: "calm",
        energy: 0.25,
        focus: "breathing",
        instrumentation: ["piano"],
        tags: ["calm", "test"],
        description: "A calm testing track",
      },
    ],
    energy_profile: {
      baseline: 0.2,
      requested: 0.4,
      recommended: 0.3,
      alignment: 0.9,
      curve: [
        { track_id: "track-1", start: 0, end: 300, energy: 0.25, focus: "breathing" },
      ],
    },
    recommendations: ["Respirez profondément avec la première piste."],
    guidance: {
      focus: "Stabiliser votre système nerveux avec des textures calmes.",
      breathwork: "Respiration 4-6",
      activities: ["Journal", "Étirements"],
    },
    metadata: {
      curated_by: "EmotionsCare",
      tags: ["calm", "relax"],
      dataset_version: "test",
    },
  },
};

const renderWithProviders = () => {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <MoodProvider>
        <AdaptiveMusicPage />
      </MoodProvider>
    </QueryClientProvider>
  );
};

describe("AdaptiveMusicPage", () => {
  beforeEach(() => {
    vi.spyOn(global, "fetch").mockImplementation(async (input: RequestInfo | URL) => {
      const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
      if (url.includes("/me/feature_flags")) {
        return {
          ok: true,
          json: async () => ({ flags: { FF_MUSIC: true, FF_ASSESS_POMS: true } }),
        } as Response;
      }

      return {
        ok: true,
        json: async () => mockPlaylistResponse,
      } as Response;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("rend la page et la playlist adaptative", async () => {
    const { container, findByText } = renderWithProviders();

    expect(await findByText(/Adaptive Music/i)).toBeTruthy();
    expect(await findByText(/Les textures proposées/i)).toBeTruthy();

    expect(container).toMatchSnapshot();
  });
});
