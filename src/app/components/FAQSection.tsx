import FAQAccordion from "./FAQAccordion";

const faqItems = [
  {
    question: "What is MatchMuse?",
    answer:
      "MatchMuse is a smart styling assistant that helps you create outfits from clothes you already own. It uses machine learning to analyze colors, styles, and combinations and gives you daily suggestions based on your closet.",
  },
  {
    question: "How does the color matching work?",
    answer:
      "Our AI uses a color harmony engine inspired by art and fashion theory. It detects dominant hues, temperature, and contrast from your clothing photos and recommends combinations that work well.",
  },
  {
    question: "Do I have to take pictures of all my clothes?",
    answer:
      "You can. Just snap a quick photo of each item and MatchMuse will automatically detect the color and category and suggest matches. The more items you add, the smarter your recommendations become.",
  },
  {
    question: "Is my data safe?",
    answer:
      "Yes. Your photos and closet data are securely stored and never shared. We only use your data to provide personalized suggestions.",
  },
];

export default function FAQSection() {
  return (
    <section id="faq" className="py-20 bg-rose-100 dark:bg-black">
      <div className="mx-auto max-w-3xl px-6 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-semibold">FAQs</h2>
        </div>

        <FAQAccordion items={faqItems} />
      </div>
    </section>
  );
}