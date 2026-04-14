import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const wearId = Number(id);

    if (!Number.isInteger(wearId)) {
      return NextResponse.json(
        { error: "Invalid wear log id." },
        { status: 400 }
      );
    }

    const rows = await sql<{ id: number }[]>`
      DELETE FROM garment_wears
      WHERE id = ${wearId}
      RETURNING id
    `;

    if (!rows.length) {
      return NextResponse.json(
        { error: "Wear log not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Wear log deleted successfully.",
    });
  } catch (e: any) {
    console.error("Failed to delete wear log:", e?.message || e);
    return NextResponse.json(
      { error: "Failed to delete wear log" },
      { status: 500 }
    );
  }
}