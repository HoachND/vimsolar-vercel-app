import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const isVercel = process.env.VERCEL === "1" || !!process.env.VERCEL_URL;
const DATA_DIR = isVercel ? "/tmp" : path.join(process.cwd(), "data");
const MUSIC_FILE = path.join(DATA_DIR, "music.json");

function ensureFile() {
  const dir = path.dirname(MUSIC_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(MUSIC_FILE)) fs.writeFileSync(MUSIC_FILE, "[]", "utf-8");
}

// GET: Return playlist
export async function GET() {
  ensureFile();
  const data = JSON.parse(fs.readFileSync(MUSIC_FILE, "utf-8"));
  return NextResponse.json(data);
}

// POST: Update playlist (admin only)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { playlist } = body;
    if (!Array.isArray(playlist)) {
      return NextResponse.json({ error: "Invalid playlist" }, { status: 400 });
    }
    ensureFile();
    fs.writeFileSync(MUSIC_FILE, JSON.stringify(playlist, null, 2), "utf-8");
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
