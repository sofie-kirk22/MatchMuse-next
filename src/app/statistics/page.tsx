import TopNav from "../components/topNav";
import LogOutfitForm from "../components/logOutfitForm";
import UsageInsights from "../components/usageInsights";
import StatisticsSummary from "../components/statisticsSummary";

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

          <UsageInsights />
          <StatisticsSummary />
        </div>
      </main>
    </>
  );
}