import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import CoachPage from "@/modules/coach/CoachPage";

describe("CoachPage", () => {
  it("rend la page et des conseils", () => {
    const { container, getByText } = render(<CoachPage />);
    expect(getByText(/Coach/i)).toBeTruthy();
    expect(container).toMatchSnapshot();
  });
});
