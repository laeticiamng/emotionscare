import { describe, it, expect, vi } from "vitest";
import React from 'react';
vi.mock('@/components/ui/PageHeader', () => ({
  default: ({ title, subtitle }: any) =>
    React.createElement(
      'header',
      null,
      React.createElement('h1', null, title),
      React.createElement('p', null, subtitle)
    ),
}));

vi.mock('@/components/ui/card', () => ({
  Card: ({ children }: any) => React.createElement('div', null, children),
}));

vi.mock('@/components/ui/button', () => ({
  Button: (props: any) => React.createElement('a', props),
}));

vi.mock('@/components/ui/LoadingSpinner', () => {
  const LoadingSpinner = () => React.createElement('div', null, 'loading');
  return { LoadingSpinner, default: LoadingSpinner };
});
import { render } from "@testing-library/react";
import ModulesIndexPage from "@/app/modules/page";

describe("ModulesIndexPage", () => {
  it("rend la page et liste les modules", () => {
    const { container, getByText } = render(<ModulesIndexPage />);
    expect(getByText(/Modules/i)).toBeTruthy();
    expect(container).toMatchSnapshot();
  });
});
