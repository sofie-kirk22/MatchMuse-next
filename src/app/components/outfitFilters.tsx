"use client";

import { useState } from "react";
import { OutfitFilters } from "@/types/outfitFilters";

type OutfitFiltersProps = {
    filters: OutfitFilters;
    onChange: (filters: OutfitFilters) => void;
};

const availableColors = ["black", "white", "grey", "blue", "brown", "beige", "gold"];
const availableStyles = ["minimalist", "casual", "streetwear", "formal"];
const availableMaterials = ["cotton", "denim", "wool", "leather", "metal"];

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
    const selectedCount = countSelected(filters);

    return (
        <div className="space-y-4">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="
                flex items-center gap-2 rounded-full border border-zinc-300
                bg-rose-100/75 px-4 py-2 text-sm font-medium transition
                hover:bg-rose-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
                <span>{open ? "Hide filters" : "Filters"}</span>
                {selectedCount > 0 && (
                    <span className="rounded-full bg-rose-200 px-2 py-0.5 text-xs text-black dark:bg-white">
                        {selectedCount}
                    </span>
                )}
            </button>
            {open && (
                <div className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
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
                </div>
            )}
        </div>
    );
}

function FilterGroup({
    label,
    options,
    selected,
    onToggle,
}: {
    label: string;
    options: string[];
    selected: string[];
    onToggle: (value: string) => void;
}) {
    return (
        <div className="space-y-2">
            <h3 className="text-sm font-medium">{label}</h3>

            <div className="flex flex-wrap gap-2">
                {options.map((option) => {
                    const active = selected.includes(option);

                    return (
                        <button
                            key={option}
                            type="button"
                            onClick={() => onToggle(option)}
                            className={`rounded-full px-3 py-1 text-sm transition ${active
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
    );
}