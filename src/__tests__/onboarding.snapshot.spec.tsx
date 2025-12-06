import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import OnboardingPage from "@/app/onboarding/page";

describe("OnboardingPage", () => {
  it("rend l’étape 1 et matche le snapshot", () => {
    const { container, getByText } = render(<OnboardingPage />);
    expect(getByText(/Bienvenue/i)).toBeTruthy();
    expect(container).toMatchSnapshot();
  });
});
