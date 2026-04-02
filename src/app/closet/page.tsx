import ClosetManager from "../components/closetManager";
import TopNav from "../components/topNav";
import OutfitGenerator from "../components/outfitGenerator";

export default function ClosetPage() {
    return (
        <>
            <TopNav />
            <main className="min-h-screen bg-rose-100 dark:bg-black py-20">
                
                <div className="mx-auto max-w-6xl px-6 space-y-8">
                    <h1 id="closet" className="text-4xl font-semibold">Your Closet</h1>
                    <p className="text-zinc-600 dark:text-zinc-400">
                        Upload clothing items to build your wardrobe for MatchMuse.
                    </p>

                    <ClosetManager />
                </div>
                <section id="generate_closet" className="py-20 bg-rose-100 dark:bg-black">
                    <div className="mx-auto max-w-3xl px-6 space-y-6">
                        <h2 className="text-3xl font-semibold">Generate Your Next Outfit</h2>
                        <p className="text-zinc-600 dark:text-zinc-400">
                            Generate an outfit from the uploaded wardrobe items and browse previous results.
                        </p>
                        <OutfitGenerator />
                    </div>
                </section>
            </main>
        </>
    );
}