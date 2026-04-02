type OutfitGeneratorActionsProps = {
    loading: boolean;
    showHistory: boolean;
    onGenerate: () => void;
    onToggleHistory: () => void;
};

export default function OutfitGeneratorActions({
    loading,
    showHistory,
    onGenerate,
    onToggleHistory,
}: OutfitGeneratorActionsProps) {
    return (
        <div className="flex flex-wrap gap-3">
            <button
                type="button"
                onClick={onGenerate}
                disabled={loading}
                className="
                    rounded-full px-6 py-3 text-sm font-medium transition
                    bg-rose-200 text-black hover:bg-rose-300 disabled:opacity-60
                    dark:bg-white dark:text-black dark:hover:bg-zinc-200
                "
            >
                {loading ? "Generating..." : "Generate outfit"}
            </button>

            <button
                type="button"
                onClick={onToggleHistory}
                className="
                    rounded-full px-6 py-3 text-sm font-medium transition
                    border border-zinc-300 hover:bg-rose-50
                    dark:border-zinc-700 dark:hover:bg-zinc-800
                "
            >
                {showHistory ? "Hide history" : "Show history"}
            </button>
        </div>
    );
}