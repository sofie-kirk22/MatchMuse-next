"use client";

import { useEffect, useState } from "react";
import OutfitGeneratorActions from "./outfitGeneratorActions";
import OutfitPreview from "./outfitPreview";
import OutfitHistory from "./outfitHistory";

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

  function handleRefreshHistory() {
    setHistory([]);
    setNextCursor(null);
    loadHistory(true);
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
      <OutfitGeneratorActions
        loading={loading}
        showHistory={showHistory}
        onGenerate={handleGenerate}
        onToggleHistory={() => setShowHistory((v) => !v)}
      />

      <OutfitPreview imageUrl={imageUrl} error={error} />

      {showHistory && (
        <OutfitHistory
          history={history}
          historyLoading={historyLoading}
          historyError={historyError}
          nextCursor={nextCursor}
          onRefresh={handleRefreshHistory}
          onLoadMore={() => loadHistory(false)}
        />
      )}
    </div>
  );
}