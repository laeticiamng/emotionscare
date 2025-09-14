import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import AdaptiveMusicPage from "@/modules/adaptive-music/AdaptiveMusicPage";

describe("AdaptiveMusicPage", () => {
  it("rend la page et le CTA", () => {
    const { container, getByText } = render(<AdaptiveMusicPage />);
    expect(getByText(/Adaptive Music/i)).toBeTruthy();
    expect(getByText(/Lancer/i)).toBeTruthy();
    expect(container).toMatchSnapshot();
  });
});
