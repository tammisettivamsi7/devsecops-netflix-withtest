import {
  formatBytes,
  formatMinuteToReadable,
  formatTime,
  getRandomNumber,
} from "../src/utils/common";

describe("common formatting utilities", () => {
  it("formats minutes with hours only when needed", () => {
    expect(formatMinuteToReadable(0)).toBe("0m");
    expect(formatMinuteToReadable(125)).toBe("2h 5m");
  });

  it("formats byte values and clamps negative precision", () => {
    expect(formatBytes(0)).toBe("0 Bytes");
    expect(formatBytes(1024)).toBe("1 KiB");
    expect(formatBytes(1536, -1)).toBe("2 KiB");
  });

  it("formats short and long durations with padded fields", () => {
    expect(formatTime(65)).toBe("01:05");
    expect(formatTime(3661)).toBe("01:01:01");
  });

  it("returns an integer in the requested random range", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.42);
    expect(getRandomNumber(10)).toBe(4);
    vi.restoreAllMocks();
  });
});
