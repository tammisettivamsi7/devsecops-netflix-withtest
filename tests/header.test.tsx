import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MainHeader from "../src/components/layouts/MainHeader";

vi.mock("../src/hooks/useOffSetTop", () => ({ default: () => false }));

describe("MainHeader", () => {
  it("renders navigation, search, and account controls", () => {
    render(
      <MemoryRouter>
        <MainHeader />
      </MemoryRouter>
    );
    expect(screen.getAllByText("My List").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Movies").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Tv Shows").length).toBeGreaterThan(0);
    expect(screen.getByLabelText("search")).toBeInTheDocument();
    expect(screen.getByAltText("user_avatar")).toBeInTheDocument();
  });

  it("opens and closes the account menu", () => {
    render(
      <MemoryRouter>
        <MainHeader />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByAltText("user_avatar").parentElement!);
    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(screen.getByText("Account")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Account"));
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });
});
