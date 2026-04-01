import { NextResponse } from "next/server";
import OpenAI from "openai";
import { put, list } from "@vercel/blob";
import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CATEGORIES = ["tops", "bottoms", "shoes", "accessories", "outerwear"] as const;

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("Missing OPENAI_API_KEY");
  return new OpenAI({ apiKey });
}

async function pickOneFromBlob(category: string) {
  const { blobs } = await list({ prefix: `Uploaded_articles/${category}/` });

  const imageBlobs = blobs.filter((b) =>
    /\.(png|jpe?g|webp)$/i.test(b.pathname)
  );

  if (!imageBlobs.length) return null;

  return imageBlobs[Math.floor(Math.random() * imageBlobs.length)];
}

async function urlToDataUrl(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch image: ${url}`);

  const contentType = res.headers.get("content-type") || "image/jpeg";
  const arrayBuffer = await res.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");

  return `data:${contentType};base64,${base64}`;
}

async function analyzeItemsFromUrls(
  openai: OpenAI,
  imageUrls: Record<string, string>
) {
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

    { type: "input_text", text: "top:" },
    { type: "input_image", image_url: await urlToDataUrl(imageUrls.top) },

    { type: "input_text", text: "bottom:" },
    { type: "input_image", image_url: await urlToDataUrl(imageUrls.bottom) },

    { type: "input_text", text: "shoes:" },
    { type: "input_image", image_url: await urlToDataUrl(imageUrls.shoes) },

    { type: "input_text", text: "accessories:" },
    { type: "input_image", image_url: await urlToDataUrl(imageUrls.accessories) },

    { type: "input_text", text: "outerwear:" },
    { type: "input_image", image_url: await urlToDataUrl(imageUrls.outerwear) },
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

async function generateOutfitImage(openai: OpenAI, attributes: any) {
  const desc = (k: string) => {
    const a = attributes?.[k];
    if (!a) return "";
    return `${k}: ${a.garmentType || k}, colors ${
      a.colorPalette?.join(", ") || a.colorMain || ""
    }, material ${a.material || ""}, style ${
      a.styleWords?.join(", ") || ""
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
    const openai = getOpenAIClient();

    const picks = Object.fromEntries(
      await Promise.all(
        CATEGORIES.map(async (category) => {
          const blob = await pickOneFromBlob(category);
          return [category, blob];
        })
      )
    ) as Record<string, Awaited<ReturnType<typeof pickOneFromBlob>>>;

    for (const category of CATEGORIES) {
      if (!picks[category]) {
        return NextResponse.json(
          { error: `No images found in Blob folder Uploaded_articles/${category}/` },
          { status: 400 }
        );
      }
    }

    const imageUrls = {
      top: picks.tops!.url,
      bottom: picks.bottoms!.url,
      shoes: picks.shoes!.url,
      accessories: picks.accessories!.url,
      outerwear: picks.outerwear!.url,
    };

    const attributes = await analyzeItemsFromUrls(openai, imageUrls);
    const imageB64 = await generateOutfitImage(openai, attributes);

    const buf = Buffer.from(imageB64, "base64");
    const filename = `Generated_outfits/outfit-${Date.now()}-${crypto.randomUUID()}.png`;

    const blob = await put(filename, buf, {
      access: "public",
      contentType: "image/png",
    });

    return NextResponse.json({
      imageUrl: blob.url,
      attributes,
      blobPathname: blob.pathname,
      sourceUrls: imageUrls,
      createdAt: new Date().toISOString(),
    });
  } catch (e: any) {
    console.error("Generate outfit failed:", e?.message || e);
    return NextResponse.json(
      { error: e?.message || "Failed to generate outfit" },
      { status: 500 }
    );
  }
}