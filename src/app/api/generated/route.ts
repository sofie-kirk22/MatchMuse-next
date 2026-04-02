import { NextRequest, NextResponse } from "next/server";
import { list } from "@vercel/blob";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;

    const { blobs, cursor: nextCursor, hasMore } = await list({
      prefix: "Generated_outfits/",
      limit: 7,
      cursor,
    });

    const imageBlobs = blobs.filter((b) =>
      /\.(png|jpe?g|webp)$/i.test(b.pathname)
    );

    const items = imageBlobs
      .slice()
      .sort(
        (a, b) =>
          new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      )
      .map((b) => ({
        filename: b.pathname.replace("Generated_outfits/", ""),
        url: b.url,
        uploadedAt: b.uploadedAt,
      }));

    return NextResponse.json({
      items,
      nextCursor: hasMore ? nextCursor : null,
    });
  } catch (e: any) {
    console.error("Failed to list generated images:", e?.message || e);
    return NextResponse.json(
      { error: "Could not list generated images" },
      { status: 500 }
    );
  }
}