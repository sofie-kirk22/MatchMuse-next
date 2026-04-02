import TopNav from "./components/topNav";
import FAQSection from "./components/FAQSection";
import AboutSection from "./components/aboutSection";
import OutfitGenerator from "./components/outfitGenerator";
import Hero from "./components/hero";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <TopNav />
      <main className="mt-12">
        {/* HERO */}
        <Hero />

        {/* ABOUT SECTION */}
        <AboutSection />

        {/* OUTFIT GENERATOR */}
        <section id="generate" className="py-20 bg-rose-100 dark:bg-black">
          <div className="mx-auto max-w-3xl px-6 space-y-6">
            <h2 className="text-3xl font-semibold">Try MatchMuse</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              Generate an outfit from the uploaded wardrobe items and browse previous results.
            </p>

            <OutfitGenerator />
            <Link
              href="/closet"
              className="
              rounded-full px-6 py-3 text-sm font-medium transition
              border border-zinc-300 hover:bg-rose-50
              dark:border-zinc-700 dark:hover:bg-zinc-800
            "
            >
              Go to your closet
            </Link>
          </div>
        </section>

        {/* FAQ SECTION */}
        <FAQSection />
      </main>
    </>
  );
}