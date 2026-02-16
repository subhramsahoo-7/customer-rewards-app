import { calculatePoints } from "../utils/rewards";

describe("calculatePoints", () => {
  // Positive cases
  test("amount > 100 should calculate correctly", () => {
    expect(calculatePoints(120)).toBe(90);
  });

  test("amount between 51 and 100 should calculate correctly", () => {
    expect(calculatePoints(75)).toBe(25);
  });

  test("amount <= 50 should return 0 points", () => {
    expect(calculatePoints(40)).toBe(0);
  });

  //  Negative cases
  test("amount = 0 should return 0 points", () => {
    expect(calculatePoints(0)).toBe(0);
  });

  test("negative amount should return 0 points", () => {
    expect(calculatePoints(-20)).toBe(0);
  });

  test("non-numeric input should return 0 points", () => {
    expect(calculatePoints("abc")).toBe(0);
  });
});