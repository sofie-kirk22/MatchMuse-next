"use client";

import { useEffect, useState } from "react";

type GenerateResponse =
  | { imageUrl: string; attributes?: unknown }
  | { error: string };

type HistoryItem = {
  filename: string;
  url: string;
  uploadedAt: string;
};

type HistoryResponse =
  | {
      items: HistoryItem[];
      nextCursor: string | null;
    }
  | {
      error: string;
    };

export default function OutfitGenerator() {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [showHistory, setShowHistory] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  async function loadHistory(reset = false) {
    setHistoryLoading(true);
    setHistoryError(null);

    try {
      const cursorToUse = reset ? null : nextCursor;
      const url = cursorToUse
        ? `/api/generated?cursor=${encodeURIComponent(cursorToUse)}`
        : "/api/generated";

      const res = await fetch(url, { method: "GET" });
      const data: HistoryResponse = await res.json();

      if (!res.ok || "error" in data) {
        setHistoryError(
          "error" in data ? data.error : "Failed to load history"
        );
        return;
      }

      setHistory((prev) => (reset ? data.items : [...prev, ...data.items]));
      setNextCursor(data.nextCursor);
    } catch {
      setHistoryError("Network error while loading history.");
    } finally {
      setHistoryLoading(false);
    }
  }

  async function handleGenerate() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/outfit/generate", { method: "GET" });
      const data: GenerateResponse = await res.json();

      if (!res.ok) {
        setError("error" in data ? data.error : "Failed to generate outfit");
        return;
      }

      if ("imageUrl" in data && data.imageUrl) {
        setImageUrl(data.imageUrl);

        if ("attributes" in data) {
          console.log("Attributes used:", data.attributes);
        }

        if (showHistory) {
          setHistory([]);
          setNextCursor(null);
          await loadHistory(true);
        }
      } else {
        setError("No image returned.");
      }
    } catch {
      setError("Network error while generating outfit.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (showHistory) {
      setHistory([]);
      setNextCursor(null);
      loadHistory(true);
    }
  }, [showHistory]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleGenerate}
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
          onClick={() => setShowHistory((v) => !v)}
          className="
            rounded-full px-6 py-3 text-sm font-medium transition
            border border-zinc-300 hover:bg-rose-50
            dark:border-zinc-700 dark:hover:bg-zinc-800
          "
        >
          {showHistory ? "Hide history" : "Show history"}
        </button>
      </div>

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

      {showHistory && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Previously generated</h3>

            <button
              type="button"
              onClick={() => {
                setHistory([]);
                setNextCursor(null);
                loadHistory(true);
              }}
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
              onClick={() => loadHistory(false)}
              disabled={historyLoading}
              className="
                rounded-full px-5 py-2 text-sm font-medium transition
                border border-zinc-300 hover:bg-rose-50
                dark:border-zinc-700 dark:hover:bg-zinc-800
                disabled:opacity-50
              "
            >
              {historyLoading ? "Loading..." : "Load more"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}