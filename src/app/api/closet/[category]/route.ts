import { NextRequest, NextResponse } from "next/server";
import { list, put } from "@vercel/blob";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_CATEGORIES = [
  "tops",
  "bottoms",
  "shoes",
  "accessories",
  "outerwear",
] as const;

function isValidCategory(category: string) {
  return ALLOWED_CATEGORIES.includes(
    category as (typeof ALLOWED_CATEGORIES)[number]
  );
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    const { category } = await params;

    if (!isValidCategory(category)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    const { blobs } = await list({
      prefix: `Uploaded_articles/${category}/`,
    });

    const items = blobs
      .filter((b) => /\.(png|jpe?g|webp)$/i.test(b.pathname))
      .sort(
        (a, b) =>
          new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      )
      .map((b) => ({
        filename: b.pathname.replace(`Uploaded_articles/${category}/`, ""),
        url: b.url,
        uploadedAt: b.uploadedAt,
      }));

    return NextResponse.json(items);
  } catch (e: any) {
    console.error("Failed to list closet items:", e?.message || e);
    return NextResponse.json(
      { error: "Could not load closet items" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    const { category } = await params;

    if (!isValidCategory(category)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    const formData = await req.formData();
    const files = formData
      .getAll("images")
      .filter((v): v is File => v instanceof File);

    if (!files.length) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const uploaded = [];

    for (const file of files) {
      const safeName = file.name.replace(/\s+/g, "-");
      const pathname = `Uploaded_articles/${category}/${Date.now()}-${safeName}`;

      const blob = await put(pathname, file, {
        access: "public",
        contentType: file.type || "application/octet-stream",
      });

      uploaded.push({
        filename: blob.pathname.replace(`Uploaded_articles/${category}/`, ""),
        url: blob.url,
      });
    }

    return NextResponse.json({
      message: `Uploaded ${uploaded.length} file(s) to ${category}`,
      uploaded,
    });
  } catch (e: any) {
    console.error("Upload failed:", e?.message || e);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}