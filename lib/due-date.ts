// 마감일 규칙. 마감일은 시간 없는 "YYYY-MM-DD" 글자로 다룬다.
// "오늘"은 한국 시간(Asia/Seoul) 기준이다. 서버와 브라우저 양쪽에서 import한다.

export const DUE_DATE_MIN = "2000-01-01";
export const DUE_DATE_MAX = "2100-12-31";

const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

/**
 * 입력값을 마감일로 바꾼다.
 * - 비어 있으면 null (마감일 없음)
 * - 실제로 있는 날짜이고 범위 안이면 그 날짜
 * - 그 밖에는 "invalid"
 */
export function parseDueDate(raw: unknown): string | null | "invalid" {
  if (raw === null || raw === undefined || raw === "") return null;
  if (typeof raw !== "string") return "invalid";

  const match = DATE_PATTERN.exec(raw);
  if (!match) return "invalid";

  const [, y, m, d] = match.map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  const isRealDate =
    date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
  if (!isRealDate) return "invalid";
  if (raw < DUE_DATE_MIN || raw > DUE_DATE_MAX) return "invalid";

  return raw;
}

/** 주어진 순간의 한국 날짜 ("YYYY-MM-DD"). */
export function todayInSeoul(now: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export type DueStatus = "none" | "done" | "overdue" | "today" | "upcoming";

/** 완료된 할 일은 마감이 지났어도 강조하지 않는다. */
export function dueStatus(dueDate: string | null, done: boolean, today: string): DueStatus {
  if (dueDate === null) return "none";
  if (done) return "done";
  if (dueDate < today) return "overdue";
  if (dueDate === today) return "today";
  return "upcoming";
}

/** "2026-11-21" → "11/21 (금)" */
export function formatDueDate(dueDate: string): string {
  const [y, m, d] = dueDate.split("-").map(Number);
  const weekday = WEEKDAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
  return `${m}/${d} (${weekday})`;
}
