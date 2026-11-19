import { Suspense } from "react";
import { connection } from "next/server";
import { isCategory, type Category } from "@/lib/category";
import { describeDbError } from "@/lib/db";
import { todayInSeoul } from "@/lib/due-date";
import { listTodos, type Todo } from "@/lib/todos";
import { AddTodoForm } from "./add-todo-form";
import { CategoryFilter } from "./category-filter";
import { TodoItem } from "./todo-item";

export default function Home({ searchParams }: PageProps<"/">) {
  return (
    <main className="flex flex-1 justify-center bg-zinc-50 px-4 py-12 dark:bg-black">
      <div className="flex w-full max-w-md flex-col gap-6 self-start rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-950 dark:ring-zinc-800">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">우리들의 할 일</h1>
        <Suspense fallback={<p className="text-sm text-zinc-500">불러오는 중…</p>}>
          <TodoSection searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}

async function TodoSection({ searchParams }: Pick<PageProps<"/">, "searchParams">) {
  const { category: rawCategory } = await searchParams;
  // 알 수 없는 값이면 전체로 본다.
  const category: Category | null = isCategory(rawCategory) ? rawCategory : null;

  return (
    <>
      {/* key: 필터가 바뀌면 폼의 카테고리 기본값도 새로 잡힌다 */}
      <AddTodoForm key={category ?? "all"} defaultCategory={category} />
      <CategoryFilter current={category} />
      <TodoList category={category} />
    </>
  );
}

async function TodoList({ category }: { category: Category | null }) {
  // DB는 빌드할 때가 아니라 실제 요청이 올 때 읽는다.
  await connection();
  const today = todayInSeoul(new Date());

  let todos: Todo[];
  try {
    todos = await listTodos(category);
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
        {category ? "이 카테고리에 할 일이 없어요." : "할 일이 없어요. 하나 추가해 보세요."}
      </p>
    );
  }

  return (
    <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} today={today} />
      ))}
    </ul>
  );
}
