import { NextResponse } from "next/server";
import { list } from "@vercel/blob";

export const runtime = "nodejs";

export async function GET() {
  try {
    const { blobs } = await list({ prefix: "outfits/" });

    const items = blobs
      .slice()
      .sort(
        (a, b) =>
          new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      )
      .map((b) => ({
        filename: b.pathname.replace("outfits/", ""),
        url: b.url,
        uploadedAt: b.uploadedAt,
      }));

    return NextResponse.json(items);
  } catch (e: any) {
    console.error("Failed to list generated images:", e?.message || e);
    return NextResponse.json(
      { error: "Could not list generated images" },
      { status: 500 }
    );
  }
}