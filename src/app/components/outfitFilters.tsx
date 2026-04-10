"use client";

import { useEffect, useState } from "react";
import { OutfitFilters } from "@/types/outfitFilters";
import FilterGroup from "./filterGroup";

type OutfitFiltersProps = {
  filters: OutfitFilters;
  onChange: (filters: OutfitFilters) => void;
};

type FilterOptionsResponse =
  | {
      colors: string[];
      styles: string[];
      materials: string[];
    }
  | {
      error: string;
    };

function toggleValue(values: string[] | undefined, value: string) {
  const current = values ?? [];
  return current.includes(value)
    ? current.filter((v) => v !== value)
    : [...current, value];
}

function countSelected(filters: OutfitFilters) {
  return (
    (filters.colors?.length ?? 0) +
    (filters.styles?.length ?? 0) +
    (filters.materials?.length ?? 0)
  );
}

export default function OutfitFiltersComponent({
  filters,
  onChange,
}: OutfitFiltersProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const [availableStyles, setAvailableStyles] = useState<string[]>([]);
  const [availableMaterials, setAvailableMaterials] = useState<string[]>([]);

  const selectedCount = countSelected(filters);

  useEffect(() => {
    let cancelled = false;

    async function loadFilterOptions() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/outfitFilters", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ filters }),
        });

        const data: FilterOptionsResponse = await res.json();

        if (!res.ok || "error" in data) {
          if (!cancelled) {
            setError(
              "error" in data ? data.error : "Failed to load filter options"
            );
          }
          return;
        }

        if (!cancelled) {
          setAvailableColors(data.colors);
          setAvailableStyles(data.styles);
          setAvailableMaterials(data.materials);
        }
      } catch {
        if (!cancelled) {
          setError("Network error while loading filter options.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadFilterOptions();

    return () => {
      cancelled = true;
    };
  }, [filters]);

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="
          flex items-center gap-2 rounded-full border border-zinc-300
          bg-rose-100/75 px-4 py-2 text-sm font-medium transition
          hover:bg-rose-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800
        "
      >
        <span>{open ? "Hide filters" : "Filter"}</span>

        {selectedCount > 0 && (
          <span className="rounded-full bg-rose-200 px-2 py-0.5 text-xs text-black dark:bg-white">
            {selectedCount}
          </span>
        )}
      </button>

      {open && (
        <div className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}

          {loading ? (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Loading filters...
            </p>
          ) : (
            <>
              <FilterGroup
                label="Colors"
                options={availableColors}
                selected={filters.colors ?? []}
                onToggle={(value) =>
                  onChange({
                    ...filters,
                    colors: toggleValue(filters.colors, value),
                  })
                }
              />

              <FilterGroup
                label="Styles"
                options={availableStyles}
                selected={filters.styles ?? []}
                onToggle={(value) =>
                  onChange({
                    ...filters,
                    styles: toggleValue(filters.styles, value),
                  })
                }
              />

              <FilterGroup
                label="Materials"
                options={availableMaterials}
                selected={filters.materials ?? []}
                onToggle={(value) =>
                  onChange({
                    ...filters,
                    materials: toggleValue(filters.materials, value),
                  })
                }
              />

              {selectedCount > 0 && (
                <button
                  type="button"
                  onClick={() =>
                    onChange({
                      colors: [],
                      styles: [],
                      materials: [],
                    })
                  }
                  className="text-sm font-medium underline transition hover:opacity-70"
                >
                  Clear filters
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}