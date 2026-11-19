"use client";

import { useState, useTransition, type FormEvent } from "react";
import { addTodoAction } from "./actions";
import { CATEGORIES, type Category } from "@/lib/category";
import { DUE_DATE_MAX, DUE_DATE_MIN } from "@/lib/due-date";
import { TITLE_MAX_LENGTH, normalizeTitle } from "@/lib/todo-title";

const fieldClass =
  "rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100";

/** defaultCategory: 필터가 켜져 있으면 그 카테고리가 미리 골라진다 (Q9). */
export function AddTodoForm({ defaultCategory }: { defaultCategory: Category | null }) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState<Category | "">(defaultCategory ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = normalizeTitle(title);
    if (normalized === null || pending) return; // 빈 제목이면 아무 일도 하지 않음

    startTransition(async () => {
      const result = await addTodoAction(normalized, dueDate, category);
      if (result.ok) {
        setTitle("");
        setDueDate("");
        setCategory(defaultCategory ?? "");
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
          className={`min-w-0 flex-1 ${fieldClass}`}
        />
        <button
          type="submit"
          disabled={pending}
          className="shrink-0 rounded-lg bg-zinc-900 px-4 py-2 font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
        >
          추가
        </button>
      </div>
      <div className="flex gap-2">
        <select
          name="category"
          value={category}
          onChange={(event) => setCategory(event.target.value as Category | "")}
          disabled={pending}
          aria-label="카테고리"
          className={`min-w-0 flex-1 text-sm ${fieldClass}`}
        >
          <option value="">카테고리 없음</option>
          {CATEGORIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.label}
            </option>
          ))}
        </select>
        <input
          type="date"
          name="dueDate"
          value={dueDate}
          onChange={(event) => setDueDate(event.target.value)}
          min={DUE_DATE_MIN}
          max={DUE_DATE_MAX}
          readOnly={pending}
          aria-label="마감일"
          className={`min-w-0 flex-1 text-sm ${fieldClass}`}
        />
      </div>
      {error && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </form>
  );
}
