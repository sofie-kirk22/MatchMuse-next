type OutfitPreviewProps = {
  imageUrl: string | null;
  error: string | null;
};

export default function OutfitPreview({
  imageUrl,
  error,
}: OutfitPreviewProps) {
  return (
    <>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {imageUrl && (
        <img
          src={imageUrl}
          alt="Generated outfit preview"
          className="w-full max-w-md rounded-2xl border border-zinc-200 dark:border-zinc-800"
        />
      )}
    </>
  );
}