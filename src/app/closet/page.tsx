import ClosetManager from "../components/closetManager";

export default function ClosetPage() {
  return (
    <main className="min-h-screen bg-rose-50 dark:bg-black py-20">
      <div className="mx-auto max-w-6xl px-6 space-y-8">
        <h1 className="text-4xl font-semibold">Your Closet</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Upload clothing items to build your wardrobe for MatchMuse.
        </p>

        <ClosetManager />
      </div>
    </main>
  );
}