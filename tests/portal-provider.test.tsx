import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import PortalProvider, {
  usePortal,
  usePortalData,
} from "../src/providers/PortalProvider";

function PortalConsumer() {
  const setPortal = usePortal();
  const { anchorElement, miniModalMediaData } = usePortalData();
  return (
    <>
      <button
        onClick={() =>
          setPortal(document.body, { id: 7, title: "Movie", poster_path: null })
        }
      >
        open
      </button>
      <button onClick={() => setPortal(null, null)}>clear</button>
      <output data-testid="anchor">{anchorElement ? "set" : "empty"}</output>
      <output data-testid="movie">{miniModalMediaData?.title ?? "empty"}</output>
    </>
  );
}

describe("PortalProvider", () => {
  it("publishes and clears the portal anchor and movie data", () => {
    render(
      <PortalProvider>
        <PortalConsumer />
      </PortalProvider>
    );
    expect(screen.getByTestId("anchor")).toHaveTextContent("empty");
    expect(screen.getByTestId("movie")).toHaveTextContent("empty");
    fireEvent.click(screen.getByRole("button", { name: "open" }));
    expect(screen.getByTestId("anchor")).toHaveTextContent("set");
    expect(screen.getByTestId("movie")).toHaveTextContent("Movie");
    fireEvent.click(screen.getByRole("button", { name: "clear" }));
    expect(screen.getByTestId("anchor")).toHaveTextContent("empty");
    expect(screen.getByTestId("movie")).toHaveTextContent("empty");
  });
});
