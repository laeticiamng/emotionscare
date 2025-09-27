import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import { AudioPlayer } from "@/ui/AudioPlayer";

describe("AudioPlayer", () => {
  it("renders, toggles favorite state and exposes volume slider", async () => {
    const toggle = vi.fn();
    const { container } = render(
      <AudioPlayer
        src="/audio/lofi-120.mp3"
        trackId="test-track"
        title="Test"
        favorite={{ active: false, onToggle: toggle }}
      />,
    );

    expect(screen.getByLabelText("Volume")).toBeInTheDocument();
    const favorite = screen.getByRole("button", { name: /Ajouter aux favoris/i });
    fireEvent.click(favorite);
    expect(toggle).toHaveBeenCalledTimes(1);
    expect(container).toMatchSnapshot();
  });

  it("shows resume button when resume prop provided", () => {
    render(
      <AudioPlayer
        src="/audio/lofi-120.mp3"
        trackId="test-track"
        title="Test"
        resume={{ position: 42, onResume: vi.fn() }}
      />,
    );

    expect(screen.getByRole("button", { name: /Reprendre/ })).toHaveTextContent("0:42");
    expect(screen.getByText(/Dernière écoute sauvegardée/)).toBeInTheDocument();
  });
});
