import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AudioPlayer } from "@/ui/AudioPlayer";

describe("AudioPlayer", () => {
  it("renders and exposes volume slider", () => {
    const { container } = render(<AudioPlayer src="/audio/lofi-120.mp3" title="Test" />);
    expect(screen.getByLabelText("Volume")).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
