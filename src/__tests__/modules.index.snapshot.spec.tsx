import { describe, it, expect, vi } from "vitest";
import React from 'react';
vi.mock('@/COMPONENTS.reg', () => ({ PageHeader: ({ title, subtitle }: any) => React.createElement('header', null, React.createElement('h1', null, title), React.createElement('p', null, subtitle)), Card: ({ children }: any) => React.createElement('div', null, children), Button: (props: any) => React.createElement('a', props), LoadingSpinner: () => React.createElement('div', null, 'loading') }));
import { render } from "@testing-library/react";
import ModulesIndexPage from "@/app/modules/page";

describe("ModulesIndexPage", () => {
  it("rend la page et liste les modules", () => {
    const { container, getByText } = render(<ModulesIndexPage />);
    expect(getByText(/Modules/i)).toBeTruthy();
    expect(container).toMatchSnapshot();
  });
});
