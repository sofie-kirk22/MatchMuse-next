type GarmentInsight = {
  id: number;
  filename: string;
  url: string;
  alt: string | null;
  category: string;
  wearCount?: number;
  lastWorn?: string | null;
};

type StatisticsGarmentGridProps = {
  title: string;
  description?: string;
  items: GarmentInsight[];
  metaType: "wearCount" | "category" | "lastWorn";
};

export default function StatisticsGarmentGrid({
  title,
  description,
  items,
  metaType,
}: StatisticsGarmentGridProps) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-md dark:border-zinc-800 dark:bg-zinc-950">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold">{title}</h2>
        {description && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {description}
          </p>
        )}
      </div>

      {items.length === 0 ? (
        <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
          No items to show yet.
        </p>
      ) : (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800"
            >
              <img
                src={item.url}
                alt={item.alt || item.filename}
                className="h-40 w-full object-cover"
                loading="lazy"
              />

              <div className="space-y-1 px-4 py-3">
                <p className="line-clamp-2 text-sm font-medium">
                  {item.alt || item.filename}
                </p>

                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {renderMeta(item, metaType)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function renderMeta(
  item: GarmentInsight,
  metaType: "wearCount" | "category" | "lastWorn"
) {
  if (metaType === "wearCount") {
    const count = item.wearCount ?? 0;
    return `Worn ${count} ${count === 1 ? "time" : "times"}`;
  }

  if (metaType === "lastWorn") {
    return item.lastWorn
      ? `Last worn ${new Date(item.lastWorn).toLocaleDateString()}`
      : "Never worn";
  }

  return item.category;
}