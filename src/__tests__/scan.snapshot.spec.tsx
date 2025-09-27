import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
vi.mock("@/components/ui/PageHeader", () => ({
  default: ({ title }: any) => <div>{title}</div>,
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children }: any) => <button>{children}</button>,
}));
import Page from "@/app/modules/scan/page";

describe("Scan Page", () => {
  it("rend la page", () => {
    const { container } = render(<Page />);
    expect(container).toMatchSnapshot();
  });
});
