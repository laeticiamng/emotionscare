import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import StorySynthPage from "@/modules/story-synth/StorySynthPage";

describe("StorySynthPage", () => {
  it("rend la page et le CTA Générer", () => {
    const { container, getByText } = render(<StorySynthPage />);
    expect(getByText(/Story Synth/i)).toBeTruthy();
    expect(getByText(/Générer/i)).toBeTruthy();
    expect(container).toMatchSnapshot();
  });
});
