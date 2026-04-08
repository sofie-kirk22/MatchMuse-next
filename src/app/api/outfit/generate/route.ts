import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { put, list } from "@vercel/blob";
import crypto from "crypto";
import sql from "@/lib/db";
import { OutfitFilters } from "@/types/outfitFilters";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CATEGORIES = ["tops", "bottoms", "shoes", "accessories", "outerwear"] as const;

type Category = (typeof CATEGORIES)[number];

type GarmentRow = {
  id: number;
  category: string;
  filename: string;
  image_url: string;
  alt: string | null;
  garment_type: string | null;
  colors: string[];
  styles: string[];
  materials: string[];
  created_at: string;
};

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("Missing OPENAI_API_KEY");
  return new OpenAI({ apiKey });
}

function pickRandom<T>(items: T[]): T | null {
  if (!items.length) return null;
  return items[Math.floor(Math.random() * items.length)];
}

async function getFilteredGarmentsForCategory(
  category: Category,
  filters: OutfitFilters
) {
  const colors = filters.colors ?? [];
  const styles = filters.styles ?? [];
  const materials = filters.materials ?? [];

  const rows = await sql<GarmentRow[]>`
    SELECT
      id,
      category,
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
      ${colors.length ? sql`AND colors && ${sql.array(colors)}::text[]` : sql``}
      ${styles.length ? sql`AND styles && ${sql.array(styles)}::text[]` : sql``}
      ${materials.length ? sql`AND materials && ${sql.array(materials)}::text[]` : sql``}
    ORDER BY created_at DESC
    `;

  return rows;
}

async function generateOutfitImage(openai: OpenAI, prompt: string) {
  const image = await openai.images.generate({
    model: "gpt-image-1",
    prompt,
    size: "1024x1024",
  });

  const first = image.data?.[0];
  if (!first?.b64_json) {
    throw new Error("Image API returned no base64 image data");
  }

  return first.b64_json;
}

function describeGarment(label: string, garment: GarmentRow | null) {
  if (!garment) return `${label}: none`;

  return `${label}: ${garment.garment_type || label
    }, alt "${garment.alt || garment.filename}", colors ${garment.colors?.join(", ") || "unknown"
    }, styles ${garment.styles?.join(", ") || "unknown"
    }, materials ${garment.materials?.join(", ") || "unknown"
    }.`;
}

export async function POST(req: NextRequest) {
  try {
    const openai = getOpenAIClient();

    const body = await req.json().catch(() => ({}));
    const filters: OutfitFilters = body?.filters ?? {};

    const [tops, bottoms, shoes, accessories, outerwear] = await Promise.all([
      getFilteredGarmentsForCategory("tops", filters),
      getFilteredGarmentsForCategory("bottoms", filters),
      getFilteredGarmentsForCategory("shoes", filters),
      getFilteredGarmentsForCategory("accessories", filters),
      getFilteredGarmentsForCategory("outerwear", filters),
    ]);

    const selected = {
      top: pickRandom(tops),
      bottom: pickRandom(bottoms),
      shoes: pickRandom(shoes),
      accessories: pickRandom(accessories),
      outerwear: pickRandom(outerwear),
    };

    for (const [key, value] of Object.entries(selected)) {
      if (!value) {
        return NextResponse.json(
          {
            error: `No matching ${key} found for the selected filters.`,
          },
          { status: 400 }
        );
      }
    }

    const outfitPrompt = `
Create a photorealistic outfit image on a clean studio background.

Use these selected garments:
${describeGarment("top", selected.top)}
${describeGarment("bottom", selected.bottom)}
${describeGarment("shoes", selected.shoes)}
${describeGarment("accessories", selected.accessories)}
${describeGarment("outerwear", selected.outerwear)}

Ensure the outfit looks cohesive, stylish, realistic, and true to the selected garments' colors and style cues.
Avoid logos and brand marks.
Camera: mid-shot, straight-on, soft shadows.
    `.trim();

    const imageB64 = await generateOutfitImage(openai, outfitPrompt);
    const buf = Buffer.from(imageB64, "base64");
    const filename = `Generated_outfits/outfit-${Date.now()}-${crypto.randomUUID()}.png`;

    const blob = await put(filename, buf, {
      access: "public",
      contentType: "image/png",
    });

    return NextResponse.json({
      imageUrl: blob.url,
      attributes: {
        selected,
        filters,
      },
    });
  } catch (e: any) {
    console.error("Generate outfit failed:", e?.message || e);
    return NextResponse.json(
      { error: e?.message || "Failed to generate outfit" },
      { status: 500 }
    );
  }
}