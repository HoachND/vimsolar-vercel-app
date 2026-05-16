import { NextRequest, NextResponse } from "next/server";
import { pool, initDb } from "@/lib/db";

// GET: Return playlist
export async function GET() {
  try {
    await initDb();
    const res = await pool.query(`SELECT title, url FROM vimsolar_music ORDER BY sort_order ASC, id ASC`);
    return NextResponse.json(res.rows);
  } catch (error) {
    return NextResponse.json({ error: "Failed to load music" }, { status: 500 });
  }
}

// POST: Update playlist (admin only)
export async function POST(req: NextRequest) {
  try {
    await initDb();
    const body = await req.json();
    const { playlist } = body;
    if (!Array.isArray(playlist)) {
      return NextResponse.json({ error: "Invalid playlist" }, { status: 400 });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(`DELETE FROM vimsolar_music`);
      
      for (let i = 0; i < playlist.length; i++) {
        await client.query(
          `INSERT INTO vimsolar_music (title, url, sort_order) VALUES ($1, $2, $3)`,
          [playlist[i].title, playlist[i].url, i]
        );
      }
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
