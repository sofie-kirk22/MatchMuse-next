type ColorInsight = {
  color: string;
  wearCount: number;
};

type StatisticsColorListProps = {
  title: string;
  items: ColorInsight[];
};

export default function StatisticsColorList({
  title,
  items,
}: StatisticsColorListProps) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-md dark:border-zinc-800 dark:bg-zinc-950">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          The colors that appear most often in your logged outfits.
        </p>
      </div>

      {items.length === 0 ? (
        <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
          No color usage data yet.
        </p>
      ) : (
        <div className="mt-5 flex flex-wrap gap-3">
          {items.map((item) => (
            <div
              key={item.color}
              className="rounded-full border border-zinc-200 bg-rose-100/75 px-4 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <span className="font-medium">{item.color}</span>
              <span className="ml-2 text-zinc-500 dark:text-zinc-400">
                {item.wearCount}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}