import TopNav from "./components/topNav";
import FAQSection from "./components/FAQSection";
import AboutSection from "./components/aboutSection";
import OutfitGenerator from "./components/outfitGenerator";

export default function Page() {
  return (
    <>
      <TopNav />

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
        </div>
      </section>

      {/* FAQ SECTION */}
      <FAQSection />
    </>
  );
}