type ClosetCategoryActionsProps = {
  label: string;
  loading: boolean;
  uploading: boolean;
  onUploadClick: () => void;
  onRefresh: () => void;
};

export default function ClosetCategoryActions({
  label,
  loading,
  uploading,
  onUploadClick,
  onRefresh,
}: ClosetCategoryActionsProps) {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={onUploadClick}
        disabled={uploading}
        className="
          rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium transition
          bg-rose-200 text-black hover:bg-rose-300 disabled:opacity-60
          dark:bg-white dark:text-black dark:hover:bg-zinc-200
        "
      >
        {uploading ? "Uploading..." : `Upload ${label}`}
      </button>

      <button
        type="button"
        onClick={onRefresh}
        disabled={loading}
        className="
          rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium transition
          hover:bg-rose-50 dark:border-zinc-700 dark:hover:bg-zinc-800
        "
      >
        Refresh
      </button>
    </div>
  );
}