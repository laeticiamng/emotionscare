import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
vi.mock("@/COMPONENTS.reg", () => ({
  PageHeader: ({ title, subtitle }: any) => React.createElement('header', null, React.createElement('h1', null, title), React.createElement('p', null, subtitle)),
  Card: ({ children }: any) => React.createElement('div', null, children),
  Button: (props: any) => React.createElement('a', props),
  ProgressBar: ({ value, max }: any) => React.createElement('progress', { value, max }),
  Sparkline: ({ values }: any) => React.createElement('div', null, values?.join(',')),
  BadgeLevel: ({ level }: any) => React.createElement('span', null, level),
}));
vi.mock("@/modules/scores/ScoresV2Panel", () => ({ default: () => React.createElement('div', null, 'ScoresV2Panel') }));
import ScoresV2Page from "@/modules/scores/ScoresV2Page";

describe("ScoresV2Page", () => {
  it("rend la page V2", () => {
    const { container, getByText } = render(<ScoresV2Page />);
    expect(getByText(/Scores \(V2\)/i)).toBeTruthy();
    expect(container).toMatchSnapshot();
  });
});
