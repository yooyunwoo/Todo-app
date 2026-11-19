import Link from "next/link";
import { CATEGORIES, type Category } from "@/lib/category";

const OPTIONS: { code: Category | null; label: string }[] = [
  { code: null, label: "전체" },
  ...CATEGORIES.map((c) => ({ code: c.code, label: c.label })),
];

/** 고른 필터는 주소(?category=)에 남는다. 내 화면에만 적용된다. */
export function CategoryFilter({ current }: { current: Category | null }) {
  return (
    <nav aria-label="카테고리 필터" className="flex flex-wrap gap-2">
      {OPTIONS.map((option) => {
        const active = option.code === current;
        return (
          <Link
            key={option.code ?? "all"}
            href={option.code ? `/?category=${option.code}` : "/"}
            aria-current={active ? "page" : undefined}
            className={`rounded-full px-3 py-1 text-sm transition-colors ${
              active
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            }`}
          >
            {option.label}
          </Link>
        );
      })}
    </nav>
  );
}
