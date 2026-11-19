// 할 일 제목 규칙. 서버와 브라우저 양쪽에서 같은 규칙을 쓴다.

export const TITLE_MAX_LENGTH = 200;

/**
 * 앞뒤 공백을 지운 제목을 돌려준다.
 * 비어 있거나 200자를 넘으면 null (추가하지 않음).
 */
export function normalizeTitle(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const title = raw.trim();
  if (title.length === 0 || title.length > TITLE_MAX_LENGTH) return null;
  return title;
}
