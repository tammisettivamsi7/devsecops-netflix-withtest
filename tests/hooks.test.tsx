import { act, renderHook } from "@testing-library/react";
import useOffSetTop from "../src/hooks/useOffSetTop";
import useWindowSize from "../src/hooks/useWindowSize";
import useIntersectionObserver from "../src/hooks/useIntersectionObserver";

describe("browser hooks", () => {
  it("tracks the window dimensions and removes its listener", () => {
    const addEventListener = vi.spyOn(window, "addEventListener");
    const removeEventListener = vi.spyOn(window, "removeEventListener");
    const { result, unmount } = renderHook(() => useWindowSize());

    expect(result.current).toEqual({ width: innerWidth, height: innerHeight });
    expect(addEventListener).toHaveBeenCalledWith("resize", expect.any(Function));
    unmount();
    expect(removeEventListener).toHaveBeenCalledWith("resize", expect.any(Function));
  });

  it("reports whether the page has crossed the configured offset", () => {
    Object.defineProperty(window, "pageYOffset", { configurable: true, value: 120 });
    const { result } = renderHook(() => useOffSetTop(100));

    act(() => window.dispatchEvent(new Event("scroll")));
    expect(result.current).toBe(true);
    Object.defineProperty(window, "pageYOffset", { configurable: true, value: 20 });
    act(() => window.dispatchEvent(new Event("scroll")));
    expect(result.current).toBe(false);
  });

  it("observes a referenced element and returns its latest entry", () => {
    const observe = vi.fn();
    const unobserve = vi.fn();
    const intersectionObserver = vi.fn((callback: IntersectionObserverCallback) => ({
      observe,
      unobserve,
      disconnect: vi.fn(),
      root: null,
      rootMargin: "0px",
      thresholds: [],
      takeRecords: () => [],
    }));
    vi.stubGlobal("IntersectionObserver", intersectionObserver);
    const { result, unmount } = renderHook(() => {
      const ref = { current: document.createElement("div") };
      return useIntersectionObserver(ref);
    });

    expect(intersectionObserver).toHaveBeenCalled();
    expect(observe).toHaveBeenCalled();
    expect(result.current).toBeNull();
    unmount();
    expect(unobserve).toHaveBeenCalled();
    vi.unstubAllGlobals();
  });
});
