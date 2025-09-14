import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
vi.mock("@/COMPONENTS.reg", () => ({
  PageHeader: ({ title }: any) => <div>{title}</div>,
  Card: ({ children }: any) => <div>{children}</div>,
  Button: ({ children, ...p }: any) => <button {...p}>{children}</button>,
  Input: (p: any) => <input {...p} />,
  Textarea: (p: any) => <textarea {...p} />,
  useDebounce: (fn: any) => fn,
}));
import JournalPage from "@/modules/journal/JournalPage";

describe("JournalPage", () => {
  it("rend la page et le CTA Ajouter", () => {
    const { container, getByText } = render(<JournalPage />);
    expect(getByText(/Journal/i)).toBeTruthy();
    expect(getByText(/Ajouter/i)).toBeTruthy();
    expect(container).toMatchSnapshot();
  });
});
