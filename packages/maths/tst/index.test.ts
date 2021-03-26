import { angleBetween } from "../src";

describe("angleBetween", () => {
  it("returns 0 for a horizontal line right", () => {
    expect(angleBetween([-1, 5], [1, 5])).toBeCloseTo(0);
  });

  it("returns 45 for a down-right diagonal", () => {
    expect(angleBetween([5, 5], [6, 6])).toBeCloseTo(45);
  });

  it("returns 90 for a vertical line downwards", () => {
    expect(angleBetween([5, -1], [5, 1])).toBeCloseTo(90);
  });

  it("returns 135 for a down-left diagonal", () => {
    expect(angleBetween([-5, -5], [-6, -4])).toBeCloseTo(135);
  });

  it("returns 180 for a horizontal line left", () => {
    expect(angleBetween([1, 5], [-1, 5])).toBeCloseTo(180);
  });

  it("returns 225 for a up-left diagonal", () => {
    expect(angleBetween([5, 5], [4, 4])).toBeCloseTo(225);
  });

  it("returns 270 for vertical line upwards", () => {
    expect(angleBetween([5, 1], [5, -1])).toBeCloseTo(270);
  });

  it("returns 315 for a up-right diagonal", () => {
    expect(angleBetween([5, 5], [6, 4])).toBeCloseTo(315);
  });
});
