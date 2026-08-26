import React from "react";
import { render, screen } from "@testing-library/react";
import Footer from "../src/components/layouts/Footer";

describe("Footer", () => {
  it("renders the developer attribution link", () => {
    render(<Footer />);
    const link = screen.getByRole("link", { name: "Crazy Man" });
    expect(link).toHaveAttribute("href", "https://github.com/crazy-man22");
    expect(link).toHaveAttribute("target", "_blank");
  });
});
