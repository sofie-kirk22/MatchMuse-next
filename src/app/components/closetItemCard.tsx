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

type ClosetItemCardProps = {
  item: ClosetItem;
  onDelete: (itemUrl: string) => void;
};

export default function ClosetItemCard({
  item,
  onDelete,
}: ClosetItemCardProps) {
  return (
    <div
      className="group overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800"
      title={item.filename}
    >
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <img
          src={item.url}
          alt={item.alt || item.filename}
          className="h-32 w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </a>

      <div className="flex items-center justify-between gap-2 px-3 py-2">
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium underline transition hover:opacity-70"
        >
          View →
        </a>

        <button
          type="button"
          onClick={() => onDelete(item.url)}
          className="
            rounded-full border border-red-200 px-3 py-1 text-xs font-medium text-red-600 transition
            hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/30
          "
        >
          Delete
        </button>
      </div>
    </div>
  );
}