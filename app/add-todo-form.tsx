"use client";

import { useState, useTransition, type FormEvent } from "react";
import { addTodoAction } from "./actions";
import { TITLE_MAX_LENGTH, normalizeTitle } from "@/lib/todo-title";

export function AddTodoForm() {
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = normalizeTitle(title);
    if (normalized === null || pending) return; // 빈 제목이면 아무 일도 하지 않음

    startTransition(async () => {
      const result = await addTodoAction(normalized);
      if (result.ok) {
        setTitle("");
        setError(null);
      } else {
        setError(result.message); // 실패하면 입력한 내용은 그대로 둔다
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex gap-2">
        <input
          type="text"
          name="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={TITLE_MAX_LENGTH}
          readOnly={pending}
          placeholder="할 일을 입력하세요"
          aria-label="할 일 제목"
          autoComplete="off"
          className="min-w-0 flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
        <button
          type="submit"
          disabled={pending}
          className="shrink-0 rounded-lg bg-zinc-900 px-4 py-2 font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
        >
          추가
        </button>
      </div>
      {error && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </form>
  );
}
