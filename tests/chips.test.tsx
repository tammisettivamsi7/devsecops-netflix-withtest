import { render } from "@testing-library/react";
import React from "react";
import AgeLimitChip from "../src/components/AgeLimitChip";
import QualityChip from "../src/components/QualityChip";

describe("metadata chips", () => {
  it("renders the age limit label and keeps square corners", () => {
    const { getByText } = render(<AgeLimitChip label="16+" />);
    expect(getByText("16+")).toBeInTheDocument();
    expect(getByText("16+").closest("div")).toHaveStyle("border-radius: 0");
  });

  it("renders quality labels with an outlined style", () => {
    const { getByText } = render(<QualityChip label="4K" />);
    expect(getByText("4K")).toBeInTheDocument();
    expect(getByText("4K").closest("div")).toHaveClass("MuiChip-outlined");
  });
});
