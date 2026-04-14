import { NextResponse } from "next/server";
import sql from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CATEGORIES = [
    "tops",
    "bottoms",
    "shoes",
    "accessories",
    "outerwear",
] as const;

type Category = (typeof CATEGORIES)[number];

type UsageRow = {
    garment_id: string | number;
    filename: string;
    image_url: string;
    alt: string | null;
    wear_count: string | number;
};

async function getCategoryUsage(category: Category) {
    const rows = await sql<UsageRow[]>`
    SELECT
      g.id AS garment_id,
      g.filename,
      g.image_url,
      g.alt,
      COUNT(*) AS wear_count
    FROM garment_wears gw
    JOIN garments g ON g.id = gw.garment_id
    WHERE g.category = ${category}
    GROUP BY g.id, g.filename, g.image_url, g.alt
    ORDER BY COUNT(*) DESC, g.filename ASC
    LIMIT 10
  `;

    const normalized = rows.map((row) => ({
        garmentId: Number(row.garment_id),
        filename: row.filename,
        url: row.image_url,
        alt: row.alt,
        wearCount: Number(row.wear_count),
    }));

    return {
        topThree: normalized.slice(0, 3),
        topTen: normalized,
    };
}

export async function GET() {
    try {
        const results = await Promise.all(
            CATEGORIES.map(async (category) => {
                const usage = await getCategoryUsage(category);
                return [category, usage] as const;
            })
        );

        const data = Object.fromEntries(results);

        return NextResponse.json(data);
    } catch (e: any) {
        console.error("Failed to load statistics:", e?.message || e);
        return NextResponse.json(
            { error: "Failed to load statistics" },
            { status: 500 }
        );
    }
}