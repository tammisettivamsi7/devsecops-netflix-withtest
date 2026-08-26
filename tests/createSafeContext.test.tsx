import { renderHook } from "@testing-library/react";
import React from "react";
import createSafeContext from "../src/lib/createSafeContext";

describe("createSafeContext", () => {
  it("returns a provider and reads its value", () => {
    const [useValue, Provider] = createSafeContext<string>();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider value="provided">{children}</Provider>
    );

    const { result } = renderHook(() => useValue(), { wrapper });
    expect(result.current).toBe("provided");
  });

  it("throws when consumed without a provider", () => {
    const [useValue] = createSafeContext<string>();
    expect(() => renderHook(() => useValue())).toThrow(
      "useContext must be inside a Provider with a value"
    );
  });
});
