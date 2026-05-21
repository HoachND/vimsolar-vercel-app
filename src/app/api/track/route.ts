import { NextRequest, NextResponse } from "next/server";
import { pool, initDb } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    await initDb();
    
    const searchParams = req.nextUrl.searchParams;
    const ref = searchParams.get("ref");
    
    if (!ref) {
      return NextResponse.json({ error: "Missing ref parameter" }, { status: 400 });
    }

    // 1. Verify if referrer exists in our database
    const userRes = await pool.query(
      "SELECT id, username FROM vimsolar_users WHERE ref_code = $1",
      [ref]
    );

    if (userRes.rowCount === 0) {
      return NextResponse.json({ error: "Referral code not found" }, { status: 404 });
    }

    const referrer = userRes.rows[0];

    // 2. Get IP and User-Agent
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "127.0.0.1";
    const userAgent = req.headers.get("user-agent") || "";

    // 3. Deduplicate clicks within the last 24 hours for same IP + Referrer
    const clickCheck = await pool.query(
      `SELECT id FROM vimsolar_clicks 
       WHERE referrer_id = $1 AND ip_address = $2 
       AND created_at > NOW() - INTERVAL '1 day'`,
      [referrer.id, ip]
    );

    if (clickCheck.rowCount === 0) {
      // Log new click
      await pool.query(
        "INSERT INTO vimsolar_clicks (referrer_id, ip_address, user_agent) VALUES ($1, $2, $3)",
        [referrer.id, ip, userAgent]
      );
    }

    // 4. Return success and instruct the client-side to set cookie
    const response = NextResponse.json({ 
      success: true, 
      ref, 
      referrer: referrer.username 
    });

    // Set HTTP-only cookie for tracking conversions (lasts 30 days)
    response.cookies.set("vimsolar_affiliate_ref", ref, {
      path: "/",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return response;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
