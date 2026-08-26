import { buildThresholdList, formatMinuteToReadable } from "../src/utils";

describe("utility exports", () => {
  it("builds twenty-one intersection thresholds including zero", () => {
    const thresholds = buildThresholdList();

    expect(thresholds).toHaveLength(21);
    expect(thresholds[0]).toBe(0.05);
    expect(thresholds[19]).toBe(1);
    expect(thresholds[20]).toBe(0);
  });

  it("re-exports common utilities", () => {
    expect(formatMinuteToReadable(60)).toBe("1h 0m");
  });
});
