import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
vi.mock("@/COMPONENTS.reg", () => ({
  PageHeader: ({ title }: any) => <div>{title}</div>,
  Card: ({ children }: any) => <div>{children}</div>,
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  GlowSurface: () => <div>glow</div>,
  ProgressBar: ({ value }: any) => <div>progress:{value}</div>,
  usePulseClock: () => 0
}));
import FlashGlowUltraPage from "@/modules/flash-glow-ultra/FlashGlowUltraPage";

describe("FlashGlowUltraPage", () => {
  it("rend la page et le CTA Démarrer", () => {
    const { container, getByText } = render(<FlashGlowUltraPage />);
    expect(getByText(/Flash Glow Ultra/i)).toBeTruthy();
    expect(getByText(/Démarrer/i)).toBeTruthy();
    expect(container).toMatchSnapshot();
  });
});
