import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
vi.mock("@/COMPONENTS.reg", () => ({
  PageHeader: ({ title }: any) => <div>{title}</div>,
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  Card: ({ children }: any) => <div>{children}</div>,
  ProgressBar: ({ value }: any) => <div>progress {value}</div>,
  Sparkline: ({ values }: any) => <div>{values.join(',')}</div>
}));
import Page from "@/app/modules/emotion-scan/page";
import EmotionScanPage from "@/modules/emotion-scan/EmotionScanPage";

describe("EmotionScan Page", () => {
  it("rend la page", () => {
    const { container } = render(<Page />);
    expect(container).toMatchSnapshot();
  });
});

describe("EmotionScanPage", () => {
  it("rend la page et le CTA Calculer", () => {
    const { container, getByText } = render(<EmotionScanPage />);
    expect(getByText(/Emotion Scan/i)).toBeTruthy();
    expect(getByText(/Calculer/i)).toBeTruthy();
    expect(container).toMatchSnapshot();
  });
});
