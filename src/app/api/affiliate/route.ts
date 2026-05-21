import { NextRequest, NextResponse } from "next/server";
import { pool, initDb } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    await initDb();
    
    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // 1. Verify user role
    const userRes = await pool.query(
      "SELECT id, username, name, email, phone, role, ref_code, balance, bank_name, bank_account, bank_holder FROM vimsolar_users WHERE id = $1",
      [userId]
    );

    if (userRes.rowCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = userRes.rows[0];

    // 2. Fetch Clicks count
    const clicksRes = await pool.query(
      "SELECT COUNT(*)::int as count FROM vimsolar_clicks WHERE referrer_id = $1",
      [userId]
    );
    const clicksCount = clicksRes.rows[0].count;

    // 3. Fetch Leads list
    const leadsRes = await pool.query(
      `SELECT id, name, phone, email, status, contract_value::float as contract_value, 
              commission_amount::float as commission_amount, created_at 
       FROM vimsolar_leads 
       WHERE referrer_id = $1 
       ORDER BY created_at DESC`,
      [userId]
    );
    const leads = leadsRes.rows;

    // 4. Fetch Payout & Earnings logs
    const earningsRes = await pool.query(
      `SELECT id, amount::float as amount, status, reason, created_at 
       FROM vimsolar_earnings 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [userId]
    );
    const earnings = earningsRes.rows;

    // Calculate dynamic stats
    let totalEarned = 0;
    let totalPaid = 0;
    let pendingEarned = 0;

    earnings.forEach((e: { amount: number; status: string }) => {
      if (e.amount > 0) {
        if (e.status === "paid") {
          totalPaid += e.amount;
          totalEarned += e.amount;
        } else if (e.status === "approved") {
          totalEarned += e.amount;
        } else if (e.status === "pending") {
          pendingEarned += e.amount;
        }
      } else {
        // Payouts (negative amounts)
        if (e.status === "paid") {
          totalPaid += Math.abs(e.amount);
        }
      }
    });

    return NextResponse.json({
      success: true,
      user,
      stats: {
        clicks: clicksCount,
        leadsCount: leads.length,
        balance: parseFloat(user.balance),
        totalEarned,
        totalPaid,
        pendingEarned
      },
      leads,
      earnings
    });

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
