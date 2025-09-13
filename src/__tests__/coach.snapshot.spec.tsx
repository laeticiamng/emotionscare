import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
vi.mock("@/COMPONENTS.reg", () => ({
  PageHeader: ({ title }: any) => <div>{title}</div>,
  Button: ({ children }: any) => <button>{children}</button>,
}));
import Page from "@/app/modules/coach/page";

describe("Coach Page", () => {
  it("rend la page", () => {
    const { container } = render(<Page />);
    expect(container).toMatchSnapshot();
  });
});
