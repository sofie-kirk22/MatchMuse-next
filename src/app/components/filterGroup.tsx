"use client";

import { useMemo, useState } from "react";

type FilterGroupProps = {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
};

export default function FilterGroup({
  label,
  options,
  selected,
  onToggle,
}: FilterGroupProps) {
  const [query, setQuery] = useState("");

  const filteredOptions = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return options;

    return options.filter((option) =>
      option.toLowerCase().includes(q)
    );
  }, [options, query]);

  if (!options.length) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">{label}</h3>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          {selected.length} selected
        </span>
      </div>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={`Search ${label.toLowerCase()}...`}
        className="
          w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm
          bg-white dark:bg-zinc-900
          focus:outline-none focus:border-rose-300
          dark:border-zinc-700 dark:focus:border-zinc-500
        "
      />

      <div className="max-h-40 overflow-y-auto">
        <div className="flex flex-wrap gap-2">
          {filteredOptions.map((option) => {
            const active = selected.includes(option);

            return (
              <button
                key={option}
                type="button"
                onClick={() => onToggle(option)}
                className={`rounded-full px-3 py-1 text-sm transition ${
                  active
                    ? "bg-rose-200 text-black dark:bg-white dark:text-black"
                    : "border border-zinc-300 bg-rose-100/75 hover:bg-rose-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}