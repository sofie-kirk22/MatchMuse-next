import TopNav from "../components/topNav";
import LogOutfitForm from "../components/logOutfitForm";

export default function MyStatisticsPage() {
  return (
    <>
      <TopNav />
      <main className="min-h-screen bg-rose-50 py-20 dark:bg-black">
        <div className="mx-auto max-w-6xl space-y-10 px-6">
          <section className="space-y-3">
            <h1 id="statistics" className="text-4xl font-semibold">My Statistics</h1>
            <p className="max-w-2xl text-zinc-600 dark:text-zinc-400">
              Track what you wear and build insight into your wardrobe usage over
              time.
            </p>
          </section>

          <LogOutfitForm />

          <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-md dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="text-2xl font-semibold">Usage insights</h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              This section can later show your top 3 most worn garments in each
              category and charts for your most used items.
            </p>
          </section>
        </div>
      </main>
    </>
  );
}