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
      <OutfitGenerator />

      {/* FAQ SECTION */}
      <FAQSection />
    </>
  );
}