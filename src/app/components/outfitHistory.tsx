type HistoryItem = {
    filename: string;
    url: string;
    uploadedAt: string;
};

type OutfitHistoryProps = {
    history: HistoryItem[];
    historyLoading: boolean;
    historyError: string | null;
    nextCursor: string | null;
    onRefresh: () => void;
    onLoadMore: () => void;
};

export default function OutfitHistory({
    history,
    historyLoading,
    historyError,
    nextCursor,
    onRefresh,
    onLoadMore,
}: OutfitHistoryProps) {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Previously generated</h3>

                <button
                    type="button"
                    onClick={onRefresh}
                    disabled={historyLoading}
                    className="text-sm underline hover:opacity-70 transition disabled:opacity-50"
                >
                    {historyLoading ? "Refreshing..." : "Refresh"}
                </button>
            </div>

            {historyError && (
                <p className="text-sm text-red-600 dark:text-red-400">
                    {historyError}
                </p>
            )}

            {!historyLoading && history.length === 0 && !historyError && (
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    No generated outfits yet.
                </p>
            )}

            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {history.map((item) => (
                    <a
                        key={item.url}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800"
                        title={item.filename}
                    >
                        <img
                            src={item.url}
                            alt={item.filename}
                            className="h-40 w-full object-cover transition duration-500 group-hover:scale-105"
                            loading="lazy"
                        />
                        <div className="px-3 py-2 text-xs text-zinc-600 dark:text-zinc-400">
                            {new Date(item.uploadedAt).toLocaleDateString()}
                        </div>
                    </a>
                ))}
            </div>

            {nextCursor && (
                <button
                    type="button"
                    onClick={onLoadMore}
                    disabled={historyLoading}
                    className="
                        rounded-full px-5 py-2 text-sm font-medium transition
                        border border-zinc-300 bg-rose-100/75 hover:bg-rose-50
                        dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800
                        disabled:opacity-50
                    "
                >
                    {historyLoading ? "Loading..." : "Load more"}
                </button>
            )}
        </div>
    );
}