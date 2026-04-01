import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import mime from "mime-types";
import OpenAI from "openai";
import { put } from "@vercel/blob";
import crypto from "crypto";

export const runtime = "nodejs"; // we need Node for fs

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const uploadsRoot = path.join(process.cwd(), "Uploaded_articles");

const CATEGORIES = ["Tops", "Bottoms", "Shoes", "Accessories", "Outerwear"] as const;

function pickOne(category: string) {
  const folder = path.join(uploadsRoot, category);
  const files = fs.existsSync(folder)
    ? fs.readdirSync(folder).filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
    : [];

  if (!files.length) return null;
  const file = files[Math.floor(Math.random() * files.length)];
  return { category, file };
}

function toDataUrl(fp: string) {
  const b64 = fs.readFileSync(fp).toString("base64");
  const mt = mime.lookup(fp) || "image/jpeg";
  return `data:${mt};base64,${b64}`;
}

async function analyzeItemsLocalFiles(localPaths: Record<string, string>) {
  const prompt = `
Return ONLY a JSON object. No markdown fences, no explanations.
For each image (top, bottom, shoes, accessories, outerwear), include:
- garmentType
- colorMain
- colorPalette (≤4)
- material
- styleWords (3–6)
- notablePatterns
`;

  const content: any[] = [
    { type: "input_text", text: prompt },

    { type: "input_text", text: "Top:" },
    { type: "input_image", image_url: toDataUrl(localPaths.top) },

    { type: "input_text", text: "Bottom:" },
    { type: "input_image", image_url: toDataUrl(localPaths.bottom) },

    { type: "input_text", text: "Shoes:" },
    { type: "input_image", image_url: toDataUrl(localPaths.shoes) },

    { type: "input_text", text: "Accessories:" },
    { type: "input_image", image_url: toDataUrl(localPaths.accessories) },

    { type: "input_text", text: "Outerwear:" },
    { type: "input_image", image_url: toDataUrl(localPaths.outerwear) },
  ];

  const res = await openai.responses.create({
    model: "gpt-4o",
    input: [{ role: "user", content }],
    text: { format: { type: "json_object" } },
  });

  const text = res.output_text?.trim();
  if (!text) throw new Error("Empty JSON from model");

  return JSON.parse(text);
}

async function generateOutfitImage(attributes: any) {
  const desc = (k: string) => {
    const a = attributes?.[k];
    if (!a) return "";
    return `${k}: ${a.garmentType || k}, colors ${a.colorPalette?.join(", ") || a.colorMain || ""
      }, material ${a.material || ""}, style ${a.styleWords?.join(", ") || ""
      }, patterns ${a.notablePatterns || "none"}.`;
  };

  const outfitPrompt = `
Photorealistic outfit mockup on a clean studio background.
Include these pieces styled together cohesively:
${desc("top")}
${desc("bottom")}
${desc("outerwear")}
${desc("shoes")}
${desc("accessories")}
Ensure realistic proportions, consistent lighting, and true-to-color rendering.
Avoid logos or brand marks. Camera: mid-shot, straight-on, soft shadows.
`;

  const image = await openai.images.generate({
    model: "gpt-image-1",
    prompt: outfitPrompt,
    size: "1024x1024",
  });

  const first = image.data?.[0];
  if (!first?.b64_json) {
    throw new Error("Image API returned no base64 image data");
  }
  return first.b64_json;
}

export async function GET() {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "Missing OPENAI_API_KEY" }, { status: 500 });
    }

    // pick files
    const picks = Object.fromEntries(
      CATEGORIES.map((c) => {
        const picked = pickOne(c);
        return [c, picked?.file ?? null];
      })
    ) as Record<string, string | null>;

    for (const c of CATEGORIES) {
      if (!picks[c]) {
        return NextResponse.json({ error: `No images in /uploads/${c}` }, { status: 400 });
      }
    }

    const localPaths = {
      top: path.join(uploadsRoot, "tops", picks.tops!),
      bottom: path.join(uploadsRoot, "bottoms", picks.bottoms!),
      shoes: path.join(uploadsRoot, "shoes", picks.shoes!),
      accessories: path.join(uploadsRoot, "accessories", picks.accessories!),
      outerwear: path.join(uploadsRoot, "outerwear", picks.outerwear!),
    };

    const attributes = await analyzeItemsLocalFiles(localPaths);
    const imageB64 = await generateOutfitImage(attributes);

    // Upload to Vercel Blob (public)
    const buf = Buffer.from(imageB64, "base64");
    const filename = `Generated_outfits/outfit-${Date.now()}-${crypto.randomUUID()}.png`;

    const blob = await put(filename, buf, {
      access: "public",
      contentType: "image/png",
    });

    // Return a public URL that works in production
    return NextResponse.json({
      imageUrl: blob.url,
      attributes,
      blobPathname: blob.pathname,
      createdAt: new Date().toISOString(),
    });
  } catch (e: any) {
    console.error("Generate outfit failed:", e?.message || e);
    return NextResponse.json({ error: "Failed to generate outfit" }, { status: 500 });
  }
}