"use server";

// 서버 액션은 화면 밖에서 POST로도 호출될 수 있으므로 입력을 모두 서버에서 다시 검사한다.
import { refresh } from "next/cache";
import { describeDbError } from "@/lib/db";
import { normalizeTitle } from "@/lib/todo-title";
import { addTodo, deleteTodo, setTodoDone } from "@/lib/todos";

export type ActionResult = { ok: true } | { ok: false; message: string };

const FAILED = "요청을 처리하지 못했어요. 잠시 후 다시 시도해 주세요.";

function isValidId(id: unknown): id is number {
  return typeof id === "number" && Number.isInteger(id) && id > 0;
}

async function run(label: string, work: () => Promise<void>): Promise<ActionResult> {
  try {
    await work();
  } catch (error) {
    console.error(`[todo] ${label} 실패: ${describeDbError(error)}`);
    return { ok: false, message: FAILED };
  }
  refresh();
  return { ok: true };
}

export async function addTodoAction(rawTitle: unknown): Promise<ActionResult> {
  const title = normalizeTitle(rawTitle);
  if (title === null) {
    // 빈 제목은 조용히 무시하고 (Q4), 200자 초과 등 잘못된 입력은 실패로 돌려준다.
    const isBlank = typeof rawTitle === "string" && rawTitle.trim().length === 0;
    return isBlank ? { ok: true } : { ok: false, message: FAILED };
  }
  return run("추가", () => addTodo(title));
}

export async function setTodoDoneAction(id: unknown, done: unknown): Promise<ActionResult> {
  if (!isValidId(id) || typeof done !== "boolean") {
    return { ok: false, message: FAILED };
  }
  return run("완료 변경", () => setTodoDone(id, done));
}

export async function deleteTodoAction(id: unknown): Promise<ActionResult> {
  if (!isValidId(id)) {
    return { ok: false, message: FAILED };
  }
  return run("삭제", () => deleteTodo(id));
}
