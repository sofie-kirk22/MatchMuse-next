type TimeInsight = {
  period: string;
  wearCount: number;
};

type StatisticsTimeChartProps = {
  title: string;
  items: TimeInsight[];
};

export default function StatisticsTimeChart({
  title,
  items,
}: StatisticsTimeChartProps) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-md dark:border-zinc-800 dark:bg-zinc-950">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          How often you log garments over time.
        </p>
      </div>

      {items.length === 0 ? (
        <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
          No time-based usage data yet.
        </p>
      ) : (
        <div className="mt-5 space-y-3">
          {items.map((item) => (
            <ChartRow key={item.period} item={item} max={getMax(items)} />
          ))}
        </div>
      )}
    </section>
  );
}

function ChartRow({
  item,
  max,
}: {
  item: TimeInsight;
  max: number;
}) {
  const widthPercent = max > 0 ? (item.wearCount / max) * 100 : 0;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between gap-4 text-sm">
        <span>{formatPeriod(item.period)}</span>
        <span className="text-zinc-500 dark:text-zinc-400">
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
}

function getMax(items: TimeInsight[]) {
  return Math.max(...items.map((item) => item.wearCount), 1);
}

function formatPeriod(period: string) {
  const date = new Date(period);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}