"use client";

import { useEffect, useRef, useState } from "react";

type Category = "tops" | "bottoms" | "shoes" | "accessories" | "outerwear";

type ClosetItem = {
  filename: string;
  url: string;
  uploadedAt: string;
};

const categories: { key: Category; label: string }[] = [
  { key: "tops", label: "Tops" },
  { key: "bottoms", label: "Bottoms" },
  { key: "shoes", label: "Shoes" },
  { key: "accessories", label: "Accessories" },
  { key: "outerwear", label: "Outerwear" },
];

export default function ClosetManager() {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      {categories.map((category) => (
        <ClosetCategoryCard
          key={category.key}
          category={category.key}
          label={category.label}
        />
      ))}
    </div>
  );
}

function ClosetCategoryCard({
  category,
  label,
}: {
  category: Category;
  label: string;
}) {
  const [items, setItems] = useState<ClosetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  async function loadItems() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/closet/${category}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Failed to load items");
        return;
      }

      setItems(Array.isArray(data) ? data : []);
    } catch {
      setError("Network error while loading items.");
    } finally {
      setLoading(false);
    }
  }

  async function handleFilesSelected(files: FileList | null) {
    if (!files?.length) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      for (const file of Array.from(files)) {
        formData.append("images", file);
      }

      const res = await fetch(`/api/closet/${category}`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Upload failed");
        return;
      }

      await loadItems();

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    } catch {
      setError("Network error while uploading.");
    } finally {
      setUploading(false);
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-md dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-xl font-medium">{label}</h2>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="
              rounded-full px-4 py-2 text-sm font-medium transition
              bg-rose-200 text-black hover:bg-rose-300 disabled:opacity-60
            "
          >
            {uploading ? "Uploading..." : `Upload ${label}`}
          </button>

          <button
            type="button"
            onClick={loadItems}
            disabled={loading}
            className="
              rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium transition
              hover:bg-rose-50 dark:border-zinc-700 dark:hover:bg-zinc-800
            "
          >
            Refresh
          </button>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        multiple
        hidden
        onChange={(e) => handleFilesSelected(e.target.files)}
      />

      {error && (
        <p className="mb-4 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {loading ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          No items uploaded yet.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {items.map((item) => (
            <a
              key={item.url}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800"
              title={item.filename}
            >
              <img
                src={item.url}
                alt={item.filename}
                className="h-32 w-full object-cover transition duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}