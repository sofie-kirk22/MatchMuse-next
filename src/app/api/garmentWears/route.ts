import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CreateWearLogBody = {
    wornOn: string;
    garmentIds: number[];
};

function isValidDateString(value: string) {
    return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export async function POST(req: NextRequest) {
    try {
        const body: CreateWearLogBody = await req.json();

        const wornOn = body?.wornOn;
        const garmentIds = body?.garmentIds;

        if (!wornOn || !isValidDateString(wornOn)) {
            return NextResponse.json(
                { error: "Invalid or missing wornOn date. Use YYYY-MM-DD." },
                { status: 400 }
            );
        }

        if (!Array.isArray(garmentIds) || garmentIds.length === 0) {
            return NextResponse.json(
                { error: "garmentIds must be a non-empty array." },
                { status: 400 }
            );
        }

        const normalizedIds = garmentIds
            .filter((id): id is number => typeof id === "number" && Number.isInteger(id))
            .filter((id, index, arr) => arr.indexOf(id) === index);

        if (!normalizedIds.length) {
            return NextResponse.json(
                { error: "No valid garmentIds provided." },
                { status: 400 }
            );
        }

        // Make sure all garment IDs exist
        const existingGarments = await sql<{ id: string | number }[]>`
            SELECT id
            FROM garments
            WHERE id = ANY(${normalizedIds}::bigint[])
        `;

        const existingIds = new Set(
            existingGarments.map((g) => Number(g.id))
        );

        const missingIds = normalizedIds.filter((id) => !existingIds.has(id));

        if (missingIds.length > 0) {
            return NextResponse.json(
                {
                    error: "Some garmentIds do not exist.",
                    missingGarmentIds: missingIds,
                    receivedGarmentIds: normalizedIds,
                },
                { status: 400 }
            );
        }

        const insertedRows = [];

        for (const garmentId of normalizedIds) {
            const [row] = await sql<{
                id: number;
                garment_id: number;
                worn_on: string;
                created_at: string;
            }[]>`
        INSERT INTO garment_wears (garment_id, worn_on)
        VALUES (${garmentId}, ${wornOn})
        ON CONFLICT (garment_id, worn_on) DO NOTHING
        RETURNING id, garment_id, worn_on, created_at
      `;

            if (row) {
                insertedRows.push(row);
            }
        }

        return NextResponse.json({
            message: `Logged ${insertedRows.length} garment wear(s).`,
            items: insertedRows,
        });
    } catch (e: any) {
        console.error("Failed to create wear log:", e?.message || e);
        return NextResponse.json(
            { error: "Failed to create wear log" },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        const wornOn = req.nextUrl.searchParams.get("wornOn");

        if (wornOn && !isValidDateString(wornOn)) {
            return NextResponse.json(
                { error: "Invalid wornOn date. Use YYYY-MM-DD." },
                { status: 400 }
            );
        }

        const rows = wornOn
            ? await sql<{
                id: number;
                garment_id: number;
                worn_on: string;
                created_at: string;
                category: string;
                filename: string;
                image_url: string;
                alt: string | null;
            }[]>`
          SELECT
            gw.id,
            gw.garment_id,
            gw.worn_on,
            gw.created_at,
            g.category,
            g.filename,
            g.image_url,
            g.alt
          FROM garment_wears gw
          JOIN garments g ON g.id = gw.garment_id
          WHERE gw.worn_on = ${wornOn}
          ORDER BY g.category ASC, gw.created_at ASC
        `
            : await sql<{
                id: number;
                garment_id: number;
                worn_on: string;
                created_at: string;
                category: string;
                filename: string;
                image_url: string;
                alt: string | null;
            }[]>`
          SELECT
            gw.id,
            gw.garment_id,
            gw.worn_on,
            gw.created_at,
            g.category,
            g.filename,
            g.image_url,
            g.alt
          FROM garment_wears gw
          JOIN garments g ON g.id = gw.garment_id
          ORDER BY gw.worn_on DESC, gw.created_at DESC
          LIMIT 100
        `;

        const items = rows.map((row) => ({
            id: row.id,
            garmentId: row.garment_id,
            wornOn: row.worn_on,
            createdAt: row.created_at,
            category: row.category,
            filename: row.filename,
            url: row.image_url,
            alt: row.alt,
        }));

        return NextResponse.json(items);
    } catch (e: any) {
        console.error("Failed to load wear logs:", e?.message || e);
        return NextResponse.json(
            { error: "Failed to load wear logs" },
            { status: 500 }
        );
    }
}