"use client";

import { useEffect, useState } from "react";
import StatisticsColorList from "./statisticsColorList";
import StatisticsGarmentGrid from "./statisticsGarmentGrid";
import StatisticsTimeChart from "./statisticsTimeChart";

type ColorInsight = {
  color: string;
  wearCount: number;
};

type GarmentInsight = {
  id: number;
  filename: string;
  url: string;
  alt: string | null;
  category: string;
  wearCount?: number;
  lastWorn?: string | null;
};

type TimeInsight = {
  period: string;
  wearCount: number;
};

type StatisticsSummaryResponse =
  | {
      mostWornColors: ColorInsight[];
      leastWornGarments: GarmentInsight[];
      neverWornGarments: GarmentInsight[];
      usageByWeek: TimeInsight[];
      usageByMonth: TimeInsight[];
      staleGarments: GarmentInsight[];
    }
  | {
      error: string;
    };

export default function StatisticsSummary() {
  const [data, setData] = useState<StatisticsSummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadSummary() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/statistics/summary");
      const json: StatisticsSummaryResponse = await res.json();

      if (!res.ok || "error" in json) {
        setError("error" in json ? json.error : "Failed to load summary");
        return;
      }

      setData(json);
    } catch {
      setError("Network error while loading statistics summary.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSummary();
  }, []);

  if (loading) {
    return (
      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-md dark:border-zinc-800 dark:bg-zinc-950">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Loading statistics summary...
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

  if (!data || "error" in data) return null;

  return (
    <section className="space-y-8">
      <StatisticsColorList
        title="Most worn colors"
        items={data.mostWornColors}
      />

      <StatisticsGarmentGrid
        title="Least worn garments"
        description="Garments you have worn, but only rarely."
        items={data.leastWornGarments}
        metaType="wearCount"
      />

      <StatisticsGarmentGrid
        title="Never worn garments"
        description="Pieces in your closet that have not been logged yet."
        items={data.neverWornGarments}
        metaType="category"
      />

      <StatisticsGarmentGrid
        title="You haven’t worn this in 30 days"
        description="Garments that may be worth revisiting."
        items={data.staleGarments}
        metaType="lastWorn"
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <StatisticsTimeChart
          title="Usage by week"
          items={data.usageByWeek}
        />

        <StatisticsTimeChart
          title="Usage by month"
          items={data.usageByMonth}
        />
      </div>
    </section>
  );
}