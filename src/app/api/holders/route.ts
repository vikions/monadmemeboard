import { NextResponse } from "next/server";
import { getTopHoldersForToken } from "@/lib/providers/blockvision";
import fs from "node:fs/promises";
import path from "node:path";

export const revalidate = 60 * 60 * 24;

const SNAP_DIR = path.join(process.cwd(), "public", "cache");
const FREEZE = process.env.FREEZE_DATA === "true";

async function readSnap(token: string) {
  try {
    const f = path.join(SNAP_DIR, `${token}.json`);
    const txt = await fs.readFile(f, "utf8");
    return JSON.parse(txt);
  } catch {
    return null;
  }
}

async function writeSnap(token: string, data: any) {
  try {
    await fs.mkdir(SNAP_DIR, { recursive: true });
    const f = path.join(SNAP_DIR, `${token}.json`);
    await fs.writeFile(f, JSON.stringify(data, null, 2), "utf8");
  } catch {
  
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token") as "yaki" | "chog" | "dak" | null;
  if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 });

  try {
    if (FREEZE) {
      const snap = await readSnap(token);
      if (snap) {
        return NextResponse.json(snap, {
          headers: { "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=3600" },
        });
      }
      return new NextResponse("Frozen mode without snapshot", { status: 503 });
    }

    const data = await getTopHoldersForToken(token);
   
    await writeSnap(token, data);

    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600" },
    });
  } catch (e: any) {
    
    const snap = await readSnap(token);
    if (snap) {
      return NextResponse.json(snap, {
        headers: { "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=3600" },
      });
    }
    return new NextResponse(e?.message ? String(e.message) : "Internal error", { status: 500 });
  }
}
