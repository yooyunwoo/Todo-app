// 하나뿐인 목록의 할 일을 읽고 바꾼다. 서버에서만 사용.
import "server-only";
import { getDb } from "./db";

export type Todo = {
  id: number;
  title: string;
  done: boolean;
};

/** 최신순(새로 추가한 할 일이 맨 위). */
export async function listTodos(): Promise<Todo[]> {
  const db = await getDb();
  const result = await db.execute(
    "SELECT id, title, done FROM todos ORDER BY created_at DESC, id DESC",
  );
  return result.rows.map((row) => ({
    id: Number(row.id),
    title: String(row.title),
    done: Number(row.done) === 1,
  }));
}

/** 새 할 일은 항상 미완료로 시작한다. title은 이미 normalizeTitle을 거친 값이어야 한다. */
export async function addTodo(title: string): Promise<void> {
  const db = await getDb();
  await db.execute({
    sql: "INSERT INTO todos (title, done) VALUES (?, 0)",
    args: [title],
  });
}

export async function setTodoDone(id: number, done: boolean): Promise<void> {
  const db = await getDb();
  await db.execute({
    sql: "UPDATE todos SET done = ? WHERE id = ?",
    args: [done ? 1 : 0, id],
  });
}

export async function deleteTodo(id: number): Promise<void> {
  const db = await getDb();
  await db.execute({
    sql: "DELETE FROM todos WHERE id = ?",
    args: [id],
  });
}
