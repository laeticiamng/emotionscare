import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
vi.mock("@/COMPONENTS.reg", () => ({
  PageHeader: ({ title }: any) => <div>{title}</div>,
  Card: ({ children }: any) => <div>{children}</div>,
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  ProgressBar: ({ value }: any) => <div data-progress={value} />,
}));
import BossGritPage from "@/modules/boss-grit/BossGritPage";

describe("BossGritPage", () => {
  it("rend la page et le bouton Démarrer", () => {
    const { container, getByText } = render(<BossGritPage />);
    expect(getByText(/Boss Grit/i)).toBeTruthy();
    expect(getByText(/Démarrer/i)).toBeTruthy();
    expect(container).toMatchSnapshot();
  });
});
