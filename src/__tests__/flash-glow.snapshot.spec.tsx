import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
vi.mock("@/components/ui/PageHeader", () => ({
  default: ({ title }: any) => <div>{title}</div>,
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children }: any) => <button>{children}</button>,
}));
import Page from "@/app/modules/flash-glow/page";
import { ThemeProvider } from "@/theme/ThemeProvider";
import { I18nProvider } from "@/lib/i18n";

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
