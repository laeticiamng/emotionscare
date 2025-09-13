import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import Page from "@/app/modules/flash-glow/page";
import { ThemeProvider, I18nProvider } from "@/COMPONENTS.reg";

describe("FlashGlowPage", () => {
  it("rend la page", () => {
    const { container } = render(
      <ThemeProvider>
        <I18nProvider>
          <Page />
        </I18nProvider>
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });
});
