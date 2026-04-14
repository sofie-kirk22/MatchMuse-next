"use client";

import { useEffect, useMemo, useState } from "react";

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

        if (
            selectedTop == null ||
            selectedBottom == null ||
            selectedShoes == null
        ) {
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
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-md dark:border-zinc-800 dark:bg-zinc-950">
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-2xl font-semibold">Log your outfit</h2>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        Choose the pieces you wore to track wardrobe usage over time.
                    </p>
                </div>

                <div className="space-y-2">
                    <label htmlFor="wornOn" className="block text-sm font-medium">
                        Date worn
                    </label>
                    <input
                        id="wornOn"
                        type="date"
                        value={wornOn}
                        onChange={(e) => setWornOn(e.target.value)}
                        className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                    />
                </div>
            </div>

            {error && (
                <p className="mb-4 text-sm text-red-600 dark:text-red-400">{error}</p>
            )}

            {success && (
                <p className="mb-4 text-sm text-green-600 dark:text-green-400">
                    {success}
                </p>
            )}

            {loading ? (
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Loading garments...
                </p>
            ) : (
                <div className="space-y-8">
                    <PickerSection
                        title="Top"
                        items={tops}
                        selectedId={selectedTop}
                        onSelectSingle={setSelectedTop}
                    />

                    <PickerSection
                        title="Bottom"
                        items={bottoms}
                        selectedId={selectedBottom}
                        onSelectSingle={setSelectedBottom}
                    />

                    <PickerSection
                        title="Shoes"
                        items={shoes}
                        selectedId={selectedShoes}
                        onSelectSingle={setSelectedShoes}
                    />

                    <PickerSection
                        title="Outerwear (optional)"
                        items={outerwear}
                        selectedId={selectedOuterwear}
                        onSelectSingle={setSelectedOuterwear}
                    />

                    <PickerSection
                        title="Accessories (optional)"
                        items={accessories}
                        multiple
                        selectedIds={selectedAccessories}
                        onToggleMulti={(id) =>
                            setSelectedAccessories((prev) => toggleMulti(prev, id))
                        }
                    />
                </div>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
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
        </section>
    );
}

function PickerSection({
    title,
    items,
    selectedId,
    selectedIds = [],
    multiple = false,
    onSelectSingle,
    onToggleMulti,
}: {
    title: string;
    items: GarmentItem[];
    selectedId?: number | null;
    selectedIds?: number[];
    multiple?: boolean;
    onSelectSingle?: (id: number | null) => void;
    onToggleMulti?: (id: number) => void;
}) {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
                <h3 className="text-xl font-medium">{title}</h3>
                {multiple ? (
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                        {selectedIds.length} selected
                    </span>
                ) : (
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                        {selectedId != null ? "1 selected" : "None selected"}
                    </span>
                )}
            </div>

            {items.length === 0 ? (
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    No garments available in this category yet.
                </p>
            ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
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
                                className={`group overflow-hidden rounded-xl border text-left transition ${active
                                        ? "border-rose-300 ring-2 ring-rose-200 dark:border-white dark:ring-white/30"
                                        : "border-zinc-200 dark:border-zinc-800"
                                    }`}
                                title={item.filename}
                            >
                                <img
                                    src={item.url}
                                    alt={item.alt || item.filename}
                                    className="h-32 w-full object-cover transition duration-500 group-hover:scale-105"
                                    loading="lazy"
                                />

                                <div className="flex items-center justify-between gap-2 px-3 py-2">
                                    <span className="line-clamp-2 text-xs font-medium">
                                        {item.alt || item.filename}
                                    </span>

                                    {active && (
                                        <span className="shrink-0 rounded-full bg-rose-200 px-2 py-1 text-[10px] font-medium text-black dark:bg-white">
                                            Selected
                                        </span>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}