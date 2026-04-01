"use client";

import { useState } from "react";

type FAQItem = {
  question: string;
  answer: string;
};

export default function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function toggle(index: number) {
    setOpenIndex(openIndex === index ? null : index);
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const open = openIndex === index;

        return (
          <div
            key={item.question}
            className="rounded-xl border border-zinc-300 transition
            bg-rose-200 text-black hover:bg-rose-300 disabled:opacity-60
            dark:bg-white dark:text-black dark:hover:bg-zinc-200 dark:border-zinc-800"
          >
            <button
              className="w-full text-left p-5 font-medium flex justify-between items-center"
              aria-expanded={open}
              onClick={() => toggle(index)}
            >
              {item.question}
              <span
                className={`transition-transform ${
                  open ? "rotate-45" : ""
                }`}
              >
                +
              </span>
            </button>

            {open && (
              <div className="px-5 pb-5 text-sm text-zinc-600 dark:text-zinc-400">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}