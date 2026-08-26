import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import SearchBox from "../src/components/SearchBox";
import NetflixNavigationLink from "../src/components/NetflixNavigationLink";
import PlayButton from "../src/components/PlayButton";
import GenreBreadcrumbs from "../src/components/GenreBreadcrumbs";
import MaxLineTypography from "../src/components/MaxLineTypography";
import MainLoadingScreen from "../src/components/MainLoadingScreen";
import MaturityRate from "../src/components/MaturityRate";
import NetflixIconButton from "../src/components/NetflixIconButton";
import MoreInfoButton from "../src/components/MoreInfoButton";
import VideoItemWithHoverPure from "../src/components/VideoItemWithHoverPure";

function LocationReader() {
  return <output data-testid="location">{useLocation().pathname}</output>;
}

describe("basic UI components", () => {
  it("focuses the search input from its icon and toggles focused styling", () => {
    const { container } = render(<SearchBox />);
    const input = screen.getByLabelText("search");
    const iconButton = container.querySelector("svg")?.parentElement;

    expect(iconButton).toBeTruthy();
    fireEvent.click(iconButton!);
    expect(input).toHaveFocus();
    expect(input.parentElement?.parentElement).toHaveStyle(
      "border: 1px solid white"
    );
    fireEvent.blur(input);
    expect(input.parentElement?.parentElement).not.toHaveStyle(
      "border: 1px solid white"
    );
  });

  it("renders a router link with its children", () => {
    render(
      <MemoryRouter>
        <NetflixNavigationLink to="/browse">Browse</NetflixNavigationLink>
      </MemoryRouter>
    );
    expect(screen.getByRole("link", { name: "Browse" })).toHaveAttribute(
      "href",
      "/browse"
    );
  });

  it("navigates to the watch route when Play is clicked", () => {
    render(
      <MemoryRouter>
        <PlayButton />
        <LocationReader />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole("button", { name: /play/i }));
    expect(screen.getByTestId("location")).toHaveTextContent("/watch");
  });

  it("renders genre breadcrumbs in order and supports an empty list", () => {
    const { rerender } = render(<GenreBreadcrumbs genres={["Action", "Drama"]} />);
    expect(screen.getByText("Action")).toBeInTheDocument();
    expect(screen.getByText("Drama")).toBeInTheDocument();
    rerender(<GenreBreadcrumbs genres={[]} />);
    expect(screen.queryByText("Action")).not.toBeInTheDocument();
  });

  it("forwards MaxLineTypography refs and renders its content", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <MaxLineTypography ref={ref} maxLine={2}>
        Long title
      </MaxLineTypography>
    );
    expect(screen.getByText("Long title")).toBeInTheDocument();
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current?.textContent).toBe("Long title");
  });

  it("renders the loading overlay and small action components", () => {
    render(
      <>
        <MainLoadingScreen />
        <MaturityRate>16+</MaturityRate>
        <NetflixIconButton aria-label="favorite">+</NetflixIconButton>
        <MoreInfoButton />
      </>
    );
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    expect(screen.getByText("16+")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "favorite" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /more info/i })).toBeInTheDocument();
  });

  it("forwards pointer hover state and image source", () => {
    const handleHover = vi.fn();
    render(
      <VideoItemWithHoverPure
        src="poster.jpg"
        innerRef={null}
        handleHover={handleHover}
      />
    );
    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("src", "poster.jpg");
    fireEvent.pointerEnter(image);
    fireEvent.pointerLeave(image);
    expect(handleHover).toHaveBeenNthCalledWith(1, true);
    expect(handleHover).toHaveBeenNthCalledWith(2, false);
  });
});
