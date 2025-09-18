import { beforeAll, beforeEach, describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { AudioPlayer } from "@/ui/AudioPlayer";

describe("AudioPlayer", () => {
  beforeAll(() => {
    Object.defineProperty(window.HTMLMediaElement.prototype, "pause", {
      configurable: true,
      value: vi.fn(),
    });
    Object.defineProperty(window.HTMLMediaElement.prototype, "play", {
      configurable: true,
      value: vi.fn().mockResolvedValue(undefined),
    });
  });

  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders and exposes volume slider", () => {
    const { container } = render(
      <AudioPlayer src="/audio/lofi-120.mp3" trackId="test-track" title="Test" />
    );
    expect(screen.getByLabelText("Volume")).toBeInTheDocument();
    const favorite = screen.getByRole("button", { name: /Ajouter aux favoris/i });
    fireEvent.click(favorite);
    expect(favorite).toHaveAttribute("aria-pressed", "true");
    expect(container).toMatchSnapshot();
  });

  it("restores resume button from persisted playback state", async () => {
    window.localStorage.setItem(
      "adaptive-music:playback:test-track",
      JSON.stringify({ position: 42, volume: 0.4, wasPlaying: false, updatedAt: Date.now() })
    );

    render(
      <AudioPlayer src="/audio/lofi-120.mp3" trackId="test-track" title="Test" />
    );

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Reprendre/ })).toBeInTheDocument();
    });

    expect(screen.getByText(/Dernière écoute sauvegardée/)).toHaveTextContent("0:42");
  });
});
