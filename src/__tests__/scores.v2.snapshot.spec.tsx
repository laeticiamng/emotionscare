import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import ScoresV2Panel from "@/app/modules/scores/ScoresV2Panel";

describe("ScoresV2Panel", () => {
  it("rend un panneau scores", () => {
    const { container, getByText } = render(<ScoresV2Panel />);
    expect(getByText(/Scores/i)).toBeTruthy();
    expect(container).toMatchSnapshot();
  });
});
