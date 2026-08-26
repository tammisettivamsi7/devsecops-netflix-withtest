import reducer, {
  initialItemState,
  initiateItem,
  setNextPage,
} from "../src/store/slices/discover";

describe("discover reducer", () => {
  it("starts with no loaded media groups", () => {
    expect(reducer(undefined, { type: "unknown" })).toEqual({});
  });

  it("initializes an item once and advances its page", () => {
    const initialized = reducer(
      undefined,
      initiateItem({ mediaType: "movie", itemKey: "popular" })
    );

    expect(initialized.movie.popular).toEqual(initialItemState);
    expect(
      reducer(
        initialized,
        initiateItem({ mediaType: "movie", itemKey: "popular" })
      )
    ).toEqual(initialized);
    expect(
      reducer(
        initialized,
        setNextPage({ mediaType: "movie", itemKey: "popular" })
      ).movie.popular.page
    ).toBe(1);
  });
});
