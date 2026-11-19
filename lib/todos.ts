// 하나뿐인 목록의 할 일을 읽고 바꾼다. 서버에서만 사용.
import "server-only";
import { isCategory, type Category } from "./category";
import { getDb } from "./db";

export type Todo = {
  id: number;
  title: string;
  done: boolean;
  /** "YYYY-MM-DD" 또는 null (마감일 없음) */
  dueDate: string | null;
  category: Category | null;
};

/** 새 할 일. 값은 모두 검사를 거친 뒤여야 한다. */
export type NewTodo = {
  title: string;
  dueDate: string | null;
  category: Category | null;
};

/** 최신순(새로 추가한 할 일이 맨 위). category를 주면 그 카테고리만. */
export async function listTodos(category: Category | null = null): Promise<Todo[]> {
  const db = await getDb();
  const result = await db.execute({
    sql: `SELECT id, title, done, due_date, category FROM todos
          WHERE (? IS NULL OR category = ?)
          ORDER BY created_at DESC, id DESC`,
    args: [category, category],
  });
  return result.rows.map((row) => ({
    id: Number(row.id),
    title: String(row.title),
    done: Number(row.done) === 1,
    dueDate: typeof row.due_date === "string" ? row.due_date : null,
    category: isCategory(row.category) ? row.category : null,
  }));
}

/** 새 할 일은 항상 미완료로 시작한다. */
export async function addTodo(todo: NewTodo): Promise<void> {
  const db = await getDb();
  await db.execute({
    sql: "INSERT INTO todos (title, done, due_date, category) VALUES (?, 0, ?, ?)",
    args: [todo.title, todo.dueDate, todo.category],
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
