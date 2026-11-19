import { describe, expect, it } from "vitest";
import { TITLE_MAX_LENGTH, normalizeTitle } from "./todo-title";

describe("normalizeTitle", () => {
  it("앞뒤 공백을 지운다", () => {
    expect(normalizeTitle("  과제 제출  ")).toBe("과제 제출");
  });

  it("비어 있거나 공백뿐이면 null", () => {
    expect(normalizeTitle("")).toBeNull();
    expect(normalizeTitle("   ")).toBeNull();
  });

  it("최대 길이까지는 받고, 넘으면 null", () => {
    expect(normalizeTitle("가".repeat(TITLE_MAX_LENGTH))).toHaveLength(TITLE_MAX_LENGTH);
    expect(normalizeTitle("가".repeat(TITLE_MAX_LENGTH + 1))).toBeNull();
  });

  it("공백을 지운 뒤의 길이로 판단한다", () => {
    expect(normalizeTitle(` ${"가".repeat(TITLE_MAX_LENGTH)} `)).toHaveLength(TITLE_MAX_LENGTH);
  });

  it("문자열이 아니면 null", () => {
    expect(normalizeTitle(null)).toBeNull();
    expect(normalizeTitle(123)).toBeNull();
  });
});
