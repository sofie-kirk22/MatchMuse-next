"use client";

import { useEffect, useMemo, useState } from "react";
import GarmentPicker from "./garmentPicker";

type Category = "tops" | "bottoms" | "shoes" | "accessories" | "outerwear";

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

type WearLogResponse =
  | {
      message: string;
      items: {
        id: number;
        garment_id: number;
        worn_on: string;
        created_at: string;
      }[];
    }
  | {
      error: string;
      missingGarmentIds?: number[];
    };

const categories: { key: Category; label: string }[] = [
  { key: "tops", label: "Top" },
  { key: "bottoms", label: "Bottom" },
  { key: "shoes", label: "Shoes" },
  { key: "outerwear", label: "Outerwear" },
  { key: "accessories", label: "Accessories" },
];

function todayString() {
  return new Date().toISOString().split("T")[0];
}

function toggleMulti(values: number[], id: number) {
  return values.includes(id)
    ? values.filter((value) => value !== id)
    : [...values, id];
}

export default function LogOutfitForm() {
  const [wornOn, setWornOn] = useState(todayString());

  const [tops, setTops] = useState<GarmentItem[]>([]);
  const [bottoms, setBottoms] = useState<GarmentItem[]>([]);
  const [shoes, setShoes] = useState<GarmentItem[]>([]);
  const [outerwear, setOuterwear] = useState<GarmentItem[]>([]);
  const [accessories, setAccessories] = useState<GarmentItem[]>([]);

  const [selectedTop, setSelectedTop] = useState<number | null>(null);
  const [selectedBottom, setSelectedBottom] = useState<number | null>(null);
  const [selectedShoes, setSelectedShoes] = useState<number | null>(null);
  const [selectedOuterwear, setSelectedOuterwear] = useState<number | null>(null);
  const [selectedAccessories, setSelectedAccessories] = useState<number[]>([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function loadCategory(category: Category) {
    const res = await fetch(`/api/closet/${category}`);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.error || `Failed to load ${category}`);
    }

    return Array.isArray(data) ? data : [];
  }

  async function loadAllGarments() {
    setLoading(true);
    setError(null);

    try {
      const [topsData, bottomsData, shoesData, outerwearData, accessoriesData] =
        await Promise.all([
          loadCategory("tops"),
          loadCategory("bottoms"),
          loadCategory("shoes"),
          loadCategory("outerwear"),
          loadCategory("accessories"),
        ]);

      setTops(topsData);
      setBottoms(bottomsData);
      setShoes(shoesData);
      setOuterwear(outerwearData);
      setAccessories(accessoriesData);
    } catch (e: any) {
      setError(e?.message || "Failed to load garments.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAllGarments();
  }, []);

  const selectedGarmentIds = useMemo(() => {
    return [
      selectedTop,
      selectedBottom,
      selectedShoes,
      selectedOuterwear,
      ...selectedAccessories,
    ].filter((id): id is number => typeof id === "number");
  }, [
    selectedTop,
    selectedBottom,
    selectedShoes,
    selectedOuterwear,
    selectedAccessories,
  ]);

  async function handleSubmit() {
    setError(null);
    setSuccess(null);

    if (!selectedTop || !selectedBottom || !selectedShoes) {
      setError("Please choose a top, bottom, and pair of shoes.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/garmentWears", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wornOn,
          garmentIds: selectedGarmentIds,
        }),
      });

      const data: WearLogResponse = await res.json();

      if (!res.ok || "error" in data) {
        setError("error" in data ? data.error : "Failed to save outfit log.");
        return;
      }

      setSuccess(data.message);

      // optional reset:
      setSelectedTop(null);
      setSelectedBottom(null);
      setSelectedShoes(null);
      setSelectedOuterwear(null);
      setSelectedAccessories([]);
    } catch {
      setError("Network error while saving outfit log.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-md dark:border-zinc-800 dark:bg-zinc-950">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Log your outfit</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Pick the garments you wore on a given day to build usage statistics.
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="wornOn" className="text-sm font-medium">
          Date worn
        </label>
        <input
          id="wornOn"
          type="date"
          value={wornOn}
          onChange={(e) => setWornOn(e.target.value)}
          className="
            rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm
            dark:border-zinc-700 dark:bg-zinc-900
          "
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {success && (
        <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
      )}

      {loading ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Loading garments...
        </p>
      ) : (
        <div className="space-y-8">
          <GarmentPicker
            label="Top"
            items={tops}
            selectedId={selectedTop}
            onSelectSingle={setSelectedTop}
          />

          <GarmentPicker
            label="Bottom"
            items={bottoms}
            selectedId={selectedBottom}
            onSelectSingle={setSelectedBottom}
          />

          <GarmentPicker
            label="Shoes"
            items={shoes}
            selectedId={selectedShoes}
            onSelectSingle={setSelectedShoes}
          />

          <GarmentPicker
            label="Outerwear (optional)"
            items={outerwear}
            selectedId={selectedOuterwear}
            onSelectSingle={setSelectedOuterwear}
          />

          <GarmentPicker
            label="Accessories (optional)"
            items={accessories}
            multiple
            selectedIds={selectedAccessories}
            onToggleMulti={(id) =>
              setSelectedAccessories((prev) => toggleMulti(prev, id))
            }
          />
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting || loading}
          className="
            rounded-full px-6 py-3 text-sm font-medium transition
            bg-rose-200 text-black hover:bg-rose-300 disabled:opacity-60
            dark:bg-white dark:text-black dark:hover:bg-zinc-200
          "
        >
          {submitting ? "Saving..." : "Save outfit"}
        </button>

        <button
          type="button"
          onClick={loadAllGarments}
          disabled={loading}
          className="
            rounded-full border border-zinc-300 px-6 py-3 text-sm font-medium transition
            hover:bg-rose-50 dark:border-zinc-700 dark:hover:bg-zinc-800
          "
        >
          Refresh garments
        </button>
      </div>
    </div>
  );
}