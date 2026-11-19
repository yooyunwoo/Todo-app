import { describe, expect, it } from "vitest";
import { dueStatus, formatDueDate, parseDueDate, todayInSeoul } from "./due-date";

describe("parseDueDate", () => {
  it("비어 있으면 null", () => {
    expect(parseDueDate("")).toBeNull();
    expect(parseDueDate(null)).toBeNull();
    expect(parseDueDate(undefined)).toBeNull();
  });

  it("실제 날짜는 그대로", () => {
    expect(parseDueDate("2026-11-21")).toBe("2026-11-21");
    expect(parseDueDate("2028-02-29")).toBe("2028-02-29"); // 윤년
  });

  it("지난 날짜도 받는다", () => {
    expect(parseDueDate("2001-01-01")).toBe("2001-01-01");
  });

  it("없는 날짜, 잘못된 형식은 invalid", () => {
    expect(parseDueDate("2026-13-45")).toBe("invalid");
    expect(parseDueDate("2027-02-29")).toBe("invalid");
    expect(parseDueDate("2026-1-5")).toBe("invalid");
    expect(parseDueDate("내일")).toBe("invalid");
    expect(parseDueDate(20261121)).toBe("invalid");
  });

  it("2000~2100년 밖이면 invalid", () => {
    expect(parseDueDate("1999-12-31")).toBe("invalid");
    expect(parseDueDate("2101-01-01")).toBe("invalid");
    expect(parseDueDate("2000-01-01")).toBe("2000-01-01");
    expect(parseDueDate("2100-12-31")).toBe("2100-12-31");
  });
});

describe("todayInSeoul", () => {
  it("UTC 저녁은 한국에서 다음 날", () => {
    // UTC 11/19 15:30 = KST 11/20 00:30
    expect(todayInSeoul(new Date("2026-11-19T15:30:00Z"))).toBe("2026-11-20");
  });

  it("UTC 오후 3시 전은 한국에서도 같은 날", () => {
    expect(todayInSeoul(new Date("2026-11-19T14:59:00Z"))).toBe("2026-11-19");
  });
});

describe("dueStatus", () => {
  const today = "2026-11-19";

  it("마감일이 없으면 none", () => {
    expect(dueStatus(null, false, today)).toBe("none");
  });

  it("미완료: 지남 / 오늘 / 앞으로", () => {
    expect(dueStatus("2026-11-18", false, today)).toBe("overdue");
    expect(dueStatus("2026-11-19", false, today)).toBe("today");
    expect(dueStatus("2026-11-20", false, today)).toBe("upcoming");
  });

  it("완료면 날짜와 관계없이 done", () => {
    expect(dueStatus("2026-11-18", true, today)).toBe("done");
    expect(dueStatus("2026-11-19", true, today)).toBe("done");
  });
});

describe("formatDueDate", () => {
  it("월/일 (요일)", () => {
    expect(formatDueDate("2026-11-21")).toBe("11/21 (토)");
    expect(formatDueDate("2026-01-05")).toBe("1/5 (월)");
  });
});
