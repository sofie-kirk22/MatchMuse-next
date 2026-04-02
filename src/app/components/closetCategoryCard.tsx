"use client";

import { useEffect, useRef, useState } from "react";
import ClosetCategoryActions from "./closetCategoryActions";
import ClosetCategoryContent from "./closetCategoryContent";

export type Category =
  | "tops"
  | "bottoms"
  | "shoes"
  | "accessories"
  | "outerwear";

type ClosetItem = {
  filename: string;
  url: string;
  uploadedAt: string;
};

type ClosetCategoryCardProps = {
  category: Category;
  label: string;
};

export default function ClosetCategoryCard({
  category,
  label,
}: ClosetCategoryCardProps) {
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

  async function handleDelete(itemUrl: string) {
    const confirmed = window.confirm("Delete this clothing item?");
    if (!confirmed) return;

    setError(null);

    try {
      const res = await fetch(`/api/closet/${category}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: itemUrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Delete failed");
        return;
      }

      setItems((prev) => prev.filter((item) => item.url !== itemUrl));
    } catch {
      setError("Network error while deleting.");
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-md dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-xl font-medium">{label}</h2>

        <ClosetCategoryActions
          label={label}
          loading={loading}
          uploading={uploading}
          onUploadClick={() => inputRef.current?.click()}
          onRefresh={loadItems}
        />
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        multiple
        hidden
        onChange={(e) => handleFilesSelected(e.target.files)}
      />

      <ClosetCategoryContent
        loading={loading}
        error={error}
        items={items}
        onDelete={handleDelete}
      />
    </div>
  );
}