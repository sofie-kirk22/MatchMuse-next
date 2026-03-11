"use client";

import { useState } from "react";

type ReadMoreProps = {
  children: React.ReactNode;
  maxHeight?: number;
};

export default function ReadMore({ children, maxHeight = 160 }: ReadMoreProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <div
        className="relative overflow-hidden transition-all duration-300"
        style={{ maxHeight: expanded ? "none" : `${maxHeight}px` }}
      >
        {children}

        {!expanded && (
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-rose-200 dark:from-black to-transparent" />
        )}
      </div>

      <button
        onClick={() => setExpanded((v) => !v)}
        className="mt-3 text-sm font-medium underline hover:opacity-70 transition"
      >
        {expanded ? "Show less" : "Read more"}
      </button>
    </div>
  );
}