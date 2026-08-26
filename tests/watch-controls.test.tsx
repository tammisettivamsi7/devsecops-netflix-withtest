import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import PlayerControlButton from "../src/components/watch/PlayerControlButton";
import PlayerSeekbar from "../src/components/watch/PlayerSeekbar";
import VolumeControllers from "../src/components/watch/VolumeControllers";
import CustomNavigation from "../src/components/slick-slider/CustomNavigation";

describe("watch controls", () => {
  it("forwards PlayerControlButton clicks", () => {
    const onClick = vi.fn();
    render(
      <PlayerControlButton aria-label="pause" onClick={onClick}>
        ||
      </PlayerControlButton>
    );
    fireEvent.click(screen.getByRole("button", { name: "pause" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("passes seekbar values to seekTo and exposes duration", () => {
    const seekTo = vi.fn();
    render(<PlayerSeekbar playedSeconds={30} duration={120} seekTo={seekTo} />);
    const slider = screen.getByRole("slider");
    expect(slider).toHaveAttribute("aria-valuenow", "30");
    expect(slider).toHaveAttribute("aria-valuemax", "120");
    fireEvent.change(slider, { target: { value: "45" } });
    expect(seekTo).toHaveBeenCalledWith(45);
  });

  it("renders the correct volume icon and forwards changes", () => {
    const handleVolume = vi.fn();
    const handleVolumeToggle = vi.fn();
    const { rerender } = render(
      <VolumeControllers
        value={0.5}
        muted={false}
        handleVolume={handleVolume}
        handleVolumeToggle={handleVolumeToggle}
      />
    );
    expect(screen.getByTestId("VolumeUpIcon")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button"));
    expect(handleVolumeToggle).toHaveBeenCalledTimes(1);
    rerender(
      <VolumeControllers
        value={0}
        muted
        handleVolume={handleVolume}
        handleVolumeToggle={handleVolumeToggle}
      />
    );
    expect(screen.getByTestId("VolumeOffIcon")).toBeInTheDocument();
  });

  it("shows only applicable navigation arrows and invokes callbacks", () => {
    const onNext = vi.fn();
    const onPrevious = vi.fn();
    const { rerender } = render(
      <CustomNavigation
        isEnd={false}
        arrowWidth={60}
        activeSlideIndex={0}
        onNext={onNext}
        onPrevious={onPrevious}
      >
        <span>slides</span>
      </CustomNavigation>
    );
    expect(screen.getByText("slides")).toBeInTheDocument();
    expect(screen.queryByTestId("ArrowBackIosNewIcon")).not.toBeInTheDocument();
    const nextArrow = screen.getByTestId("ArrowForwardIosIcon").parentElement;
    fireEvent.click(nextArrow!);
    expect(onNext).toHaveBeenCalledTimes(1);
    rerender(
      <CustomNavigation
        isEnd
        arrowWidth={60}
        activeSlideIndex={1}
        onNext={onNext}
        onPrevious={onPrevious}
      >
        <span>slides</span>
      </CustomNavigation>
    );
    fireEvent.click(screen.getByTestId("ArrowBackIosNewIcon").parentElement!);
    expect(onPrevious).toHaveBeenCalledTimes(1);
    expect(screen.queryByTestId("ArrowForwardIosIcon")).not.toBeInTheDocument();
  });
});
