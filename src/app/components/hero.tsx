"use client";

import Image from "next/image";

export default function Hero() {
    return (
        <section
            id="home"
            className="relative overflow-hidden bg-rose-100 dark:bg-black pt-24 pb-16"
        >
            {/* subtle gradient glow */}
            <div className="
                absolute inset-0 pointer-events-none
                bg-gradient-to-b
                from-rose-300/70 to-transparent
                dark:from-zinc-800 dark:to-black
            "
            />

            <div className="relative mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-2 md:items-center">
                {/* TEXT */}
                <div className="space-y-6">
                    <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
                        Design Your Outfits Using <br />
                        <span className="text-rose-400">
                            Machine Learning Software
                        </span>
                    </h1>

                    <p className="text-zinc-600 dark:text-zinc-400 max-w-md">
                        MatchMuse analyzes color, style, and context to build outfits
                        from the clothes you already own.
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <a
                            href="/closet"
                            className="
                rounded-full px-6 py-3 text-sm font-medium transition
                bg-rose-200 text-black hover:bg-rose-300
                dark:bg-white dark:text-black dark:hover:bg-zinc-200
              "
                        >
                            Start Designing
                        </a>

                        <a
                            href="#generate"
                            className="
                rounded-full px-6 py-3 text-sm font-medium transition
                border border-zinc-300 hover:bg-rose-50
                dark:border-zinc-700 dark:hover:bg-zinc-800
              "
                        >
                            Try Demo
                        </a>
                    </div>
                </div>

                {/* IMAGE */}
                <div className="relative">
                    <Image
                        src="/images/HeroImage.png"
                        alt="Closet outfit matching illustration"
                        width={500}
                        height={500}
                        className="w-full h-auto rounded-3xl"
                        priority
                    />
                </div>
            </div>
        </section>
    );
}