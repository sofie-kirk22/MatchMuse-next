"use client";

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

export default function OutfitFiltersComponent({
  filters,
  onChange,
}: OutfitFiltersProps) {
  return (
    <div className="space-y-4">
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
  );
}