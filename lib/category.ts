// 카테고리는 고정 목록이다. DB에는 code를, 화면에는 label을 쓴다.
// 서버와 브라우저 양쪽에서 import한다.

export const CATEGORIES = [
  { code: "study", label: "공부" },
  { code: "work", label: "일" },
  { code: "personal", label: "개인" },
  { code: "etc", label: "기타" },
] as const;

export type Category = (typeof CATEGORIES)[number]["code"];

export function isCategory(value: unknown): value is Category {
  return CATEGORIES.some((category) => category.code === value);
}

export function categoryLabel(code: Category): string {
  return CATEGORIES.find((category) => category.code === code)!.label;
}
