import { NextRequest, NextResponse } from "next/server";
import { readData, writeData } from "@/lib/storage";

// GET: Return playlist
export async function GET() {
  const data = readData("music.json");
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
    writeData("music.json", playlist);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
