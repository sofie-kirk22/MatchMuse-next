import { NextResponse } from "next/server";
import sql from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ColorRow = {
  color: string;
  wear_count: string | number;
};

type GarmentUsageRow = {
  id: string | number;
  filename: string;
  image_url: string;
  alt: string | null;
  category: string;
  wear_count: string | number;
};

type TimeRow = {
  period: string;
  wear_count: string | number;
};

type StaleRow = {
  id: string | number;
  filename: string;
  image_url: string;
  alt: string | null;
  category: string;
  last_worn: string | null;
};

export async function GET() {
  try {
    const [
      mostWornColorsRows,
      leastWornGarmentsRows,
      neverWornGarmentsRows,
      usageByWeekRows,
      usageByMonthRows,
      staleGarmentsRows,
    ] = await Promise.all([
      sql<ColorRow[]>`
        SELECT
          color,
          COUNT(*) AS wear_count
        FROM garment_wears gw
        JOIN garments g ON g.id = gw.garment_id
        CROSS JOIN LATERAL unnest(g.colors) AS color
        GROUP BY color
        ORDER BY COUNT(*) DESC, color ASC
        LIMIT 10
      `,

      sql<GarmentUsageRow[]>`
        SELECT
          g.id,
          g.filename,
          g.image_url,
          g.alt,
          g.category,
          COUNT(gw.id) AS wear_count
        FROM garments g
        LEFT JOIN garment_wears gw ON gw.garment_id = g.id
        GROUP BY g.id, g.filename, g.image_url, g.alt, g.category
        HAVING COUNT(gw.id) > 0
        ORDER BY COUNT(gw.id) ASC, g.filename ASC
        LIMIT 10
      `,

      sql<GarmentUsageRow[]>`
        SELECT
          g.id,
          g.filename,
          g.image_url,
          g.alt,
          g.category,
          0 AS wear_count
        FROM garments g
        LEFT JOIN garment_wears gw ON gw.garment_id = g.id
        WHERE gw.id IS NULL
        ORDER BY g.created_at DESC
        LIMIT 20
      `,

      sql<TimeRow[]>`
        SELECT
          date_trunc('week', worn_on)::date::text AS period,
          COUNT(*) AS wear_count
        FROM garment_wears
        GROUP BY date_trunc('week', worn_on)
        ORDER BY date_trunc('week', worn_on) ASC
      `,

      sql<TimeRow[]>`
        SELECT
          date_trunc('month', worn_on)::date::text AS period,
          COUNT(*) AS wear_count
        FROM garment_wears
        GROUP BY date_trunc('month', worn_on)
        ORDER BY date_trunc('month', worn_on) ASC
      `,

      sql<StaleRow[]>`
        SELECT
          g.id,
          g.filename,
          g.image_url,
          g.alt,
          g.category,
          MAX(gw.worn_on)::text AS last_worn
        FROM garments g
        LEFT JOIN garment_wears gw ON gw.garment_id = g.id
        GROUP BY g.id, g.filename, g.image_url, g.alt, g.category
        HAVING MAX(gw.worn_on) IS NULL
           OR MAX(gw.worn_on) < CURRENT_DATE - INTERVAL '30 days'
        ORDER BY MAX(gw.worn_on) ASC NULLS FIRST, g.filename ASC
        LIMIT 20
      `,
    ]);

    return NextResponse.json({
      mostWornColors: mostWornColorsRows.map((row) => ({
        color: row.color,
        wearCount: Number(row.wear_count),
      })),

      leastWornGarments: leastWornGarmentsRows.map((row) => ({
        id: Number(row.id),
        filename: row.filename,
        url: row.image_url,
        alt: row.alt,
        category: row.category,
        wearCount: Number(row.wear_count),
      })),

      neverWornGarments: neverWornGarmentsRows.map((row) => ({
        id: Number(row.id),
        filename: row.filename,
        url: row.image_url,
        alt: row.alt,
        category: row.category,
        wearCount: 0,
      })),

      usageByWeek: usageByWeekRows.map((row) => ({
        period: row.period,
        wearCount: Number(row.wear_count),
      })),

      usageByMonth: usageByMonthRows.map((row) => ({
        period: row.period,
        wearCount: Number(row.wear_count),
      })),

      staleGarments: staleGarmentsRows.map((row) => ({
        id: Number(row.id),
        filename: row.filename,
        url: row.image_url,
        alt: row.alt,
        category: row.category,
        lastWorn: row.last_worn,
      })),
    });
  } catch (e: any) {
    console.error("Failed to load statistics summary:", e?.message || e);
    return NextResponse.json(
      { error: "Failed to load statistics summary" },
      { status: 500 }
    );
  }
}