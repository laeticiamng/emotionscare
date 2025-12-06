import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import BreathConstellationPage from "@/modules/breath-constellation/BreathConstellationPage";

// mock canvas context for jsdom
Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
  value: () => ({
    scale: () => {},
    setTransform: () => {},
    clearRect: () => {},
    beginPath: () => {},
    arc: () => {},
    fill: () => {},
    moveTo: () => {},
    lineTo: () => {},
    stroke: () => {},
    save: () => {},
    restore: () => {},
    fillStyle: "",
    globalAlpha: 1,
    lineWidth: 1,
    strokeStyle: "",
  }),
});

class RO {
  observe() {}
  disconnect() {}
}
(globalThis as any).ResizeObserver = RO;

describe("BreathConstellationPage", () => {
  it("rend la page et le CTA Démarrer", () => {
    const { container, getByText } = render(<BreathConstellationPage />);
    expect(getByText(/Breath Constellation/i)).toBeTruthy();
    expect(getByText(/Démarrer/i)).toBeTruthy();
    expect(container).toMatchSnapshot();
  });
});
