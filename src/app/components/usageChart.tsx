type UsageItem = {
  garmentId: number;
  filename: string;
  url: string;
  alt: string | null;
  wearCount: number;
};

type UsageChartProps = {
  title: string;
  items: UsageItem[];
};

export default function UsageChart({ title, items }: UsageChartProps) {
  if (!items.length) {
    return (
      <div className="space-y-2">
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          No usage data yet.
        </p>
      </div>
    );
  }

  const maxCount = Math.max(...items.map((item) => item.wearCount), 1);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{title}</h3>

      <div className="space-y-3">
        {items.map((item) => {
          const widthPercent = (item.wearCount / maxCount) * 100;

          return (
            <div key={item.garmentId} className="space-y-1">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="truncate">
                  {item.alt || item.filename}
                </span>
                <span className="shrink-0 text-zinc-500 dark:text-zinc-400">
                  {item.wearCount}
                </span>
              </div>

              <div className="h-3 rounded-full bg-zinc-100 dark:bg-zinc-800">
                <div
                  className="h-3 rounded-full bg-rose-300 dark:bg-white"
                  style={{ width: `${widthPercent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}