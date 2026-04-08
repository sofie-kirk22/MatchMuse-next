import "server-only";
import OpenAI from "openai";

export type GarmentMetadata = {
  alt: string;
  garmentType: string;
  colors: string[];
  styles: string[];
  materials: string[];
};

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("Missing OPENAI_API_KEY");
  return new OpenAI({ apiKey });
}

export async function generateGarmentMetadata(
  imageUrl: string
): Promise<GarmentMetadata> {
  const openai = getOpenAIClient();

  const response = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: [
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: `
Analyze this clothing image and return JSON only.

Return:
- alt: a short natural alt-text description for the garment
- garmentType: e.g. top, trousers, shoes, jacket
- colors: array of main colors
- styles: array of style words
- materials: array of likely materials

Keep alt short and useful for both accessibility and filtering.
          `.trim(),
          },
          {
            type: "input_image",
            image_url: imageUrl,
            detail: "auto",
          },
        ],
      },
    ],
    text: {
      format: {
        type: "json_schema",
        name: "garment_description",
        schema: {
          type: "object",
          additionalProperties: false,
          properties: {
            alt: { type: "string" },
            garmentType: { type: "string" },
            colors: { type: "array", items: { type: "string" } },
            styles: { type: "array", items: { type: "string" } },
            materials: { type: "array", items: { type: "string" } },
          },
          required: ["alt", "garmentType", "colors", "styles", "materials"],
        },
      },
    },
  });

  const text = response.output_text?.trim();
  if (!text) throw new Error("No response text returned");

  return JSON.parse(text) as GarmentMetadata;
}