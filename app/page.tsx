import { Suspense } from "react";
import { connection } from "next/server";
import { describeDbError } from "@/lib/db";
import { listTodos, type Todo } from "@/lib/todos";
import { AddTodoForm } from "./add-todo-form";
import { TodoItem } from "./todo-item";

export default function Home() {
  return (
    <main className="flex flex-1 justify-center bg-zinc-50 px-4 py-12 dark:bg-black">
      <div className="flex w-full max-w-md flex-col gap-6 self-start rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-950 dark:ring-zinc-800">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">우리들의 할 일</h1>
        <AddTodoForm />
        <Suspense fallback={<p className="text-sm text-zinc-500">불러오는 중…</p>}>
          <TodoList />
        </Suspense>
      </div>
    </main>
  );
}

async function TodoList() {
  // DB는 빌드할 때가 아니라 실제 요청이 올 때 읽는다.
  await connection();

  let todos: Todo[];
  try {
    todos = await listTodos();
  } catch (error) {
    console.error(`[todo] 목록 불러오기 실패: ${describeDbError(error)}`);
    return (
      <p role="alert" className="text-sm text-red-600 dark:text-red-400">
        할 일을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
      </p>
    );
  }

  if (todos.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-zinc-500">
        할 일이 없어요. 하나 추가해 보세요.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}
