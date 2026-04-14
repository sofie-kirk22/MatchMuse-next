type UsageItem = {
  garmentId: number;
  filename: string;
  url: string;
  alt: string | null;
  wearCount: number;
};

type UsageTopCardProps = {
  item: UsageItem;
};

export default function UsageTopCard({ item }: UsageTopCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
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
          Worn {item.wearCount} {item.wearCount === 1 ? "time" : "times"}
        </p>
      </div>
    </div>
  );
}