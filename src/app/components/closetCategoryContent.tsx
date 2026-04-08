import ClosetItemCard from "./closetItemCard";

type ClosetItem = {
  id: number;
  filename: string;
  url: string;
  uploadedAt: string;
  alt: string | null;
  garmentType: string | null;
  colors: string[];
  styles: string[];
  materials: string[];
};

type ClosetCategoryContentProps = {
  loading: boolean;
  error: string | null;
  items: ClosetItem[];
  onDelete: (itemUrl: string) => void;
};

export default function ClosetCategoryContent({
  loading,
  error,
  items,
  onDelete,
}: ClosetCategoryContentProps) {
  if (error) {
    return (
      <p className="mb-4 text-sm text-red-600 dark:text-red-400">{error}</p>
    );
  }

  if (loading) {
    return (
      <p className="text-sm text-zinc-600 dark:text-zinc-400">Loading...</p>
    );
  }

  if (items.length === 0) {
    return (
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        No items uploaded yet.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {items.map((item) => (
        <ClosetItemCard key={item.url} item={item} onDelete={onDelete} />
      ))}
    </div>
  );
}