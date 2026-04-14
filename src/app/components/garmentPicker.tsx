"use client";

type GarmentItem = {
  id: number;
  filename: string;
  url: string;
  alt: string | null;
  garmentType: string | null;
  colors: string[];
  styles: string[];
  materials: string[];
  uploadedAt: string;
};

type GarmentPickerProps = {
  label: string;
  items: GarmentItem[];
  selectedId?: number | null;
  selectedIds?: number[];
  multiple?: boolean;
  onSelectSingle?: (id: number | null) => void;
  onToggleMulti?: (id: number) => void;
};

export default function GarmentPicker({
  label,
  items,
  selectedId,
  selectedIds = [],
  multiple = false,
  onSelectSingle,
  onToggleMulti,
}: GarmentPickerProps) {
  if (!items.length) {
    return (
      <div className="space-y-2">
        <h3 className="text-sm font-medium">{label}</h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          No garments available in this category yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">{label}</h3>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {items.map((item) => {
          const active = multiple
            ? selectedIds.includes(item.id)
            : selectedId === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                if (multiple) {
                  onToggleMulti?.(item.id);
                } else {
                  onSelectSingle?.(active ? null : item.id);
                }
              }}
              className={`overflow-hidden rounded-2xl border text-left transition ${
                active
                  ? "border-rose-400 ring-2 ring-rose-300/50 dark:border-white dark:ring-white/30"
                  : "border-zinc-200 hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
              }`}
            >
              <img
                src={item.url}
                alt={item.alt || item.filename}
                className="h-32 w-full object-cover"
                loading="lazy"
              />

              <div className="space-y-1 px-3 py-2">
                <p className="line-clamp-2 text-xs font-medium">
                  {item.alt || item.filename}
                </p>

                {item.colors?.length > 0 && (
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {item.colors.slice(0, 3).join(", ")}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}