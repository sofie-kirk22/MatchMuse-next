"use client";

import { useEffect, useState } from "react";
import UsageTopCard from "./usageTopCard";
import UsageChart from "./usageChart";

type UsageItem = {
  garmentId: number;
  filename: string;
  url: string;
  alt: string | null;
  wearCount: number;
};

type CategoryUsage = {
  topThree: UsageItem[];
  topTen: UsageItem[];
};

type StatisticsResponse =
  | {
      tops: CategoryUsage;
      bottoms: CategoryUsage;
      shoes: CategoryUsage;
      accessories: CategoryUsage;
      outerwear: CategoryUsage;
    }
  | {
      error: string;
    };

const categoryLabels = {
  tops: "Tops",
  bottoms: "Bottoms",
  shoes: "Shoes",
  accessories: "Accessories",
  outerwear: "Outerwear",
} as const;

export default function UsageInsights() {
  const [data, setData] = useState<StatisticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadStatistics() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/statistics");
      const json: StatisticsResponse = await res.json();

      if (!res.ok || "error" in json) {
        setError("error" in json ? json.error : "Failed to load statistics");
        return;
      }

      setData(json);
    } catch {
      setError("Network error while loading statistics.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStatistics();
  }, []);

  if (loading) {
    return (
      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-md dark:border-zinc-800 dark:bg-zinc-950">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Loading usage insights...
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-md dark:border-zinc-800 dark:bg-zinc-950">
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      </section>
    );
  }

  if (!data || "error" in data) {
    return null;
  }

  const categories = Object.entries(categoryLabels).map(([key, label]) => ({
    key: key as keyof typeof categoryLabels,
    label,
    usage: data[key as keyof typeof categoryLabels],
  }));

  return (
    <section className="space-y-10">
      {categories.map(({ key, label, usage }) => (
        <div
          key={key}
          className="space-y-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-md dark:border-zinc-800 dark:bg-zinc-950"
        >
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold">{label}</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Your most worn {label.toLowerCase()}.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Top 3 most worn</h3>

            {usage.topThree.length === 0 ? (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                No usage data yet.
              </p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {usage.topThree.map((item) => (
                  <UsageTopCard key={item.garmentId} item={item} />
                ))}
              </div>
            )}
          </div>

          <UsageChart
            title="Top 10 usage"
            items={usage.topTen}
          />
        </div>
      ))}
    </section>
  );
}