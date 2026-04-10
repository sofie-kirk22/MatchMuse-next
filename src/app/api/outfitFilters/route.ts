import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
import { OutfitFilters } from "@/types/outfitFilters";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type GarmentRow = {
  colors: string[];
  styles: string[];
  materials: string[];
};

function normalizeFilters(filters: OutfitFilters) {
  return {
    colors: Array.isArray(filters.colors) ? filters.colors : [],
    styles: Array.isArray(filters.styles) ? filters.styles : [],
    materials: Array.isArray(filters.materials) ? filters.materials : [],
  };
}

function intersects(rowValues: string[] | null | undefined, selected: string[]) {
  if (!selected.length) return true;
  if (!rowValues?.length) return false;
  return selected.some((value) => rowValues.includes(value));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const rawFilters: OutfitFilters = body?.filters ?? {};
    const filters = normalizeFilters(rawFilters);

    const rows = await sql<GarmentRow[]>`
      SELECT colors, styles, materials
      FROM garments
    `;

    const matchingRows = rows.filter((row) => {
      return (
        intersects(row.colors, filters.colors) &&
        intersects(row.styles, filters.styles) &&
        intersects(row.materials, filters.materials)
      );
    });

    const colors = Array.from(
      new Set(matchingRows.flatMap((row) => row.colors ?? []))
    ).sort();

    const styles = Array.from(
      new Set(matchingRows.flatMap((row) => row.styles ?? []))
    ).sort();

    const materials = Array.from(
      new Set(matchingRows.flatMap((row) => row.materials ?? []))
    ).sort();

    return NextResponse.json({
      colors,
      styles,
      materials,
    });
  } catch (e: any) {
    console.error("Failed to load filtered options:", e?.message || e);
    return NextResponse.json(
      { error: "Failed to load filter options" },
      { status: 500 }
    );
  }
}