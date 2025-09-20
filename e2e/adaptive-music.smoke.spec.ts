import { test, expect } from "@playwright/test";

const mockPlaylistResponse = {
  ok: true,
  data: {
    playlist_id: "mock-playlist",
    mood: "relaxed",
    requested_mood: "relaxed",
    title: "Sélection douceur",
    description: "Ambiance apaisante",
    total_duration: 600,
    tracks: [
      {
        id: "mock-track",
        title: "Brume matinale",
        artist: "Studio Calm",
        url: "/audio/mock.mp3",
        duration: 180,
        mood: "calm",
        energy: 0.3,
        focus: "breathing",
        instrumentation: ["piano"],
        tags: ["douceur"],
        description: "Ambiance moelleuse pour se déposer.",
      },
    ],
    energy_profile: {
      baseline: 0.3,
      requested: 0.4,
      recommended: 0.35,
      alignment: 0.9,
      curve: [],
    },
    recommendations: ["Respire calmement"],
    guidance: { focus: "Laisse-toi bercer", breathwork: "", activities: ["relaxation"] },
    metadata: { curated_by: "care", tags: ["calm"], dataset_version: "v1" },
  },
};

test("adaptive music favorites, reprise et opt-in", async ({ page }) => {
  await page.route("/api/mood_playlist", async route => {
    await route.fulfill({
      status: 200,
      body: JSON.stringify(mockPlaylistResponse),
      headers: { "content-type": "application/json" },
    });
  });

  await page.goto("/modules/adaptive-music");
  await expect(page.getByTestId("adaptive-music-page")).toBeVisible();

  const skipButton = page.getByRole("button", { name: /Pas maintenant/i });
  if (await skipButton.isVisible()) {
    await skipButton.click();
  }

  await expect(page.getByRole("button", { name: /^Lecture$/ })).toBeVisible();

  const favoriteButton = page.getByRole("button", { name: /Garder cette bulle/i });
  await favoriteButton.click();

  const playButton = page.getByRole("button", { name: /^Lecture$/ });
  await playButton.click();
  await page.waitForTimeout(500);
  await page.getByRole("button", { name: /^Pause$/ }).click();

  await expect(page.getByRole("button", { name: /Reprendre/ })).toBeVisible();
});
