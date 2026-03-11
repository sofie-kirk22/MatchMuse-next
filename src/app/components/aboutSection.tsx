import ReadMore from "./readMore";

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-rose-200 dark:bg-black">
      <div className="mx-auto max-w-3xl px-6 space-y-6">
        <h2 className="text-3xl font-semibold">About MatchMuse</h2>

        <ReadMore maxHeight={200}>
          <div className="space-y-4 text-zinc-600 dark:text-zinc-400 leading-relaxed">
            <p>
              At MatchMuse, we believe that your closet should feel less like chaos
              and more like a curated gallery of self-expression. Founded with the
              vision of simplifying personal style, MatchMuse uses machine learning
              to help you match and combine outfits based on color harmony,
              contrast theory, and personal preference.
            </p>

            <p>
              What started as a small side project between a data scientist and a
              fashion enthusiast has grown into a tool that empowers people to
              rediscover the potential of the clothes they already own. Our mission
              is to take the guesswork out of getting dressed.
            </p>

            <p>
              Using your existing wardrobe, MatchMuse analyzes color palettes,
              fabric textures, and seasonal combinations to generate outfit
              pairings that align with your aesthetic. Whether you're dressing for
              brunch, a presentation, or everyday errands, our AI helps you find
              combinations that work.
            </p>

            <p>
              We’re also committed to sustainable fashion. By helping users make
              better use of what they already own, we reduce the temptation to
              overconsume and encourage mindful fashion choices.
            </p>

            <p>
              MatchMuse is powered by a color engine trained on stylist pairings,
              art theory models, and contemporary fashion trends. The interface is
              designed to be clean and inspiring, with simple tools for exploring
              outfit ideas.
            </p>

            <p>
              Fashion isn’t about following trends — it’s about discovering what
              makes you feel most like yourself. MatchMuse amplifies your own style
              by revealing combinations you may not have noticed before.
            </p>

            <p>
              Thank you for being part of the MatchMuse journey.
            </p>
          </div>
        </ReadMore>
      </div>
    </section>
  );
}