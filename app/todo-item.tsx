"use client";

import { useState, useTransition } from "react";
import { deleteTodoAction, setTodoDoneAction, type ActionResult } from "./actions";
import type { Todo } from "@/lib/todos";

export function TodoItem({ todo }: { todo: Todo }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function runAction(action: () => Promise<ActionResult>) {
    startTransition(async () => {
      const result = await action();
      setError(result.ok ? null : result.message);
    });
  }

  const checkboxId = `todo-${todo.id}`;

  return (
    <li className="flex flex-col gap-1 py-3">
      <div className="flex items-center gap-3">
        <input
          id={checkboxId}
          type="checkbox"
          checked={todo.done}
          disabled={pending}
          onChange={() => runAction(() => setTodoDoneAction(todo.id, !todo.done))}
          className="h-5 w-5 shrink-0 cursor-pointer accent-zinc-900 disabled:cursor-not-allowed dark:accent-zinc-100"
        />
        <label
          htmlFor={checkboxId}
          className={`min-w-0 flex-1 cursor-pointer break-words ${
            todo.done
              ? "text-zinc-400 line-through dark:text-zinc-500"
              : "text-zinc-900 dark:text-zinc-100"
          }`}
        >
          {todo.title}
        </label>
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
