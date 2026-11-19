"use client";

import { useState, useTransition } from "react";
import { deleteTodoAction, setTodoDoneAction, type ActionResult } from "./actions";
import { categoryLabel, type Category } from "@/lib/category";
import { dueStatus, formatDueDate } from "@/lib/due-date";
import type { Todo } from "@/lib/todos";

const BADGE_CLASS: Record<Category, string> = {
  study: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  work: "bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  personal: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  etc: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300",
};

/** today: 서버가 계산한 한국 날짜 ("YYYY-MM-DD"). 서버와 브라우저의 판정이 어긋나지 않게 받아 쓴다. */
export function TodoItem({ todo, today }: { todo: Todo; today: string }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function runAction(action: () => Promise<ActionResult>) {
    startTransition(async () => {
      const result = await action();
      setError(result.ok ? null : result.message);
    });
  }

  const checkboxId = `todo-${todo.id}`;
  const hasMeta = todo.category !== null || todo.dueDate !== null;

  return (
    <li className="flex flex-col gap-1 py-3">
      <div className="flex items-start gap-3">
        <input
          id={checkboxId}
          type="checkbox"
          checked={todo.done}
          disabled={pending}
          onChange={() => runAction(() => setTodoDoneAction(todo.id, !todo.done))}
          className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-zinc-900 disabled:cursor-not-allowed dark:accent-zinc-100"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <label
            htmlFor={checkboxId}
            className={`cursor-pointer break-words ${
              todo.done
                ? "text-zinc-400 line-through dark:text-zinc-500"
                : "text-zinc-900 dark:text-zinc-100"
            }`}
          >
            {todo.title}
          </label>
          {hasMeta && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {todo.category && (
                <span className={`rounded-full px-2 py-0.5 font-medium ${BADGE_CLASS[todo.category]}`}>
                  {categoryLabel(todo.category)}
                </span>
              )}
              {todo.dueDate && <DueDate dueDate={todo.dueDate} done={todo.done} today={today} />}
            </div>
          )}
        </div>
        <button
          type="button"
          disabled={pending}
          onClick={() => runAction(() => deleteTodoAction(todo.id))}
          className="shrink-0 rounded-md px-2 py-1 text-sm text-zinc-500 transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-red-950 dark:hover:text-red-400"
        >
          삭제
        </button>
      </div>
      {error && (
        <p role="alert" className="pl-8 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </li>
  );
}

function DueDate({ dueDate, done, today }: { dueDate: string; done: boolean; today: string }) {
  switch (dueStatus(dueDate, done, today)) {
    case "today":
      return <span className="font-semibold text-amber-600 dark:text-amber-400">오늘</span>;
    case "overdue":
      return (
        <span className="font-medium text-red-600 dark:text-red-400">
          {formatDueDate(dueDate)} · 지남
        </span>
      );
    case "done":
      return <span className="text-zinc-400 dark:text-zinc-500">{formatDueDate(dueDate)}</span>;
    default:
      return <span className="text-zinc-500 dark:text-zinc-400">{formatDueDate(dueDate)}</span>;
  }
}
