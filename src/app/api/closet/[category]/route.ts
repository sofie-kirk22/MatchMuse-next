import { NextRequest, NextResponse } from "next/server";
import { list, put, del } from "@vercel/blob";
import sql from "@/lib/db";
import { generateGarmentMetadata } from "@/lib/garment-prompts";

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

    const rows = await sql<{
      id: number;
      filename: string;
      image_url: string;
      alt: string | null;
      garment_type: string | null;
      colors: string[];
      styles: string[];
      materials: string[];
      created_at: string;
    }[]>`
      SELECT
        id,
        filename,
        image_url,
        alt,
        garment_type,
        colors,
        styles,
        materials,
        created_at
      FROM garments
      WHERE category = ${category}
      ORDER BY created_at DESC
    `;

    const items = rows.map((row) => ({
      id: row.id,
      filename: row.filename,
      url: row.image_url,
      alt: row.alt,
      garmentType: row.garment_type,
      colors: row.colors ?? [],
      styles: row.styles ?? [],
      materials: row.materials ?? [],
      updatedAt: row.created_at,
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

      const metadata = await generateGarmentMetadata(blob.url);

      const [row] = await sql<{
        id: number;
        filename: string;
        image_url: string;
        alt: string | null;
        garment_type: string | null;
        colors: string[];
        styles: string[];
        materials: string[];
        created_at: string; 
      }[]>`
        INSERT INTO garments (
          category,
          filename,
          image_url,
          blob_pathname,
          alt,
          garment_type,
          colors,
          styles,
          materials
        )
        VALUES (
          ${category},
          ${blob.pathname.replace(`Uploaded_articles/${category}/`, "")},
          ${blob.url},
          ${blob.pathname},
          ${metadata.alt},
          ${metadata.garmentType},
          ${sql.array(metadata.colors)},
          ${sql.array(metadata.styles)},
          ${sql.array(metadata.materials)}
        )
        RETURNING
          id,
          filename,
          image_url,
          alt,
          garment_type,
          colors,
          styles,
          materials,
          created_at
      `;

      uploaded.push({
        id: row.id,
        filename: row.filename,
        url: row.image_url,
        alt: row.alt,
        garmentType: row.garment_type,
        colors: row.colors ?? [],
        styles: row.styles ?? [],
        materials: row.materials ?? [],
        uploadedAt: row.created_at,
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    const { category } = await params;

    if (!isValidCategory(category)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    const body = await req.json();
    const url = body?.url;

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Missing blob URL" }, { status: 400 });
    }

    const rows = await sql<{ blob_pathname: string }[]>`
      SELECT blob_pathname
      FROM garments
      WHERE category = ${category} AND image_url = ${url}
      LIMIT 1
    `;

    if (!rows.length) {
      return NextResponse.json({error: "Item not found"}, {status: 404});
    }

    await del(url);

    await sql`
      DELETE FROM garments
      WHERE category = ${category} AND image_url = ${url}
    `;

    return NextResponse.json({ message: "Item deleted successfully" });
  } catch (e: any) {
    console.error("Delete failed:", e?.message || e);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}