import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import Page from "@/app/modules/flash-glow/page";

describe("FlashGlowPage", () => {
  it("rend la page", () => {
    const { container } = render(<Page />);
    expect(container).toMatchSnapshot();
  });
});
