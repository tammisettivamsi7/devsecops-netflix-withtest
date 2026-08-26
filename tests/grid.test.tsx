import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import GridWithInfiniteScroll from "../src/components/GridWithInfiniteScroll";

const observe = vi.fn();
const unobserve = vi.fn();
let observerCallback: IntersectionObserverCallback;

vi.mock("../src/components/VideoItemWithHover", () => ({
  default: ({ video }: { video: { title: string } }) => (
    <div data-testid="video">{video.title}</div>
  ),
}));

vi.mock("../src/hooks/useIntersectionObserver", () => ({
  default: () => {
    return null;
  },
}));

describe("GridWithInfiniteScroll", () => {
  it("renders the genre title and filters results without backdrops", () => {
    render(
      <GridWithInfiniteScroll
        genre={{ name: "Action", apiString: "action" }}
        data={{
          page: 1,
          total_pages: 1,
          total_results: 2,
          results: [
            { id: 1, title: "Visible", backdrop_path: "/visible.jpg" },
            { id: 2, title: "Hidden", backdrop_path: null },
          ],
        }}
        handleNext={vi.fn()}
      />
    );
    expect(screen.getByText("Action Movies")).toBeInTheDocument();
    expect(screen.getByText("Visible")).toBeInTheDocument();
    expect(screen.queryByText("Hidden")).not.toBeInTheDocument();
  });

  it("renders each eligible result as a video item", () => {
    render(
      <GridWithInfiniteScroll
        genre={{ name: "Drama", id: 18 }}
        data={{
          page: 1,
          total_pages: 2,
          total_results: 2,
          results: [
            { id: 1, title: "One", backdrop_path: "/one.jpg" },
            { id: 2, title: "Two", backdrop_path: "/two.jpg" },
          ],
        }}
        handleNext={vi.fn()}
      />
    );
    expect(screen.getAllByTestId("video")).toHaveLength(2);
  });
});
