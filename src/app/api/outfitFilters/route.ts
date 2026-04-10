import { NextResponse } from "next/server";
import sql from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [colorsRows, stylesRows, materialsRows] = await Promise.all([
      sql<{ value: string }[]>`
        SELECT DISTINCT unnest(colors) AS value
        FROM garments
        WHERE colors IS NOT NULL
        ORDER BY value ASC
      `,
      sql<{ value: string }[]>`
        SELECT DISTINCT unnest(styles) AS value
        FROM garments
        WHERE styles IS NOT NULL
        ORDER BY value ASC
      `,
      sql<{ value: string }[]>`
        SELECT DISTINCT unnest(materials) AS value
        FROM garments
        WHERE materials IS NOT NULL
        ORDER BY value ASC
      `,
    ]);

    return NextResponse.json({
      colors: colorsRows.map((row) => row.value),
      styles: stylesRows.map((row) => row.value),
      materials: materialsRows.map((row) => row.value),
    });
  } catch (e: any) {
    console.error("Failed to load outfit filters:", e?.message || e);

    return NextResponse.json(
      { error: "Failed to load filter options" },
      { status: 500 }
    );
  }
}